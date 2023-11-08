import { PrismaClient } from '@prisma/client';

declare global {
  // Only inside Node.js
  namespace NodeJS {
    interface Global {
      prisma: PrismaClient;
    }
  }
}

export {};
