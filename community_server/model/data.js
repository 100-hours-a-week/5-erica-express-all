export const comments = [
	{
		commentId: 1,
		postId: 1,
		userId: 1,
		nickname: 'user1',
		profile_image: 'http://localhost:8000/images/profile/zzanggu.png',
		comment: '꽁꽁 얼어붙은 한강 위로 감성 모르면 ...',
		created_at: '2024-04-04 00:00:00',
		updated_at: '2024-04-04 00:00:00',
		deleted_at: null
	},
	{
		commentId: 2,
		postId: 2,
		userId: 1,
		nickname: 'user1',
		profile_image: 'http://localhost:8000/images/profile/zzanggu.png',
		comment: '우리 21살에 만났는데 벌써 29이야~.',
		created_at: '2024-04-04 00:00:00',
		updated_at: '2024-04-04 00:00:00',
		deleted_at: null
	},
	{
		commentId: 3,
		postId: 3,
		userId: 2,
		nickname: 'user2',
		profile_image: 'http://localhost:8000/images/profile/suzi.jpeg',
		comment: 'ENFP 없는 ENFP 조 by v버지',
		created_at: '2024-04-04 00:00:00',
		updated_at: '2024-04-04 00:00:00',
		deleted_at: null
	},
	{
		commentId: 4,
		postId: 4,
		userId: 2,
		nickname: 'user2',
		profile_image: 'http://localhost:8000/images/profile/suzi.jpeg',
		comment: '묵찌빠 전공...',
		created_at: '2024-04-04 00:00:00',
		updated_at: '2024-04-04 00:00:00',
		deleted_at: null
	},
	{
		commentId: 5,
		postId: 5,
		userId: 3,
		nickname: 'user3',
		profile_image: 'http://localhost:8000/images/profile/chulsoo.jpeg',
		comment: '맥북 사고 싶다.',
		created_at: '2024-04-04 00:00:00',
		updated_at: '2024-04-04 00:00:00',
		deleted_at: null
	},
	{
		commentId: 6,
		postId: 6,
		userId: 3,
		nickname: 'user3',
		profile_image: 'http://localhost:8000/images/profile/chulsoo.jpeg',
		comment: '백재롱 귀여워. 백재롱 귀여워.',
		created_at: '2024-04-04 00:00:00',
		updated_at: '2024-04-04 00:00:00',
		deleted_at: null
	},
	{
		commentId: 7,
		postId: 7,
		userId: 4,
		nickname: 'user4',
		profile_image: 'http://localhost:8000/images/profile/hunyi.webp',
		comment: '전재준 그만해~~~~ 멈춰~~',
		created_at: '2024-04-04 00:00:00',
		updated_at: '2024-04-04 00:00:00',
		deleted_at: null
	},
	{
		commentId: 8,
		postId: 8,
		userId: 4,
		nickname: 'user4',
		profile_image: 'http://localhost:8000/images/profile/hunyi.webp',
		comment: '음...',
		created_at: '2024-04-04 00:00:00',
		updated_at: '2024-04-04 00:00:00',
		deleted_at: null
	},
	{
		commentId: 9,
		postId: 9,
		userId: 5,
		nickname: 'user5',
		profile_image: 'http://localhost:8000/images/profile/yuri.jpeg',
		comment: "치료가 필요할 정도로 심각한 '도파민 중독증'입니다.",
		created_at: '2024-04-04 00:00:00',
		updated_at: '2024-04-04 00:00:00',
		deleted_at: null
	},
	{
		commentId: 10,
		postId: 10,
		userId: 5,
		nickname: 'user5',
		profile_image: 'http://localhost:8000/images/profile/yuri.jpeg',
		comment: '구다사이좌 아세요?',
		created_at: '2024-04-04 00:00:00',
		updated_at: '2024-04-04 00:00:00',
		deleted_at: null
	}
]

