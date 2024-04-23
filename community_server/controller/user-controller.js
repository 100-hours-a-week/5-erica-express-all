import { users } from "../model/data.js";
import fs from "fs";
import path from "path";

const __dirname = path.resolve();

//유저 관련 서비스
let userNum = users.length;

function getLocalDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  const second = String(now.getSeconds()).padStart(2, "0");

  const localDateTime = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  return localDateTime;
}

//userId 유효성 조회 로직
function checkUserId(userId) {
  const user = users.find(
    (user) => user.userId === userId && user.deleted_at === null
  );
  if (!user) {
    return false;
  }
  return true;
}

export function checkUser(userId) {
  const user = users.find(
    (user) => user.userId === userId && user.deleted_at === null
  );
  return user;
}

export function checkUserNickname(nickname) {
  const user = users.find(
    (user) => user.nickname === nickname && user.deleted_at === null
  );
  if (user) {
    return true;
  }
  return false;
}

export function checkUserEmail(email) {
  const user = users.find(
    (user) => user.email === email && user.deleted_at === null
  );
  if (user) {
    return true;
  }
  return false;
}

//유저 등록 로직
function registerUser(data) {
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
}

//유저 로그인 로직 -> 유저 아이디 반환
function logInUser(email, password) {
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
}

//유저 정보 수정 로직
function updateUserProfile(data) {
  if (!data.nickname && !data.profile_image) {
    return false;
  }
  if (data.nickname) {
    users[data.userId - 1].nickname = data.nickname;
  }
  if (data.profile_image) {
    users[data.userId - 1].profile_image = data.profile_image;
  }
  return data.userId;
}

//유저 비밀번호 수정 로직
function updateUserPassword(data) {
  if (!data.userId || !data.password) {
    return false;
  }
  users[data.userId - 1].password = data.password;
  return true;
}

//유저 회원탈퇴 로직
function eraseUser(id) {
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
}

//이미지 저장
function postImage(image) {
  const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    return res.status(400).json({ error: "Invalid image data" });
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
}

//--------------------------------------------------------
//실제 user controller
function getUserList(req, res) {
  res.json(users);
}

function getUser(req, res) {
  const userId = Number(req.params.userId);
  if (!userId) {
    res
      .status(400)
      .json({ status: 404, message: "invalid_user_id", data: null });
  }
  const user = checkUser(userId);
  if (!user) {
    res
      .status(404)
      .json({ status: 404, message: "not_fount_user", data: null });
  }

  if (user) {
    res.status(200).json({ status: 200, message: null, data: user });
  }
}

function postUser(req, res) {
  const email = req.body.email;
  const nickname = req.body.nickname;
  const password = req.body.password;
  const profile_image = req.body.profile_image;
  let profile_server_url = "";

  if (!email || !nickname || !password || !profile_image) {
    res.status(400).json({ status: 404, message: "invalid_input", data: null });
  }

  if (profile_image) {
    profile_server_url = postImage(profile_image);
  }

  const newUserId = registerUser({
    email,
    nickname,
    password,
    profile_image: profile_server_url,
  });

  if (!newUserId) {
    res
      .status(500)
      .json({ status: 500, message: "internal_server_error", data: null });
    return;
  }

  res.status(201).json({
    status: 201,
    message: "register_success",
    data: { userId: newUserId, profile_image },
  });
}

function postLongIn(req, res) {
  if (!req.body.email) {
    res
      .status(400)
      .json({ status: 400, message: "required_email", data: null });
  }
  const email = req.body.email;
  const password = req.body.password;
  const user = logInUser(email, password);

  if (!user) {
    res
      .status(401)
      .json({ status: 401, message: "invalid_email_or_password", data: null });
  }
  res.status(200).json({ status: 200, message: "login_success", data: user });
}

function patchUserInfo(req, res) {
  const userId = Number(req.params.userId);
  const nickname = req.body.nickname;
  const profile_image = req.body.profile_image;

  if (!userId) {
    res
      .status(400)
      .json({ status: 400, message: "invalid_user_id", data: null });
  }
  if (!checkUserId(userId)) {
    res
      .status(404)
      .json({ status: 404, message: "not_found_user", data: null });
  }

  if (!nickname && !profile_image) {
    res
      .status(500)
      .json({ status: 500, message: "internal_server_error", data: null });
  }

  const success = updateUserProfile({ userId, nickname, profile_image });

  res
    .status(201)
    .json({ status: 201, message: "update_user_data_success", data: success });
}

function patchUserPassword(req, res) {
  const userId = Number(req.params.userId);
  const password = req.body.password;

  if (!userId) {
    res
      .status(400)
      .json({ status: 400, message: "invalid_user_id", data: null });
  }

  if (!password) {
    res
      .status(400)
      .json({ status: 400, message: "invalid_password", data: null });
  }

  if (!checkUserId(userId)) {
    res
      .status(404)
      .json({ status: 404, message: "not_found_user", data: null });
  }

  const success = updateUserPassword({ userId, password });
  if (!success) {
    res
      .status(500)
      .json({ status: 500, message: "internal_server_error", data: null });
  }
  res.status(201).json({
    status: 201,
    message: "change_user_password_success",
    data: null,
  });
}

function deleteUser(req, res) {
  const userId = Number(req.params.id);

  if (!userId) {
    res
      .status(400)
      .json({ status: 400, message: "invalid_user_id", data: null });
  }

  if (!checkUserId(userId)) {
    res
      .status(404)
      .json({ status: 404, message: "not_found_user", data: null });
  }

  const isSuccess = eraseUser(userId);

  if (isSuccess) {
    res
      .status(200)
      .json({ status: 200, message: "delete_user-data_success", data: null });
  }
}

function duplicateEmail(req, res) {
  const email = req.params.email;

  const isExist = checkUserEmail(email);

  if (isExist) {
    res
      .status(400)
      .json({ status: 400, message: "already_exist_email", data: null });
  }

  res.status(200).json({ status: 200, message: "available_email", data: null });
}

function duplicateNickname(req, res) {
  const nickname = req.params.nickname;

  const isExist = checkUserNickname(nickname);

  if (isExist) {
    res
      .status(400)
      .json({ status: 400, message: "already_exist_nickname", data: null });
  }

  res
    .status(200)
    .json({ status: 200, message: "available_nickname", data: null });
}

export const userController = {
  getUserList,
  getUser,
  postUser,
  postLongIn,
  patchUserInfo,
  patchUserPassword,
  deleteUser,
  duplicateEmail,
  duplicateNickname,
  postImage,
};
