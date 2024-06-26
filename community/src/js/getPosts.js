import { useIntersectionObserver } from "../hooks/useIntersectionObserver.js";

let cursor = 0;
let hasNextPage = false;
let fetchMoreInProgress = false;
const size = 10;

const createPosts = (post) => {
  let postTitle = post.title;
  if (post.title.length > 26) {
    postTitle = `${post.title.slice(0, 26)} ...`;
  }

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

  const boardContainer = document.createElement("a");
  boardContainer.className = "boardContainer";
  boardContainer.href = `/public/board/post.html?postId=${post.postId}`;
  boardContainer.innerHTML = `
    <div class="board">
      <h2 class="boardTitle">${postTitle}</h2>
      <div class="boardContent">
        <div class="action">
          <div class="comment">댓글 ${post.comment_count}</div>
          <div class="like">좋아요 ${post.like}</div>
          <div class="view">조회수 ${postView}</div>
        </div>
        <div class="date">${post.created_at}</div>
      </div>
    </div>
    <hr />
    <div class="boardWriter">
      <img
        alt="profile imge"
        src=${post.userImage}
        style="width: 30px; height: 30px"
        class="writerImage"
      />
      <p class="writerName">${post.nickname}</p>
    </div>`;

  document.querySelector(".wrapper").appendChild(boardContainer);
};

(async () => {
  const response = await fetch(`${backHost}/api/posts?cursor=${cursor}`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "ngrok-skip-browser-warning": "69420",
    },
    credentials: "include",
  });
  const responseData = await response.json();

  switch (responseData.status) {
    case 200:
      if (responseData.data.length === 0) {
        alert("게시물이 없습니다. 게시물을 작성하십시오");
        // location.replace("/board/write");
      }
      responseData.data.forEach((post) => {
        createPosts(post);
      });
      cursor += size;
      return;
    case 401:
      alert("로그인 하십시오");
      location.replace("/");
      return;
    default:
      alert("서버 오류");
      return;
  }
})();

const onIntersect = (entries, observer) => {
  console.log("onIntersect");
  console.log(cursor);
  entries.forEach(async (entry) => {
    if (entry.isIntersecting) {
      observer.unobserve(entry.target);
      if (hasNextPage && fetchMoreInProgress === false) {
        fetchMoreInProgress = true;
        const response = await fetch(`${backHost}/api/posts?cursor=${cursor}`, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "ngrok-skip-browser-warning": "69420",
          },
          credentials: "include",
        });
        const responseData = await response.json();
        if (responseData.status !== 200) {
          hasNextPage = false;
        }
        responseData.data.forEach((post) => {
          createPosts(post);
        });
        cursor += size;
        fetchMoreInProgress = false;
      }
    }
  });
};

useIntersectionObserver(onIntersect, document.querySelector(".target"), {
  rootMargin: `100px`,
});
