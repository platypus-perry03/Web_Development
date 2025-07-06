// components/TodoItem.jsx
import React from 'react';
import '../../styles/TodoList.css';

const TodoItem = ({
  todo,
  onToggleDone,       // 완료 상태 토글
  onDelete,            // 삭제 핸들러
  onEdit,              // 수정 모드 진입
  onSaveEdit,          // 수정 저장
  onEditKeyDown,       // 수정 입력 엔터 감지
  editingId,           // 현재 수정 중인 항목 id
  editingText,         // 수정 중 입력값
  setEditingText,      // 입력값 변경 핸들러
  onTogglePin,         // 고정 핀 토글
}) => {
  // 반복 유형 텍스트 반환
  const getRepeatLabel = (repeat) => {
    switch (repeat) {
      case 'daily': return '(매일)';
      case 'weekly': return '(매주)';
      case 'monthly': return '(매월)';
      default: return '';
    }
  };

  return (
    <li key={todo.id} className={todo.pinned ? 'pinned' : ''}>
      {/* 체크박스로 완료 여부 토글 */}
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggleDone(todo.id)}
      />

      {/* 수정 중일 때 입력창 표시 */}
      {editingId === todo.id ? (
        <>
          <input
            type="text"
            value={editingText}
            onChange={(e) => setEditingText(e.target.value)}
            onKeyDown={(e) => onEditKeyDown(e, todo.id)}
            autoFocus
          />
          <button onClick={() => onSaveEdit(todo.id)}>✔</button>
        </>
      ) : (
        // 일반 보기 상태
        <span
          onDoubleClick={() => onEdit(todo.id, todo.text)}
          className={todo.done ? 'done' : ''}
        >
          {todo.text} ({todo.dueDate}) {getRepeatLabel(todo.repeat)}
        </span>
      )}

      {/* 고정 핀 버튼 */}
      <button
        onClick={() => onTogglePin(todo.id)}
        className={`pin-button ${todo.pinned ? 'pinned' : ''}`}
      >
        📌
      </button>

      {/* 삭제 버튼 */}
      <button
        onClick={() => onDelete(todo.id)}
        style={{ marginLeft: '4px' }}
      >
        삭제
      </button>
    </li>
  );
};

export default TodoItem;