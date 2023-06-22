# brick_wall_ip_ban

brick_wall_ip_ban is an extension module of [Brick Wall](https://brickwall.deno.dev)

Blocks communication according to the IP set by the API.

## Setup

### Brick Wall main app

```ts
import { BrickWall } from 'https://deno.land/x/brick_wall/mod.ts';
import {
  brickWallIpBanHandler,
  ipBanApiRouter,
} from "https://deno.land/x/brick_wall_ip_ban/mod.ts";

const brickWall = new BrickWall({ port: 8001 });
brickWall.useHandler(brickWallIpBanHandler);
brickWall.useApiRouter(ipBanApiRouter);

await brickWall.start();
```

And env.

```sh
BRICK_WALL_API_JWT_KEY=XXXXXXXXXXXXX
BRICK_WALL_API_HASHED_PASSWORD=YYYYYYYYYYYYY
```

`BRICK_WALL_API_JWT_KEY` is generate key from `crypto.subtle.generateKey`.
`BRICK_WALL_API_HASHED_PASSWORD` is hash from bcrypt.


### brick_wall_ip_ban client

```ts
import { IpBanClient } from "brick_wall_ip_ban/mod.ts";
// get
const result = await ipBanClient.get();

// set
const result = await ipBanClient.set("192.0.2.0");
// or 
const result = await ipBanClient.set("2001:db8:ffff:ffff:ffff:ffff:ffff:ffff");
```

And env.

```sh
BRICK_WALL_API_JWT_KEY=XXXXXXXXXXXXX
BRICK_WALL_API_PASSWORD=[password]
BRICK_WALL_API_BASE_URL=[https://example.com]
```

## Reference

[https://deno.land/x/brick_wall_ip_ban](https://deno.land/x/brick_wall_ip_ban)
