import { users } from "../model/data.js";
import {
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
} from "../model/users.js";

const getUserList = (req, res) => {
  //TODO: 서버로 띄울 시 활셩화 필요
  // users.forEach((user) => {
  //   user.profile_image = user.profile_image.replace(
  //     "http://localhost:8000",
  //     `https://${req.headers.host}`
  //   );
  // });
  res.json(users);
};

const getUser = (req, res) => {
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

  //TODO: 서버로 띄울 시 활셩화 필요
  // user.profile_image = user.profile_image.replace(
  //   "http://localhost:8000",
  //   `https://${req.headers.host}`
  // );

  if (user) {
    res.status(200).json({ status: 200, message: null, data: user });
  }
};

const postUser = (req, res) => {
  const { email, nickname, password, profile_image } = req.body;

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
  }

  res.status(201).json({
    status: 201,
    message: "register_success",
    data: { userId: newUserId, profile_image },
  });
};

const postLongIn = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email) {
    res
      .status(400)
      .json({ status: 400, message: "required_email", data: null });
  }

  const user = logInUser(email, password);

  if (!user) {
    res
      .status(401)
      .json({ status: 401, message: "invalid_email_or_password", data: null });
  }

  res.status(200).json({ status: 200, message: "login_success", data: user });
};

const patchUserInfo = (req, res) => {
  const userId = Number(req.params.userId);
  const { nickname, profile_image } = req.body;

  let user_server_url = "";

  if (!userId) {
    res
      .status(400)
      .json({ status: 400, message: "invalid_user_id", data: null });
  }

  if (!profile_image.includes(req.headers.host)) {
    console.log("post Image");
    const saved_image_url = postImage(protile_image);
    if (!saved_image_url) {
      res
        .status(500)
        .json({ status: 500, message: "internal_server_error", data: null });
    }
    user_server_url = saved_image_url;
    console.log(user_server_url);
  } else {
    user_server_url = profile_image.replace(
      req.headers.host,
      "http://localhost:8080"
    );
    console.log(user_server_url);
  }

  if (!checkUserId(userId)) {
    res
      .status(404)
      .json({ status: 404, message: "not_found_user", data: null });
  }

  if (!checkUserId(userId) && !profile_image) {
    res
      .status(500)
      .json({ status: 500, message: "internal_server_error", data: null });
  }

  const success = updateUserProfile({
    userId,
    nickname,
    profile_image: user_server_url,
  });

  if (!success) {
    res
      .status(500)
      .json({ status: 500, message: "internal_server_error", data: null });
  }

  res
    .status(201)
    .json({ status: 201, message: "update_user_data_success", data: success });
};

const patchUserPassword = (req, res) => {
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
};

const deleteUser = (req, res) => {
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
};

const duplicateEmail = (req, res) => {
  const email = req.params.email;

  const isExist = checkUserEmail(email);

  if (isExist) {
    res
      .status(400)
      .json({ status: 400, message: "already_exist_email", data: null });
  }

  res.status(200).json({ status: 200, message: "available_email", data: null });
};

const duplicateNickname = (req, res) => {
  const nickname = req.params.nickname;
  const userId = Number(req.body.userId) ?? null;

  if (userId) {
    const user = checkUser(userId);
    if (user.nickname === nickname) {
      res
        .status(200)
        .json({ status: 200, message: "same_nickname", data: null });
    }
  }

  const isExist = checkUserNickname(nickname);

  if (isExist) {
    res
      .status(400)
      .json({ status: 400, message: "already_exist_nickname", data: null });
  }

  res
    .status(200)
    .json({ status: 200, message: "available_nickname", data: null });
};

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
