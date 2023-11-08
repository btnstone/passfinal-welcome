import { PrismaClient } from '@prisma/client';

declare global {
  // 在 global 类型上增加一个 prisma 的属性
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

// 检查是否为生产环境
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // 在非生产环境下重用实例
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
