const { getPostModel } = require('../model/posts.cjs')
const { getCommentModel } = require('../model/comments.cjs')

const getAuthUser = (req, res, next) => {
	if (req.session.id && req.session.user) {
		req.user = req.session.user
		next()
	} else {
		return res.status(401).json({ status: 401, message: 'unauthorized', data: null })
	}
}

const modifyAuthUser = (req, res, next) => {
	if (!req.session.user.userId || !req.session.user) {
		return res.status(403).json({ status: 403, message: 'unauthorized', data: null })
	}
	req.userId = req.session.user.userId
	next()
}

//게시물 작성자가 본인이 맞는지 확인
const getPostUser = (req, res, next) => {
	if (!req.params.id) return res.status(400).json({ status: 400, message: 'invalid_post_id', data: null })

	const post = getPostModel(Number(req.params.id))

	if (!post) return res.status(404).json({ status: 404, message: 'not_a_single_post', data: null })

	if (!req.session || !req.session.user || req.session.user.userId !== post.userId) {
		return res.status(403).json({ status: 403, message: 'unauthorized', data: null })
	}
	next()
}

//댓글 작성자가 본인이 맞는지 확인
const getCommentUser = (req, res, next) => {
	const postId = Number(req.params.postId)
	const commentId = Number(req.params.commentId)

	if (!postId) return res.status(400).json({ status: 400, message: 'invalid_post_id', data: null })

	if (!commentId) return res.status(400).json({ status: 400, message: 'invalid_comment_id', data: null })

	const comment = getCommentModel({ commentId, postId })

	if (!comment) return res.status(404).json({ status: 404, message: 'not_a_single_comment', data: null })

	if (!req.session || !req.session.user || req.session.user.userId !== comment.userId) {
		return res.status(403).json({ status: 403, message: 'unauthorized', data: null })
	}

	next()
}

module.exports = {
	getAuthUser,
	modifyAuthUser,
	getPostUser,
	getCommentUser
}
