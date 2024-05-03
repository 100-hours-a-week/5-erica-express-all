import "../../styles/PostModal.css";
import { backHost } from "../../static.js";
import { useNavigate } from "react-router-dom";
import { enableScroll } from "../../utils/scroll.js";
import { useState, useEffect } from "react";
import { getScrollPosition } from "../../utils/scroll.js";

export function DeletePostModal({ postId, setIsPostDelete, isPostDelete }) {
  const navigate = useNavigate();
  const [position, setPosition] = useState("");

  useEffect(() => {
    setPosition(getScrollPosition().scrollPosition);
  }, [isPostDelete]);

  async function hadleOnClickDeleteConfirm() {
    const deleteResponse = await fetch(`${backHost}/api/posts/${postId}`, {
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
        navigate("/posts");
        break;
      default:
        alert("게시물 삭제 실패");
        break;
    }
    setPosition(getScrollPosition.scrollPosition);
    setIsPostDelete(false);
    enableScroll();
  }

  function handleOnClickDeleteCancel() {
    enableScroll();
    setIsPostDelete(false);
  }

  return isPostDelete ? (
    <div
      style={{ top: `${position}px` }}
      className="boardModalContainer modalContainer"
    >
      <div className="deem"></div>
      <div className="boardDeleteModal modal">
        <p className="title">게시글을 삭제하시겠습니까?</p>
        <div className="description">삭제한 내용은 복구 할 수 없습니다.</div>
        <div className="buttonContainer">
          <button
            onClick={handleOnClickDeleteCancel}
            className="cancelButton button"
          >
            취소
          </button>
          <button
            onClick={hadleOnClickDeleteConfirm}
            className="submitButton button"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  ) : null;
}

export function DeleteCommentModal({
  postId,
  commentId,
  isCommentDelete,
  setIsCommentDelete,
}) {
  const [position, setPosition] = useState("");

  useEffect(() => {
    setPosition(getScrollPosition().scrollPosition);
  }, [isCommentDelete]);

  async function hadleOnClickDeleteConfirm() {
    const response = await fetch(
      `${backHost}/api/posts/${postId}/comments/${commentId}`,
      {
        credentials: "include",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "ngrok-skip-browser-warning": "69420",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        method: "DELETE",
      }
    );
    const responseData = await response.json();

    switch (responseData?.status) {
      case 200:
        alert("댓글이 삭제되었습니다.");
        window.location.reload();
        break;
      default:
        alert("삭제 실패");
        break;
    }

    enableScroll();
    setIsCommentDelete(false);
    enableScroll();
  }

  function handleOnClickDeleteCancel() {
    enableScroll();
    setIsCommentDelete(false);
  }

  return isCommentDelete ? (
    <div
      style={{ top: `${position}px` }}
      className="commentModalContainer modalContainer"
    >
      <div className="deem"></div>
      <div className="commentDeleteModal modal">
        <p className="title">댓글을 삭제하시겠습니까?</p>
        <div className="description">삭제한 내용은 복구 할 수 없습니다.</div>
        <div className="buttonContainer">
          <button
            onClick={handleOnClickDeleteCancel}
            className="cancelButton button"
          >
            취소
          </button>
          <button
            onClick={hadleOnClickDeleteConfirm}
            className="submitButton button"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  ) : null;
}

export function DeleteUserModal({ isDelete, setIsDelete }) {
  const navigate = useNavigate();

  const [position, setPosition] = useState("");

  useEffect(() => {
    setPosition(getScrollPosition().scrollPosition);
  }, [isDelete]);

  function handleOnClickDeleteUserCancel() {
    setIsDelete(false);
    enableScroll();
  }

  async function handleOnClickDeleteUserConfirm() {
    const deleteResponse = await fetch(`${backHost}/api/users/user`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "ngrok-skip-browser-warning": "69420",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      method: "DELETE",
    });
    const deleteData = await deleteResponse.json();
    switch (deleteData.status) {
      case 200:
        alert("계정이 삭제되었습니다.");
        navigate("/");
        return;
      default:
        alert("계정삭제 실패");
    }
    setIsDelete(false);
  }

  return isDelete ? (
    <div className="modalContainer" style={{ top: `${position}px` }}>
      <div className="deem"></div>
      <div className="memberDelete modal">
        <p className="title">회원탈퇴 하시겠습니까?</p>
        <div className="description">작성된 게시글과 댓글은 삭제됩니다.</div>
        <div className="buttonContainer">
          <button
            onClick={handleOnClickDeleteUserCancel}
            className="cancelButton button"
          >
            취소
          </button>
          <button
            onClick={handleOnClickDeleteUserConfirm}
            className="submitButton button"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  ) : null;
}
