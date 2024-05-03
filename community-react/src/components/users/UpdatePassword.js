import "../../styles/UpdatePassword.css";
import { useState } from "react";
import { backHost } from "../../static";
import { useNavigate } from "react-router-dom";

export default function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [isAble, setIsAble] = useState(false);
  const navigate = useNavigate();

  function handleChangePassword(event) {
    setPassword(event.target.value);
  }

  function handleChangePasswordCheck(event) {
    setPasswordCheck(event.target.value);
  }

  async function handleClickUpdatePassword() {
    const updateResponse = await fetch(`${backHost}/api/users/user/password`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "ngrok-skip-browser-warning": "69420",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      method: "PATCH",
      //TODO: postimage url 다시 생성
      body: JSON.stringify({
        password,
      }),
    });

    switch (updateResponse.status) {
      case 201:
        document.querySelector(".helperText").style.display = "none";
        setIsAble(true);
        setTimeout(() => {
          alert("비밀번호가 수정되었습니다.");
          setIsAble(false);
          navigate("/");
        }, 3000);
        return;
      default:
        alert("비밀번호 수정실패");
        return;
    }
  }

  return (
    <section className="passwordMain">
      <p className="pageTitle">비밀번호 수정</p>
      <form className="passwordWrapper">
        <div className="password">
          <p className="inputTitle">비밀번호</p>
          <input
            type="password"
            id="passwordInput"
            maxLength="20"
            minLength="8"
            value={password}
            onChange={handleChangePassword}
            placeholder="비밀번호를 입력하세요"
          />
          <div className="helperTextContainer">
            <div className="helperText passwordText"></div>
          </div>
        </div>
        <div className="passwordCheck">
          <p className="inputTitle">비밀번호 확인</p>
          <input
            type="password"
            maxLength="20"
            minLength="8"
            value={passwordCheck}
            onChange={handleChangePasswordCheck}
            id="passwordCheckInput"
            placeholder="비밀번호를 한번 더 입력하세요"
          />
          <div className="helperTextContainer">
            <div className="helperText passwordCheckText"></div>
          </div>
        </div>
        <button
          type="button"
          style={
            isAble || (password && passwordCheck)
              ? { backgroundColor: "#7f6aee" }
              : null
          }
          onClick={handleClickUpdatePassword}
          className="updateButton"
        >
          완료
        </button>
      </form>
    </section>
  );
}
