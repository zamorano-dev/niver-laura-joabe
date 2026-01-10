import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { DEFAULT_CHILD_PHOTOS } from "./constants";
import { ProductTag } from "./types";

export type ChildPhotoMap = Record<ProductTag, string>;

const dataFile = path.join(process.cwd(), "src", "data", "child-photos.json");
const uploadDir = path.join(process.cwd(), "public", "uploads", "child");
const allowedExtensions = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".heic",
  ".heif",
]);

export async function getChildPhotos(): Promise<ChildPhotoMap> {
  try {
    const raw = await fs.readFile(dataFile, "utf8");
    const data = JSON.parse(raw) as Partial<ChildPhotoMap>;
    return {
      ...DEFAULT_CHILD_PHOTOS,
      ...Object.fromEntries(
        Object.entries(data).filter(([, value]) => typeof value === "string")
      ),
    } as ChildPhotoMap;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return DEFAULT_CHILD_PHOTOS;
    }
    throw error;
  }
}

export async function saveChildPhotos(photos: ChildPhotoMap) {
  await fs.writeFile(dataFile, `${JSON.stringify(photos, null, 2)}\n`, "utf8");
}

export async function saveChildPhoto(tag: ProductTag, file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const extRaw = path.extname(file.name || "").toLowerCase();
  const ext = allowedExtensions.has(extRaw) ? extRaw : ".jpg";
  const fileName = `${tag.toLowerCase()}-${Date.now()}-${crypto
    .randomUUID()
    .slice(0, 8)}${ext}`;

  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, fileName), buffer);

  return `/uploads/child/${fileName}`;
}
