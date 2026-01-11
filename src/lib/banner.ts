import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { ensureUploadsSubdir, getUploadPublicUrl, readJsonFile, writeJsonFile } from "./storage";

export type BannerData = {
  title: string;
  subtitle: string;
  image: string;
  enabled: boolean;
};

const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const defaultBanner: BannerData = {
  title: "Um abraco em forma de presente",
  subtitle:
    "Laura Ludovica e Joabe Lincoln no mesmo dia, na mesma festa e com todo o carinho da familia.",
  image: "/images/banner-default.svg",
  enabled: true,
};

export async function getBanner(): Promise<BannerData> {
  const data = await readJsonFile<Partial<BannerData>>(
    "banner.json",
    defaultBanner
  );
  return {
    ...defaultBanner,
    ...data,
  } as BannerData;
}

export async function saveBanner(data: BannerData) {
  await writeJsonFile("banner.json", data);
}

export async function saveBannerImage(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const extRaw = path.extname(file.name || "").toLowerCase();
  const ext = allowedExtensions.has(extRaw) ? extRaw : ".jpg";
  const fileName = `banner-${Date.now()}-${crypto.randomUUID().slice(0, 8)}${ext}`;

  const uploadDir = await ensureUploadsSubdir("banner");
  await fs.writeFile(path.join(uploadDir, fileName), buffer);

  return getUploadPublicUrl("banner", fileName);
}
