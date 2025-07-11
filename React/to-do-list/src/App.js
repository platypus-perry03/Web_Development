// src/App.js

import React, { useContext } from 'react';
// React Router의 핵심 컴포넌트들 불러오기
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// 로그인 폼 컴포넌트
import LoginForm from './components/LoginForm';
// 투두 리스트 메인 컴포넌트
import TodoList from './components/Todo/TodoList';
// 유저 인증 상태를 전역에서 관리하는 컨텍스트
import { UserContext } from './context/UserContext';

function App() {
  const { currentUser } = useContext(UserContext); // 현재 로그인된 사용자 정보 가져오기

  return (
    <Router>
      <Routes>
        {/* 루트 경로("/")에 접속 시: 로그인되어 있으면 /todo로 이동, 아니면 로그인폼 보여줌 */}
        <Route path="/" element={currentUser ? <Navigate to="/todo" /> : <LoginForm />} />

        {/* /todo 페이지: 로그인되어 있으면 투두 리스트 보여주고, 아니면 로그인 페이지로 리다이렉트 */}
        <Route path="/todo" element={currentUser ? <TodoList /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;