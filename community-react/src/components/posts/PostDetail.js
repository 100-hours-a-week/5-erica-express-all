import { useParams } from "react-router-dom";
import Comments from "../comments/Comments";
import { backHost } from "../../static";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { viewToK, commentToK } from "../../utils/numberToK";
import "../../styles/PostDetail.css";
import { DeletePostModal } from "../modals/Modals";
import { disableScroll } from "../../utils/scroll.js";

export default function PostDetail() {
  const postId = Number(useParams().id);
  const [result, setResult] = useState([]);
  const navigate = useNavigate();
  const [isPostDelete, setIsPostDelete] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${backHost}/api/posts/${postId}`, {
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
          return;
        case 401:
          navigate("/");
          return;
        default:
          alert("게시물이 없습니다");
          navigate("/posts");
          return;
      }
    };
    console.log("PostDetail.js");
    fetchData();
  }, [postId, navigate]);

  async function handleOnClickUpdate() {
    const checkData = await fetch(`${backHost}/api/posts/checkOwner`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "ngrok-skip-browser-warning": "69420",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      method: "POST",
      body: JSON.stringify({ postId }),
    });

    const checkResponseData = await checkData.json();

    if (checkResponseData.status === 403) {
      alert("본인이 작성한 게시물이 아닙니다.");
      return;
    }
    navigate(`/posts/${postId}/update`);
  }

  async function handleOnClickDelete() {
    const checkData = await fetch(`${backHost}/api/posts/checkOwner`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "ngrok-skip-browser-warning": "69420",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      method: "POST",
      body: JSON.stringify({ postId }),
    });

    const checkResponseData = await checkData.json();

    if (checkResponseData.status === 403) {
      alert("본인이 작성한 게시물이 아닙니다.");
      return;
    }
    disableScroll();
    setIsPostDelete(true);
  }

  return (
    <>
      <section className="main">
        <div className="detailBoard">
          <div className="boardHeader">
            <p className="boardTitle">{result.title}</p>
            <div className="boardHeaderBottom">
              <div className="writer">
                <img
                  className="writerImage"
                  alt="profile"
                  src={result.userImage}
                  style={{ width: "30px", height: "30px" }}
                />
                <p className="postWriterName">{result.nickname}</p>
                <div className="postWriteDate">{result.created_at}</div>
              </div>
              <div className="boardButton">
                <button onClick={handleOnClickUpdate} className="updateBoard">
                  수정
                </button>
                <button onClick={handleOnClickDelete} className="deleteBoard">
                  삭제
                </button>
              </div>
            </div>
          </div>
          <div className="boardBody">
            {result.postImage ? (
              <div className="boardImageContainer">
                <img
                  className="boardImage"
                  src={result.postImage}
                  alt="board"
                />
              </div>
            ) : null}
            <div className="boardDetailContent">{result.content}</div>
          </div>
          <div className="boardAction">
            <div className="readCount">
              <strong className="readNumber">{viewToK(result.view)}</strong>
              <div>조회수</div>
            </div>
            <div className="commentCount">
              <strong className="commentNumber">
                {commentToK(result.comment_count)}
              </strong>
              <div>댓글수</div>
            </div>
          </div>
        </div>
        <hr />
        <Comments postId={postId} />
      </section>
      <DeletePostModal
        postId={postId}
        isPostDelete={isPostDelete}
        setIsPostDelete={setIsPostDelete}
      />
    </>
  );
}

// function PostSkeleton() {
//   return (
//     <div className"=""boardSkeleton">
//       <div className"=""boardHeader">
//         <p className"=""boardTitle"></p>
//         <div className"=""boardHeaderBottom">
//           <div className"=""writer">
//             <div className"=""writerImage"></div>
//             <p className"=""postWriterName"></p>
//             <div className"=""postWriteDate"></div>
//           </div>
//         </div>
//       </div>
//       <div className"=""boardBody">
//         <div className"=""boardImageContainer">
//           <div className"=""boardImage"></div>
//         </div>
//         <div className"=""boardContent"></div>
//       </div>
//     </div>
//   );
// }
