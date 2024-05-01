export interface Env {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  AI: any;
}

interface RequestBody {
  imagePrompt: string;
}

export const onRequest: PagesFunction<Env> = async ({ env, request }) => {
  const prompt = ((await request.json()) as RequestBody).imagePrompt;

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
};
