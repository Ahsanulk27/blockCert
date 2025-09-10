import { PrismaClient } from "@prisma/client";

// Add "?pgbouncer=true" to DATABASE_URL to disable prepared statements
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL + "?pgbouncer=true",
    },
  },
});

export { prisma };
