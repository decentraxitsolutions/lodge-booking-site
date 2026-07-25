import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

function createPrismaClient() {
    const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
    return new PrismaClient({ adapter });
}

// If global client doesn't support the newly generated models, clear the cache to force instantiation of the updated schema client
if (globalThis.prisma && !globalThis.prisma.setting) {
    globalThis.prisma = undefined;
}

export const db = globalThis.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = db;
}
