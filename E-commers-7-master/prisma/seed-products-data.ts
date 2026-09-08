export type ProductSeedInput = {
  name: string;
  slug: string;
  sku: string;
  price: number;
  salePrice?: number;
  stock: number;
  categorySlug: string;
  brandSlug?: string;
  isFeatured?: boolean;
  shortDescription: string;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function makeProduct(
  name: string,
  sku: string,
  categorySlug: string,
  price: number,
  salePrice: number | undefined,
  stock: number,
  brandSlug?: string,
  isFeatured = false,
): ProductSeedInput {
  const slug = slugify(name);
  return {
    name,
    slug,
    sku,
    price,
    salePrice,
    stock,
    categorySlug,
    brandSlug,
    isFeatured,
    shortDescription: `Premium quality ${name.toLowerCase()} — fast delivery across Bangladesh.`,
  };
}

const catalog: ProductSeedInput[] = [
  // Gadget (18)
  makeProduct("Oraimo Watch 5 Max", "PK-G001", "gadget", 1550, 1450, 50, "oraimo", true),
  makeProduct("K12 Karaoke Microphone Speaker", "PK-G002", "gadget", 1699, 1250, 30, "paki-select", true),
  makeProduct("UV Night Light Mosquito Killer", "PK-G003", "gadget", 950, 650, 40, undefined, true),
  makeProduct("Electric Hot Shower 3KW", "PK-G004", "gadget", 2000, 1900, 18, undefined, true),
  makeProduct("Wireless Bluetooth Earbuds TWS", "PK-G005", "gadget", 890, 690, 120, "oraimo"),
  makeProduct("20000mAh Power Bank Fast Charge", "PK-G006", "gadget", 1299, 999, 85, "oraimo"),
  makeProduct("Smart Fitness Band M6", "PK-G007", "gadget", 750, 599, 95, "oraimo"),
  makeProduct("Portable Mini Bluetooth Speaker", "PK-G008", "gadget", 650, 499, 70),
  makeProduct("USB Rechargeable Table Fan", "PK-G009", "gadget", 1150, 950, 45),
  makeProduct("LED Ring Light 10 Inch Tripod", "PK-G010", "gadget", 1450, 1199, 55),
  makeProduct("Wireless Mouse Silent Click", "PK-G011", "gadget", 450, 350, 150),
  makeProduct("Mechanical Keyboard RGB Backlit", "PK-G012", "gadget", 2200, 1899, 40),
  makeProduct("Type-C Fast Charging Cable 2M", "PK-G013", "gadget", 299, 249, 200),
  makeProduct("Phone Holder Car Dashboard Mount", "PK-G014", "gadget", 399, 299, 110),
  makeProduct("Smart WiFi Plug Socket", "PK-G015", "gadget", 850, 699, 60),
  makeProduct("Digital Kitchen Weighing Scale", "PK-G016", "gadget", 550, 450, 75),
  makeProduct("Rechargeable Emergency LED Light", "PK-G017", "gadget", 480, 380, 90),
  makeProduct("Laptop Cooling Pad Dual Fan", "PK-G018", "gadget", 990, 799, 50),

  // Men's Fashion (15)
  makeProduct("Full Sleeve Classic Fit Shirt", "PK-M001", "mens-fashion", 1500, 1200, 60, undefined, true),
  makeProduct("Premium Cotton Polo T-Shirt", "PK-M002", "mens-fashion", 850, 699, 80),
  makeProduct("Slim Fit Denim Jeans Blue", "PK-M003", "mens-fashion", 1890, 1599, 55),
  makeProduct("Casual Check Shirt Long Sleeve", "PK-M004", "mens-fashion", 1100, 899, 65),
  makeProduct("Formal Black Trouser Pants", "PK-M005", "mens-fashion", 1350, 1150, 48),
  makeProduct("Sports Running Shoes Men", "PK-M006", "mens-fashion", 2499, 1999, 35),
  makeProduct("Leather Belt Automatic Buckle", "PK-M007", "mens-fashion", 590, 450, 90),
  makeProduct("Winter Hoodie Sweatshirt", "PK-M008", "mens-fashion", 1650, 1399, 42),
  makeProduct("Panjabi Eid Special Embroidered", "PK-M009", "mens-fashion", 2200, 1850, 30),
  makeProduct("Cargo Shorts Summer Collection", "PK-M010", "mens-fashion", 750, 599, 70),
  makeProduct("Formal Blazer Single Button", "PK-M011", "mens-fashion", 3500, 2999, 20),
  makeProduct("Cotton Vest Inner Wear Pack 3", "PK-M012", "mens-fashion", 650, 550, 100),
  makeProduct("Sports T-Shirt Dry Fit", "PK-M013", "mens-fashion", 550, 450, 85),
  makeProduct("Leather Wallet Bifold", "PK-M014", "mens-fashion", 690, 550, 75, "arctic-hunter"),
  makeProduct("Sunglasses UV Protection Men", "PK-M015", "mens-fashion", 450, 350, 95),

  // Women's Fashion (15)
  makeProduct("Women Large Capacity Tote Bag", "PK-W001", "womens-fashion", 790, 690, 25, "arctic-hunter", true),
  makeProduct("Ladies Kurti Cotton Printed", "PK-W002", "womens-fashion", 890, 750, 70),
  makeProduct("Women's Leggings High Waist", "PK-W003", "womens-fashion", 450, 350, 120),
  makeProduct("Designer Saree Silk Blend", "PK-W004", "womens-fashion", 3200, 2799, 18),
  makeProduct("Casual Maxi Dress Floral", "PK-W005", "womens-fashion", 1450, 1199, 40),
  makeProduct("Women's Sandal Block Heel", "PK-W006", "womens-fashion", 990, 799, 55),
  makeProduct("Crossbody Shoulder Bag PU", "PK-W007", "womens-fashion", 850, 699, 48, "arctic-hunter"),
  makeProduct("Embroidered Three Piece Set", "PK-W008", "womens-fashion", 2800, 2399, 22),
  makeProduct("Women's Palazzo Pants Cotton", "PK-W009", "womens-fashion", 650, 499, 65),
  makeProduct("Stylish Scarf Hijab Soft", "PK-W010", "womens-fashion", 350, 299, 100),
  makeProduct("Women's Wrist Watch Elegant", "PK-W011", "womens-fashion", 1250, 999, 45, "oraimo"),
  makeProduct("Party Wear Gown Evening", "PK-W012", "womens-fashion", 3500, 2999, 15),
  makeProduct("Women's Sneakers White Pink", "PK-W013", "womens-fashion", 1890, 1599, 38),
  makeProduct("Gold Plated Earrings Set", "PK-W014", "womens-fashion", 590, 450, 80),
  makeProduct("Winter Shawl Wool Blend", "PK-W015", "womens-fashion", 1100, 899, 35),

  // Kids (12)
  makeProduct("Baby Rocking Chair", "PK-K001", "kids", 1990, 1850, 15, undefined, true),
  makeProduct("Kids School Backpack Cartoon", "PK-K002", "kids", 690, 550, 60),
  makeProduct("Baby Diaper Pack Economy 50pc", "PK-K003", "kids", 850, 750, 100),
  makeProduct("Kids Cotton T-Shirt Pack 3", "PK-K004", "kids", 750, 599, 70),
  makeProduct("Baby Feeding Bottle Set BPA Free", "PK-K005", "kids", 550, 450, 85),
  makeProduct("Kids Sports Shoes Velcro", "PK-K006", "kids", 1290, 1099, 45),
  makeProduct("Educational Building Blocks 100pc", "PK-K007", "kids", 890, 699, 55),
  makeProduct("Baby Stroller Lightweight Fold", "PK-K008", "kids", 4500, 3999, 12),
  makeProduct("Kids Rain Coat Waterproof", "PK-K009", "kids", 450, 350, 75),
  makeProduct("Soft Teddy Bear Large 40cm", "PK-K010", "kids", 590, 450, 65),
  makeProduct("Kids Bicycle 16 Inch", "PK-K011", "kids", 5500, 4999, 10),
  makeProduct("Baby Walker Activity Center", "PK-K012", "kids", 2800, 2499, 14),

  // Grocery (18)
  makeProduct("PRAN Dhaka Cheese 100gm", "PK-GR001", "grocery", 120, 110, 200, "pran"),
  makeProduct("Igloo Premium Ice Cream 120ml", "PK-GR002", "grocery", 60, 55, 200, "igloo"),
  makeProduct("PRAN Mango Juice 1 Liter", "PK-GR003", "grocery", 95, 85, 180, "pran"),
  makeProduct("Basmati Rice Premium 5kg", "PK-GR004", "grocery", 650, 599, 90),
  makeProduct("Soybean Oil Teer 5 Liter", "PK-GR005", "grocery", 780, 750, 75),
  makeProduct("Fresh Eggs Farm 12 Pieces", "PK-GR006", "grocery", 145, 135, 150),
  makeProduct("PRAN Tomato Ketchup 340gm", "PK-GR007", "grocery", 110, 99, 120, "pran"),
  makeProduct("Milk Powder Full Cream 1kg", "PK-GR008", "grocery", 890, 850, 60),
  makeProduct("Mixed Dry Fruits Premium 500gm", "PK-GR009", "grocery", 750, 699, 45),
  makeProduct("Green Tea Bags 50pc", "PK-GR010", "grocery", 280, 250, 85),
  makeProduct("Honey Natural Pure 500gm", "PK-GR011", "grocery", 550, 499, 50),
  makeProduct("Instant Noodles Chicken 5 Pack", "PK-GR012", "grocery", 175, 155, 200),
  makeProduct("Olive Oil Extra Virgin 500ml", "PK-GR013", "grocery", 890, 799, 40),
  makeProduct("Sugar Refined 2kg", "PK-GR014", "grocery", 145, 135, 130),
  makeProduct("Salt Iodized 1kg", "PK-GR015", "grocery", 35, undefined, 250),
  makeProduct("PRAN Pickle Mango 400gm", "PK-GR016", "grocery", 95, 85, 100, "pran"),
  makeProduct("Biscuit Cream Cracker Family Pack", "PK-GR017", "grocery", 120, 105, 160),
  makeProduct("Mineral Water 1.5L Pack 6", "PK-GR018", "grocery", 180, 165, 140),

  // Beauty & Health (12)
  makeProduct("Micro Touch Trimmer", "PK-BH001", "beauty-health", 690, 590, 45, undefined, true),
  makeProduct("Face Wash Neem Herbal 100ml", "PK-BH002", "beauty-health", 250, 199, 120),
  makeProduct("Hair Oil Coconut 200ml", "PK-BH003", "beauty-health", 180, 155, 150),
  makeProduct("Body Lotion Moisturizing 400ml", "PK-BH004", "beauty-health", 350, 299, 90),
  makeProduct("Toothpaste Herbal 200gm", "PK-BH005", "beauty-health", 120, 99, 200),
  makeProduct("Perfume Roll On Long Lasting", "PK-BH006", "beauty-health", 450, 380, 75),
  makeProduct("Vitamin C Serum Brightening", "PK-BH007", "beauty-health", 590, 499, 60),
  makeProduct("Sunscreen SPF 50 PA+++", "PK-BH008", "beauty-health", 650, 550, 55),
  makeProduct("Shampoo Anti Dandruff 400ml", "PK-BH009", "beauty-health", 320, 275, 100),
  makeProduct("Lipstick Matte Set 6 Colors", "PK-BH010", "beauty-health", 490, 399, 70),
  makeProduct("Electric Hair Dryer 2000W", "PK-BH011", "beauty-health", 1450, 1199, 40),
  makeProduct("Hand Sanitizer Gel 500ml", "PK-BH012", "beauty-health", 220, 185, 130),

  // Home Decor (10)
  makeProduct("Chair Covers Dining Room Set", "PK-HD001", "home-decor", 699, 399, 20, undefined, true),
  makeProduct("5 in 1 Sofa Bed", "PK-HD002", "home-decor", 7999, 5999, 8, undefined, true),
  makeProduct("Wall Clock Silent Sweep 12 Inch", "PK-HD003", "home-decor", 590, 450, 55),
  makeProduct("LED String Lights Warm White 10M", "PK-HD004", "home-decor", 450, 350, 80),
  makeProduct("Cushion Cover Set of 4 Velvet", "PK-HD005", "home-decor", 750, 599, 45),
  makeProduct("Kitchen Knife Set Stainless 6pc", "PK-HD006", "home-decor", 1290, 1099, 35),
  makeProduct("Non Stick Frying Pan 28cm", "PK-HD007", "home-decor", 890, 750, 50),
  makeProduct("Plastic Storage Box 50L", "PK-HD008", "home-decor", 650, 550, 60),
  makeProduct("Bamboo Laundry Basket Foldable", "PK-HD009", "home-decor", 550, 450, 40),
  makeProduct("Artificial Plant Pot Decorative", "PK-HD010", "home-decor", 480, 399, 65),
];

export function getProductSeeds(): ProductSeedInput[] {
  return catalog;
}

export function getProductImagePath(slug: string) {
  return `/images/products/${slug}.jpg`;
}

export function getProductImageUrl(slug: string, categorySlug: string) {
  const categorySeeds: Record<string, number> = {
    gadget: 100,
    "mens-fashion": 200,
    "womens-fashion": 300,
    kids: 400,
    grocery: 500,
    "beauty-health": 600,
    "home-decor": 700,
  };
  const base = categorySeeds[categorySlug] ?? 50;
  const hash = slug.split("").reduce((sum, c) => sum + c.charCodeAt(0), 0);
  const id = base + (hash % 80);
  return `https://picsum.photos/seed/paki-${slug}/500/500`;
}
