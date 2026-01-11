import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { getUploadsDir } from "@/lib/storage";

export const runtime = "nodejs";

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".heic": "image/heic",
  ".heif": "image/heif",
  ".svg": "image/svg+xml",
};

type UploadRouteContext = {
  params: {
    path: string[];
  };
};

export async function GET(_request: Request, { params }: UploadRouteContext) {
  const segments = params.path ?? [];
  const baseDir = getUploadsDir();
  const resolvedPath = path.resolve(baseDir, ...segments);

  if (!resolvedPath.startsWith(path.resolve(baseDir))) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const file = await fs.readFile(resolvedPath);
    const ext = path.extname(resolvedPath).toLowerCase();
    const contentType = MIME_TYPES[ext] ?? "application/octet-stream";

    return new NextResponse(file, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return new NextResponse("Not found", { status: 404 });
    }
    throw error;
  }
}
