// express 모듈을 불러옵니다.
import express from "express";
import path from "path";
// express 애플리케이션을 생성합니다.
const app = express();
// 웹 서버가 사용할 포트 번호를 정의합니다.
const port = 3000;
const __dirname = path.resolve();
app.use(express.static(__dirname));

/**
 * 루트 경로('/')에 대한 GET 요청을 처리
 * 요청이 오면 'Hello World!' 문자열을 응답
 */
// req = request(요청), res = response(응답)
app.get("/", (req, res) => {
  const filePath = path.join(__dirname, "index.html");
  res.sendFile(filePath);
});

app.get("/signUp", (req, res) => {
  const filePath = path.join(__dirname, "signUp/index.html");
  res.sendFile(filePath);
});

app.get("/images", (req, res) => {
  const filePath = path.join(__dirname, "images");
  res.sendFile(filePath);
});

app.get("/user", (req, res) => {
  const filePath = path.join(__dirname, "user/index.html");
  res.sendFile(filePath);
});

app.get("/user/password", (req, res) => {
  const filePath = path.join(__dirname, "user/password/index.html");
  res.sendFile(filePath);
});

app.get("/user/update", (req, res) => {
  const filePath = path.join(__dirname, "user/update/index.html");
  res.sendFile(filePath);
});

app.get("/board", (req, res) => {
  const filePath = path.join(__dirname, "board/index.html");
  res.sendFile(filePath);
});

app.get("/board/[id]", (req, res) => {
  const filePath = path.join(__dirname, "board/[id]/index.html");
  res.sendFile(filePath);
});

app.get("/board/[id]/update", (req, res) => {
  const filePath = path.join(__dirname, "board/[id]/update/index.html");
  res.sendFile(filePath);
});

app.get("/board/[id]/modal", (req, res) => {
  const filePath = path.join(__dirname, "board/[id]/modal/index.html");
  res.sendFile(filePath);
});

app.get("/board/write", (req, res) => {
  const filePath = path.join(__dirname, "board/write/index.html");
  res.sendFile(filePath);
});

app.get("/signup", (req, res) => {
  const filePath = path.join(__dirname, "signUp");
  res.sendFile(filePath);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
