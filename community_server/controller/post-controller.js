import {
  getPost,
  checkIsOwner,
  getPosts,
  checkIsPost,
  postImage,
  registerPost,
  updatePost,
  erasePost,
} from "../model/posts.js";

//--------------------------------------------------------
//실제 controller
const getPostList = (req, res) => {
  const posts = getPosts();

  //TODO: 서버로 띄울 시 활셩화 필요
  // posts.forEach((post) => {
  //   post.postImage = post.postImage.replace(
  //     "http://localhost:8000",
  //     `https://${req.headers.host}`
  //   );
  //   post.userImage = post.userImage.replace(
  //     "http://localhost:8000",
  //     `https://${req.headers.host}`
  //   );
  // });

  res.status(200).json({ status: 200, message: null, data: posts });
};

const getOnePost = (req, res) => {
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

  //TODO: 서버로 띄울 시 활셩화 필요
  // post.postImage = post.postImage.replace(
  //   "http://localhost:8000",
  //   `https://${req.headers.host}`
  // );

  res.status(200).json({ status: 200, message: null, data: post });
};

const getPostImage = (req, res) => {
  const postId = Number(req.params.postId);

  if (!postId) {
    res
      .status(404)
      .json({ status: 404, message: "invalid_post_id", data: null });
  }

  const post_image = getPostData(postId);

  res
    .status(200)
    .json({ status: 200, message: "load_image_success", data: { post_image } });
};

const postPost = (req, res) => {
  const userId = Number(req.body.userId);
  const title = req.body.title;
  const content = req.body.content;
  const postImageSrc = req.body.postImage;
  let post_server_url = "";

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
};

const patchPost = (req, res) => {
  const id = Number(req.params.id);
  const title = req.body.title;
  const content = req.body.content;
  const postImageInput = req.body.postImage;
  let post_server_url = "";

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
};

const deletePost = (req, res) => {
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
};

const isOwner = (req, res) => {
  const id = Number(req.body.postId);
  const userId = Number(req.body.userId);
  const check = checkIsOwner({ userId, postId: id });
  if (!check) {
    console.log("403 error");
    res.status(403).json({ status: 403, message: "not_allowed", data: null });
  }

  res.status(200).json({ status: 200, message: "is_owner", data: null });
};

export const postController = {
  getPostList,
  getOnePost,
  postPost,
  patchPost,
  deletePost,
  isOwner,
  getPostImage,
};
