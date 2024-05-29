const {
	getPostModel,
	checkPostOwnerModel,
	getPostsModel,
	addPostImageModel,
	addPostModel,
	updatePostModel,
	deletePostModel,
	getMyPostsModel,
	getOtherPostsModel,
	getCodingPostsModel
} = require('../model/posts.cjs')

//--------------------------------------------------------
//실제 controller
const getPosts = (req, res) => {
	// console.log(req.query.cursor);
	// const cursor = Number(req.query.cursor);
	const posts = getPostsModel().reverse()

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

	return res.status(200).json({ status: 200, message: null, data: posts })
}

const getPost = (req, res) => {
	const id = Number(req.params.id)
	if (!id) return res.status(400).json({ status: 400, message: 'invalid_post_id', data: null })

	const post = getPostModel(id)

	if (!post) return res.status(404).json({ status: 404, message: 'cannot_found_post', data: null })

	//TODO: 서버로 띄울 시 활셩화 필요
	// post.postImage = post.postImage.replace(
	//   "http://localhost:8000",
	//   `https://${req.headers.host}`
	// );

	return res.status(200).json({ status: 200, message: null, data: post })
}

const getUpdatePost = (req, res) => {
	const id = Number(req.params.id)
	if (!id) return res.status(400).json({ status: 400, message: 'invalid_post_id', data: null })

	const post = getPostModel(id)

	if (!post) return res.status(404).json({ status: 404, message: 'cannot_found_post', data: null })

	//TODO: 서버로 띄울 시 활셩화 필요
	// post.postImage = post.postImage.replace(
	//   "http://localhost:8000",
	//   `https://${req.headers.host}`
	// );

	return res.status(200).json({ status: 200, message: null, data: post })
}

const getPostImage = (req, res) => {
	const postId = Number(req.params.postId)

	if (!postId) return res.status(404).json({ status: 404, message: 'invalid_post_id', data: null })

	const post_image = getPostData(postId)

	return res.status(200).json({ status: 200, message: 'load_image_success', data: { post_image } })
}

const addPost = (req, res) => {
	const userId = Number(req.session.user.userId)
	const { title, content, postImageSrc, type } = req.body
	let post_server_url = ''

	if (!userId) return res.status(400).json({ status: 400, message: 'invalid_user_id', data: null })
	if (!title) return res.status(400).json({ status: 400, message: 'invalid_post_title', data: null })
	if (!content) return res.status(400).json({ status: 400, message: 'invalid_post_content', data: null })

	if (postImageSrc) {
		post_server_url = addPostImageModel(postImageSrc)
	}

	const postId = addPostModel({
		userId,
		type,
		title,
		content,
		postImage: post_server_url
	})

	if (!postId) res.status(500).json({ status: 500, message: 'internal_server_error', data: null })

	return res.status(201).json({
		status: 201,
		message: 'write_post_success',
		data: { postId }
	})
}

const updatePost = (req, res) => {
	const id = Number(req.params.id)
	const { title, content, postImageInput, type } = req.body
	let post_server_url = ''

	if (!title && !content && !postImageInput) {
		return res.status(400).json({
			status: 400,
			message: 'invalid_post_content_length',
			data: null
		})
	}

	if (!id) return res.status(400).json({ status: 400, message: 'invalid_post_id', data: null })

	if (postImageInput) {
		post_server_url = addPostImageModel(postImageInput)
	}

	if (post_server_url === -1) return res.status(500).json({ status: 500, message: 'internal_sever_error', data: null })

	const postId = updatePostModel({
		id,
		type,
		title,
		content,
		postImage: post_server_url
	})

	if (!postId) return res.status(500).json({ status: 500, message: 'internal_sever_error', data: null })

	return res.status(200).json({ status: 200, message: 'update_post_success', data: { postId } })
}

const deletePost = (req, res) => {
	const id = Number(req.params.id)
	const isSuccess = deletePostModel(id)
	if (!isSuccess) return res.status(500).json({ status: 500, message: 'internal_sever_error', data: null })

	return res.status(200).json({ status: 200, message: 'delete_post_success', data: null })
}

const checkPostOwner = (req, res) => {
	if (!req.session) return res.status(403).json({ status: 403, message: 'unauthorized', data: null })

	const userId = Number(req.session.user.userId)

	const id = Number(req.body.postId)

	const check = checkPostOwnerModel({ userId, postId: id })

	if (!check) return res.status(403).json({ status: 403, message: 'not_allowed', data: null })

	return res.status(200).json({ status: 200, message: 'is_owner', data: null })
}

const getMyPosts = (req, res) => {
	const myPosts = getMyPostsModel(Number(req.session.user.userId))
	return res.status(200).json({ status: 200, message: '', data: myPosts })
}

const getOtherPosts = (req, res) => {
	const otherPosts = getOtherPostsModel()
	return res.status(200).json({ status: 200, message: '', data: otherPosts })
}

const getCodingPosts = (req, res) => {
	const codingPosts = getCodingPostsModel()
	return res.status(200).json({ status: 200, message: '', data: codingPosts })
}

module.exports = {
	getPosts,
	getPost,
	getPostImage,
	getUpdatePost,
	addPost,
	updatePost,
	deletePost,
	checkPostOwner,
	getMyPosts,
	getOtherPosts,
	getCodingPosts
}
