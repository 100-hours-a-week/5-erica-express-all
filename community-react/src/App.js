import { BrowserRouter, Routes, Route } from "react-router-dom";
import LogIn from "./components/users/LogIn";
import SignUp from "./components/users/SignUp";
import Posts from "./components/posts/Posts";
import Navbar from "./components/Navbar";
import "./App.css";
import "./styles/Navbar.css";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<LogIn />}></Route>
          <Route path="/signUp" element={<SignUp />}></Route>
          <Route path="/posts" element={<Posts />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
