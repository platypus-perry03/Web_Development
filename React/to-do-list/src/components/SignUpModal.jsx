import React, { useState } from 'react';
import '../styles/SignUpModal.css';

// 이모지 목록 중 하나를 무작위로 선택 (가입 시 사용자에게 부여)
const getRandomEmoji = () => {
  const emojis = [
    '🐶', '🐱', '🐵', '🐳', '🦊', '🐯', '🐸', '🐰', '🐼', '🐢', '🦖', '🐌',
    '🐙', '🦈', '🐝', '🦭', '🐲', '🦉', '🐤', '🐼', '🐏', '🐈', '🐻‍❄️', '🐻'
  ];
  return emojis[Math.floor(Math.random() * emojis.length)];
};

// 색상 목록 중 하나를 무작위로 선택 (유저 테마용)
const getRandomColor = () => {
  const colors = ['red', 'blue', 'green', 'purple', 'orange', 'teal', 'brown'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const SignUpModal = ({ onClose }) => {
  const [name, setName] = useState('');
  const [isAvailable, setIsAvailable] = useState(null); // 사용 가능한 이름 여부
  const [checked, setChecked] = useState(false);        // 중복 확인 여부

  // 이름 중복 확인
  const handleCheck = () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const exists = users.some(user => user.name === name.trim());

    if (exists) {
      alert('이미 사용 중인 이름입니다.');
      setName('');
      setIsAvailable(false);
      setChecked(false);
      // 다시 입력 칸에 포커스
      setTimeout(() => {
        document.getElementById('signup-input').focus();
      }, 0);
    } else {
      alert('사용 가능한 이름입니다!');
      setIsAvailable(true);
      setChecked(true);
    }
  };

  // 회원가입 처리 → localStorage에 사용자 추가
  const handleSignUp = () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const newUser = {
      name: name.trim(),
      emoji: getRandomEmoji(),
      color: getRandomColor(),
    };
    localStorage.setItem('users', JSON.stringify([...users, newUser]));
    alert('🎉가입 완료!🎉');
    onClose(); // 모달 닫기
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>회원가입</h3>
        <input
          id="signup-input"
          type="text"
          placeholder="이름 입력"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setChecked(false);        // 입력이 바뀌면 다시 확인 필요
            setIsAvailable(null);
          }}
        />
        <button onClick={handleCheck}>중복 확인</button>
        <br />
        <button
          onClick={handleSignUp}
          disabled={!checked || !isAvailable} // 중복 확인 통과해야 가입 가능
        >
          가입
        </button>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default SignUpModal;