export const posts = [
	{
		postId: 1,
		userId: 1,
		nickname: 'user1',
		userImage: 'http://localhost:8000/images/profile/zzanggu.png',
		title: '꽁꽁 얼어붙은 어쩌고 저쩌고',
		content: '꽁꽁 얼어붙은 한강 위로 고양이가 걸어다닙니다.🐈',
		postImage: 'http://localhost:8000/images/post/hangang_cat.webp',
		created_at: '2024-04-04 00:00:00',
		updated_at: '2024-04-04 00:00:00',
		deleted_at: null,
		view: 19000,
		like: 12,
		comment_count: 1
	},
	{
		postId: 2,
		userId: 1,
		nickname: 'user1',
		userImage: 'http://localhost:8000/images/profile/zzanggu.png',
		title: '환승연애 명언 제조기.',
		content: "너가 '자기야 미안해' 했잖아? 환승연애 이딴거 안나왔어.",
		postImage: 'http://localhost:8000/images/post/hwanseung.jpeg',
		created_at: '2024-04-04 00:00:00',
		updated_at: '2024-04-04 00:00:00',
		deleted_at: null,
		view: 1000,
		like: 12,
		comment_count: 1
	},
	{
		postId: 3,
		userId: 2,
		nickname: 'user2',
		userImage: 'http://localhost:8000/images/profile/suzi.jpeg',
		title: '6조에 대해서 알아보자',
		content: '그만 알아보자.',
		postImage: 'http://localhost:8000/images/post/postImage.jpg',
		created_at: '2024-04-04 00:00:00',
		updated_at: '2024-04-04 00:00:00',
		deleted_at: null,
		view: 10000,
		like: 12,
		comment_count: 1
	},
	{
		postId: 4,
		userId: 2,
		nickname: 'user2',
		userImage: 'http://localhost:8000/images/profile/suzi.jpeg',
		title: '난 대학 시절 묵찌빠를 전공했단 사실~',
		content: '난 묵찌빠로 유학까지 다녀왔단 사실~ 니 놈을 이겨 가문의 이름 높이리~',
		postImage: 'http://localhost:8000/images/post/mukzippa.jpeg',
		created_at: '2024-04-04 00:00:00',
		updated_at: '2024-04-04 00:00:00',
		deleted_at: null,
		view: 30,
		like: 12,
		comment_count: 1
	},
	{
		postId: 5,
		userId: 3,
		nickname: 'user3',
		userImage: 'http://localhost:8000/images/profile/chulsoo.jpeg',
		title: '삼성 vs 애플',
		content: '골라보세요',
		postImage: 'http://localhost:8000/images/post/postImage.jpg',
		created_at: '2024-04-04 00:00:00',
		updated_at: '2024-04-04 00:00:00',
		deleted_at: null,
		view: 30,
		like: 12,
		comment_count: 1
	},
	{
		postId: 6,
		userId: 3,
		nickname: 'user3',
		userImage: 'http://localhost:8000/images/profile/chulsoo.jpeg',
		title: '못난이 노을이',
		content:
			'노을이 귀여워. 🐶 노을이 귀여워. 🐶 노을이 귀여워. 🐶 노을이 귀여워. 🐶 노을이 귀여워. 🐶 노을이 귀여워. 🐶 노을이 귀여워. 🐶 노을이 귀여워. 🐶 노을이 귀여워. 🐶 노을이 귀여워. 🐶 노을이 귀여워. 🐶 ',
		postImage: 'http://localhost:8000/images/post/noeul.jpg',
		created_at: '2024-04-04 00:00:00',
		updated_at: '2024-04-04 00:00:00',
		deleted_at: null,
		view: 30,
		like: 12,
		comment_count: 1
	},
	{
		postId: 7,
		userId: 4,
		nickname: 'user4',
		userImage: 'http://localhost:8000/images/profile/hunyi.webp',
		title: '눈물의 여왕 스포',
		content: '홍해인 기억 돌아와서 백현우랑 다시 결혼함 ~ 그러니 백현우 돌려내~~~~~',
		postImage: 'http://localhost:8000/images/post/queen.webp',
		created_at: '2024-04-04 00:00:00',
		updated_at: '2024-04-04 00:00:00',
		deleted_at: null,
		view: 10000,
		like: 12,
		comment_count: 1
	},
	{
		postId: 8,
		userId: 4,
		nickname: 'user4',
		userImage: 'http://localhost:8000/images/profile/hunyi.webp',
		title: '여러분 100시간 공부하세요',
		content: '음....',
		postImage: 'http://localhost:8000/images/post/100times.jpeg',
		created_at: '2024-04-04 00:00:00',
		updated_at: '2024-04-04 00:00:00',
		deleted_at: null,
		view: 10,
		like: 12,
		comment_count: 1
	},
	{
		postId: 9,
		userId: 5,
		nickname: 'user5',
		userImage: 'http://localhost:8000/images/profile/yuri.jpeg',
		title: "치료가 필요할 정도로 심각한 '도박 중독증'입니다.",
		content: '흥, 웃기는 소리. 내기 하겠소?',
		postImage: 'http://localhost:8000/images/post/dobak.webp',
		created_at: '2024-04-04 00:00:00',
		updated_at: '2024-04-04 00:00:00',
		deleted_at: null,
		view: 30,
		like: 12,
		comment_count: 1
	},
	{
		postId: 10,
		userId: 5,
		nickname: 'user5',
		userImage: 'http://localhost:8000/images/profile/yuri.jpeg',
		title: '인스타 재밌는거 추천 부탁드려요.',
		content: '~~~~~~~~',
		postImage: '',
		created_at: '2024-04-04 00:00:00',
		updated_at: '2024-04-04 00:00:00',
		deleted_at: null,
		view: 30,
		like: 12,
		comment_count: 1
	}
]

