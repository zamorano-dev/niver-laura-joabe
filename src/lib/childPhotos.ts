import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { DEFAULT_CHILD_PHOTOS } from "./constants";
import { ProductTag } from "./types";
import {
  ensureUploadsSubdir,
  getUploadPublicUrl,
  readJsonFile,
  writeJsonFile,
} from "./storage";

export type ChildPhotoMap = Record<ProductTag, string>;

const allowedExtensions = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".heic",
  ".heif",
]);

export async function getChildPhotos(): Promise<ChildPhotoMap> {
  const data = await readJsonFile<Partial<ChildPhotoMap>>(
    "child-photos.json",
    DEFAULT_CHILD_PHOTOS
  );
  return {
    ...DEFAULT_CHILD_PHOTOS,
    ...Object.fromEntries(
      Object.entries(data).filter(([, value]) => typeof value === "string")
    ),
  } as ChildPhotoMap;
}

export async function saveChildPhotos(photos: ChildPhotoMap) {
  await writeJsonFile("child-photos.json", photos);
}

export async function saveChildPhoto(tag: ProductTag, file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const extRaw = path.extname(file.name || "").toLowerCase();
  const ext = allowedExtensions.has(extRaw) ? extRaw : ".jpg";
  const fileName = `${tag.toLowerCase()}-${Date.now()}-${crypto
    .randomUUID()
    .slice(0, 8)}${ext}`;

  const uploadDir = await ensureUploadsSubdir("child");
  await fs.writeFile(path.join(uploadDir, fileName), buffer);

  return getUploadPublicUrl("child", fileName);
}
