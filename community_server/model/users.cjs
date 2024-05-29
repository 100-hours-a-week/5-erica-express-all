const fs = require('fs')
const path = require('path')
const bcrypt = require('bcryptjs')

const { db_info } = require('../config/mysql.cjs')
const conn = mysql.createConnection(db_info)

const {
	getUserQuery,
	nicknameQuery,
	emailQuery,
	addUserQuery,
	updateUserPasswordQuery,
	updateUserProfileQuery,
	deleteUserQuery,
	getPostCountQuery,
	getCommentCountQuery
} = require('../queries/users.cjs')

//userId 유효성 조회 로직
const checkUserIdModel = userId => {
	return new Promise((resolve, reject) => {
		conn.query(getUserQuery(userId), function (err, result) {
			if (err) {
				console.log(err)
				reject(err)
			} else {
				if (result.length != 0) {
					resolve(true)
				} else resolve(false)
			}
		})
	})
}

const checkUserModel = userId => {
	return new Promise((resolve, reject) => {
		conn.query(getUserQuery(userId), function (err, result) {
			if (err) {
				console.log(err)
				reject(err)
			} else {
				if (result.length != 0) {
					resolve(result[0])
				}
			}
		})
	})
}

const checkUserNicknameModel = nickname => {
	return new Promise((resolve, reject) => {
		conn.query(nicknameQuery(nickname), function (err, result) {
			if (err) {
				console.log(err)
				reject(err)
			} else {
				if (result.length != 0) {
					resolve(true)
				}
				resolve(false)
			}
		})
	})
}

const checkUserEmailModel = email => {
	return new Promise((resolve, reject) => {
		conn.query(emailQuery(email), function (err, result) {
			if (err) {
				console.log(err)
				reject(err)
			} else {
				if (result.length != 0) {
					resolve(true)
				}
				resolve(false)
			}
		})
	})
}

//유저 등록 로직
const addUserModel = data => {
	const salt = bcrypt.genSaltSync(10)
	const hash = bcrypt.hashSync(data.password, salt)

	const addData = { email: data.email, nickname: data.nickname, password: hash, profileImage: data.profile_image }

	return new Promise((resolve, reject) => {
		conn.query(addUserQuery(addData), function (err, result) {
			if (err) {
				console.log(err)
				reject(err)
			} else {
				resolve(result.insertId)
			}
		})
	})
}

const checkLogInModel = email => {
	return new Promise((resolve, reject) => {
		conn.query(emailQuery(email), function (err, result) {
			if (err) {
				console.log(err)
				reject(err)
				return false
			} else {
				resolve(result[0])
			}
		})
	})
}

//유저 로그인 로직 -> 유저 아이디 반환
const logInUserModel = async (email, password) => {
	const user = await checkLogInModel(email)
	if (!user) {
		return false
	}
	const passwordCorrect = await bcrypt.compare(password, user.password)

	if (!passwordCorrect) return false

	return user
}

//유저 정보 수정 로직
const updateUserProfileModel = data => {
	if (!data.nickname && !data.profile_image) return null

	return new Promise((resolve, reject) => {
		conn.query(updateUserProfileQuery(data), function (err, result) {
			if (err) {
				console.log(err)
				reject(err)
			} else {
				resolve(true)
			}
		})
	})
}

//유저 비밀번호 수정 로직
const updateUserPasswordModel = data => {
	const { userId, password } = data
	if (!userId || !password) return false
	const salt = bcrypt.genSaltSync(10)
	const hash = bcrypt.hashSync(password, salt)

	const updateData = { password: hash, userId: data.userId }

	return new Promise((resolve, reject) => {
		conn.query(updateUserPasswordQuery(updateData), function (err, result) {
			if (err) {
				console.log(err)
				reject(err)
			} else {
				resolve(true)
			}
		})
	})
}

//유저 회원탈퇴 로직
const deleteUserModel = async id => {
	if (!id) return false

	const user = await checkUserIdModel(id)
	if (!user) return false

	return new Promise((resolve, reject) => {
		conn.query(deleteUserQuery(id), function (err, result) {
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

//이미지 저장
const addUserImageModel = image => {
	const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
	if (!matches || matches.length !== 3) return null

	// 이미지 데이터를 Buffer로 디코딩
	const imageBuffer = Buffer.from(matches[2], 'base64')

	// 이미지를 서버에 저장
	const imageName = `profile_image_${Date.now()}.png` // 파일명 생성
	const imagePath = path.join(__dirname, '../images/profile', imageName)
	fs.writeFile(imagePath, imageBuffer, err => {
		if (err) {
			console.error('Error saving image:', err)
		} else {
			console.log('Image saved successfully')
		}
	})

	const imageUrl = `http://localhost:8000/images/profile/${imageName}`
	return imageUrl
}

//게시글 수, 댓글 수 가져오기
const getUserWriteCount = async userId => {
	const postCount = await new Promise((resolve, reject) => {
		conn.query(getPostCountQuery(userId), function (err, result) {
			if (err) {
				console.log(err)
				reject(err)
			} else {
				const count = result[0].count
				resolve(count)
			}
		})
	})

	const commentCount = await new Promise((resolve, reject) => {
		conn.query(getCommentCountQuery(userId), function (err, result) {
			if (err) {
				console.log(err)
				reject(err)
			} else {
				const count = result[0].count
				resolve(count)
			}
		})
	})

	return { postCount, commentCount }
}

module.exports = {
	checkUserIdModel,
	checkUserModel,
	checkUserNicknameModel,
	checkUserEmailModel,
	addUserModel,
	logInUserModel,
	updateUserProfileModel,
	updateUserPasswordModel,
	deleteUserModel,
	addUserImageModel,
	getUserWriteCount
}