export const users = [
	{
		userId: 1,
		nickname: 'user1',
		email: 'user1@example.com',
		password: '$2a$10$6hIQj/rOpk7lAsgqcSrBYeoyzjh1CkHZdfgnVCO3gi5TC.fqDrsBi',
		profile_image: 'http://localhost:8000/images/profile/zzanggu.png',
		created_at: '2024-04-04 00:00:00',
		updated_at: '2024-04-04 00:00:00',
		deleted_at: null
	},
	{
		userId: 2,
		nickname: 'user2',
		email: 'user2@example.com',
		password: '$2a$10$6hIQj/rOpk7lAsgqcSrBYeoyzjh1CkHZdfgnVCO3gi5TC.fqDrsBi',
		profile_image: 'http://localhost:8000/images/profile/suzi.jpeg',
		created_at: '2024-04-04 00:00:00',
		updated_at: '2024-04-04 00:00:00',
		deleted_at: null
	},
	{
		userId: 3,
		nickname: 'user3',
		email: 'user3@example.com',
		password: '$2a$10$6hIQj/rOpk7lAsgqcSrBYeoyzjh1CkHZdfgnVCO3gi5TC.fqDrsBi',
		profile_image: 'http://localhost:8000/images/profile/chulsoo.jpeg',
		created_at: '2024-04-04 00:00:00',
		updated_at: '2024-04-04 00:00:00',
		deleted_at: null
	},
	{
		userId: 4,
		nickname: 'user4',
		email: 'user4@example.com',
		password: '$2a$10$6hIQj/rOpk7lAsgqcSrBYeoyzjh1CkHZdfgnVCO3gi5TC.fqDrsBi',
		profile_image: 'http://localhost:8000/images/profile/hunyi.webp',
		created_at: '2024-04-04 00:00:00',
		updated_at: '2024-04-04 00:00:00',
		deleted_at: null
	},
	{
		userId: 5,
		nickname: 'user5',
		email: 'user5@example.com',
		password: '$2a$10$6hIQj/rOpk7lAsgqcSrBYeoyzjh1CkHZdfgnVCO3gi5TC.fqDrsBi',
		profile_image: 'http://localhost:8000/images/profile/yuri.jpeg',
		created_at: '2024-04-04 00:00:00',
		updated_at: '2024-04-04 00:00:00',
		deleted_at: null
	}
]
