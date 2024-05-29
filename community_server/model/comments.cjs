const { getLocalDateTime } = require('../tools/dataUtils.cjs')

const db = require('../config/mysql.cjs')
const conn = db.init()

//댓글 관련 service
const getCommentModel = commentId => {
	const sql = `SELECT * 
    FROM comments 
    WHERE 
      commentId = ${commentId} and
      deleted_at IS NULL 
  `

	return new Promise((resolve, reject) => {
		conn.query(sql, function (err, result) {
			if (err) {
				console.log('query is not executed: ' + err)
				reject(err)
			} else {
				resolve(result)
			}
		})
	})
}

const getCommentsModel = postId => {
	const sql = `SELECT 
    comments.*, 
    users.nickname, 
    users.profileImage 
    FROM 
      comments 
    INNER JOIN 
      users 
    ON 
      comments.userId = users.userId 
    INNER JOIN 
      posts 
    ON 
      comments.postId = posts.postId 
    WHERE 
      posts.postId = ${postId} and
      comments.deleted_at IS NULL 
    ORDER BY 
      comments.created_at DESC;
  `

	return new Promise((resolve, reject) => {
		conn.query(sql, function (err, result) {
			if (err) {
				console.log('query is not executed: ' + err)
				reject(err)
			} else {
				resolve(result)
			}
		})
	})
}

const checkCommentOwnerModel = async data => {
	const comment = await getCommentModel(data.commentId)
	return comment[0].userId !== data.userId ? false : true

	/*
	 * true: 해당 댓글의 Owner임
	 * false: 해당 댓글의 Owner가 아님
	 */

	return comment.userId !== data.userId || !comment ? false : true
}

const addCommentModel = data => {
	const date = getLocalDateTime()

	const sql = `INSERT INTO comments (
    comment,
    postId,
    userId,
    created_at
) VALUES (
    '${data.comment}',
    ${data.postId},
    ${data.userId},
    '${date}'
);`

	return new Promise((resolve, reject) => {
		conn.query(sql, function (err, result) {
			if (err) {
				console.log('query is not executed: ' + err)
				reject(err)
			} else {
				resolve(true)
			}
		})
	})
}

const updateCommentModel = data => {
	//TODO: post id 검증 추가

	const { commentId, commentContent } = data

	const sql = `Update comments SET comment = '${commentContent}' WHERE commentId = ${commentId} and deleted_at IS NULL;`

	return new Promise((resolve, reject) => {
		conn.query(sql, function (err, result) {
			if (err) {
				console.log('query is not executed: ' + err)
				reject(err)
			} else {
				resolve(true)
			}
		})
	})
}

const deleteCommentModel = commentId => {
	const sql = `Delete from comments where commentId = ${commentId}`
	return new Promise((resolve, reject) => {
		conn.query(sql, function (err, result) {
			if (err) {
				console.log('query is not executed: ' + err)
				reject(err)
				return false
			} else {
				resolve(true)
			}
		})
	})
}

module.exports = {
	getCommentModel,
	getCommentsModel,
	checkCommentOwnerModel,
	addCommentModel,
	updateCommentModel,
	deleteCommentModel
}
