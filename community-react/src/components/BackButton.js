import backButton from "../images/back.png";
import "../styles/Navbar.css";
import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();
  function handleOnClickBackButton() {
    navigate(-1);
  }

  return (
    <button onClick={handleOnClickBackButton} className="beforeBtn">
      <img src={backButton} alt="backbutton" className="backImage" />
    </button>
  );
}
