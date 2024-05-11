import express from "express";
import { postController } from "../controller/post-controller.js";
import { getAuthUser, getPostUser } from "../middleware/authUser.js";

const router = express.Router();

//게시물 목록 불러오기 --OK
router.get("/", getAuthUser, postController.getPosts);

//게시물 상세 불러오기 --OK
router.get("/:id", getAuthUser, postController.getPost);

//게시물 작성 --OK
router.post("/", getAuthUser, postController.addPost);

//게시물 수정 --OK
router.patch("/:id", getPostUser, postController.updatePost);

//게시물 삭제
router.delete("/:id", getPostUser, postController.deletePost);

//게시물 작성자 비교
router.post("/checkOwner", postController.checkPostOwner);

//게시물 수정시 내용 불러오기
router.get("/:id/update", getPostUser, postController.getUpdatePost);

export default router;
