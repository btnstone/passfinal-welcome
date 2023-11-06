// src/app/page.tsx
"use client"
// src/app/page.tsx

import React, { useState } from 'react';
import axios from 'axios';

const Page: React.FC = () => {
  const [outTradeNo, setOutTradeNo] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState('');

  const queryOrder = async () => {
    try {
      const response = await axios.post('/api/query-order', { outTradeNo });
      setOrderData(response.data);
      setError('');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'An error occurred');
      } else {
        setError('An error occurred');
      }
    }
  };

  return (
    <div>
      <input
        type="text"
        value={outTradeNo}
        onChange={(e) => setOutTradeNo(e.target.value)}
        placeholder="输入订单号"
      />
      <button onClick={queryOrder}>查询订单</button>

      {orderData && <pre>{JSON.stringify(orderData, null, 2)}</pre>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default Page;
