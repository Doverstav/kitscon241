export const onRequest: PagesFunction = async () => {
  return new Response("Hello, world!", { status: 200 });
};
