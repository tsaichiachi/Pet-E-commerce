import { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";
import useInterval from "use-interval";

export default function Chatroom() {
  const router = useRouter();
  const { id } = router.query;
  const chatlist_id = id;
  // console.log("chatlist_id=" + chatlist_id);
  const [chatContent, setChatContent] = useState([]); //內容設置的狀態
  const [chatTitle, setChatTitle] = useState([]); //聊天室標題設置的狀態
  const [userId, setUserId] = useState(""); //儲存userID
  const [userInfo, setUserInfo] = useState(""); //儲存userInfo
  const [decodedToken, setDecodedToken] = useState(null); // 新增 decodedToken 狀態
  const [msgInputValue, setMsgInputValue] = useState(""); // 輸入框的值

  // 使用 useInterval 定時刷新 chatContent
  useInterval(() => {
    getChatContent(chatlist_id);
  }, 50); // 0.05秒刷新一次

  // 驗證有無登入
  useEffect(() => {
    const token = localStorage.getItem("token");
    // 沒有token
    if (!token) {
      console.log("user沒登入");
      return;
    }
    const decodedToken = decodeToken(token);

    // 使用 router.isReady 判斷
    if (router.isReady) {
      // 解 token 拿到 user_id
      setDecodedToken(decodedToken);
      // 儲存user_id
      setUserId(decodedToken.id);
    }
    // 如果 chatlist_id 存在，則調用 getChatContent
    if (chatlist_id) {
      getChatContent(chatlist_id);
    }
    if (chatlist_id && userId) {
      getChatTitle(chatlist_id, userId);
    }
    if (userId) {
      getUserInfo(userId);
    }
  }, [router.isReady, chatlist_id, userId]);

  const decodeToken = (token) => {
    try {
      const decoded = jwt_decode(token);
      return decoded;
    } catch (error) {
      console.error("失敗：", error);
      return false;
    }
  };

  // 利用網址傳來的chatlist_id向伺服器要求資料並設定到狀態中
  const getChatContent = async (chatlist_id) => {
    const res = await fetch(
      "http://localhost:3005/api/chatroom/" + chatlist_id
    );

    const ChatContentData = await res.json();

    console.log(ChatContentData);
    // 設定到狀態中 -> 會觸發重新渲染(re-render)
    if (Array.isArray(ChatContentData)) setChatContent(ChatContentData);
  };

  // 利用網址傳來的chatlist_id + Token解出來的user_id向伺服器要求聊天室標題資料並設定到狀態中
  const getChatTitle = async (chatlist_id, userId) => {
    const res = await fetch(
      "http://localhost:3005/api/chatlist/" + userId + "/" + chatlist_id
    );

    const ChatTitleData = await res.json();

    console.log(ChatTitleData);
    // 設定到狀態中 -> 會觸發重新渲染(re-render)
    if (Array.isArray(ChatTitleData)) setChatTitle(ChatTitleData);

    const TargetObject = ChatTitleData[0];

    if (TargetObject) {
      const TargetUserId = TargetObject.user_id;
      const TargetUserCoverPhoto = TargetObject.cover_photo;
      const TargetUserName = TargetObject.name;
    } else {
      // 如果陣列為空（沒有找到匹配的資料），可以在這裡處理
      console.log("未找到相應的使用者資訊");
    }
  };

  // 利用token解出的userId + 向伺服器要求目前正在登入狀態的userInfo
  const getUserInfo = async (userId) => {
    const res = await fetch(
      "http://localhost:3005/api/chatroom/userinfo/" + userId
    );

    const UserInfoData = await res.json();

    console.log(UserInfoData);
    // 設定到狀態中 -> 會觸發重新渲染(re-render)
    if (Array.isArray(UserInfoData)) setUserInfo(UserInfoData);

    const firstObject = UserInfoData[0];

    if (firstObject) {
      const UserCoverPhoto = firstObject.cover_photo;
    } else {
      // 如果陣列為空（沒有找到匹配的資料），可以在這裡處理
      console.log("未找到相應的使用者資訊");
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
            chatlist_id,
            talk_userId: userId, // 使用前端頁面登入的 userId
            chat_content: msgInputValue,
          }),
        }
      );
      if (response.ok) {
        // 清空輸入框的值
        setMsgInputValue("");
        // 把發送的消息set進狀態裡更新
        const newMessage = {
          chat_content: msgInputValue,
          cover_photo: userInfo.cover_photo,
        };
        setChatContent((prevChatContent) => [...prevChatContent, newMessage]);
      } else {
        console.error("發送消息時出錯");
      }
    } catch (error) {
      console.error("發送消息時出錯", error);
    }
  };

  function CustomHTMLRenderer({ htmlContent }) {
    const containsSpecialText = htmlContent.includes("小幫手簡歷");

    // 根據包含不同文字的情況，設置不同的CSS名
    const className = containsSpecialText
      ? "size-7 m-size-7 px-4 py-2 helper-information" // 含「小幫手簡歷」時的樣式
      : "size-7 m-size-7 rounded-pill content py-1 px-2";

    return (
      <div
        className={className}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      ></div>
    );
  }

  return (
    <>
      <div className="chatroom">
        <div className="container shadow bg-body-tertiary rounded p-0">
          <div className="size-3 sticky-top size-3 m-size-5 p-3">
            <div className="target-user">
              <div className="d-flex align-items-center">
                <div className="avatar rounded-circle mr-3 overflow-hidden rounded-circle">
                  {chatTitle.map((v, i) => (
                    <img
                      key={v.chatlist_id}
                      src={v.cover_photo}
                      className="img-fluid object-fit-cover"
                    />
                  ))}
                </div>
                <div className="mx-3 size-5 m-size-5">
                  {chatTitle.map((v, i) => (
                    <span key={v.chatlist_id}>{v.name}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="chat-content d-flex flex-column flex-grow-1 overflow-auto">
            {chatContent.map((v, i) => {
              return (
                <div className="user p-3" key={i}>
                  {v.talk_userId === decodedToken.id ? ( // 自己的消息
                    <div className="d-flex align-items-center justify-content-end my-1 chat-box">
                      {/* <div className="size-7 m-size-7 rounded-pill content py-1 px-2">
                        {v.chat_content}
                      </div> */}
                      <CustomHTMLRenderer htmlContent={v.chat_content} />
                      <div className="avatar rounded-circle mr-3 overflow-hidden rounded-circle ms-2">
                        <img
                          src={v.cover_photo}
                          className="img-fluid object-fit-cover"
                        />
                      </div>
                    </div>
                  ) : (
                    // 聊天对方的消息
                    <div className="chat-content-target-user">
                      <div className="d-flex align-items-center">
                        <div className="avatar rounded-circle mr-3 overflow-hidden rounded-circle">
                          <img
                            src={v.cover_photo}
                            className="img-fluid object-fit-cover"
                          />
                        </div>
                        <div className="mx-3 size-6 m-size-6">
                          <span>{v.name}</span>
                        </div>
                        {/* <div className="size-7 m-size-7 rounded-pill content py-1 px-2"> */}
                        <CustomHTMLRenderer htmlContent={v.chat_content} />
                        {/* </div> */}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
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
              送出
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
