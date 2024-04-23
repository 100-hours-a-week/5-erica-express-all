const writeButton = document.querySelector(".submitBtn");
const userId = sessionStorage.getItem("userId");
const titleInput = document.getElementById("boardInputTitle");
const contentInput = document.getElementById("boardInputContent");
const postImageInput = document.getElementById("boardInputImage");
const reader = new FileReader();

const onInputHandler = () => {
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (title && content) {
    writeButton.style.backgroundColor = "#7f6aee";
  } else {
    writeButton.style.backgroundColor = "";
  }
};

titleInput.addEventListener("input", onInputHandler);
contentInput.addEventListener("input", onInputHandler);

writeButton.addEventListener("click", async () => {
  const title = titleInput.value;
  const content = contentInput.value;
  const boardImage = postImageInput.src;
  if (!title || !content) {
    document.querySelector(".helperText").style.display = "block";
    return;
  }

  const response = await fetch("http://localhost:8000/api/posts", {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      userId,
      title,
      content,
      postImage: boardImage,
    }),
  });

  const responseData = await response.json();

  switch (responseData.status) {
    case 201:
      alert("게시글 작성이 완성됐습니다.");
      location.href = `/board/[id]/index.html?postId=${responseData.data.postId}`;
      return;
    default:
      alert("작성 오류");
      return;
  }
});

postImageInput.addEventListener("change", (event) => {
  reader.onload = (data) => {
    postImageInput.src = data.target.result;
  };
  reader.readAsDataURL(event.target.files[0]);
});
