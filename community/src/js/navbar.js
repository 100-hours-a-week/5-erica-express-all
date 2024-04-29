const logoutButton = document.querySelector(".logOut");
const backButton = document.querySelector(".beforeBtn");

logoutButton?.addEventListener("click", async () => {
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
  location.replace("/");
});

backButton?.addEventListener("click", () => {
  history.back();
});

const profileImage = document.querySelector(".profileImage");
const userId = document.cookie;

(async () => {
  const currentUrl = location.pathname;
  console.log(currentUrl);

  if (
    currentUrl === "/" ||
    currentUrl === "/index.html" ||
    currentUrl === "/signUp"
  ) {
    return;
  }

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
    location.href = "/";
  }

  if (!profileImage) {
    return;
  }

  profileImage.src = responseData?.data.profile_image;
})();
