// src/libs/logger.ts

import prisma from "./prisma"

interface LogEntry {
  outTradeNo: string
  userId: string
  userName: string
  ipAddress: string
  avatar?: string
  createTime?: string
}

export async function logQuery({
  outTradeNo,
  userId,
  userName,
  ipAddress,
  avatar,
  createTime,
}: LogEntry): Promise<void> {
  try {
    console.log("Logging query...")
    console.log("DATABASE_URL:", process.env.DATABASE_URL);
    await prisma.queryLog.create({
      data: {
        outTradeNo,
        userId,
        userName,
        ipAddress,
        avatar,
        createTime,

        // queryTime 是自动生成的
      },
    })
    console.log("Query logged successfully.")
  } catch (error) {
    console.error("Error logging query:", error)
    // 处理或传播错误
    throw error // 如果你想让调用者知道错误发生了
  }
}
