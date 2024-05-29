const { checkUserModel } = require('./users.cjs')
const path = require('path')
const fs = require('fs')
const { getLocalDateTime } = require('../tools/dataUtils.cjs')
const { posts } = require('./data.cjs')

const db = require('../config/mysql.cjs')
const conn = db.init()

let postNum = posts.length

//post관련 서비스
//게시물 상세 조회 로직
const getPostsModel = () => {
	const sql = `SELECT 
      posts.*, 
      users.nickname, 
      users.profileImage,
      (SELECT COUNT(*) FROM comments WHERE comments.postId = posts.postId AND comments.deleted_at IS NULL) AS comment_count
    FROM 
      posts 
    INNER JOIN 
      users 
    ON 
      posts.userId = users.userId 
    WHERE 
      posts.deleted_at IS NULL
    ORDER BY
      posts.created_at DESC;
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

const getPostModel = id => {
	const sql = `SELECT 
      posts.*, 
      users.nickname, 
      users.profileImage,
      (SELECT COUNT(*) FROM comments WHERE comments.postId = posts.postId AND comments.deleted_at IS NULL) AS comment_count
    FROM 
      posts 
    INNER JOIN 
      users 
    ON 
      posts.userId = users.userId 
    WHERE 
      posts.postId = ${id} 
    AND 
      posts.deleted_at IS NULL;
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

const updatePostViewModel = id => {
	const sql = `Update posts SET view = view + 1 WHERE posts.postId = ${id} and posts.deleted_at IS NULL;`
	new Promise((resolve, reject) => {
		conn.query(sql, function (err, result) {
			if (err) console.log('query is not excuted: ' + err)
		})
	})
}

const getMyPostsModel = userId => {
	const sql = `SELECT posts.*, users.nickname, users.profileImage 
    FROM posts INNER JOIN users ON posts.userId = users.userId 
    WHERE users.userId = ${userId} and posts.deleted_at IS NULL 
    ORDER BY posts.created_at DESC; `

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

const getOtherPostsModel = () => {
	const sql = `SELECT posts.*, users.nickname, users.profileImage 
  FROM posts INNER JOIN users ON posts.userId = users.userId 
  WHERE posts.type = "other" and posts.deleted_at IS NULL 
  ORDER BY posts.created_at DESC; `

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

const getCodingPostsModel = () => {
	const sql = `SELECT posts.*, users.nickname, users.profileImage 
FROM posts INNER JOIN users ON posts.userId = users.userId 
WHERE posts.type = "coding" and posts.deleted_at IS NULL 
ORDER BY posts.created_at DESC; `

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
	const date = getLocalDateTime()

	const sql = `INSERT INTO posts (
    userId, 
    postImage, 
    title, 
    content, 
    created_at, 
    type
) VALUES (
    ${data.userId}, 
    '${data.postImage}', 
    '${data.title}',
    '${data.content}',  
    '${date}',
    '${data.type}'   
);
 `
	return new Promise((resolve, reject) => {
		conn.query(sql, function (err, result) {
			if (err) {
				console.log('query is not executed: ' + err)
				reject(err)
			} else {
				resolve(result.insertId)
			}
		})
	})
}

//게시물 수정 로직
const updatePostModel = data => {
	const { id, title, content, postImage, type } = data
	const sql = `Update posts SET title = "${title}", content = "${content}", postImage = "${postImage}", type="${type}"  WHERE posts.postId = ${id} and posts.deleted_at IS NULL ; `

	new Promise((resolve, reject) => {
		conn.query(sql, function (err, result) {
			if (err) {
				console.log('query is not executed: ' + err)
				reject(err)
			} else {
				resolve(result)
			}
		})
	})

	return id
}

//게시물 삭제 로직
const deletePostModel = async id => {
	const sql = `Delete from posts where postId = ${id}`
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
