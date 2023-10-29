const mysql = require("mysql2");
const connection = require("./db");
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

const memberRouter = require("./routes/member-route");
const workRouter = require("./routes/work-route");
const productRouter = require("./routes/product-route");
const missionRouter = require("./routes/mission-route");
const memberOrderRouter = require("./routes/member-order-route");
const memberOrderDetailRouter = require("./routes/member-order-detail-route");
const memberWishlistRouter = require("./routes/member-wishlist-route");
const memberPurchastRouter = require("./routes/member-purchast-route");
const memberHistoryRouter = require("./routes/member-history-route");
const memberJoblistRouter = require("./routes/member-joblist-route");
const cartRouter = require("./routes/cart-route");
const articleRouter = require("./routes/article-route");
const articleCategoryRouter = require("./routes/article-category");
const articleHomeRouter = require("./routes/article-home-route");
const chatListRouter = require("./routes/chatlist-route");
const chatRoomRouter = require("./routes/chatroom-route");
const breadCrumbRouter = require("./routes/breadCrumb");
const payRouter = require("./routes/pay-route");

app.use(bodyParser.json()); // 解析 JSON 请求体
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public")); //建立靜態資源資料夾
app.use("/api/member", memberRouter);
app.use("/api/work", workRouter);
app.use("/api/product", productRouter);
app.use("/api/mission", missionRouter);
app.use("/api/member-order", memberOrderRouter);
app.use("/api/member-order-detail", memberOrderDetailRouter);
app.use("/api/member-wishlist", memberWishlistRouter);
app.use("/api/member-purchast", memberPurchastRouter);
app.use("/api/member-history", memberHistoryRouter);
app.use("/api/member-joblist", memberJoblistRouter);
app.use("/api/product/cart", cartRouter);
app.use("/api/article", articleRouter);
app.use("/api/article-home", articleHomeRouter);
app.use("/api/article-category", articleCategoryRouter);
app.use("/api/chatlist", chatListRouter);
app.use("/api/chatroom", chatRoomRouter);
app.use("/api/breadcrumb", breadCrumbRouter);
app.use("/api/pay", payRouter);

//------------------------------------------佳瑜
// //jwt路由使用
const authJWTRouter = require("./routes/auth-jwt");
const userRouter = require("./routes/user-route");
const JWTOtherRouter = require("./routes/auth-jwt-other");
const email = require("./routes/email");
const resetPassword = require("./routes/reset-password");

// // // 掛載 auth-jwt 路由
app.use("/api/auth-jwt", authJWTRouter);
app.use("/api/auth-jwt-other", JWTOtherRouter);
app.use("/api/user", userRouter);
app.use("/api/email", email);
app.use("/api/reset-password", resetPassword);

//跨網域資源共用、設置白名單
app.use(
  cors({
    origin: [
      "http://127.0.0.1:3005",
      "http://localhost:3005",
      "http://127.0.0.1:3000",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("首頁測試");
});

app.get("/login", (req, res) => {
  res.send("登入頁面測試");
});

app.listen(3005, () => {
  console.log("server is running");
});

// // 聊天室websocket
// const WebSocket = require("ws");
// const wss = new WebSocket.Server({ port: 8080 });

// const clients = {};

// wss.on("connection", (connection) => {
//   console.log("新的使用者已連線");

//   connection.on("message", (message) => {
//     const msg = message.toString("utf-8");
//     console.log(`收到消息=>${msg}`);
//     const parseMessage = JSON.parse(message);

//     if (parseMessage.type === "register") {
//       const userId = parseMessage.userId;
//       clients[userId] = connection;
//       connection.userId = userId;
//       const otherClients = Object.keys(clients);
//       wss.clients.forEach((client) => {
//         if (client.readyState === WebSocket.OPEN) {
//           client.send(
//             JSON.stringify({
//               type: "registered",
//               otherClients,
//             })
//           );
//         }
//       });
//       return false;
//     }

//     if (parseMessage.type === "message") {
//       const targetUserId = parseMessage.targetUserId;
//       const fromID = parseMessage.fromID;
//       const chatmsg = parseMessage.message;
//       console.log(parseMessage);
//       if (targetUserId) {
//         console.log("沒有送到訊息但有跑進來");
//         let targetClient = clients[targetUserId];
//         if (targetClient.readyState === WebSocket.OPEN) {
//           console.log("有送到訊息");
//           targetClient.send(
//             JSON.stringify({
//               type: "message",
//               message: chatmsg,
//               fromID,
//               private: true,
//             })
//           );
//         }
//       }
//       return false;
//     }
//   });

//   connection.on("close", () => {
//     console.log("使用者已斷線");
//     if (connection.userId) {
//       delete clients[connection.userId];
//     }
//     const otherClients = Object.keys(clients);
//     wss.clients.forEach((client) => {
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(
//           JSON.stringify({
//             type: "disconnected",
//             otherClients,
//             disconnectedID: connection.userId,
//           })
//         );
//       }
//     });
//   });
// });
