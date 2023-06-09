import { Context } from "../../deps.ts";
import { getIps, updateBanIpCount } from "../kv.ts";

export async function brickWallIpBanHandler(
  ctx: Context<Record<string, any>, Record<string, any>>,
  next: () => Promise<unknown>,
) {
  if ((await getIps()).includes(ctx.request.ip)) {
    updateBanIpCount(ctx.request.ip);
    ctx.response.status = 403;
    return;
  }

  await next();
}
