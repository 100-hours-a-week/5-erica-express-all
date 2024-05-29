const { comments, posts } = require('./data.cjs')
const { checkUserModel } = require('./users.cjs')
const { getLocalDateTime } = require('../tools/dataUtils.cjs')

let commentNum = comments.length

//댓글 관련 service
const getCommentModel = data => {
	const { commentId, postId } = data

	const comment = comments.find(
		comment => comment.commentId === commentId && comment.postId === postId && comment.deleted_at === null
	)
	if (!comment) return null
	return comment
}

const getCommentsModel = postId => {
	return comments.filter(comment => comment.postId === postId && comment.deleted_at === null)
}

const checkCommentOwnerModel = data => {
	const comment = comments.find(comment => comment.commentId === data.commentId)

	/*
	 * true: 해당 댓글의 Owner임
	 * false: 해당 댓글의 Owner가 아님
	 */

	return comment.userId !== data.userId || !comment ? false : true
}

const addCommentModel = data => {
	const user = checkUserModel(data.userId)
	const commentId = commentNum + 1
	const date = getLocalDateTime()

	const newComment = {
		commentId,
		postId: data.postId,
		userId: user.userId,
		nickname: user.nickname,
		profile_image: user.profile_image,
		comment: data.comment,
		created_at: date,
		updated_at: date,
		deleted_at: null
	}

	const postIndex = posts.findIndex(post => post.postId === data.postId)
	posts[postIndex].comment_count += 1

	commentNum += 1
	comments.push(newComment)
	return true
}

const updateCommentModel = data => {
	//TODO: post id 검증 추가

	const { commentId, commentContent } = data

	const commentIndex = comments.findIndex(comment => comment.commentId === commentId && comment.deleted_at === null)
	comments[commentIndex].comment = commentContent
	return comments[commentIndex]
}

const deleteCommentModel = (commentId, postId) => {
	const commentIndex = comments.findIndex(comment => comment.commentId === commentId && comment.deleted_at === null)

	const postIndex = posts.findIndex(post => post.postId === postId)
	posts[postIndex].comment_count -= 1

	const date = getLocalDateTime()
	comments[commentIndex].deleted_at = date

	return true
}

module.exports = {
	getCommentModel,
	getCommentsModel,
	checkCommentOwnerModel,
	addCommentModel,
	updateCommentModel,
	deleteCommentModel
}
