// helper.ts
import crypto from 'crypto';

// 帮助函数来创建签名
export function createSignature(token: string, userId: string, params: string, ts: number): string {
  const rawString = `${token}params${params}ts${ts}user_id${userId}`;
  return crypto.createHash('md5').update(rawString).digest('hex');
}