import { comments } from "./data.js";
import { checkUser } from "./users.js";
import { getLocalDateTime } from "../tools/dataUtils.js";

let commentNum = comments.length;

//댓글 관련 service
const getComment = (data) => {
  const comment = comments.find(
    (comment) =>
      comment.commentId === data.commentId &&
      comment.postId === data.postId &&
      comment.deleted_at === null
  );
  if (!comment) {
    return null;
  }
  return comment;
};

const getComments = (postId) => {
  return comments.filter(
    (comment) => comment.postId === postId && comment.deleted_at === null
  );
};

const checkIsOwner = (data) => {
  const comment = comments.find(
    (comment) => comment.commentId === data.commentId
  );

  /*
   * true: 해당 댓글의 Owner임
   * false: 해당 댓글의 Owner가 아님
   */

  return comment.userId !== data.userId || !comment ? false : true;
};

const registerComments = (data) => {
  const user = checkUser(data.userId);
  const commentId = commentNum + 1;
  const date = getLocalDateTime();

  const newComment = {
    commentId,
    postId: data.postId,
    userId: user.userId,
    nickname: user.nickname,
    profile_image: user.profile_image,
    comment: data.comment,
    created_at: date,
    updated_at: date,
    deleted_at: null,
  };
  commentNum += 1;
  comments.push(newComment);
  return true;
};

const updateComment = (data) => {
  //TODO: post id 검증 추가

  const { commentId, commentContent } = data;

  const commentIndex = comments.findIndex(
    (comment) => comment.id === commentId && comment.deleted_at === null
  );

  comments[commentIndex].comment = commentContent;
  return comments[commentIndex];
};

const eraseComment = (commentId) => {
  const date = getLocalDateTime();
  comments[commentId - 1].deleted_at = date;
  return true;
};

export {
  getComment,
  getComments,
  checkIsOwner,
  registerComments,
  updateComment,
  eraseComment,
};
