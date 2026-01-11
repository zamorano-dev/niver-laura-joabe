import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

export type BannerData = {
  title: string;
  subtitle: string;
  image: string;
  enabled: boolean;
};

const dataFile = path.join(process.cwd(), "src", "data", "banner.json");
const uploadDir = path.join(process.cwd(), "public", "uploads", "banner");
const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const defaultBanner: BannerData = {
  title: "Um abraco em forma de presente",
  subtitle:
    "Laura Ludovica e Joabe Lincoln no mesmo dia, na mesma festa e com todo o carinho da familia.",
  image: "/images/banner-default.svg",
  enabled: true,
};

export async function getBanner(): Promise<BannerData> {
  try {
    const raw = await fs.readFile(dataFile, "utf8");
    const data = JSON.parse(raw) as Partial<BannerData>;
    return {
      ...defaultBanner,
      ...data,
    } as BannerData;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return defaultBanner;
    }
    throw error;
  }
}

export async function saveBanner(data: BannerData) {
  await fs.writeFile(dataFile, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export async function saveBannerImage(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const extRaw = path.extname(file.name || "").toLowerCase();
  const ext = allowedExtensions.has(extRaw) ? extRaw : ".jpg";
  const fileName = `banner-${Date.now()}-${crypto.randomUUID().slice(0, 8)}${ext}`;

  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, fileName), buffer);

  return `/uploads/banner/${fileName}`;
}
