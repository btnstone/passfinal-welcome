import { PrismaClient } from '@prisma/client';

// This ensures that if we're running in `development` mode,


declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}
if (!global.prisma) {
  global.prisma = new PrismaClient();
}
prisma = global.prisma;


export default prisma;
