export interface Env {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  AI: any;
}

interface RequestBody {
  question: string;
}

export const onRequest: PagesFunction<Env> = async ({ env, request }) => {
  const userInput = ((await request.json()) as RequestBody).question;

  if (!userInput) {
    return new Response("Please provide a question in the request body.", {
      status: 400,
    });
  }

  const answer = await env.AI.run("@cf/meta/llama-2-7b-chat-int8", {
    prompt: userInput,
  });

  return Response.json(answer);
};
