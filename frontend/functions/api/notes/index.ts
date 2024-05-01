export interface Env {
  NOTES: KVNamespace;
}

interface RequestBody {
  note: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  const body = await request.json<RequestBody>();

  await env.NOTES.put(crypto.randomUUID(), JSON.stringify(body.note));

  return new Response("OK", { status: 200 });
};

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
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
};
