import { backHost } from "../static";
import BackButton from "./BackButton";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function UserProfile() {
  const [profileImage, setProfileImage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${backHost}/api/users/user`, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "ngrok-skip-browser-warning": "69420",
          },
          credentials: "include",
        });
        const responseData = await response.json();
        if (responseData.status === 401) {
          alert("로그인 하십시오");
          navigate("/");
          return;
        }
        setProfileImage(responseData.data.profile_image);
      } catch (error) {
        console.log(error);
        return;
      }
    };
    fetchData();
  }, [navigate]);

  async function handleOnClickLogOut() {
    const response = await fetch(`${backHost}/api/users/logOut`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "ngrok-skip-browser-warning": "69420",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      method: "DELETE",
      credentials: "include",
    });

    const responseData = await response.json();

    if (responseData.status !== 200) {
      alert("로그아웃 실패. 다시 시도하세요.");
      return;
    }

    alert("로그아웃 됐습니다.");
    navigate("/");
  }

  return (
    <div className="userSetting">
      {profileImage ? (
        <img alt="profile" className="profileImage" src={profileImage} />
      ) : (
        <div
          className="profileImage"
          style={{ backgroundColor: "#f4f5f7" }}
        ></div>
      )}
      <div className="settingList">
        <Link to="/user/update" className="profileUpdate setting">
          회원정보수정
        </Link>
        <Link to="/user/password" className="passwordUpdate setting">
          비밀번호수정
        </Link>
        <button onClick={handleOnClickLogOut} className="logOut setting">
          로그아웃
        </button>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [showProfile, setShowProfile] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname !== "/" && pathname !== "/signUp") {
      setShowProfile(true);
    } else {
      setShowProfile(false);
    }

    if (pathname === "/signUp" || pathname.includes("/posts")) {
      setShowBackButton(true);
    } else {
      setShowBackButton(false);
    }
  }, [pathname]);

  return (
    <section className="navbar">
      <div className="navbarContainer">
        {showBackButton ? (
          <BackButton />
        ) : (
          <div style={{ width: "36px", height: "1px" }}></div>
        )}
        <Link
          className="navbarTitle"
          to={pathname === "/" || pathname === "/signUp" ? "" : "/posts"}
        >
          아무 말 대잔치
        </Link>
        {showProfile ? (
          <UserProfile />
        ) : (
          <div style={{ width: "36px", height: "1px" }}></div>
        )}
      </div>
    </section>
  );
}
