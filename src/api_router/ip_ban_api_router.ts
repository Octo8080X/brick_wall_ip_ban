import { Context, Router } from "../../deps.ts";

import { deleteIp, getBandIps, getIps, setIp } from "../kv.ts";

const ipBanApiRouter = new Router();
ipBanApiRouter
  .get("/ip_ban", async (context: Context) => {
    context.response.body = Array.from(await getIps());
  })
  .get("/ip_ban/list", async (context: Context) => {
    context.response.body = Array.from(await getBandIps());
  })
  .post("/ip_ban", async (context: Context) => {
    const body = await context.request.body();

    const json = await body.value;
    if (!json?.ip) {
      throw new Error("ip is required");
    }

    await setIp(json.ip);
    context.response.status = 200;
  })
  .delete("/ip_ban", async (context: Context) => {
    const body = await context.request.body();

    const json = await body.value;
    if (!json?.ip) {
      throw new Error("ip is required");
    }

    await deleteIp(json.ip);
    context.response.status = 200;
  });

export { ipBanApiRouter };
