import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ChatList() {
  const [chatList, setChatList] = useState([]); //聊天列表設置的狀態
  const [chatContent, setChatContent] = useState([]); //聊天列表最新一筆聊天訊息的狀態
  const [decodedToken, setDecodedToken] = useState(null); // 新增 decodedToken 狀態
  const router = useRouter();

  // 驗證登入
  useEffect(() => {
    const token = localStorage.getItem("token");
    // 沒有token
    if (!token) {
      console.log("user沒登入");
      return;
    }
    const decodedToken = decodeToken(token);
    setDecodedToken(decodedToken);

    // 解token後，拿到user_id
    getChatList(decodedToken.id);
    getChatContent(decodedToken.id);
  }, []);

  const decodeToken = (token) => {
    try {
      const decoded = jwt_decode(token);
      return decoded;
    } catch (error) {
      console.error("失敗：", error);
      return false;
    }
  };

  // 利用解碼後的user_id向伺服器要求資料並設定到狀態中
  const getChatList = async (user_id) => {
    console.log(user_id);
    const res = await fetch("http://localhost:3005/api/chatlist/" + user_id);

    const data = await res.json();

    console.log("data.chatlist_id" + data.chatlist_id);
    // 設定到狀態中 -> 會觸發重新渲染(re-render)
    if (Array.isArray(data)) setChatList(data);
  };

  // 利用user_id向伺服器要求聊天室內最新一筆資料並設定到狀態中
  const getChatContent = async (user_id) => {
    console.log(user_id);
    const res = await fetch(
      "http://localhost:3005/api/chatroom/newest/" + user_id
    );

    const data = await res.json();

    console.log("data" + data);
    // 設定到狀態中 -> 會觸發重新渲染(re-render)
    if (Array.isArray(data)) setChatContent(data);
  };

  return (
    <>
      <div className="chatlist">
        <div className="container-fluid py-5">
          <div className="list-group">
            <div className="list-title">
              <Link
                href="#"
                className="list-group-item list-group-item-action active size-3 m-size-5"
                aria-current="true"
              >
                我的訊息
              </Link>
            </div>
            {chatContent.length > 0 ? ( // Check if chatContent is not empty
              chatContent.map((v, i) => {
                const latestMessage = v.latestMessage;
                return (
                  <div className="list" key={v.user_id}>
                    <Link
                      href={`/chatlist/${v.chatlist_id}`}
                      className="list-group-item list-group-item-action"
                    >
                      <div className="d-flex align-items-center">
                        <div className="avatar rounded-circle mr-3 overflow-hidden rounded-circle">
                          <img
                            src={v.cover_photo}
                            className="img-fluid object-fit-cover"
                          />
                        </div>
                        <div className="mx-3 size-5 m-size-5">
                          <span>{v.name}</span>
                        </div>
                        <div className="size-7 m-size-7 text-secondary">
                          {latestMessage ? (
                            <span key={latestMessage.timestamp}>
                              {latestMessage.chat_content}
                            </span>
                          ) : (
                            <span></span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })
            ) : (
              // Display an image or message when chatContent is empty
              <div className="no-data-image d-flex flex-column align-items-center justify-content-center my-5">
                <img src="/checkout.png" alt="No data image" />
                <p className="size-5">目前沒有新消息</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
