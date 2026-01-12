const fs = require("fs/promises");
const path = require("path");
const { createClient } = require("redis");

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "src", "data");
const DEFAULT_NAMESPACE = "niver-j-l";

async function loadEnv() {
  const envPath = path.join(ROOT, ".env");
  try {
    const raw = await fs.readFile(envPath, "utf8");
    raw
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .forEach((line) => {
        const [key, ...rest] = line.split("=");
        if (!key) {
          return;
        }
        const value = rest.join("=").trim();
        if (!value || process.env[key]) {
          return;
        }
        process.env[key] = value.replace(/^"(.*)"$/, "$1");
      });
  } catch {
    // .env is optional
  }
}

async function readJson(fileName) {
  const filePath = path.join(DATA_DIR, fileName);
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

async function main() {
  await loadEnv();

  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    throw new Error("REDIS_URL nao definido no ambiente.");
  }

  const namespace = process.env.STORAGE_NAMESPACE || DEFAULT_NAMESPACE;
  const key = (name) => `${namespace}:${name}`;

  const [products, banner, childPhotos] = await Promise.all([
    readJson("products.json"),
    readJson("banner.json"),
    readJson("child-photos.json"),
  ]);

  const client = createClient({ url: redisUrl });
  client.on("error", (error) => {
    console.error("Redis connection error:", error);
  });

  await client.connect();

  await client.set(key("products"), JSON.stringify(products));
  await client.set(key("banner"), JSON.stringify(banner));
  await client.set(key("child-photos"), JSON.stringify(childPhotos));

  await client.disconnect();

  console.log(
    `Dump concluido: ${Array.isArray(products) ? products.length : 0} produtos, banner e fotos sincronizados.`
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
