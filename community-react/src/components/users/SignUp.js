import "../../styles/SignUp.css";
import { backHost } from "../../static";
import { Link } from "react-router-dom";
import { useState, useRef } from "react";

const reader = new FileReader();

export default function SignUp() {
  const [profileImage, setProileImage] = useState("");
  const email = useRef("");
  const password = useRef("");
  const passwordCheck = useRef("");
  const nickname = useRef("");

  const [imageNull, setImageNull] = useState(false);
  const [emailNull, setEmailNull] = useState(false);
  const [emailNotCorrect, setEmailNotCorrect] = useState(false);
  const [emailDuplicate, setEmailDuplciate] = useState(false);
  const [passwordNotSame, setPasswordNotSame] = useState(false);
  const [passwordNotMatch, setPasswordNotMatch] = useState(false);
  const [nicknameSpace, setNicknameSpace] = useState(false);
  const [nicknameDuplicate, setNicknameDuplicate] = useState(false);

  const signUpButton = document.querySelector(".signUpButton");

  //프로필 이미지 유효성 검사
  function checkImageValidation(image) {
    if (!image) {
      setImageNull(true);
      return false;
    }
    setImageNull(false);
    return true;
  }

  //이메일 유효성 검사
  async function checkEmailValidation(email) {
    //이메일이 없을 시
    if (!email) {
      setEmailNull(true);
      return false;
    }
    setEmailNull(false);

    //이메일 형식 안맞을 시
    const emailForm = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && (!emailForm.test(email) || email.length < 5)) {
      setEmailNotCorrect(true);
      return false;
    }
    setEmailNotCorrect(false);

    const isEmailDuplicate = await fetch(
      `${backHost}/api/users/email/${email}`,
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "ngrok-skip-browser-warning": "69420",
        },
        credentials: "include",
        method: "POST",
      }
    ).then(async (response) => {
      const data = await response.json();
      if (data.status === 400) {
        return true;
      }
      return false;
    });

    if (isEmailDuplicate) {
      setEmailDuplciate(true);
      return false;
    }

    setEmailDuplciate(false);
    return true;
  }

  //비밀번호 유효성 검사
  function checkPasswordValidation(password, passwordCheck) {
    //password 없을 시
    if (!password) {
      return false;
    }

    if (!passwordCheck) {
      return false;
    }

    //password 와 passwordCheck가 같지 않을 시
    const isPasswordNotSame = password !== passwordCheck ? true : false;

    if (isPasswordNotSame) {
      setPasswordNotSame(true);
      return false;
    }
    setPasswordNotSame(false);

    //비밀번호 형식 안맞음
    const passwordRegExp =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/;
    const isNotPasswordRule = !passwordRegExp.test(password);
    if (isNotPasswordRule) {
      setPasswordNotMatch(true);
      return false;
    }
    setPasswordNotMatch(false);
    return true;
  }

  //닉네임 유효성 검사
  async function checkNicknameValidation(nickname) {
    if (!nickname) {
      return false;
    }

    //닉네임에 공백이 있을 시
    if (nickname?.indexOf(" ") !== -1 ? true : false) {
      setNicknameSpace(true);
      return false;
    }
    setNicknameSpace(false);

    //닉네임이 중복일시
    const isNicknameDuplicate = await fetch(
      `${backHost}/api/users/signup/nickname/${nickname}`,
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "ngrok-skip-browser-warning": "69420",
        },
        credentials: "include",
        method: "POST",
      }
    ).then(async (response) => {
      const data = await response.json();
      console.log(data.status);
      if (data.status === 400) {
        return true;
      }
      return false;
    });

    if (isNicknameDuplicate) {
      setNicknameDuplicate(true);
      return false;
    }
    setNicknameDuplicate(false);
    return true;
  }

  //회원가입 버튼 클릭 시
  async function hanleOnClickSignUp() {
    //유효성 검사
    //TODO: 이미지 실제 데이터값으로 변경

    const data = JSON.stringify({
      email: email.current,
      password: password.current,
      nickname: nickname.current,
      profile_image: profileImage,
    });

    const isImageValid = checkImageValidation(profileImage);
    const isEmailValid = await checkEmailValidation(email.current);
    const isPasswordValid = checkPasswordValidation(
      password.current,
      passwordCheck.current
    );
    const isNicknameValid = await checkNicknameValidation(nickname.current);

    console.log(`isImageValid ${isImageValid}`);
    console.log(`isEmailValid ${isEmailValid}`);
    console.log(`isPasswordValid ${isPasswordValid}`);
    console.log(`isNicknameValid ${isNicknameValid}`);

    if (!isImageValid || !isEmailValid || !isNicknameValid || !profileImage) {
      signUpButton.style.backgroundColor = "lightgray";
      return;
    }

    signUpButton.style.backgroundColor = "#7f6aee";

    const response = await fetch(`${backHost}/api/users/signup`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "ngrok-skip-browser-warning": "69420",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      method: "POST",
      body: data,
    });

    const responseData = await response.json();

    //응답 상태에 따른 분기
    switch (responseData.status) {
      case 201:
        alert("회원가입 성공");
        window.location.href = "/";
        return;
      default:
        signUpButton.style.backgroundColor = "lightgray";
        setTimeout(() => {
          signUpButton.style.backgroundColor = "";
        }, 1000);
        return;
    }
  }

  //이미지 변경 시
  function handleOnChangeProfileImage(event) {
    if (event.target.files.length === 0) {
      setProileImage(null);
      return;
    }
    reader.onload = (data) => {
      setProileImage(data.target.result);
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  //인풋값을 입력하다가 포커스 아웃될 때
  async function handleOnBlurEmail(event) {
    email.current = event.target.value;
    await checkEmailValidation(event.target.value);
  }

  function handleOnBlurPassword(event) {
    password.current = event.target.value;
    checkPasswordValidation(password.current, passwordCheck.current);
  }

  function handleOnBlurPasswordCheck(event) {
    passwordCheck.current = event.target.value;
    checkPasswordValidation(password.current, passwordCheck.current);
  }

  async function handleOnBlurNickname(event) {
    nickname.current = event.target.value;
    await checkNicknameValidation(nickname.current);
  }

  return (
    <div className="signUpMain">
      <p className="mainTitle">회원가입</p>
      <form className="signUpContainer">
        <div className="topContainer">
          <p className="inputTitle">프로필 사진</p>
          <div className="helperTextContainer">
            <div className="helperText profileImageText">
              {imageNull ? "* 프로필 사진을 추가해주세요." : null}
            </div>
          </div>
          <div className="imageContainer">
            {profileImage ? (
              <img className="imageShow" alt="profile" src={profileImage} />
            ) : null}
            <div className="imageUpdate">
              <label htmlFor="imageInput" className="imageUpdateButton">
                +
              </label>
              <input
                id="imageInput"
                onChange={handleOnChangeProfileImage}
                type="file"
                accept="image/*"
              />
            </div>
          </div>
        </div>
        <div className="bottomContainer">
          <div className="emailContainer">
            <label htmlFor="emailInput" className="inputTitle">
              이메일*
            </label>
            <input
              required
              type="email"
              id="emailInput"
              onBlur={handleOnBlurEmail}
              placeholder="이메일을 입력하세요"
            />
            <div className="helperTextContainer">
              <div className="helperText emailText">
                {emailNull
                  ? "* 이메일을 입력해주세요"
                  : emailNotCorrect
                  ? "* 올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)"
                  : emailDuplicate
                  ? "*중복된 이메일 입니다."
                  : null}
              </div>
            </div>
          </div>
          <div className="passwordContainer">
            <label htmlFor="passwordInput" className="inputTitle">
              비밀번호*
            </label>
            <input
              required
              type="password"
              id="passwordInput"
              onBlur={handleOnBlurPassword}
              placeholder="비밀번호를 입력하세요"
            />
            <div className="helperTextContainer">
              <div className="helperText passwordText">
                {!password
                  ? "* 비밀번호를 입력해주세요."
                  : passwordNotSame
                  ? "* 비밀번호가 다릅니다."
                  : passwordNotMatch
                  ? "* 비밀번호는 대문자, 소문자, 숫자, 특수문자가 들어가야 합니다 (8자 이상 20자 이하)"
                  : null}
              </div>
            </div>
          </div>
          <div className="passwordCheckContainer">
            <label htmlFor="passwordCheckInput" className="inputTitle">
              비밀번호 확인*
            </label>
            <input
              required
              type="password"
              id="passwordCheckInput"
              onBlur={handleOnBlurPasswordCheck}
              placeholder="비밀번호를 한번 더 입력하세요"
            />
            <div className="helperTextContainer">
              <div className="helperText passwordCheckText">
                {!passwordCheck
                  ? "* 비밀번호를 한번 더 입력해주세요."
                  : passwordNotSame
                  ? "* 비밀번호가 다릅니다."
                  : null}
              </div>
            </div>
          </div>
          <div className="nicknameContainer">
            <label htmlFor="nicknameInput" className="inputTitle">
              닉네임*
            </label>
            <input
              type="text"
              id="nicknameSignUpInput"
              maxLength="10"
              required
              onBlur={handleOnBlurNickname}
              placeholder="닉네임을 입력하세요"
            />
            <div className="helperTextContainer">
              <div className="helperText nicknameText">
                {!nickname
                  ? "* 닉네임을 입력해주세요."
                  : nicknameSpace
                  ? "* 띄어쓰기를 없애주세요"
                  : nicknameDuplicate
                  ? "* 중복된 닉네임입니다."
                  : null}
              </div>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={hanleOnClickSignUp}
          className="signUpButton"
        >
          회원가입
        </button>
      </form>
      <Link to="/" className="goLoginButton">
        로그인하러 가기
      </Link>
    </div>
  );
}
