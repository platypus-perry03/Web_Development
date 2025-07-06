import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import SignUpModal from './SignUpModal';
import '../styles/LoginForm.css';

const LoginForm = () => {
  const [name, setName] = useState('');               // 입력된 이름
  const [showSignUp, setShowSignUp] = useState(false); // 가입 모달 표시 여부
  const { currentUser, loginUser } = useContext(UserContext); // 사용자 정보
  const navigate = useNavigate();

  // 로그인 처리
  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const found = users.find(user => user.name === name.trim());

    if (found) {
      console.log('[로그인 시도] 사용자 찾음:', found);
      loginUser(found); // 로그인 성공 시 Context에 저장
    } else {
      alert('등록된 이름이 없습니다. 가입해주세요.');
    }
  };

  // 로그인 상태일 경우 자동 이동
  useEffect(() => {
    if (currentUser) {
      navigate('/todo');
    }
  }, [currentUser, navigate]);

  return (
    <div className="login-container">
      <h2>To-Do List</h2>
      <div className="login-form">
        <label>이름 :</label>
        <input
          type="text"
          placeholder="(유저 이름 입력)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={handleLogin}>로그인</button>
      </div>

      {/* 가입 버튼 → 모달 열기 */}
      <button onClick={() => setShowSignUp(true)} className="signup-button">
        가입
      </button>

      {/* 가입 모달 */}
      {showSignUp && (
        <SignUpModal
          onClose={() => setShowSignUp(false)} // 닫기
          onSuccess={() => setShowSignUp(false)} // 가입 성공 시 닫기
        />
      )}
    </div>
  );
};

export default LoginForm;