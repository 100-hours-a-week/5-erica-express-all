const logInButton = document.querySelector(".logInButton");
const helperText = document.querySelector(".helperText");
const loginForm = document.querySelector(".logInContent");

logInButton.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const data = { email, password };
  const jsonData = JSON.stringify(data);

  const response = await fetch("http://localhost:8000/api/users/login", {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    method: "POST",
    body: jsonData,
  });

  const responseData = await response.json();

  //응답 상태에 따른 분기
  switch (responseData.status) {
    case 200:
      logInButton.style.backgroundColor = "#7f6aee";
      sessionStorage.setItem("userId", responseData.data.userId);
      helperText.innerHTML = "";
      setTimeout(() => {
        location.href = "/board/index.html";
      }, 3000);
      return;
    case 400:
      helperText.innerHTML = "이메일을 입력해주세요.";
      helperText.style.display = "block";
      return;
    case 401:
      helperText.style.display = "block";
      return;
    default:
      alert("로그인 실패");
      return;
  }
});
