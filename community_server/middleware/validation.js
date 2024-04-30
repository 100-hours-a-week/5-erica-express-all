import { checkUserEmailModel, checkUserNicknameModel } from "../model/users.js";

export const validation = (req, res, next) => {
  const { nickname, email } = req.body;

  if (checkUserEmailModel(email)) {
    return res
      .status(400)
      .json({ status: 400, message: "already_exist_email", data: null });
  }

  if (checkUserNicknameModel(nickname)) {
    return res
      .status(400)
      .json({ status: 400, message: "already_exist_nickname", data: null });
  }

  next();
};
