import { getPostModel } from "../model/posts.js";
import {
  getCommentModel,
  getCommentsModel,
  checkCommentOwnerModel,
  addCommentModel,
  updateCommentModel,
  deleteCommentModel,
} from "../model/comments.js";

//실제 controller 역할
export const getComments = (req, res) => {
  const postId = Number(req.params.postId);
  if (!postId) {
    return res
      .status(400)
      .json({ status: 400, message: "invalid_post_id", data: null });
  }

  const comments = getCommentsModel(postId);

  //TODO: 서버로 띄울 시 활셩화 필요
  // comments.forEach((comment) => {
  //   comment.profile_image = comment.profile_image.replace(
  //     "http://localhost:8000",
  //     `https://${req.headers.host}`
  //   );
  // });
  return res.status(200).json({ status: 200, message: null, data: comments });
};

export const addComment = (req, res) => {
  const postId = Number(req.params.postId);
  const comment = req.body.comment;
  const userId = Number(req.body.userId);

  if (!postId) {
    return res
      .status(400)
      .json({ status: 400, message: "invalid_post_id", data: null });
  }

  const post = getPostModel(postId);
  if (!post) {
    return res
      .status(404)
      .json({ status: 404, message: "not_a_single_post", data: null });
  }

  if (!userId) {
    return res
      .status(400)
      .json({ status: 400, message: "invalid_user_id", data: null });
  }

  if (!comment) {
    return res
      .status(400)
      .json({ status: 400, message: "invalid_comment", data: null });
  }

  const isSuccess = addCommentModel({ postId, userId, comment });

  if (!isSuccess) {
    return res
      .status(500)
      .json({ status: 500, message: "internal_sever_error", data: null });
  }

  return res
    .status(201)
    .json({ status: 201, message: "write_comment_success", data: null });
};

export const updateComment = (req, res) => {
  const postId = Number(req.params.postId);
  const commentId = Number(req.params.commentId);
  const commentContent = req.body.comment;
  const comment = getCommentModel({ commentId, postId });

  if (!comment) {
    return res
      .status(404)
      .json({ status: 404, message: "not_a_single_comment", data: null });
  }

  if (!postId) {
    return res
      .status(400)
      .json({ status: 400, message: "invalid_post_id", data: null });
  }

  if (!commentId) {
    return res
      .status(400)
      .json({ status: 400, message: "invalid_comment_id", data: null });
  }

  const isSuccess = updateCommentModel({ commentId, commentContent });

  if (!isSuccess) {
    return res
      .status(500)
      .json({ status: 500, message: "internal_server_error", data: null });
  }

  return res
    .status(200)
    .json({ status: 200, message: "update_comment_success", data: null });
};

export const deleteComment = (req, res) => {
  const postId = Number(req.params.postId);
  const commentId = Number(req.params.commentId);
  const comment = getCommentModel({ postId, commentId });

  if (!comment) {
    return res
      .status(404)
      .json({ status: 404, message: "not_a_single_comment", data: null });
  }

  if (!postId) {
    return res
      .status(400)
      .json({ status: 400, message: "invalid_post_id", data: null });
  }

  if (!commentId) {
    return res
      .status(400)
      .json({ status: 400, message: "invalid_comment_id", data: null });
  }

  const isSuccess = deleteCommentModel(commentId);

  if (!isSuccess) {
    return res
      .status(500)
      .json({ status: 500, message: "internal_server_error", data: null });
  }

  return res
    .status(200)
    .json({ status: 200, message: "delete_comment_success", data: null });
};

export const checkCommentOwner = (req, res) => {
  const id = Number(req.body.commentId);
  const userId = Number(req.body.userId);
  const check = checkCommentOwnerModel({ userId, commentId: id });
  if (!check) {
    return res
      .status(403)
      .json({ status: 403, message: "not_allowed", data: null });
  }

  return res.status(200).json({ status: 200, message: "is_owner", data: null });
};
