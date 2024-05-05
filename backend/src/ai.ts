import { Hono } from "hono";

type Bindings = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  AI: any;
  CHAT_HISTORY: KVNamespace;
};

interface ChatRequestBody {
  prompt: string;
  id: string;
}

interface ChatHistory {
  messages: { role: string; content: string }[];
}

interface ImageRequestBody {
  imagePrompt: string;
}

interface TranslateRequestBody {
  text: string;
  source_lang: string;
  target_lang: string;
}

const app = new Hono<{ Bindings: Bindings }>();

app.post("/image", async ({ req, env }) => {
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

app.post("/translate", async ({ req, env }) => {
  const body = await req.json<TranslateRequestBody>();

  const translation = await env.AI.run("@cf/meta/m2m100-1.2b", body);

  return Response.json(translation);
});

app.post("/chat", async ({ req, env }) => {
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

export default app;
