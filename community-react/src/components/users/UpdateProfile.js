import { DeleteUserModal } from "../modals/Modals";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { backHost } from "../../static";
import { disableScroll } from "../../utils/scroll";

import "../../styles/UpdateProfile.css";

export default function UpdateProfile() {
  const [profile, setProfile] = useState();
  const [nickname, setNickname] = useState();
  const [email, setEmail] = useState();
  const navigate = useNavigate();
  const [isDelete, setIsDelete] = useState(false);
  const [isNicknameDuplicate, setIsNicknameDuplicate] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const reader = new FileReader();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${backHost}/api/users/user`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "ngrok-skip-browser-warning": "69420",
        },
        credentials: "include",
      });
      const userData = await response.json();

      switch (userData.status) {
        case 200:
          setEmail(userData.data.email);
          setNickname(userData.data.nickname);
          setProfile(userData.data.profile_image);
          return;
        default:
          alert("등록되지 않는 유저입니다.");
          navigate("/posts");
          return;
      }
    };

    fetchData();
  }, [navigate]);

  function handleOnChangeNickname(event) {
    setNickname(event.target.value);
  }

  async function handleOnClickUpdateButton() {
    //닉네임 중복 검사 in 서버
    const response = await fetch(`${backHost}/api/users/nickname/${nickname}`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      method: "POST",
    });

    const responseData = await response.json();

    switch (responseData.status) {
      case 200:
        break;
      default:
        setIsNicknameDuplicate(true);
        return;
    }

    const updateResponse = await fetch(`${backHost}/api/users/user/profile`, {
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
        nickname,
        profile_image: profile,
      }),
    });

    const updateData = await updateResponse.json();

    switch (updateData.status) {
      case 201:
        setIsNicknameDuplicate(false);
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          window.location.href = "/posts";
        }, 2000);
        return;
      default:
        alert("수정 실패");
        return;
    }
  }

  function handleOnChangeProfileImage(event) {
    reader.onload = (data) => {
      setProfile(data.target.result);
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  function handleOnClickUserDelete() {
    disableScroll();
    setIsDelete(true);
  }

  return (
    <>
      <section className="updateMain">
        <p className="pageTitle">회원정보 수정</p>
        <form className="wrapper">
          <div className="profileTitle">
            <p className="inputTitle">프로필 사진*</p>
            <div className="imageContainer">
              {profile ? (
                <img className="imageShow" alt="profile" src={profile} />
              ) : (
                <div
                  className="imageShow"
                  style={{ backgroundColor: "#f4f5f7" }}
                ></div>
              )}
              <div className="imageUpdate">
                <label htmlFor="imageInput" className="imageUpdateButton">
                  변경
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
          <div className="profileEmail">
            <label htmlFor="emailInput" className="inputTitle">
              이메일
            </label>
            <div id="updateEmailInput">{email ?? "불러오는 중"}</div>
          </div>
          <div className="profileNickname">
            <label htmlFor="nicknameInput" className="inputTitle">
              닉네임
            </label>
            <input
              type="text"
              id="nicknameInput"
              maxLength="10"
              value={nickname ?? "불러오는 중"}
              onChange={handleOnChangeNickname}
            />
            <div className="helperTextContainer">
              <div className="helperText">
                {isNicknameDuplicate ? "* 중복된 닉네임입니다." : null}
              </div>
            </div>
          </div>
        </form>
        <div className="profilebutton">
          <button
            type="button"
            className="updateButton"
            onClick={handleOnClickUpdateButton}
          >
            수정하기
          </button>
        </div>
        <div className="profilebutton">
          <button onClick={handleOnClickUserDelete} className="deleteButton">
            회원 탈퇴
          </button>
        </div>
        {showToast ? <div className="updateMessage">수정완료</div> : null}
      </section>
      <DeleteUserModal isDelete={isDelete} setIsDelete={setIsDelete} />
    </>
  );
}
