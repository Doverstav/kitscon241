# KitsCon 24.1 demo

Prerequisite: Basic worker already created with dependencies installed

## 1. Show basic worker

Show code, show that it is deployed. Mention that it can be deployed to custom domain. We are showing a fetch handler (for HTTP), others exist for specific use cases.

```javascript
type Env = {
  // Your bindings here
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return new Response("Hello World");
  },
};
```


Start local dev, Change return value to something else, verify. Redeploy, show that it's quick and easy.

## 2. Show Hono/REST API

But we get the same thing on every path. Creating a REST API with the "basic" worker is not great.

Show how to use Hono.js to create an Express-like REST API

```javascript
import { Hono } from "hono";

const app = new Hono();

app.get("/", async (c) => {
  return c.text("Hello, World!");
});

app.get("/hello/:name", (c) => {
  return c.text(`Hello, ${c.req.param("name")}`);
});

export default app;

```


## 3. Show service bindings with dice roller

Show diceroller service, showcase difference between fetch and RPC services binding

Show how you can bind in other cloudflare services with wrangler

```javascript
import { WorkerEntrypoint } from "cloudflare:workers";
import { Hono } from "hono";

interface DiceRollerService extends WorkerEntrypoint {
  rollDice: (faces: number) => Promise<number>;
}
type Env = {
  // Your bindings here
  DICE_ROLLER: Service;
  DICE_ROLLER_RPC: Service<DiceRollerService>;
};

const app = new Hono<{ Bindings: Env }>();

app.get("/", async ({ req, env, text }) => {
  const httpDice = await (await env.DICE_ROLLER.fetch(req.url)).text();
  return text(`You got a ${httpDice}!`);
});

app.get("/rpc", async ({ req, env, text }) => {
  const facesParam = new URL(req.url).searchParams.get("faces");
  const requestedFaces = !isNaN(parseInt(facesParam ?? ""))
    ? parseInt(facesParam!)
    : 6;
  const rpcDice = await env.DICE_ROLLER_RPC.rollDice(requestedFaces);
  return text(`You rolled a ${rpcDice}!`);
});

export default app;

```


## 4. Show AI worker

Add AI binding, showcase some AI model

```javascript
app.get("/ai", async ({ env, text }) => {
  const messages = [
    { role: "system", content: "You are a friendly assistant" },
    {
      role: "user",
      content: "What is the origin of the phrase Hello, World",
    },
  ];
  const response = await env.AI.run("@cf/meta/llama-3-8b-instruct", {
    messages,
  });

  return text(response.response);
});
```


## 5. Show demo website

Click through the different tabs, show related backend code. Frontend probably not important.

