import { users } from '../model/data.js'
import {
	checkUserModel,
	checkUserIdModel,
	checkUserEmailModel,
	checkUserNicknameModel,
	addUserModel,
	logInUserModel,
	updateUserProfileModel,
	updateUserPasswordModel,
	deleteUserModel,
	addUserImageModel,
	getUserWriteCount
} from '../model/users.js'

const getUsers = (req, res) => {
	//TODO: 서버로 띄울 시 활셩화 필요
	// users.forEach((user) => {
	//   user.profile_image = user.profile_image.replace(
	//     "http://localhost:8000",
	//     `https://${req.headers.host}`
	//   );
	// });
	return res.status(200).json({ status: 200, message: null, data: users })
}

const getUser = (req, res) => {
	const userId = req.session.user.userId

	if (!userId) return res.status(400).json({ status: 404, message: 'invalid_user_id', data: null })

	const user = checkUserModel(userId)
	if (!user) return res.status(404).json({ status: 404, message: 'not_fount_user', data: null })

	//TODO: 서버로 띄울 시 활셩화 필요
	// user.profile_image = user.profile_image.replace(
	//   "http://localhost:8000",
	//   `https://${req.headers.host}`
	// );

	return res.status(200).json({ status: 200, message: null, data: user })
}

const addUser = (req, res) => {
	const { email, nickname, password, profile_image } = req.body

	let profile_server_url = ''

	if (!email || !nickname || !password || !profile_image) {
		return res.status(400).json({ status: 404, message: 'invalid_input', data: null })
	}

	if (profile_image) {
		profile_server_url = addUserImageModel(profile_image)
	}

	const newUserId = addUserModel({
		email,
		nickname,
		password,
		profile_image: profile_server_url
	})

	if (!newUserId) return res.status(500).json({ status: 500, message: 'internal_server_error', data: null })

	return res.status(201).json({
		status: 201,
		message: 'register_success',
		data: { userId: newUserId, profile_image }
	})
}

const logInUser = async (req, res) => {
	const { email, password } = req.body

	if (!email) return res.status(400).json({ status: 400, message: 'required_email', data: null })

	const user = await logInUserModel(email, password)

	if (!user) return res.status(404).json({ status: 404, message: 'invalid_email_or_password', data: null })

	req.session.user = user

	//req.session -> {user: {userId: 1, email: "", }}
	return res.status(200).json({ status: 200, message: 'login_success', data: user })
}

const updateUserProfile = (req, res) => {
	const userId = Number(req.userId)
	const { nickname, profile_image } = req.body

	let user_server_url = ''

	if (!userId) return res.status(400).json({ status: 400, message: 'invalid_user_id', data: null })

	if (!profile_image.includes(req.headers.host)) {
		const saved_image_url = addUserImageModel(profile_image)

		if (!saved_image_url) return res.status(500).json({ status: 500, message: 'internal_server_error', data: null })
		user_server_url = saved_image_url
		console.log(user_server_url)
	} else {
		// TODO: 배포할때 주소 변경해야함
		user_server_url = profile_image.replace(`http://${req.headers.host}`, 'http://localhost:8000')
		console.log(user_server_url)
	}

	if (!checkUserIdModel(userId)) return res.status(404).json({ status: 404, message: 'not_found_user', data: null })

	if (!profile_image) return res.status(500).json({ status: 500, message: 'internal_server_error', data: null })

	const success = updateUserProfileModel({
		userId,
		nickname,
		profile_image: user_server_url
	})

	if (!success) return res.status(500).json({ status: 500, message: 'internal_server_error', data: null })

	return res.status(201).json({ status: 201, message: 'update_user_data_success', data: success })
}

const updateUserpassword = (req, res) => {
	const userId = Number(req.userId)
	const password = req.body.password

	if (!userId) return res.status(400).json({ status: 400, message: 'invalid_user_id', data: null })

	if (!password) return res.status(400).json({ status: 400, message: 'invalid_password', data: null })

	if (!checkUserIdModel(userId)) return res.status(404).json({ status: 404, message: 'not_found_user', data: null })

	if (!updateUserPasswordModel({ userId, password }))
		return res.status(500).json({ status: 500, message: 'internal_server_error', data: null })

	req.session.destroy()

	return res.status(201).json({
		status: 201,
		message: 'change_user_password_success',
		data: null
	})
}

const deleteUser = (req, res) => {
	const userId = Number(req.session.user.userId)

	if (!userId) return res.status(400).json({ status: 400, message: 'invalid_user_id', data: null })

	if (!checkUserIdModel(userId)) return res.status(404).json({ status: 404, message: 'not_found_user', data: null })

	if (deleteUserModel(userId))
		return res.status(200).json({ status: 200, message: 'delete_user-data_success', data: null })
}

const duplicateEmail = (req, res) => {
	if (checkUserEmailModel(req.params.email))
		return res.status(400).json({ status: 400, message: 'already_exist_email', data: null })

	return res.status(200).json({ status: 200, message: 'available_email', data: null })
}

const duplicateNickname = (req, res) => {
	const nickname = req.params.nickname
	const userId = Number(req.session.user.userId) ?? null

	if (!userId) return res.status(404).json({ status: 404, message: 'invalid_user', data: null })

	if (userId) {
		const user = checkUserModel(userId)
		if (user.nickname === nickname) return res.status(200).json({ status: 200, message: 'same_nickname', data: null })
	}

	if (checkUserNicknameModel(nickname))
		return res.status(400).json({ status: 400, message: 'already_exist_nickname', data: null })

	return res.status(200).json({ status: 200, message: 'available_nickname', data: null })
}

const duplicateSignUpNickname = (req, res) => {
	if (checkUserNicknameModel(req.params.nickname))
		return res.status(400).json({ status: 400, message: 'already_exist_nickname', data: null })

	return res.status(200).json({ status: 200, message: 'available_nickname', data: null })
}

const logOut = (req, res) => {
	req.session.destroy()
	res.status(200).json({ status: 200, message: 'log_out_success', data: null })
}

const checkLogIn = (req, res) => {
	if (req.session.user) return res.status(200).json({ status: 200, message: 'authenticated', data: '' })

	return res.status(401).json({ status: 401, message: 'unauthenticated', data: '' })
}

const getMyCount = (req, res) => {
	const data = getUserWriteCount(req.session.user.userId)
	return res.status(200).json({ status: 200, message: '', data })
}

export const userController = {
	getUsers,
	getUser,
	addUser,
	logInUser,
	updateUserProfile,
	duplicateSignUpNickname,
	updateUserpassword,
	deleteUser,
	duplicateEmail,
	duplicateNickname,
	logOut,
	checkLogIn,
	getMyCount
}
