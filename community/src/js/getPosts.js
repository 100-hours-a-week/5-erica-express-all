const createPosts = (post) => {
  let postTitle = post.title;
  if (post.title.length > 26) {
    postTitle = `${post.title.slice(0, 26)} ...`;
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
          <div class="view">조회수 ${post.view}</div>
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
  const response = await fetch("http://localhost:8000/api/posts");
  const responseData = await response.json();

  switch (responseData.status) {
    case 200:
      responseData.data.forEach((post) => {
        createPosts(post);
      });
      return;
    default:
      alert("게시물이 없습니다");
      location.replace("/board/write");
  }
})();
