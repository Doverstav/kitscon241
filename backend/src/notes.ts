import { Hono } from "hono";

type Bindings = {
  NOTES_DB: D1Database;
};

interface NoteRequestBody {
  note: string;
}

interface DBNote {
  id: string;
  note: string;
}

const app = new Hono<{ Bindings: Bindings }>();

app.post("/", async ({ req, env }) => {
  const body = await req.json<NoteRequestBody>();

  const { success, error } = await env.NOTES_DB.prepare(
    "insert into notes (note) values (?)"
  )
    .bind(body.note)
    .run();

  if (success) {
    return new Response(undefined, { status: 201 });
  } else {
    return Response.json({ error }, { status: 500 });
  }
});

app.get("/", async ({ env }) => {
  const { results, success, error } = await env.NOTES_DB.prepare(
    "select * from notes"
  ).all<DBNote>();

  if (success) {
    return Response.json(results);
  } else {
    return Response.json({ error }, { status: 500 });
  }
});

app.delete("/:id", async ({ req, env }) => {
  const id = req.param("id");

  const { success } = await env.NOTES_DB.prepare(
    "delete from notes where id = ?"
  )
    .bind(id)
    .run();

  if (success) {
    return Response.json({ id });
  } else {
    return Response.json({ id }, { status: 500 });
  }
});

export default app;
