export interface Env {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  AI: any;
}

export const onRequest: PagesFunction<Env> = async ({ env, request }) => {
  const blob = await request.arrayBuffer();

  const input = {
    audio: [...new Uint8Array(blob)],
  };

  const response = await env.AI.run("@cf/openai/whisper", input);

  return Response.json(response);
};
