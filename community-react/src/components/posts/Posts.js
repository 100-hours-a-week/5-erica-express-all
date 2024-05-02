import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { backHost } from "../../static";
import "../../styles/Posts.css";

function MiniPost({ data }) {
  const {
    title,
    view,
    comment_count,
    postId,
    like,
    created_at,
    userImage,
    nickname,
  } = data;

  const postTitle = title.slice(0, 26);

  let postView = "";
  if (view >= 1000000) {
    postView = "100K";
  } else if (view >= 10000) {
    postView = "10K";
  } else if (view >= 1000) {
    postView = "1K";
  } else {
    postView = view;
  }

  let postCommentCount = "";
  if (comment_count >= 1000) {
    postCommentCount = "1K";
  } else if (comment_count >= 10000) {
    postCommentCount = "10K";
  } else if (comment_count >= 1000000) {
    postCommentCount = "100K";
  } else {
    postCommentCount = comment_count;
  }

  return (
    <Link className="boardContainer" to={`/posts/${postId}`}>
      <div className="board">
        <h2 className="boardTitle">{postTitle}</h2>
        <div className="boardContent">
          <div className="action">
            <div className="comment">댓글 {postCommentCount}</div>
            <div className="like">좋아요 {like}</div>
            <div className="view">조회수 {postView}</div>
          </div>
          <div className="date">{created_at}</div>
        </div>
      </div>
      <hr />
      <div className="boardWriter">
        <img
          alt="profile imge"
          src={userImage}
          style={{ width: "30px", height: "30px" }}
          className="writerImage"
        />
        <p className="writerName">{nickname}</p>
      </div>
    </Link>
  );
}

export default function Posts() {
  const [result, setResult] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${backHost}/api/posts`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "ngrok-skip-browser-warning": "69420",
        },
        credentials: "include",
      });
      const responseData = await response.json();
      console.log(responseData);
      switch (responseData.status) {
        case 200:
          if (responseData.data.length === 0) {
            alert("게시물이 없습니다. 게시물을 작성하십시오");
            navigate("/posts/write");
          }
          setResult(responseData.data);
          return;
        case 401:
          alert("로그인 하십시오");
          navigate("/");
          return;
        default:
          alert("서버 오류");
          return;
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <section className="main">
      <span className="title">
        <p>
          안녕하세요, <br />
          아무 말 대잔치 <strong>게시판</strong> 입니다.
        </p>
      </span>
      <div className="writeContainer">
        <Link className="writeBtn" to="/posts/write">
          게시글 작성
        </Link>
      </div>
      <div className="wrapper">
        {result.map((post) => (
          <MiniPost key={post.postId} data={post} />
        ))}
      </div>
    </section>
  );
}
