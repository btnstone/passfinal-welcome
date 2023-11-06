// src/app/page.tsx

"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"
import Confetti from "../components/Confetti"

// 定义订单响应类型
interface OrderDetails {
  orderNumber: string
  createTime: string
  planTitle: string
  totalAmount: string
  status: number
}

interface OrderResponse {
  message: string
  orderDetails: OrderDetails
}

const Page: React.FC = () => {
  const [outTradeNo, setOutTradeNo] = useState("")
  const [orderInfo, setOrderInfo] = useState<OrderResponse | null>(null)
  const [error, setError] = useState("")
  const [typingEffect, setTypingEffect] = useState("")
  const [showContent, setShowContent] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const fullText = "嗨！别来无恙！"
  const typingSpeed = 100 // 打字速度（毫秒）

  useEffect(() => {
    if (typingEffect.length < fullText.length) {
      setTimeout(() => {
        setTypingEffect(fullText.slice(0, typingEffect.length + 1))
      }, typingSpeed)
    } else {
      setTimeout(() => {
        setShowContent(true)
      }, 1000)
    }
  }, [typingEffect])

  const queryOrder = async () => {
    try {
      const response = await axios.post("/api/query-order", { outTradeNo })
      setOrderInfo(response.data)
      setShowConfetti(true)
      setError("")
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "An error occurred")
      } else {
        setError("There was an error fetching the order data.")
      }
      setOrderInfo(null)
      setShowConfetti(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 ">
          {typingEffect}
          <span className="animate-blink">|</span>
        </h1>
        <div
          className={`transition-opacity duration-1000 ${
            showContent ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="mb-4 m-5">感谢你的一路支持，小破站即将重构完成！<br></br>截至2023年11月6日前，曾经在爱发电赞助过任意金额的朋友们<br></br>都可以获得优先内测资格和铁杆支持者待遇！</p>
          <div>
            <input
              type="text"
              value={outTradeNo}
              onChange={(e) => setOutTradeNo(e.target.value)}
              className="border-2 border-gray-300 p-2 mr-2 w-80"
              placeholder="输入爱发电订单号"
            />
            <button
              onClick={queryOrder}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              查询订单
            </button>
          </div>
          {orderInfo && (
            <div className="mt-4 text-green-600">
              <p>{orderInfo.message}</p>
              {orderInfo.orderDetails && (
                <>
                  <p>赞助金额: {orderInfo.orderDetails.totalAmount}</p>
                  <p>赞助时间: {orderInfo.orderDetails.createTime}</p>
                </>
              )}
            </div>
          )}

          {error && <p className="text-red-600">{error}</p>}
        </div>
        {showConfetti && <Confetti />}
      </div>
    </div>
  )
}

export default Page
