const path = require('path')
const fs = require('fs')
const {
	postsQuery,
	postQuery,
	myPostsQuery,
	otherPostsQuery,
	codingPostsQuery,
	addPostQuery,
	updatePostQuery,
	updatePostViewQuery,
	deletePostQuery
} = require('../queries/posts.cjs')

const { db_info } = require('../config/mysql.cjs')
const conn = mysql.createConnection(db_info)

//post관련 서비스
//게시물 상세 조회 로직
const getPostsModel = () => {
	return new Promise((resolve, reject) => {
		conn.query(postsQuery(), function (err, result) {
			if (err) {
				console.log(err)
				reject(err)
			} else {
				resolve(result)
			}
		})
	})
}

const getPostModel = id => {
	return new Promise((resolve, reject) => {
		conn.query(postQuery(id), function (err, result) {
			if (err) {
				console.log(err)
				reject(err)
			} else {
				resolve(result)
			}
		})
	})
}

const updatePostViewModel = id => {
	new Promise((resolve, reject) => {
		conn.query(updatePostViewQuery(id), function (err, result) {
			if (err) {
				console.log(err)
				reject(err)
			} else {
				resolve(true)
			}
		})
	})
}

const getMyPostsModel = userId => {
	return new Promise((resolve, reject) => {
		conn.query(myPostsQuery(userId), function (err, result) {
			if (err) {
				console.log(err)
				reject(err)
			} else {
				resolve(result)
			}
		})
	})
}

const getOtherPostsModel = () => {
	return new Promise((resolve, reject) => {
		conn.query(otherPostsQuery(), function (err, result) {
			if (err) {
				console.log(err)
				reject(err)
			} else {
				resolve(result)
			}
		})
	})
}

const getCodingPostsModel = () => {
	return new Promise((resolve, reject) => {
		conn.query(codingPostsQuery(), function (err, result) {
			if (err) {
				console.log(err)
				reject(err)
			} else {
				resolve(result)
			}
		})
	})
}

const checkPostOwnerModel = async data => {
	const post = await getPostModel(data.postId)
	/*
	 * true: 해당 글의 Owner임
	 * fale: 해당 글의 Owner가 아님
	 */
	return post[0].userId !== data.userId ? false : true
}

//게시물 이미지 저장
//이미지 저장
const addPostImageModel = image => {
	const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)

	if (image.includes('localhost')) {
		return image
	}

	if (!matches || matches.length !== 3) {
		console.log('Wrong Image Type')
		return null
	}

	// 이미지 데이터를 Buffer로 디코딩
	const imageBuffer = Buffer.from(matches[2], 'base64')

	// 이미지를 서버에 저장
	const imageName = `post_image_${Date.now()}.png` // 파일명 생성
	const imagePath = path.join(__dirname, '../images/post', imageName)
	fs.writeFile(imagePath, imageBuffer, err => {
		if (err) {
			console.error('Error saving image:', err)
			return -1
		} else {
			console.log('Image saved successfully')
		}
	})

	const imageUrl = `http://localhost:8000/images/post/${imageName}`
	return imageUrl
}

//게시물 작성 로직
const addPostModel = data => {
	return new Promise((resolve, reject) => {
		conn.query(addPostQuery(data), function (err, result) {
			if (err) {
				console.log(err)
				reject(err)
			} else {
				resolve(result.insertId)
			}
		})
	})
}

//게시물 수정 로직
const updatePostModel = data => {
	new Promise((resolve, reject) => {
		conn.query(updatePostQuery(data), function (err, result) {
			if (err) {
				console.log(err)
				reject(err)
			} else {
				resolve(result)
			}
		})
	})

	return data.id
}

//게시물 삭제 로직
const deletePostModel = async id => {
	return new Promise((resolve, reject) => {
		conn.query(deletePostQuery(id), function (err, result) {
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
	getPostsModel,
	getPostModel,
	getMyPostsModel,
	getOtherPostsModel,
	getCodingPostsModel,
	checkPostOwnerModel,
	addPostImageModel,
	addPostModel,
	updatePostViewModel,
	updatePostModel,
	deletePostModel
}
