// pages/api/query-order.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import crypto from 'crypto';

// 帮助函数来创建签名
function createSignature(token: string, userId: string, params: string, ts: number): string {
  const rawString = `${token}params${params}ts${ts}user_id${userId}`;
  return crypto.createHash('md5').update(rawString).digest('hex');
}

// API路由的处理函数
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  // 从环境变量获取userId和token
  const userId = process.env.USER_ID;
  const token = process.env.TOKEN;

  // 确保环境变量存在
  if (!userId || !token) {
    return res.status(500).json({ message: '服务器配置错误。' });
  }

  // 获取订单号
  const { outTradeNo } = req.body;

  // 检查订单号是否为27位
  if (!outTradeNo || outTradeNo.length !== 27) {
    return res.status(400).json({ message: '订单信息不正确。' });
  }

  // 构建请求
  const ts = Math.floor(Date.now() / 1000);
  const params = JSON.stringify({ out_trade_no: outTradeNo });

  // 创建签名
  const sign = createSignature(token, userId, params, ts);

  // 发送请求到爱发电API
  try {
    const afdianResponse = await axios.post('https://afdian.net/api/open/query-order', {
      user_id: userId,
      ts,
      params,
      sign,
    });

    // 检查返回数据中是否有订单列表
    if (afdianResponse.data.ec === 200 && afdianResponse.data.data.list.length > 0) {
      // 提取所需的数据
      const orderData = afdianResponse.data.data.list[0]; // 假设我们只关心第一个订单
      const responseData = {
        message: `恭喜，你曾经在${new Date(orderData.create_time * 1000).toLocaleString()}发电了${orderData.plan_title}。`,
        orderDetails: {
          orderNumber: orderData.out_trade_no,
          createTime: new Date(orderData.create_time * 1000).toLocaleString(),
          planTitle: orderData.plan_title,
          totalAmount: orderData.total_amount,
          status: orderData.status,
        },
      };

      // 发送处理后的数据回前端
      res.status(200).json(responseData);
    } else {
      // 如果没有订单，返回提示信息
      res.status(404).json({ message: "没有找到订单信息。" });
    }
  } catch (error) {
    // 处理错误
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
