// pages/api/query-order.ts
import type { NextApiRequest, NextApiResponse } from "next"
import { requestAfdianApi } from "@/utils/afdianApi" // 确保路径正确
import { OrderResponse, UserResponse } from "@/types/api" // 确保路径正确
import { logQuery } from "@/lib/logger"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 解构请求体中的订单号
    const { outTradeNo } = req.body

    // 检查订单号是否有效
    if (!outTradeNo || outTradeNo.length !== 27) {
      return res.status(400).json({ message: "订单信息不正确。" })
    }

    // 查询订单信息
    const orderParams = { out_trade_no: outTradeNo }
    const orderResponse = await requestAfdianApi<OrderResponse>(
      "https://afdian.net/api/open/query-order",
      orderParams
    )

    // 验证订单查询结果
    if (orderResponse.data.list.length === 0) {
      return res.status(404).json({ message: "没有找到订单信息。" })
    }
    const orderData = orderResponse.data.list[0]

    // 查询用户信息
    const userParams = { user_id: orderData.user_id }
    const userResponse = await requestAfdianApi<UserResponse>(
      "https://afdian.net/api/open/query-sponsor",
      userParams
    )

    // 验证用户查询结果
    if (userResponse.data.list.length === 0) {
      return res.status(404).json({ message: "没有找到用户信息。" })
    }
    const userData = userResponse.data.list.find(
      (u) => u.user.user_id === orderData.user_id
    )

    if (!userData) {
      return res.status(404).json({ message: "用户信息不匹配。" })
    }

    // 组装返回的用户和订单详情
    const userDetails = {
      name: userData.user.name || "未知用户",
      avatar: userData.user.avatar || "默认头像",
      // ...其他用户信息
    }

    const orderDetails = {
      orderNumber: orderData.out_trade_no,
      userId: orderData.user_id,
      createTime: new Date(orderData.create_time * 1000).toISOString(), // 将时间转换为 ISO 格式
      planTitle: orderData.plan_title,
      totalAmount: orderData.total_amount,
      status: orderData.status,
      // ...其他订单信息
    }

    // 返回成功响应
    res.status(200).json({
      message: `订单查询成功。`,
      orderDetails,
      userDetails,
    })

    // 假设订单信息查询成功，并且你已经获取了需要的所有数据
    const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress // 获取用户IP地址

    // 调用 logQuery 函数记录日志
    await logQuery({
      outTradeNo: orderDetails.orderNumber, // 替换为你的实际变量
      avatar: userDetails.avatar, // 替换为你的实际变量
      userId: orderDetails.userId, // 替换为你的实际变量
      userName: userDetails.name, // 替换为你的实际变量
      ipAddress: ipAddress as string,
      createTime: orderDetails.createTime,

    })
  } catch (error) {
    // 统一错误处理
    if (error instanceof Error) {
      res.status(500).json({ message: error.message })
    } else {
      res.status(500).json({ message: "未知服务器错误" })
    }
  }
}

export default handler
