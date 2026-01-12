import { readJsonFile, writeJsonFile } from "@/lib/storage";

type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

export type StorageGateway = {
  readJson<T extends JsonValue>(key: string, fallback: T): Promise<T>;
  writeJson<T extends JsonValue>(key: string, data: T): Promise<void>;
};

const DEFAULT_NAMESPACE = "niver-j-l";
const namespace = process.env.STORAGE_NAMESPACE || DEFAULT_NAMESPACE;

let cachedGateway: StorageGateway | null = null;
type RedisClient = {
  connect: () => Promise<unknown>;
  disconnect: () => Promise<unknown>;
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string) => Promise<unknown>;
  on: (event: "error", listener: (error: unknown) => void) => void;
};

let redisClient: RedisClient | null = null;
let redisReady: Promise<RedisClient> | null = null;

function buildKey(key: string) {
  return `${namespace}:${key}`;
}

function createFileGateway(): StorageGateway {
  return {
    readJson: (key, fallback) => readJsonFile(`${key}.json`, fallback),
    writeJson: (key, data) => writeJsonFile(`${key}.json`, data),
  };
}

async function getRedisClient() {
  if (redisClient) {
    return redisClient;
  }

  if (!redisReady) {
    redisReady = (async () => {
      const { createClient } = await import("redis");
      const client = createClient({ url: process.env.REDIS_URL });
      client.on("error", (error) => {
        console.error("Redis connection error:", error);
      });
      await client.connect();
      redisClient = client as unknown as RedisClient;
      return redisClient;
    })();
  }

  return redisReady;
}

async function createRedisGateway(): Promise<StorageGateway> {
  const client = await getRedisClient();

  return {
    async readJson<T extends JsonValue>(key: string, fallback: T) {
      const value = await client.get(buildKey(key));
      if (!value) {
        return fallback;
      }

      try {
        return JSON.parse(value) as T;
      } catch {
        return fallback;
      }
    },
    async writeJson<T extends JsonValue>(key: string, data: T) {
      await client.set(buildKey(key), JSON.stringify(data));
    },
  };
}

async function createKvGateway(): Promise<StorageGateway> {
  const { kv } = await import("@vercel/kv");

  return {
    async readJson<T extends JsonValue>(key: string, fallback: T) {
      const value = await kv.get<T>(buildKey(key));
      return value ?? fallback;
    },
    async writeJson<T extends JsonValue>(key: string, data: T) {
      await kv.set(buildKey(key), data);
    },
  };
}

function canUseRedis() {
  return Boolean(process.env.REDIS_URL);
}

function canUseKv() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export async function getStorageGateway(): Promise<StorageGateway> {
  if (cachedGateway) {
    return cachedGateway;
  }

  if (canUseRedis()) {
    cachedGateway = await createRedisGateway();
  } else if (canUseKv()) {
    cachedGateway = await createKvGateway();
  } else {
    cachedGateway = createFileGateway();
  }

  return cachedGateway;
}
