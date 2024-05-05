import { Hono } from "hono";

type Bindings = {
  NOTES: KVNamespace;
};

interface NoteRequestBody {
  note: string;
}

const app = new Hono<{ Bindings: Bindings }>();

app.post("/", async ({ req, env }) => {
  const body = await req.json<NoteRequestBody>();
  const noteUUID = crypto.randomUUID();

  await env.NOTES.put(noteUUID, JSON.stringify(body.note));

  return Response.json({ id: noteUUID, note: body.note }, { status: 201 });
});

app.get("/", async ({ env }) => {
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

app.delete("/:id", async ({ req, env }) => {
  const id = req.param("id");

  await env.NOTES.delete(id);

  return Response.json({ id: id }, { status: 200 });
});

export default app;
