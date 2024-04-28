import express from "express";
import http from "http";
import userRouter from "./routes/user.js";
import postRouter from "./routes/post.js";
import commentRouter from "./routes/comment.js";
import profileImageRouter from "./routes/profileImage.js";
import postImageRouter from "./routes/postImage.js";

import cors from "cors";

const app = express();
const server = http.createServer(app);
const port = 8000;
const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.text());

// /api 경로용 라우터
const apiRouter = express.Router();
apiRouter.use("/users", userRouter);
apiRouter.use("/posts", postRouter);
apiRouter.use("/posts", commentRouter);

// /imgaes 경로용 라우터
const imagesRouter = express.Router();
imagesRouter.use("/profile", profileImageRouter);
imagesRouter.use("/post", postImageRouter);

// 공통 라우터
app.use("/api", apiRouter);
app.use("/images", imagesRouter);

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
