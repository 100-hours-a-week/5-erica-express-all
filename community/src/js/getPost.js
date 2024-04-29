import { enableScroll, disableScroll, getScrollPosition } from "./scroll.js";

const userId = Number(sessionStorage.getItem("userId"));
const boardModalContainer = document.querySelector(".boardModalContainer");
const skeleton = document.querySelector(".boardSkeleton");
const board = document.querySelector(".board");

const urlPostId = Number(window.location.search.split("=")[1]);

const readPost = (post) => {
  skeleton.style.display = "none";
  board.style.display = "block";

  //조회수 댓글
  let postView = "";
  if (post.view >= 1000000) {
    postView = "100K";
  } else if (post.view >= 10000) {
    postView = "10K";
  } else if (post.view >= 1000) {
    postView = "1K";
  } else {
    postView = post.view;
  }

  let postComment = "";
  if (post.comment_count >= 1000) {
    postComment = "1K";
  } else if (post.comment_count >= 10000) {
    postComment = "10K";
  } else if (post.comment_count >= 1000000) {
    postComment = "100K";
  } else {
    postComment = post.comment_count;
  }

  const boardTitle = board.querySelector(".boardTitle");
  boardTitle.innerHTML = post.title;

  const writerImage = board.querySelector(".writerImage");
  writerImage.src = post.userImage;

  const postWriterName = board.querySelector(".postWriterName");
  postWriterName.innerHTML = post.nickname;

  const postWriteDate = board.querySelector(".postWriteDate");
  postWriteDate.innerHTML = post.created_at;

  const boardContent = board.querySelector(".boardContent");
  boardContent.innerHTML = post.content;

  const readNumber = board.querySelector(".readNumber");
  readNumber.innerHTML = postView;

  const commentNumber = board.querySelector(".commentNumber");
  commentNumber.innerHTML = postComment;

  if (post.postImage) {
    board.querySelector(".boardImageContainer").innerHTML = `
      <img class="boardImage" src=${post.postImage} alt="board image" />
    `;
  }
  const deletePostButton = board.querySelector(".deleteBoard");
  const updatePostButton = board.querySelector(".updateBoard");

  updatePostButton.addEventListener("click", async () => {
    const checkData = await fetch(`${backHost}/api/posts/checkOwner`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "ngrok-skip-browser-warning": "69420",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      method: "POST",
      body: JSON.stringify({ postId: post.postId }),
    });

    const checkResponseData = await checkData.json();

    if (checkResponseData.status === 403) {
      alert("본인이 작성한 게시물이 아닙니다.");
      return;
    }

    location.href = `/public/board/updatePost.html?postId=${post.postId}`;
  });

  deletePostButton.addEventListener("click", async () => {
    const checkData = await fetch(`${backHost}/api/posts/checkOwner`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "ngrok-skip-browser-warning": "69420",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      method: "POST",
      body: JSON.stringify({ postId: post.postId }),
    });

    const checkResponseData = await checkData.json();

    if (checkResponseData.status === 403) {
      alert("본인이 작성한 게시물이 아닙니다.");
      return;
    }

    const modalPositionTop = getScrollPosition().scrollPosition;
    boardModalContainer.style.display = "flex";
    boardModalContainer.style.top = `${modalPositionTop}px`;
    disableScroll();
  });

  document
    .querySelector(".boardDeleteModal .submitButton")
    .addEventListener("click", async () => {
      const deleteResponse = await fetch(`${backHost}/api/posts/${urlPostId}`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "ngrok-skip-browser-warning": "69420",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        method: "DELETE",
      });

      const responseData = await deleteResponse.json();

      switch (responseData.status) {
        case 200:
          alert("게시물이 삭제되었습니다.");
          boardModalContainer.style.display = "none";
          enableScroll();
          location.replace("/board");
          return;
        default:
          alert("게시물 삭제 실패");
          boardModalContainer.style.display = "none";
          enableScroll();
          return;
      }
    });

  //게시글 수정 - 취소
  document
    .querySelector(".boardDeleteModal .cancelButton")
    .addEventListener("click", () => {
      boardModalContainer.style.display = "none";
      enableScroll();
    });
};

(async () => {
  const response = await fetch(`${backHost}/api/posts/${urlPostId}`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "ngrok-skip-browser-warning": "69420",
    },
    credentials: "include",
  });
  const responseData = await response.json();

  switch (responseData.status) {
    case 200:
      readPost(responseData.data);
      return;
    case 401:
      alert("로그인 하십시오");
      location.replace("/");
      return;
    default:
      alert("게시물이 없습니다");
      location.replace("/board");
      return;
  }
})();
