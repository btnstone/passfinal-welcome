import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import crypto from 'crypto';
import { OrderResponse, UserResponse } from '@/types/api';

// 帮助函数来创建签名
function createSignature(token: string, userId: string, params: string, ts: number): string {
  const rawString = `${token}params${params}ts${ts}user_id${userId}`;
  return crypto.createHash('md5').update(rawString).digest('hex');
}

// 泛型请求函数
async function requestAfdianApi<T>(endpoint: string, userId: string, token: string, paramsData: any): Promise<T> {
  const ts = Math.floor(Date.now() / 1000);
  const params = JSON.stringify(paramsData);
  const sign = createSignature(token, userId, params, ts);

  const response = await axios.post<T>('https://afdian.net/api/open' + endpoint, {
    user_id: userId,
    ts,
    params,
    sign,
  });

  return response.data;
}

// API路由的处理函数
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
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

  try {
    // 查询订单
    const orderResponse = await requestAfdianApi<OrderResponse>('/query-order', userId, token, { out_trade_no: outTradeNo });

    if (orderResponse.ec === 200 && orderResponse.data.list.length > 0) {
      const orderDetails = orderResponse.data.list[0];

      // 查询用户
      const userResponse = await requestAfdianApi<UserResponse>('/query-sponsor', userId, token, { user_id: orderDetails.user_id });

      if (userResponse.ec === 200 && userResponse.data.list.length > 0) {
        const user = userResponse.data.list.find(u => u.user.user_id === orderDetails.user_id);
        
        if (user) {
          // 构造响应数据
          const userDetails = {
            name: user.user.name || '未知用户',
            avatar: user.user.avatar || '默认头像',
            // ... 其他用户信息
          };

          const orderInfo = {
            orderNumber: orderDetails.out_trade_no,
            createTime: new Date(orderDetails.create_time * 1000).toLocaleString(),
            planTitle: orderDetails.plan_title,
            totalAmount: orderDetails.total_amount,
            status: orderDetails.status,
            // ... 其他订单信息
          };

          res.status(200).json({
            message: `订单和用户信息获取成功`,
            userDetails,
            orderInfo,
          });
          console.log(userDetails, orderInfo)
        } else {
          res.status(404).json({ message: "没有找到用户信息。" });
        }
      } else {
        res.status(404).json({ message: "没有找到用户信息。" });
      }
    } else {
      res.status(404).json({ message: "没有找到订单信息。" });
    }
  } catch (error) {
    // 处理错误
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
