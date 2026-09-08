import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export const UPLOAD_FOLDERS = ["products", "categories", "banners", "landing", "general"] as const;
export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_BYTES = 5 * 1024 * 1024;

function mimeToExt(mime: string) {
  const map: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
  };
  return map[mime] || ".jpg";
}

export function isUploadFolder(value: string): value is UploadFolder {
  return (UPLOAD_FOLDERS as readonly string[]).includes(value);
}

export async function saveUploadedFile(file: File, folder: UploadFolder): Promise<string> {
  if (process.env.VERCEL) {
    throw new Error(
      "Image upload is not available on Vercel's filesystem. Use seeded images or connect Vercel Blob / S3.",
    );
  }

  if (!ALLOWED_MIME.has(file.type)) {
    throw new Error("Only JPG, PNG, WebP or GIF images are allowed");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Image must be under 5MB");
  }

  const ext = mimeToExt(file.type);
  const safeName = `${Date.now()}-${randomUUID().slice(0, 8)}${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(uploadDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, safeName), buffer);

  return `/uploads/${folder}/${safeName}`;
}
