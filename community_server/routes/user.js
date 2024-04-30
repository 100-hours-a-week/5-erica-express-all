import express from "express";
import { userController } from "../controller/user-controller.js";
import { getAuthUser, modifyAuthUser } from "../middleware/authUser.js";
import { validation } from "../middleware/validation.js";

const router = express.Router();

//전체 유저 목록
router.get("/", getAuthUser, userController.getUsers);

//userId 회원 조회
router.get("/user", getAuthUser, userController.getUser);

//회원가입
router.post("/signup", validation, userController.addUser);

//로그인
router.post("/login", userController.logInUser);

//회원정보 변경
router.patch("/user/profile", modifyAuthUser, userController.updateUserProfile);

//비밀번호 변경
router.patch(
  "/user/password",
  modifyAuthUser,
  userController.updateUserpassword
);

//유저 삭제
router.delete("/user", getAuthUser, userController.deleteUser);

//T이메일 중복 체크
router.post("/email/:email", userController.duplicateEmail);

//닉네임 중복 체크
router.post(
  "/nickname/:nickname",
  getAuthUser,
  userController.duplicateNickname
);

//회원가입시 중복 체크
router.post(
  "/signup/nickname/:nickname",
  userController.duplicateSignUpNickname
);

//로그아웃
router.delete("/logOut", getAuthUser, userController.logOut);

//이미지 업로드
// router.post("/upload", userController.postImage);

//TODO: 로그인 상태 확인

export default router;
