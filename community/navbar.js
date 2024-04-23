const logoutButton = document.querySelector(".logOut");

logoutButton?.addEventListener("click", () => {
  sessionStorage.removeItem("userId");
});

const profileImage = document.querySelector(".profileImage");

(async () => {
  const userId = sessionStorage.getItem("userId");
  const currentUrl = location.pathname;
  console.log(currentUrl);

  if (
    currentUrl === "/" ||
    currentUrl === "/index.html" ||
    currentUrl === "/signUp/"
  ) {
    return;
  }

  const response = await fetch(`http://localhost:8000/api/users/${userId}`);
  const responseData = await response.json();

  if (!responseData.data || responseData.data.length === 0) {
    location.replace = "/";
    return;
  }

  if (!profileImage) {
    return;
  }

  profileImage.src = responseData?.data.profile_image;
})();
