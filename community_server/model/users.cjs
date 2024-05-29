const fs = require('fs')
const path = require('path')
const { getLocalDateTime } = require('../tools/dataUtils.cjs')
const bcrypt = require('bcryptjs')

const db = require('../config/mysql.cjs')
const conn = db.init()

//userId 유효성 조회 로직
const checkUserIdModel = userId => {
	/*
	 * true: 해당 id를 가진 user 존재
	 * fale: 해당 id를가진 user 존재 X
	 */

	const sql = `Select * from users where userId = ${userId} and deleted_at is NULL`
	return new Promise((resolve, reject) => {
		conn.query(sql, function (err, result) {
			if (err) {
				console.log('query is not executed: ' + err)
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
	const sql = `Select * from users where userId = ${userId} and deleted_at is NULL`
	return new Promise((resolve, reject) => {
		conn.query(sql, function (err, result) {
			if (err) {
				console.log('query is not executed: ' + err)
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
	/*
	 * true: 해당 nickname을 가진 user 존재
	 * false: 해당 nickname을 가진 user 존재 X
	 */

	const sql = `Select * from users where nickname = '${nickname}' and deleted_at is NULL`
	return new Promise((resolve, reject) => {
		conn.query(sql, function (err, result) {
			if (err) {
				console.log('query is not executed: ' + err)
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
	const sql = `Select * from users where email = '${email}'`
	return new Promise((resolve, reject) => {
		conn.query(sql, function (err, result) {
			if (err) {
				console.log('query is not executed: ' + err)
				reject(err)
			} else {
				if (result.length != 0) {
					resolve(true)
				}
				resolve(false)
			}
		})
	})

	/*
	 * true: 해당 email을 가진 user 존재
	 * false: 해당 email을 가진 user 존재 X
	 */
}

//유저 등록 로직
const addUserModel = data => {
	const date = getLocalDateTime()

	const salt = bcrypt.genSaltSync(10)
	const hash = bcrypt.hashSync(data.password, salt)

	const sql = `INSERT INTO users (
    email,
    nickname,
    password,
    profileImage,
    created_at
  ) VALUES (
    '${data.email}',
    '${data.nickname}',
    '${hash}',
    '${data.profile_image}',
    '${date}'
  );`

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

const checkLogInModel = email => {
	const sql = `Select * from users where email = '${email}'`
	return new Promise((resolve, reject) => {
		conn.query(sql, function (err, result) {
			if (err) {
				console.log('query is not executed: ' + err)
				reject(err)
				return false
			} else {
				resolve(result)
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
	const passwordCorrect = await bcrypt.compare(password, user[0].password)

	if (!passwordCorrect) return false

	return user
}

//유저 정보 수정 로직
const updateUserProfileModel = data => {
	const { userId, nickname, profile_image } = data
	if (!nickname && !profile_image) return null

	const sql = `
    UPDATE users
    SET 
      nickname = '${nickname}',
      profileImage = '${profile_image}'
    WHERE 
      userId = ${userId} and deleted_at is NULL;
  `
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

//유저 비밀번호 수정 로직
const updateUserPasswordModel = data => {
	const { userId, password } = data
	if (!userId || !password) return false
	const salt = bcrypt.genSaltSync(10)
	const hash = bcrypt.hashSync(password, salt)

	const sql = `
    UPDATE users
    SET 
      password = '${hash}'
    WHERE 
      userId = ${userId} and deleted_at is NULL;
  `
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

//유저 회원탈퇴 로직
const deleteUserModel = async id => {
	if (!id) return false

	const user = await checkUserIdModel(id)
	if (!user) return false

	const sql = `Delete from users where userId = ${id}`
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
	const sql1 = `Select count(*) As count from posts where userId = ${userId}`
	const postCount = await new Promise((resolve, reject) => {
		conn.query(sql1, function (err, result) {
			if (err) {
				console.log('query is not executed: ' + err)
				reject(err)
			} else {
				const count = result[0].count
				resolve(count)
			}
		})
	})

	const sql2 = `Select count(*) As count from comments where userId = ${userId}`

	const commentCount = await new Promise((resolve, reject) => {
		conn.query(sql2, function (err, result) {
			if (err) {
				console.log('query is not executed: ' + err)
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
