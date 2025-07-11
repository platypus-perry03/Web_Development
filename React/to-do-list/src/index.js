// index.js

// React 라이브러리와 ReactDOM을 불러옴
import React from 'react';
import ReactDOM from 'react-dom/client';

// 메인 앱 컴포넌트 불러오기
import App from './App'; // ✅ 여기서 './App' 이 잘 연결돼야 앱이 정상 실행됨

// 사용자 정보를 전역으로 관리하는 컨텍스트 Provider
import { UserProvider } from './context/UserContext';

// HTML의 root 요소를 찾아 React 애플리케이션을 마운트함
const root = ReactDOM.createRoot(document.getElementById('root'));

// 애플리케이션을 렌더링하면서 UserProvider로 감싸서
// 어디서든 로그인 유저 정보(currentUser 등)를 사용할 수 있게 함
root.render(
  <UserProvider>
    <App />
  </UserProvider>
);