import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const user = await prisma.user.findFirst({ where: { phone: "01700000000" } });
console.log(user?.email, user?.role, user?.name);
await prisma.$disconnect();
