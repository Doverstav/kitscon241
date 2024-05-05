import { WorkerEntrypoint } from "cloudflare:workers";
import { Hono } from "hono";
import { cors } from "hono/cors";

import ai from "./ai";
import notes from "./notes";

interface DiceRollerService extends WorkerEntrypoint {
  rollDice: (faces?: number) => Promise<number>;
}

type Bindings = {
  DICE_ROLLER: Service;
  DICE_ROLLER_RPC: Service<DiceRollerService>;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(cors());

app.get("/", async (c) => {
  const url = new URL(c.req.url);
  const requestedFaces = url.searchParams.get("faces");
  const faces =
    requestedFaces && !isNaN(parseInt(requestedFaces))
      ? parseInt(requestedFaces)
      : 6;
  const diceVal = await (await c.env.DICE_ROLLER.fetch(url)).text();
  const diceValRPC = await c.env.DICE_ROLLER_RPC.rollDice(faces);

  return c.text(`${diceVal} & ${diceValRPC}`);
});

app.route("/api/ai", ai);
app.route("/api/notes", notes);

export default app;
