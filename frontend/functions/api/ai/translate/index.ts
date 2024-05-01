export interface Env {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  AI: any;
}

interface RequestBody {
  text: string;
  source_lang: string;
  target_lang: string;
}

export const onRequest: PagesFunction<Env> = async ({ env, request }) => {
  const body = await request.json<RequestBody>();

  const translation = await env.AI.run("@cf/meta/m2m100-1.2b", body);

  return Response.json(translation);
};
