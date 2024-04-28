import { users } from "../model/data.js";
import fs from "fs";
import path from "path";
import { getLocalDateTime } from "../tools/dataUtils.js";

const __dirname = path.resolve();

//유저 관련 서비스
let userNum = users.length;

//userId 유효성 조회 로직
const checkUserId = (userId) => {
  const user = users.find(
    (user) => user.userId === userId && user.deleted_at === null
  );

  /*
   * true: 해당 id를 가진 user 존재
   * fale: 해당 id를가진 user 존재 X
   */

  return !user ? false : true;
};

const checkUser = (userId) => {
  const user = users.find(
    (user) => user.userId === userId && user.deleted_at === null
  );
  return user;
};

const checkUserNickname = (nickname) => {
  const user = users.find(
    (user) => user.nickname === nickname && user.deleted_at === null
  );

  /*
   * true: 해당 nickname을 가진 user 존재
   * false: 해당 nickname을 가진 user 존재 X
   */

  return user ? true : false;
};

const checkUserEmail = (email) => {
  const user = users.find(
    (user) => user.email === email && user.deleted_at === null
  );

  /*
   * true: 해당 email을 가진 user 존재
   * false: 해당 email을 가진 user 존재 X
   */
  return user ? true : false;
};

//유저 등록 로직
const registerUser = (data) => {
  //data 형식: { email, nickname, password, profile_image }
  const userId = userNum + 1;
  const date = getLocalDateTime();
  const newUser = {
    userId,
    email: data.email,
    nickname: data.nickname,
    password: data.password,
    profile_image: data.profile_image,
    created_at: date,
    updated_at: date,
    deleted_at: null,
  };

  users.push(newUser);
  userNum += 1;
  return userId;
};

//유저 로그인 로직 -> 유저 아이디 반환
const logInUser = (email, password) => {
  const user = users.find(
    (user) => user.email === email && user.deleted_at === null
  );
  if (!user) {
    return null;
  }
  if (user.password !== password) {
    return null;
  }
  return user;
};

//유저 정보 수정 로직
const updateUserProfile = (data) => {
  const { userId, nickname, profile_image } = data;

  const userIndex = users.findIndex(
    (user) => user.userId === userId && user.deleted_at === null
  );

  if (!nickname && !profile_image) {
    return null;
  }

  if (nickname) {
    users[userIndex].nickname = nickname;
  }

  if (profile_image) {
    users[userIndex].profile_image = profile_image;
  }

  return users[userIndex];
};

//유저 비밀번호 수정 로직
const updateUserPassword = (data) => {
  const { userId, password } = data;

  const userIndex = users.findIndex(
    (user) => user.userId === userId && user.deleted_at === null
  );

  if (!userId || !password) {
    return false;
  }

  users[userIndex].password = data.password;

  return users[userIndex];
};

//유저 회원탈퇴 로직
const eraseUser = (id) => {
  if (!id) {
    return false;
  }
  const user = checkUserId(id);
  if (!user) {
    return false;
  }

  const date = getLocalDateTime();
  users[id - 1].deleted_at = date;
  return true;
};

//이미지 저장
const postImage = (image) => {
  const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    return null;
  }

  // 이미지 데이터를 Buffer로 디코딩
  const imageBuffer = Buffer.from(matches[2], "base64");

  // 이미지를 서버에 저장
  const imageName = `profile_image_${Date.now()}.png`; // 파일명 생성
  const imagePath = path.join(__dirname, "/images/profile", imageName);
  fs.writeFile(imagePath, imageBuffer, (err) => {
    if (err) {
      console.error("Error saving image:", err);
    } else {
      console.log("Image saved successfully");
    }
  });

  const imageUrl = `http://localhost:8000/images/profile/${imageName}`;
  return imageUrl;
};

export {
  checkUser,
  checkUserId,
  checkUserEmail,
  checkUserNickname,
  registerUser,
  logInUser,
  updateUserProfile,
  updateUserPassword,
  eraseUser,
  postImage,
};
