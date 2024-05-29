const {
	getCommentQuery,
	getCommentsQuery,
	addCommentQuery,
	updateCommentQuery,
	deleteCommentQuery
} = require('../queries/comments.cjs')

const mysql = require('mysql2')

const { db_info } = require('../config/mysql.cjs')
const conn = mysql.createConnection(db_info)

const getCommentModel = commentId => {
	return new Promise((resolve, reject) => {
		conn.query(getCommentQuery(commentId), function (err, result) {
			if (err) {
				console.log(err)
				reject(err)
			} else {
				resolve(result)
			}
		})
	})
}

const getCommentsModel = postId => {
	return new Promise((resolve, reject) => {
		conn.query(getCommentsQuery(postId), function (err, result) {
			if (err) {
				console.log(err)
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
}

const addCommentModel = data => {
	return new Promise((resolve, reject) => {
		conn.query(addCommentQuery(data), function (err, result) {
			if (err) {
				console.log(err)
				reject(err)
			} else {
				resolve(true)
			}
		})
	})
}

const updateCommentModel = data => {
	return new Promise((resolve, reject) => {
		conn.query(updateCommentQuery(data), function (err, result) {
			if (err) {
				console.log(err)
				reject(err)
			} else {
				resolve(true)
			}
		})
	})
}

const deleteCommentModel = commentId => {
	return new Promise((resolve, reject) => {
		conn.query(deleteCommentQuery(commentId), function (err, result) {
			if (err) {
				console.log(err)
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
