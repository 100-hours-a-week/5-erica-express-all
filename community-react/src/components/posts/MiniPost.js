import { viewToK, commentToK } from "../../utils/numberToK";
import "../../styles/Posts.css";
import { Link } from "react-router-dom";

export default function MiniPost({ data }) {
  const postTitle = data.title.slice(0, 26);

  const postView = viewToK(data.view);

  const postCommentCount = commentToK(data.comment_count);

  return (
    <Link className="miniBoardContainer" to={`/posts/${data.postId}`}>
      <div className="miniBoard">
        <h2 className="miniBoardTitle">{postTitle}</h2>
        <div className="miniBoardContent">
          <div className="action">
            <div className="miniComment">댓글 {postCommentCount}</div>
            <div className="miniLike">좋아요 {data.like}</div>
            <div className="miniView">조회수 {postView}</div>
          </div>
          <div className="date">{data.created_at}</div>
        </div>
      </div>
      <hr />
      <div className="miniBoardWriter">
        <img
          alt="profile"
          src={data.userImage}
          style={{ width: "30px", height: "30px" }}
          className="miniWriterImage"
        />
        <p className="miniWriterName">{data.nickname}</p>
      </div>
    </Link>
  );
}
