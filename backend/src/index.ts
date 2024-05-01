import { Hono } from "hono";
import { cors } from "hono/cors";

type Bindings = {
  NOTES: KVNamespace;
  CHAT_HISTORY: KVNamespace;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  AI: any;
};

interface ImageRequestBody {
  imagePrompt: string;
}

interface TranslateRequestBody {
  text: string;
  source_lang: string;
  target_lang: string;
}

interface NoteRequestBody {
  note: string;
}

interface ChatRequestBody {
  prompt: string;
  id: string;
}

interface ChatHistory {
  messages: { role: string; content: string }[];
}

const app = new Hono<{ Bindings: Bindings }>();

app.use(cors());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.post("/api/ai/image", async ({ req, env }) => {
  const prompt = ((await req.json()) as ImageRequestBody).imagePrompt;

  if (!prompt) {
    return new Response("Please provide a question in the request body.", {
      status: 400,
    });
  }

  const response = await env.AI.run(
    "@cf/bytedance/stable-diffusion-xl-lightning",
    {
      prompt,
    }
  );

  return new Response(response, {
    headers: { "Content-Type": "image/png" },
  });
});

app.post("/api/ai/translate", async ({ req, env }) => {
  const body = await req.json<TranslateRequestBody>();

  const translation = await env.AI.run("@cf/meta/m2m100-1.2b", body);

  return Response.json(translation);
});

app.post("/api/ai/chat", async ({ req, env }) => {
  const body = await req.json<ChatRequestBody>();

  const chatHistory = await env.CHAT_HISTORY.get<ChatHistory>(body.id, {
    type: "json",
  });

  const historyWithPrompt = chatHistory
    ? [...chatHistory.messages, { role: "user", content: body.prompt }]
    : [{ role: "user", content: body.prompt }];

  const messages = [
    { role: "system", content: "You are a friendly assistant" },
    ...historyWithPrompt,
  ];

  const response = await env.AI.run("@cf/meta/llama-3-8b-instruct", {
    messages,
  });

  const historyWithAnswer = [
    ...historyWithPrompt,
    { role: "system", content: response.response },
  ];

  // Save chat history so the AI has some kind of memory of the conversation
  await env.CHAT_HISTORY.put(
    body.id,
    JSON.stringify({ messages: historyWithAnswer })
  );

  return Response.json(response);
});

app.post("/api/notes", async ({ req, env }) => {
  const body = await req.json<NoteRequestBody>();
  const noteUUID = crypto.randomUUID();

  await env.NOTES.put(noteUUID, JSON.stringify(body.note));

  return Response.json({ id: noteUUID, note: body.note }, { status: 201 });
});

app.get("/api/notes", async ({ env }) => {
  const allKeys = await env.NOTES.list();
  if (allKeys.keys.length === 0) {
    return Response.json([]);
  }
  const allNotes = await Promise.all(
    allKeys.keys.map(async (key) => ({
      note: await env.NOTES.get(key.name),
      id: key.name,
    }))
  );

  return Response.json(allNotes);
});

app.delete("/api/notes/:id", async ({ req, env }) => {
  const id = req.param("id");

  await env.NOTES.delete(id);

  return Response.json({ id: id }, { status: 200 });
});

export default app;
