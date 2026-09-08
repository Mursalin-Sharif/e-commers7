import type { Prisma } from "@prisma/client";

/** MongoDB may store root categories with unset parentId instead of null. */
export const rootCategoryWhere = {
  isActive: true,
  OR: [{ parentId: null }, { parentId: { isSet: false } }],
} satisfies Prisma.CategoryWhereInput;
