export interface Env {
  NOTES: KVNamespace;
}

export const onRequest: PagesFunction<Env> = async ({
  env,
  request,
  params,
}) => {
  if (request.method !== "DELETE") {
    return new Response("Method not allowed", { status: 405 });
  }

  const id = params.id as string;

  await env.NOTES.delete(id);

  return new Response("OK", { status: 200 });
};
