import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import TopTabs from '../Tabs/TopTabs';
import CalendarView from '../Calendar/CalendarView';
import StatsView from '../Stats/StatsView';
import TodoItem from './TodoItem';
import { checkAndGenerateRepeatTasks } from '../../utils/repeatTaskHandler';
import '../../styles/TodoList.css';

const TodoList = () => {
  const { currentUser: user, logoutUser } = useContext(UserContext);
  const navigate = useNavigate();

  // 상태값 설정
  const [input, setInput] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [repeat, setRepeat] = useState('none');
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [activeCategory, setActiveCategory] = useState('할 일'); // 탭 선택
  const [selectedDate, setSelectedDate] = useState(null);         // 캘린더 날짜 선택
  const [sortByDueDate, setSortByDueDate] = useState(false);      // 마감일 정렬

  const storageKey = `todos_${user?.name || 'guest'}`; // 사용자별 저장 키

  // 로그인 확인
  useEffect(() => {
    if (!user) navigate('/');
  }, [user, navigate]);

  // 저장된 투두 불러오기
  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) setTodos(JSON.parse(stored));
  }, [storageKey]);

  // 변경 시 저장
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(todos));
  }, [todos, storageKey]);

  // 반복 할 일 자동 생성
  useEffect(() => {
    checkAndGenerateRepeatTasks(todos, setTodos);
  }, [todos]);

  // 새 할 일 추가
  const handleAdd = () => {
    if (input.trim() === '') return;
    const newTodo = {
      id: Date.now(),
      text: input,
      done: false,
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      pinned: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
      repeat: repeat,
    };
    setTodos([newTodo, ...todos]);
    setInput('');
    setDueDate('');
    setRepeat('none');
  };

  // 완료 토글
  const toggleDone = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id
        ? {
            ...todo,
            done: !todo.done,
            completedAt: !todo.done ? new Date().toISOString() : null,
          }
        : todo
    ));
  };

  // 삭제
  const handleDelete = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // 로그아웃
  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  // 필터링
  const filterTodos = todos.filter(todo => {
    if (filter === 'done') return todo.done;
    if (filter === 'undone') return !todo.done;
    return true;
  });

  // 수정 시작
  const handleEdit = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  // 수정 중 엔터/ESC 처리
  const handleEditKeyDown = (e, id) => {
    if (e.key === 'Enter') handleSaveEdit(id);
    else if (e.key === 'Escape') setEditingId(null);
  };

  // 수정 저장
  const handleSaveEdit = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: editingText } : todo
    ));
    setEditingId(null);
  };

  // 마감일 정렬 토글
  const toggleSortByDueDate = () => setSortByDueDate(prev => !prev);

  // 고정(핀) 토글
  const togglePin = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, pinned: !todo.pinned } : todo
    ));
  };

  // 고정 > 마감일순 정렬
  const sortedTodos = [...filterTodos].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    if (sortByDueDate) return new Date(a.dueDate) - new Date(b.dueDate);
    return 0;
  });

  if (!user) return null;

  return (
    <div className="todo-container">
      <div className="todo-header">
        <h2>{user.emoji} {user.name}님의 To-Do List</h2>
        <button onClick={handleLogout}>로그아웃</button>
      </div>

      {/* 탭 영역 */}
      <TopTabs activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

      {/* 할 일 화면 */}
      {activeCategory === '할 일' && (
        <>
          <div className="filter-buttons">
            <button onClick={() => setFilter('all')}>전체</button>
            <button onClick={() => setFilter('undone')}>미완료</button>
            <button onClick={() => setFilter('done')}>완료</button>
            <button onClick={toggleSortByDueDate}>
              {sortByDueDate ? '📅 마감일순' : '🔀 기본순'}
            </button>
          </div>

          {/* 입력 폼 */}
          <div className="todo-input">
            <input
              type="text"
              placeholder="할 일을 입력하세요"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            <select
              value={repeat}
              onChange={(e) => setRepeat(e.target.value)}
            >
              <option value="none">반복 없음</option>
              <option value="daily">매일</option>
              <option value="weekly">매주</option>
              <option value="monthly">매월</option>
            </select>
            <button onClick={handleAdd}>추가</button>
          </div>

          {/* 할 일 리스트 */}
          <ul className="todo-list">
            {sortedTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggleDone={toggleDone}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onSaveEdit={handleSaveEdit}
                onEditKeyDown={handleEditKeyDown}
                editingId={editingId}
                editingText={editingText}
                setEditingText={setEditingText}
                onTogglePin={togglePin}
              />
            ))}
          </ul>
        </>
      )}

      {/* 캘린더 화면 */}
      {activeCategory === '캘린더' && (
        <CalendarView todos={todos} setSelectedDate={setSelectedDate} />
      )}

      {/* 통계 화면 */}
      {activeCategory === '통계' && (
        <StatsView todos={todos} />
      )}

      {/* 날짜 클릭 시 모달 */}
      {selectedDate && (
        <div className="modal-overlay" onClick={() => setSelectedDate(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedDate.date} 할 일 목록</h3>
            <ul>
              {selectedDate.tasks.map((t, i) => (
                <li key={i} className={t.done ? 'done' : ''}>
                  {t.text}
                  {t.repeat && t.repeat !== 'none' && (
                    <span style={{ marginLeft: '6px', fontSize: '13px', color: '#888' }}>({
                      t.repeat === 'daily' ? '매일' : t.repeat === 'weekly' ? '매주' : '매월'
                    })</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoList;