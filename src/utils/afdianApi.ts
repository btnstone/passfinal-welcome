// afdianApi.ts
import axios from 'axios';
import { BaseResponse } from '@/types/api'; // 确保导入了BaseResponse
import { createSignature } from './helper';

// 你需要确保你的环境变量类型是正确的，或者在这里提供一个默认值
const userId = process.env.USER_ID || '';
const token = process.env.TOKEN || '';

// 泛型T继承自BaseResponse，以确保你的响应类型至少包含BaseResponse的属性
export async function requestAfdianApi<T extends BaseResponse>(
  endpoint: string,
  data: Record<string, any>
): Promise<T> {
  // 确保userId和token是有效的
  if (!userId || !token) {
    throw new Error('服务器配置错误。');
  }

  // 创建时间戳
  const ts = Math.floor(Date.now() / 1000);

  // 对请求参数进行序列化
  const params = JSON.stringify(data);

  // 创建签名
  const sign = createSignature(token, userId, params, ts);

  // 设置POST请求的正文
  const postData = {
    user_id: userId,
    ts: ts,
    params: params,
    sign: sign,
  };

  try {
    // 发起请求到爱发电的API
    const response = await axios.post<T>(endpoint, postData);
    console.log(response.data);

    // 检查响应码
    if (response.data.ec !== 200) {
      throw new Error(response.data.em || 'API请求失败');
    }

    return response.data;
  } catch (error) {
    // 如果是axios错误，我们可以得到具体的HTTP状态码和响应体
    if (axios.isAxiosError(error)) {
      throw error;
    }
    // 如果是其它错误，我们抛出一个通用错误
    throw new Error('请求爱发电API时发生未知错误');
  }
}
