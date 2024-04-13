export const onRequest: PagesFunction = async () => {
  return new Response("Hello, worldddd!", { status: 200 });
};
