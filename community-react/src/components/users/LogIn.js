import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { backHost } from "../../static";
import "../../styles/LogIn.css";

export default function LogIn() {
  const email = useRef("");
  const password = useRef("");
  const navigate = useNavigate();

  const [emailNotValid, setEmailNotValid] = useState(false);
  const [logInSuccess, setLogInSuccess] = useState(false);

  function handleOnChangeEmail(event) {
    email.current = event.target.value;
    checkEmailValidation(event.target.value);
  }

  function handleOnChangePassword(event) {
    password.current = event.target.value;
  }

  async function handleOnClickLogIn() {
    const isEmailValid = checkEmailValidation(email.current);

    if (!isEmailValid) {
      return;
    }

    const response = await fetch(`${backHost}/api/users/login`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Accept: "application/json",
        "ngrok-skip-browser-warning": "69420",
      },
      credentials: "include",
      method: "POST",
      body: JSON.stringify({
        email: email.current,
        password: password.current,
      }),
    });

    const responseData = await response.json();

    //응답 상태에 따른 분기
    switch (responseData.status) {
      case 200:
        setLogInSuccess(true);
        setTimeout(() => {
          navigate("/posts");
        }, 3000);
        return;
      default:
        setLogInSuccess(false);
        alert("로그인 실패");
        return;
    }
  }

  function checkEmailValidation(email) {
    const emailForm = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailForm.test(email) || email.length < 5) {
      setEmailNotValid(true);
      return false;
    }
    setEmailNotValid(false);
    return true;
  }

  return (
    <section className="logIn">
      <div className="title">로그인</div>
      <form className="logInContent">
        <div className="emailLogInContainer">
          <label htmlFor="email" className="logInTitle">
            이메일
          </label>
          <input
            type="email"
            minLength="8"
            id="email"
            required
            placeholder="이메일을 입력하세요"
            onChange={handleOnChangeEmail}
          />
        </div>
        <div className="passwordLogInContainer">
          <label htmlFor="password" className="logInTitle">
            비밀번호
          </label>
          <input
            type="password"
            id="password"
            required
            onChange={handleOnChangePassword}
            placeholder="비밀번호를 입력하세요"
          />
          <div className="helperTextContainer">
            <div className="helperText">
              {emailNotValid
                ? "* 올바른 이메일 주소 형식을 입력해주세요. \n (예: example@example.com)"
                : null}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={handleOnClickLogIn}
          className="logInButton"
          style={
            logInSuccess
              ? { backgroundColor: "#7f6aee" }
              : { backgroundColor: "#aca0eb", disabled: true }
          }
        >
          로그인
        </button>
      </form>
      <Link to="/signUp" className="goSignUpButton">
        회원가입
      </Link>
    </section>
  );
}
