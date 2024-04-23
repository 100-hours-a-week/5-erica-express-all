import { posts } from "../model/data.js";
import { checkUser } from "./user-controller.js";
import fs from "fs";
import path from "path";

const __dirname = path.resolve();

let postNum = posts.length;

//post관련 서비스
//게시물 상세 조회 로직
export function getPost(id) {
  return posts.find((post) => post.postId === id && post.deleted_at === null);
}

function getPosts() {
  return posts.filter((post) => post.deleted_at === null);
}

function checkIsPost(id) {
  const post = posts.find(
    (post) => post.postId === id && post.deleted_at === null
  );
  if (!post) {
    return false;
  }
  return true;
}

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

//게시물 이미지 저장
//이미지 저장
function postImage(image) {
  const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    console.log("Wrong Image Type");
    return null;
  }

  // 이미지 데이터를 Buffer로 디코딩
  const imageBuffer = Buffer.from(matches[2], "base64");

  // 이미지를 서버에 저장
  const imageName = `post_image_${Date.now()}.png`; // 파일명 생성
  const imagePath = path.join(__dirname, "/images/post", imageName);
  fs.writeFile(imagePath, imageBuffer, (err) => {
    if (err) {
      console.error("Error saving image:", err);
      return -1;
    } else {
      console.log("Image saved successfully");
    }
  });

  const imageUrl = `http://localhost:8000/images/post/${imageName}`;
  return imageUrl;
}

//게시물 작성 로직
function registerPost(data) {
  const user = checkUser(data.userId);
  const date = getLocalDateTime();
  const postId = postNum + 1;

  const newPost = {
    postId,
    userId: data.userId,
    nickname: user.nickname,
    title: data.title,
    content: data.content,
    postImage: data.postImage,
    userImage: user.profile_image,
    created_at: date,
    updated_at: date,
    deleted_at: null,
    view: 0,
    like: 0,
    comment_count: 0,
  };
  postNum += 1;
  posts.push(newPost);

  return postId;
}

//게시물 수정 로직
function updatePost(data) {
  const postId = data.id;
  const title = data.title;
  const content = data.content;
  const postImage = data.postImage;

  if (title) {
    posts[postId - 1].title = title;
  }

  if (content) {
    posts[postId - 1].content = content;
  }

  if (postImage) {
    posts[postId - 1].postImage = postImage;
  }

  return postId;
}

//게시물 삭제 로직
function erasePost(id) {
  const date = getLocalDateTime();
  posts[id - 1].deleted_at = date;
  return true;
}

//--------------------------------------------------------
//실제 controller
function getPostList(req, res) {
  const posts = getPosts();
  if (posts.length === 0) {
    res
      .status(404)
      .json({ status: 404, message: "not_a_single_post", data: null });
  }

  res.status(200).json({ status: 200, message: null, data: posts });
}

function getOnePost(req, res) {
  const id = Number(req.params.id);
  if (!id) {
    res
      .status(400)
      .json({ status: 400, message: "invalid_post_id", data: null });
  }

  const post = getPost(id);
  if (!post) {
    res
      .status(404)
      .json({ status: 404, message: "cannot_found_post", data: null });
  }

  res.status(200).json({ status: 200, message: null, data: post });
}

function postPost(req, res) {
  const userId = Number(req.body.userId);
  const title = req.body.title;
  const content = req.body.content;
  const postImageSrc = req.body.postImage;

  if (!userId) {
    res
      .status(400)
      .json({ status: 400, message: "invalid_user_id", data: null });
  }
  if (!title) {
    res
      .status(400)
      .json({ status: 400, message: "invalid_post_title", data: null });
  }
  if (!content) {
    res
      .status(400)
      .json({ status: 400, message: "invalid_post_content", data: null });
  }

  let post_server_url = "";
  if (postImageSrc) {
    post_server_url = postImage(postImageSrc);
  }

  const postId = registerPost({
    userId,
    title,
    content,
    postImage: post_server_url,
  });

  if (!postId) {
    res
      .status(500)
      .json({ status: 500, message: "internal_server_error", data: null });
  }

  res.status(201).json({
    status: 201,
    message: "write_post_success",
    data: { postId },
  });
}

function patchPost(req, res) {
  const id = Number(req.params.id);
  // const userId = req.body.userId;
  const title = req.body.title;
  const content = req.body.content;
  const postImageInput = req.body.postImage;

  //TODO: user 검증
  // if (!userId) {
  //   res
  //     .status(400)
  //     .json({ status: 400, message: "invalid_user_id", data: null });
  // }

  const post = checkIsPost(id);

  if (!post) {
    res
      .status(404)
      .json({ status: 404, message: "not_a_single_post", data: null });
  }

  if (!title && !content && !postImage) {
    res.status(400).json({
      status: 400,
      message: "invalid_post_content_length",
      data: null,
    });
  }

  if (!id) {
    res
      .status(400)
      .json({ status: 400, message: "invalid_post_id", data: null });
  }

  let post_server_url = "";
  if (postImageInput) {
    post_server_url = postImage(postImageInput);
  }

  if (post_server_url === -1) {
    res
      .status(500)
      .json({ status: 500, message: "internal_sever_error", data: null });
  }

  const postId = updatePost({ id, title, content, postImage: post_server_url });

  if (!postId) {
    res
      .status(500)
      .json({ status: 500, message: "internal_sever_error", data: null });
  }

  res
    .status(200)
    .json({ status: 200, message: "update_post_success", data: { postId } });
}

function deletePost(req, res) {
  const id = Number(req.params.id);
  if (!id) {
    res
      .status(400)
      .json({ status: 400, message: "invalid_post_id", data: null });
  }

  const post = getPost(id);
  if (!post) {
    res
      .status(404)
      .json({ status: 404, message: "not_a_single_post", data: null });
  }

  const isSuccess = erasePost(id);
  if (!isSuccess) {
    res
      .status(500)
      .json({ status: 500, message: "internal_sever_error", data: null });
  }

  res
    .status(200)
    .json({ status: 200, message: "delete_post_success", data: null });
}

export const postController = {
  getPostList,
  getOnePost,
  postPost,
  patchPost,
  deletePost,
};
