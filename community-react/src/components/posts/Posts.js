import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { backHost } from "../../static";
import MiniPost from "./MiniPost";
import "../../styles/Posts.css";

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
      switch (responseData.status) {
        case 200:
          if (responseData.data.length === 0) {
            alert("게시물이 없습니다. 게시물을 작성하십시오");
            navigate("/posts/write");
          }
          setResult(responseData.data);
          return;
        case 401:
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
      <span className="postsTitle">
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
