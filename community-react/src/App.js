import { BrowserRouter, Routes, Route } from "react-router-dom";
import LogIn from "./components/users/LogIn";
import SignUp from "./components/users/SignUp";
import Posts from "./components/posts/Posts";
import Navbar from "./components/Navbar";
import PostDetail from "./components/posts/PostDetail";
import UpdatePost from "./components/posts/UpdatePost";
import AddPost from "./components/posts/AddPost";
import UpdateProfile from "./components/users/UpdateProfile";
import UpdatePassword from "./components/users/UpdatePassword";

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
          <Route path="/posts/write" element={<AddPost />}></Route>
          <Route path="/posts/:id" element={<PostDetail />}></Route>
          <Route path="/posts/:id/update" element={<UpdatePost />}></Route>
          <Route path="/user/update" element={<UpdateProfile />}></Route>
          <Route path="/user/password" element={<UpdatePassword />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
