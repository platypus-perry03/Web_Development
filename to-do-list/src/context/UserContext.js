// src/context/UserContext.js

import React, { createContext, useState } from 'react';

// 사용자 정보를 공유하기 위한 Context 생성
export const UserContext = createContext();

// Context를 감싸는 Provider 컴포넌트
export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // 현재 로그인한 사용자 정보

  // 로그인 시 사용자 정보를 상태에 저장
  const loginUser = (user) => {
    console.log('[loginUser 호출됨]', user); // 디버깅 로그
    setCurrentUser(user);
  };

  // 로그아웃 시 사용자 정보 초기화
  const logoutUser = () => {
    setCurrentUser(null);
  };

  return (
    // Context로 하위 컴포넌트에 값 전달
    <UserContext.Provider value={{ currentUser, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};