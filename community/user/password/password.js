const updateButton = document.querySelector(".updateButton");
const form = document.querySelector(".wrapper");
const userId = sessionStorage.getItem("userId");

updateButton.addEventListener("click", async () => {
  const password = document.getElementById("passwordInput").value;
  const passwordCheck = document.getElementById("passwordCheckInput").value;
  const passwordText = document.querySelector(".passwordText");
  const passwordCheckText = document.querySelector(".passwordCheckText");

  if (!password) {
    passwordText.innerHTML = "* 비밀반호를 입력해주세요. (8자 이상 20자 이하)";
    return;
  }
  const passwordRegExp =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,20}$/;

  if (!passwordRegExp.test(password)) {
    passwordText.innerHTML =
      "* 비밀번호는 대문자, 소문자, 숫자, 특수문자가 들어가야 합니다 (8자 이상 20자 이하)";
    return;
  }

  if (!passwordCheck) {
    passwordCheckText.innerHTML = "* 비밀번호 확인과 다릅니다.";
    return;
  }

  if (password !== passwordCheck) {
    passwordText.innerHTML = "* 비밀번호 확인과 다릅니다.";
    passwordCheckText.inenrHTML = "* 비밀번호와 다릅니다.";
    return;
  }

  const updateResponse = await fetch(
    `http://localhost:8000/api/users/${userId}/password`,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      method: "PATCH",
      //TODO: postimage url 다시 생성
      body: JSON.stringify({
        password,
      }),
    }
  );

  switch (updateResponse.status) {
    case 201:
      document.querySelector(".helperText").style.display = "none";
      updateButton.style.backgroundColor = "#7f6aee";
      setTimeout(() => {
        alert("비밀번호가 수정되었습니다.");
        location.href = "/";
      }, 3000);
      return;
    default:
      alert("비밀번호 수정실패");
      return;
  }
});
