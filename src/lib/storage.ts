import { promises as fs } from "fs";
import path from "path";

const BASE_TMP_DIR = path.join("/tmp", "niver-j-l");
const BUNDLED_DATA_DIR = path.join(process.cwd(), "src", "data");

const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : process.env.VERCEL
    ? path.join(BASE_TMP_DIR, "data")
    : BUNDLED_DATA_DIR;

const UPLOADS_DIR = process.env.UPLOADS_DIR
  ? path.resolve(process.env.UPLOADS_DIR)
  : process.env.VERCEL
    ? path.join(BASE_TMP_DIR, "uploads")
    : path.join(process.cwd(), "public", "uploads");

function isSameDir(a: string, b: string) {
  return path.resolve(a) === path.resolve(b);
}

async function ensureDataFile(fileName: string, fallback: string) {
  const target = path.join(DATA_DIR, fileName);
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(target);
    return target;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }

  if (!isSameDir(DATA_DIR, BUNDLED_DATA_DIR)) {
    const bundled = path.join(BUNDLED_DATA_DIR, fileName);
    try {
      const raw = await fs.readFile(bundled, "utf8");
      await fs.writeFile(target, raw, "utf8");
      return target;
    } catch {
      // Fall back to the provided seed content.
    }
  }

  await fs.writeFile(target, fallback, "utf8");
  return target;
}

export async function readJsonFile<T>(fileName: string, fallback: T): Promise<T> {
  const fallbackPayload = `${JSON.stringify(fallback, null, 2)}\n`;
  const filePath = await ensureDataFile(fileName, fallbackPayload);

  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeJsonFile<T>(fileName: string, data: T) {
  const payload = `${JSON.stringify(data, null, 2)}\n`;
  const filePath = await ensureDataFile(fileName, payload);
  await fs.writeFile(filePath, payload, "utf8");
}

export function getUploadsDir() {
  return UPLOADS_DIR;
}

export async function ensureUploadsSubdir(subdir: string) {
  const dir = path.join(UPLOADS_DIR, subdir);
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

export function getUploadPublicUrl(subdir: string, fileName: string) {
  return `/uploads/${subdir}/${fileName}`;
}
