const TARGET_PREFIX = ["BRICK_WALL_IP_BAN", "TARGET"];
const LOG_PREFIX = ["BRICK_WALL_IP_BAN", "LOG"];

export async function setIp(ip: string) {
  const kv = await Deno.openKv();
  await kv.set([...TARGET_PREFIX, ip], ip);
}

export async function updateBanIpCount(ip: string) {
  const kv = await Deno.openKv();

  const key = [...LOG_PREFIX, ip];

  let tx_res = { ok: false };
  while (!tx_res.ok) {
    const res = await kv.get(key);
    const atomic = kv.atomic().check(res);

    if (!res.versionstamp) {
      atomic.set(key, 0);
    } else {
      atomic.set(key, res.value + 1);
    }
    tx_res = await atomic.commit();
  }
}

export async function getIps() {
  const kv = await Deno.openKv();
  const entries = kv.list({ prefix: TARGET_PREFIX });
  const values = [];
  for await (const entry of entries) {
    values.push(entry.value);
  }
  return values;
}

export async function getBandIps() {
  const kv = await Deno.openKv();
  const entries = kv.list({ prefix: LOG_PREFIX });
  const values = [];
  for await (const entry of entries) {
    values.push({ ip: entry.key.slice(-1)[0], count: entry.value });
  }
  return values;
}

export async function deleteIp(ip: string) {
  const kv = await Deno.openKv();
  await kv.delete([...TARGET_PREFIX, ip]);
}
