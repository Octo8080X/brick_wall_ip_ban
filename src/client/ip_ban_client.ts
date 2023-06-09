import { isSet } from "https://deno.land/std@0.153.0/node/internal_binding/types.ts";
import { importKey } from "../import_key.ts";
import { create } from "https://deno.land/x/djwt@v2.8/mod.ts";
export class IpBanClient {
  #BRICK_WALL_API_PASSWORD!: string;
  #BRICK_WALL_API_JWT_KEY!: CryptoKey;
  #BRICK_WALL_API_BASE_URL!: string;
  constructor() {
  }
  public async init() {
    const brickWallApiJwtKey = Deno.env.get("BRICK_WALL_API_JWT_KEY");
    if (!brickWallApiJwtKey) {
      throw new Error("No set env `BRICK_WALL_API_JWT_KEY`");
    }
    this.#BRICK_WALL_API_JWT_KEY = await importKey(brickWallApiJwtKey);

    const brickWallApiPassword = Deno.env.get("BRICK_WALL_API_PASSWORD");
    if (!brickWallApiPassword) {
      throw new Error("No set env `BRICK_WALL_API_PASSWORD`");
    }
    this.#BRICK_WALL_API_PASSWORD = brickWallApiPassword;

    const brickWallApiBaseUrl = Deno.env.get("BRICK_WALL_API_BASE_URL");
    if (!brickWallApiBaseUrl) {
      throw new Error("No set env `BRICK_WALL_API_BASE_URL`");
    }
    this.#BRICK_WALL_API_BASE_URL = brickWallApiBaseUrl;
  }
  isSetMembers(): boolean {
    return !!this.#BRICK_WALL_API_PASSWORD && !!this.#BRICK_WALL_API_JWT_KEY &&
      !!this.#BRICK_WALL_API_BASE_URL;
  }
  async getToken(): Promise<string> {

    const header_jwt_token = await create(
      { alg: "HS512", typ: "JWT" },
      {
        brickWallApiPassword: this.#BRICK_WALL_API_PASSWORD,
      },
      this.#BRICK_WALL_API_JWT_KEY,
    );
    return header_jwt_token;
  }

  async set(ip: string): Promise<boolean> {
    if (!this.isSetMembers()) {
      await this.init();
    }
    const res = await fetch(`${this.#BRICK_WALL_API_BASE_URL}/api/ip_ban`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "brick-wall-manager": await this.getToken(),
      },
      body: JSON.stringify({ ip: ip }),
    });
    return res.ok;
  }
  async get(): Promise<string[]> | never {
    if (!this.isSetMembers()) {
      await this.init();
    }
    const res = await fetch(`${this.#BRICK_WALL_API_BASE_URL}/api/ip_ban`, {
      headers: {
        "brick-wall-manager": await this.getToken(),
      },
    });
    if (!res.ok) {
      throw new Error("Not ok");
    }
    const json = await res.json();
    return json;
  }
  async delete(ip: string): Promise<boolean> {
    if (!this.isSetMembers()) {
      await this.init();
    }
    const res = await fetch(`${this.#BRICK_WALL_API_BASE_URL}/api/ip_ban`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "brick-wall-manager": await this.getToken(),
      },
      body: JSON.stringify({ ip: ip }),
    });
    return res.ok;
  }
  async count() {
  }
}
