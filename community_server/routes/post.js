import express from "express";
import { postController } from "../controller/post-controller.js";

const router = express.Router();

//게시물 목록 불러오기 --OK
router.get("/", postController.getPosts);

//게시물 상세 불러오기 --OK
router.get("/:id", postController.getPost);

//게시물 작성 --OK
router.post("/", postController.addPost);

//게시물 수정 --OK
router.patch("/:id", postController.updatePost);

//게시물 삭제
router.delete("/:id", postController.deletePost);

//게시물 작성자 비교
router.post("/checkOwner", postController.checkPostOwner);

export default router;
