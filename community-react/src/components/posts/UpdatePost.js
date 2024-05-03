import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../../styles/UpdatePost.css";
import { backHost } from "../../static";

export default function UpdatePost() {
  const postId = Number(useParams().id);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postImage, setPostImage] = useState();
  const navigate = useNavigate();
  const reader = new FileReader();

  useEffect(() => {
    const fetchData = async () => {
      try {
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
          navigate(`/posts/${postId}`);
          alert("본인이 작성한 게시물이 아닙니다.");
          return;
        }

        const postResponse = await fetch(`${backHost}/api/posts/${postId}`, {
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
            setTitle(postResponseData.data.title);
            setContent(postResponseData.data.content);
            setPostImage(postResponseData.data.postImage ?? "");
            break;
          case 401:
            navigate("/");
            return;
          default:
            alert("해당 게시물이 없습니다");
            navigate("/board");
            return;
        }
      } catch (error) {
        console.log(error);
        return;
      }
    };

    fetchData();
  }, [navigate, postId]);

  function handleOnChangePostImage(event) {
    reader.onload = (data) => {
      setPostImage(data.target.result);
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  function handleOnChangeTitle(event) {
    setTitle(event.target.value);
  }

  function handleOnChangeContent(event) {
    setContent(event.target.value);
  }

  async function handleOnClickUpdatePost() {
    const response = await fetch(`${backHost}/api/posts/${postId}`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "ngrok-skip-browser-warning": "69420",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      method: "PATCH",
      body: JSON.stringify({
        title: title,
        content: content,
        postImageInput: postImage,
      }),
    });

    const responseData = await response.json();

    switch (responseData.status) {
      case 200:
        alert("게시글 수정이 완성됐습니다.");
        navigate(`/posts/${postId}`);
        return;
      default:
        alert(
          "수정 실패, 이미지가 너무 크거나, 다른 오류로 인해 실패했습니다."
        );
        return;
    }
  }

  return (
    <section className="main updatePost">
      <p className="pageTitle">게시글 수정</p>
      <form className="boardContainer">
        <div className="boardTitle">
          <label htmlFor="boardTitleInput" className="inputTitle">
            제목*
          </label>
          <input
            type="text"
            maxLength="26"
            value={title}
            onChange={handleOnChangeTitle}
            id="boardTitleInput"
          />
        </div>
        <hr />
        <div className="boardContent">
          <label htmlFor="boardContentInput" className="inputTitle">
            내용*
          </label>
          <textarea
            type="text"
            maxLength="200"
            onChange={handleOnChangeContent}
            rows="10"
            value={content}
            id="boardContentInput"
          ></textarea>
        </div>
        <hr />
        <div className="helperTextContainer">
          <div className="helperText">
            {!title || !content ? "* 제목, 내용을 모두 작성해주세요." : ""}
          </div>
        </div>
        <div className="updateBoardImage">
          <label htmlFor="boardInputImage" className="inputTitle">
            이미지
          </label>
          <input
            type="file"
            src={postImage}
            onChange={handleOnChangePostImage}
            id="boardInputImage"
            accept="image/*"
          />
        </div>
        <button
          type="button"
          style={
            title && content
              ? { backgroundColor: "#7f6aee" }
              : { backgroundColor: "" }
          }
          disabled={!title || !content}
          onClick={handleOnClickUpdatePost}
          className="updateButton"
        >
          완료
        </button>
      </form>
    </section>
  );
}
