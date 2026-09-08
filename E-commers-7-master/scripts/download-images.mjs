import { mkdir, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(fileURLToPath(import.meta.url), "..", "..");
const publicDir = join(root, "public");

const downloads = [
  // Products
  ["images/products/oraimo-watch-5-max.jpg", "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop&q=80"],
  ["images/products/k12-karaoke-microphone.jpg", "https://picsum.photos/seed/k12mic/500/500"],
  ["images/products/uv-mosquito-killer.jpg", "https://picsum.photos/seed/uvkill/500/500"],
  ["images/products/women-tote-bag.jpg", "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&h=500&fit=crop&q=80"],
  ["images/products/full-sleeve-shirt.jpg", "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&h=500&fit=crop&q=80"],
  ["images/products/pran-dhaka-cheese.jpg", "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500&h=500&fit=crop&q=80"],
  ["images/products/micro-touch-trimmer.jpg", "https://picsum.photos/seed/trimmer/500/500"],
  ["images/products/chair-covers-set.jpg", "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=500&h=500&fit=crop&q=80"],
  ["images/products/igloo-ice-cream.jpg", "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&h=500&fit=crop&q=80"],
  ["images/products/baby-rocking-chair.jpg", "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&h=500&fit=crop&q=80"],
  ["images/products/electric-hot-shower.jpg", "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=500&h=500&fit=crop&q=80"],
  ["images/products/sofa-bed-5in1.jpg", "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop&q=80"],
  // Categories
  ["images/categories/gadget.jpg", "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop&q=80"],
  ["images/categories/mens-fashion.jpg", "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=400&fit=crop&q=80"],
  ["images/categories/womens-fashion.jpg", "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=400&fit=crop&q=80"],
  ["images/categories/kids.jpg", "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=400&fit=crop&q=80"],
  ["images/categories/grocery.jpg", "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop&q=80"],
  ["images/categories/beauty-health.jpg", "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&q=80"],
  ["images/categories/home-decor.jpg", "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&q=80"],
  // Banners
  ["images/banners/banner-1.jpg", "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop&q=80"],
  ["images/banners/banner-2.jpg", "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop&q=80"],
  ["images/banners/banner-3.jpg", "https://picsum.photos/seed/gadgetbanner/1200/400"],
  ["images/banners/banner-4.jpg", "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=400&fit=crop&q=80"],
  ["images/banners/banner-5.jpg", "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=400&fit=crop&q=80"],
];

async function downloadFile(relPath, url) {
  const dest = join(publicDir, relPath);
  await mkdir(dirname(dest), { recursive: true });
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed ${url}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf);
  console.log(`✓ ${relPath} (${buf.length} bytes)`);
}

for (const [path, url] of downloads) {
  try {
    await downloadFile(path, url);
  } catch (err) {
    console.error(`✗ ${path}:`, err.message);
    process.exitCode = 1;
  }
}
