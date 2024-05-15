import { comments, posts, users } from '../model/data.js'
import fs from 'fs'
import path from 'path'
import { getLocalDateTime } from '../tools/dataUtils.js'
import bcrypt from 'bcryptjs'

const __dirname = path.resolve()

//유저 관련 서비스
let userNum = users.length

//userId 유효성 조회 로직
export const checkUserIdModel = userId => {
	const user = users.find(user => user.userId === userId && user.deleted_at === null)

	/*
	 * true: 해당 id를 가진 user 존재
	 * fale: 해당 id를가진 user 존재 X
	 */

	return !user ? false : true
}

export const checkUserModel = userId => {
	const user = users.find(user => user.userId === userId && user.deleted_at === null)
	return user
}

export const checkUserNicknameModel = nickname => {
	const user = users.find(user => user.nickname === nickname && user.deleted_at === null)

	/*
	 * true: 해당 nickname을 가진 user 존재
	 * false: 해당 nickname을 가진 user 존재 X
	 */

	return user ? true : false
}

export const checkUserEmailModel = email => {
	const user = users.find(user => user.email === email && user.deleted_at === null)

	/*
	 * true: 해당 email을 가진 user 존재
	 * false: 해당 email을 가진 user 존재 X
	 */
	return user ? true : false
}

//유저 등록 로직
export const addUserModel = data => {
	//data 형식: { email, nickname, password, profile_image }
	const userId = userNum + 1
	const date = getLocalDateTime()

	const salt = bcrypt.genSaltSync(10)
	const hash = bcrypt.hashSync(data.password, salt)

	const newUser = {
		userId,
		email: data.email,
		nickname: data.nickname,
		password: hash,
		profile_image: data.profile_image,
		created_at: date,
		updated_at: date,
		deleted_at: null
	}

	users.push(newUser)
	userNum += 1
	return userId
}

//유저 로그인 로직 -> 유저 아이디 반환
export const logInUserModel = async (email, password) => {
	const user = users.find(user => user.email === email && user.deleted_at === null)

	const passwordCorrect = await bcrypt.compare(password, user.password)

	if (!user || !passwordCorrect) return null

	return user
}

//유저 정보 수정 로직
export const updateUserProfileModel = data => {
	const { userId, nickname, profile_image } = data
	if (!nickname && !profile_image) return null

	const userIndex = users.findIndex(user => user.userId === userId && user.deleted_at === null)

	users[userIndex].nickname = nickname
	users[userIndex].profile_image = profile_image

	//유저가 작성한 글 유저이미지, 닉네임 수정
	const userPostsIndex = []

	posts.forEach((post, index) => {
		if (post.userId === userId) {
			userPostsIndex.push(index)
		}
	})

	userPostsIndex.forEach(index => {
		posts[index].nickname = nickname
		posts[index].userImage = profile_image
	})

	//유저가 작성한 댓글 유저이미지, 닉네임 수정
	const userCommentsIndex = []
	comments.forEach((comment, index) => {
		if (comment.userId === userId) {
			userCommentsIndex.push(index)
		}
	})

	userCommentsIndex.forEach(index => {
		comments[index].nickname = nickname
		comments[index].profile_image = profile_image
	})

	return users[userIndex]
}

//유저 비밀번호 수정 로직
export const updateUserPasswordModel = data => {
	const { userId, password } = data
	if (!userId || !password) return false

	const userIndex = users.findIndex(user => user.userId === userId && user.deleted_at === null)

	const salt = bcrypt.genSaltSync(10)
	const hash = bcrypt.hashSync(password, salt)

	users[userIndex].password = hash

	return users[userIndex]
}

//유저 회원탈퇴 로직
export const deleteUserModel = id => {
	if (!id) return false

	const user = checkUserIdModel(id)
	if (!user) return false

	const date = getLocalDateTime()
	users[id - 1].deleted_at = date
	return true
}

//이미지 저장
export const addUserImageModel = image => {
	const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
	if (!matches || matches.length !== 3) return null

	// 이미지 데이터를 Buffer로 디코딩
	const imageBuffer = Buffer.from(matches[2], 'base64')

	// 이미지를 서버에 저장
	const imageName = `profile_image_${Date.now()}.png` // 파일명 생성
	const imagePath = path.join(__dirname, '/images/profile', imageName)
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
