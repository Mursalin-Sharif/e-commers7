import { mkdir, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { getProductImageUrl, getProductSeeds } from "../prisma/seed-products-data";

const root = join(fileURLToPath(import.meta.url), "..", "..");
const publicDir = join(root, "public");

const staticDownloads: [string, string][] = [
  ["images/categories/gadget.jpg", "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop&q=80"],
  ["images/categories/mens-fashion.jpg", "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=400&fit=crop&q=80"],
  ["images/categories/womens-fashion.jpg", "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=400&fit=crop&q=80"],
  ["images/categories/kids.jpg", "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=400&fit=crop&q=80"],
  ["images/categories/grocery.jpg", "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop&q=80"],
  ["images/categories/beauty-health.jpg", "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&q=80"],
  ["images/categories/home-decor.jpg", "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&q=80"],
  ["images/banners/banner-1.jpg", "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop&q=80"],
  ["images/banners/banner-2.jpg", "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop&q=80"],
  ["images/banners/banner-3.jpg", "https://picsum.photos/seed/gadgetbanner/1200/400"],
  ["images/banners/banner-4.jpg", "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=400&fit=crop&q=80"],
  ["images/banners/banner-5.jpg", "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=400&fit=crop&q=80"],
];

async function downloadFile(relPath: string, url: string) {
  const dest = join(publicDir, relPath);
  await mkdir(dirname(dest), { recursive: true });
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed ${url}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf);
  console.log(`✓ ${relPath} (${buf.length} bytes)`);
}

const productDownloads: [string, string][] = getProductSeeds().map((p) => [
  `images/products/${p.slug}.jpg`,
  getProductImageUrl(p.slug, p.categorySlug),
]);

const downloads = [...staticDownloads, ...productDownloads];

let failed = 0;
async function main() {
  for (const [path, url] of downloads) {
    try {
      await downloadFile(path, url);
    } catch (err) {
      failed++;
      console.error(`✗ ${path}:`, err instanceof Error ? err.message : err);
    }
  }

  console.log(`\nDone: ${downloads.length - failed}/${downloads.length} images downloaded`);
  if (failed > 0) process.exitCode = 1;
}

main();
