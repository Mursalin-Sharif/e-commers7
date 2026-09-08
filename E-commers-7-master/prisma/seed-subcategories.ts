export type SubcategorySeed = {
  name: string;
  slug: string;
};

export const subcategorySeeds: Record<string, SubcategorySeed[]> = {
  gadget: [
    { name: "Smart Watch", slug: "smart-watch" },
    { name: "Earphones", slug: "earphones" },
    { name: "Mobile Accessories", slug: "mobile-accessories" },
    { name: "Electronics", slug: "electronics" },
  ],
  "mens-fashion": [
    { name: "Shirt", slug: "mens-shirt" },
    { name: "Pant", slug: "mens-pant" },
    { name: "Shoe's", slug: "mens-shoes" },
    { name: "Formal Shoe", slug: "formal-shoe" },
    { name: "Sneakers", slug: "sneakers" },
    { name: "Sandals", slug: "sandals" },
    { name: "Panjabi", slug: "panjabi" },
    { name: "Pajama Sets", slug: "pajama-sets" },
    { name: "Cotton & Blends", slug: "cotton-blends" },
    { name: "Silk", slug: "mens-silk" },
  ],
  "womens-fashion": [
    { name: "Saree", slug: "saree" },
    { name: "Shalwar", slug: "shalwar" },
    { name: "Kurti", slug: "kurti" },
    { name: "Dupatta", slug: "dupatta" },
    { name: "Abaya", slug: "abaya" },
    { name: "Hijab", slug: "hijab" },
  ],
  kids: [
    { name: "Baby Wear", slug: "baby-wear" },
    { name: "Toys", slug: "kids-toys" },
    { name: "School Bags", slug: "school-bags" },
    { name: "Kids Shoes", slug: "kids-shoes" },
  ],
  grocery: [
    { name: "Cookies & Biscuits", slug: "cookies-biscuits" },
    { name: "Chocolate & Candies", slug: "chocolate-candies" },
    { name: "Bread & Cake", slug: "bread-cake" },
    { name: "Tea & Coffee", slug: "tea-coffee" },
    { name: "Energy Drinks & Soft Drink", slug: "energy-drinks" },
  ],
  "beauty-health": [
    { name: "Skin Care", slug: "skin-care" },
    { name: "Hair Care", slug: "hair-care" },
    { name: "Health Supplements", slug: "health-supplements" },
    { name: "Fitness", slug: "fitness" },
  ],
  "home-decor": [
    { name: "Kitchen", slug: "kitchen" },
    { name: "Furniture", slug: "furniture" },
    { name: "Lighting", slug: "lighting" },
    { name: "Decoration", slug: "decoration" },
  ],
};
