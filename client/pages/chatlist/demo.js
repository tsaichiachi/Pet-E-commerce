import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import axios from "axios";

export default function ChatDemo() {
  const [message, setMessage] = useState(""); // 儲存返回後的消息
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null); // 用於儲存解析後的userID
  const [chatlistId, setChatlistId] = useState(null); // 用於儲存解析後的chatlistId
  const [msgInputValue, setMsgInputValue] = useState(""); // 輸入框的值

  // 利用token拿到當前登入的userID
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwt_decode(token);
        const currentUserID = decodedToken.id;
        console.log("currentUserID", currentUserID);
        setUserId(currentUserID);
      } catch (error) {
        console.error("解析Token時出錯", error);
      }
    }
  }, []);

  // 發出消息找有沒有chatlist_id 沒有就新增
  const handleButtonClick = async () => {
    setIsLoading(true);

    // 檢查是否有有效的 userId
    //如果放入targetID 變數 這邊也要把targetID 變數放進來檢查
    if (userId) {
      // 建立要傳送的數據
      const requestData = {
        chatlist_userId1: userId,
        chatlist_userId2: 8, // 放要對話的 targetID 變數
      };

      try {
        const response = await axios.post(
          "http://localhost:3005/api/chatlist/creatchat",
          requestData
        );

        if (response.status === 201) {
          // 請求成功
          setMessage("請求成功");
          const ChatlistId = response.data.chatlistId;
          console.log("ChatlistId" + ChatlistId);

          //把ChatlistId存到狀態裡後面送消息時使用
          setChatlistId(ChatlistId);
          console.log("setChatlistId設置成功");
        } else if (response.status === 200) {
          // 消息已存在
          setMessage("消息已存在");
          const chatUrl = response.data.chatUrl;
          const ChatlistId = response.data.chatlistId;
          console.log("已存在chatUrl" + chatUrl);
          console.log("ChatlistId" + ChatlistId);

          //把ChatlistId存到狀態裡後面送消息時使用
          setChatlistId(ChatlistId);
          console.log("setChatlistId設置成功");
        } else {
          // 請求失敗
          setMessage("請求失敗: " + response.data.error);
        }
      } catch (error) {
        // 處理錯誤
        setMessage(error.message || "發生錯誤");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // 處理訊息送出事件
  const handleSendClick = async () => {
    // 先檢查消息是否為空
    if (!msgInputValue) {
      return;
    }
    try {
      // 發送消息到後端
      const response = await fetch(
        "http://localhost:3005/api/chatroom/sendchat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chatlist_id: chatlistId,
            talk_userId: userId, // 使用前端頁面登入的 userId
            chat_content: msgInputValue,
          }),
        }
      );
      if (response.ok) {
        // 清空輸入框的值
        setMsgInputValue("");
        const chatUrl = `/chatlist/${chatlistId}`;
        // 在這裡導向到 chatUrl
        window.location.href = chatUrl;
      } else {
        console.error("發送消息時出錯");
      }
    } catch (error) {
      console.error("發送消息時出錯", error);
    }
  };

  return (
    <>
      <h1>ChatDemo</h1>
      <button
        className="btn-brown mx-1"
        onClick={handleButtonClick}
        disabled={isLoading}
      >
        {isLoading ? "發送中..." : "發送消息"}
      </button>
      {/* 顯示返回後的消息 */}
      {message && <p>{message}</p>}
      <div className="input-group mb-3">
        <input
          name="msg"
          type="text"
          className="form-control"
          placeholder="請輸入訊息內容"
          aria-label="Recipient's username"
          aria-describedby="button-addon2"
          value={msgInputValue}
          onChange={(e) => setMsgInputValue(e.target.value)}
        />
        <button
          className="btn-second mx-1"
          type="button"
          id="button-addon2"
          onClick={handleSendClick}
        >
          {isLoading ? "送出中..." : "送出"}
        </button>
      </div>
    </>
  );
}
