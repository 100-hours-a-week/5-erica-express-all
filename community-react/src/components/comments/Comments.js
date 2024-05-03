import { useEffect, useState } from "react";
import { backHost } from "../../static";
import { DeleteCommentModal } from "../modals/Modals";
import { disableScroll } from "../../utils/scroll.js";
import AddComment from "./AddComment.js";

export default function Comments({ postId }) {
  const [result, setResult] = useState([]);
  const [isAdd, setIsAdd] = useState(true);
  const [updateTarget, setUpdateTarget] = useState();

  const id = Number(postId);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${backHost}/api/posts/${id}/comments`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "ngrok-skip-browser-warning": "69420",
        },
        credentials: "include",
      });

      const responseData = await response.json();

      switch (responseData.status) {
        case 200:
          setResult(responseData.data);
          break;
        default:
          return;
      }
    };

    fetchData();
    console.log("Comments.js");
  }, [id, isAdd]);

  return (
    <div className="commentContainer">
      <AddComment
        postId={postId}
        setIsAdd={setIsAdd}
        isAdd={isAdd}
        updateTarget={updateTarget}
      />
      <div className="commentList">
        {result.map((comment) => (
          <Comment
            setUpdateTarget={setUpdateTarget}
            key={comment.commentId}
            setIsAdd={setIsAdd}
            postId={id}
            data={comment}
          />
        ))}
      </div>
    </div>
  );
}

function Comment({ data, postId, setIsAdd, setUpdateTarget }) {
  const [isCommentDelete, setIsCommentDelete] = useState(false);

  async function handleOnClickDelete() {
    const checkData = await fetch(
      `${backHost}/api/posts/${postId}/comments/checkOwner`,
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "ngrok-skip-browser-warning": "69420",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ commentId: data.commentId }),
      }
    );

    const checkResponseData = await checkData.json();

    if (checkResponseData.status === 403) {
      alert("본인이 작성한 댓글이 아닙니다.");
      return;
    }
    disableScroll();
    setIsCommentDelete(true);
  }

  async function handleOnClickUpdate() {
    const checkData = await fetch(
      `${backHost}/api/posts/${postId}/comments/checkOwner`,
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "ngrok-skip-browser-warning": "69420",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ commentId: data.commentId }),
      }
    );

    const checkResponseData = await checkData.json();

    if (checkResponseData.status === 403) {
      alert("본인이 작성한 댓글이 아닙니다.");
      return;
    }

    setUpdateTarget({ commentId: data.commentId, comment: data.comment });
    setIsAdd(false);
  }

  return (
    <>
      <div className="comment">
        <div className="commentHeader">
          <div className="commentWriter">
            <input type="hidden" id="commentId" value={data.commentId} />
            <img
              src={data.profile_image}
              alt="profile"
              className="commentWriterImage"
            ></img>
            <div className="commentWriterName">{data.nickname}</div>
            <div className="commentWriterDate">{data.created_at}</div>
          </div>
          <div className="commentButton">
            <button onClick={handleOnClickUpdate} className="commentUpdate">
              수정
            </button>
            <button onClick={handleOnClickDelete} className="commentDelete">
              삭제
            </button>
          </div>
        </div>
        <div className="commentBody">{data.comment}</div>
      </div>
      <DeleteCommentModal
        postId={postId}
        commentId={data.commentId}
        isCommentDelete={isCommentDelete}
        setIsCommentDelete={setIsCommentDelete}
      />
    </>
  );
}
