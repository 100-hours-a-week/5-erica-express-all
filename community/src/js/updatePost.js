const urlPostId = Number(window.location.search.split("=")[1]);
const title = document.getElementById("boardTitleInput");
const content = document.getElementById("boardContentInput");
const postImage = document.getElementById("boardInputImage");

const updateButton = document.querySelector(".updateButton");
const backButton = document.querySelector(".beforeBtn");

const reader = new FileReader();

const onInputHandler = () => {
  const title = document.getElementById("boardTitleInput").value.trim();
  const content = document.getElementById("boardContentInput").value.trim();

  if (title && content) {
    updateButton.style.backgroundColor = "#7f6aee";
    document.querySelector(".helperText").innerHTML = "";
  } else {
    updateButton.style.backgroundColor = "";
    document.querySelector(".helperText").innerHTML =
      "* 제목, 내용을 모두 작성해주세요";
  }
  return;
};

title.addEventListener("input", onInputHandler);
content.addEventListener("input", onInputHandler);

const read = (post) => {
  title.value = post.title;
  content.innerHTML = post.content;
  postImage.src = post.postImage;
};

(async () => {
  const postResponse = await fetch(`${backHost}/api/posts/${urlPostId}`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "ngrok-skip-browser-warning": "69420",
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
  });
  const postResponseData = await postResponse.json();

  switch (postResponseData.status) {
    case 200:
      read(postResponseData.data);
      break;
    case 401:
      alert("로그인 하십시오");
      location.href = "/";
      return;
    default:
      alert("해당 게시물이 없습니다");
      location.href = "/board";
      return;
  }

  updateButton.addEventListener("click", async () => {
    if (!title.value || !content.value) {
      document.querySelector(".helperText").style.display = "block";
      return;
    }
    const response = await fetch(`${backHost}/api/posts/${urlPostId}`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "ngrok-skip-browser-warning": "69420",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      method: "PATCH",
      body: JSON.stringify({
        title: title.value,
        content: content.value,
        postImageInput: postImage.src,
      }),
    });

    const responseData = await response.json();
    console.log(responseData);

    switch (responseData.status) {
      case 200:
        alert("게시글 수정이 완성됐습니다.");
        location.href = `/public/board/post.html?postId=${urlPostId}`;
        return;
      default:
        alert(
          "수정 실패, 이미지가 너무 크거나, 다른 오류로 인해 실패했습니다."
        );
        return;
    }
  });
})();

backButton.addEventListener("click", () => {
  if (urlPostId) {
    location.replace = `/board/[id]/post.html?postId=${urlPostId}`;
  }
});

postImage.addEventListener("change", (event) => {
  reader.onload = (data) => {
    postImage.src = data.target.result;
  };
  reader.readAsDataURL(event.target.files[0]);
});
