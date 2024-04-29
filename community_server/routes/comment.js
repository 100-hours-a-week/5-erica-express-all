import express from "express";
import { commentController } from "../controller/comment-controller.js";
import { getCommentUser, getAuthUser } from "../middleware/authUser.js";

const router = express.Router();

//해당 게시물 댓글 불러오기
router.get("/:postId/comments", getAuthUser, commentController.getComments);

//댓글 작성
router.post("/:postId/comments", getAuthUser, commentController.addComment);

//댓글 수정
router.patch(
  "/:postId/comments/:commentId",
  getCommentUser,
  commentController.updateComment
);

//댓글 삭제
router.delete(
  "/:postId/comments/:commentId",
  getCommentUser,
  commentController.deleteComment
);

//댓글 작성자 확인
router.post(
  "/:postId/comments/checkOwner",
  commentController.checkCommentOwner
);

export default router;
