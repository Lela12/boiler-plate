import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import LandingPage from "./components/views/LandingPage/LandingPage";
import LoginPage from "./components/views/LoginPage/LoginPage";
import RegisterPage from "./components/views/RegisterPage/RegisterPage";
import Auth from "./hoc/auth";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* 랜딩페이지 컴포넌트를 auth컴포넌트가 감싼다 */}
          {/* 어드민 유저만 들어가게 하려면 true붙여준다 */}
          <Route path="/" element={Auth(LandingPage, null, true)} />
          <Route path="/login" element={Auth(LoginPage, false)} />
          <Route path="/register/" element={Auth(RegisterPage, false)} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
