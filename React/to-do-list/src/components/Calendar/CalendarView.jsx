import React from 'react';
import '../../styles/TodoList.css';

const CalendarView = ({ todos, setSelectedDate }) => {
  // 2025년 1월부터 12월까지의 달 객체 생성
  const months = [...Array(12).keys()].map(i => new Date(2025, i));
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  // 반복 일정 날짜 계산 함수
  const getRepeatDates = (task, year, month) => {
    const results = [];
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    const baseDate = new Date(task.dueDate); // 반복 시작 기준일

    const current = new Date(startDate);

    while (current <= endDate) {
      // 반복 시작일 이전은 건너뜀
      if (current < baseDate) {
        current.setDate(current.getDate() + 1);
        continue;
      }

      const sameDay = current.getDate() === baseDate.getDate();
      const sameWeekday = current.getDay() === baseDate.getDay();

      // 반복 조건에 따라 추가
      if (
        (task.repeat === 'daily') ||
        (task.repeat === 'weekly' && sameWeekday) ||
        (task.repeat === 'monthly' && sameDay)
      ) {
        const dateStr = current.toISOString().split('T')[0];
        results.push(dateStr);
      }

      current.setDate(current.getDate() + 1);
    }

    return results;
  };

  // 달력 렌더링 함수
  const renderCalendar = () => {
    return months.map(monthDate => {
      const year = monthDate.getFullYear();
      const month = monthDate.getMonth();
      const firstDay = new Date(year, month, 1).getDay(); // 그 달 1일의 요일
      const daysInMonth = new Date(year, month + 1, 0).getDate(); // 그 달의 일 수
      const days = [];

      // 시작 요일 전까지 빈 칸
      for (let i = 0; i < firstDay; i++) days.push(null);
      for (let d = 1; d <= daysInMonth; d++) days.push(d);

      const tasksByDate = {};

      // 반복 일정과 일반 일정을 날짜별로 정리
      todos.forEach((task) => {
        if (task.repeat && !task.done) {
          const repeatDates = getRepeatDates(task, year, month);
          repeatDates.forEach(dateStr => {
            if (!tasksByDate[dateStr]) tasksByDate[dateStr] = [];
            tasksByDate[dateStr].push({ ...task, isRepeat: true });
          });
        } else {
          const dateStr = task.dueDate;
          if (!tasksByDate[dateStr]) tasksByDate[dateStr] = [];
          tasksByDate[dateStr].push(task);
        }
      });

      return (
        <div key={month} className="calendar-month">
          <h3>{year}년 {month + 1}월</h3>
          <div className="calendar-grid">
            {/* 요일 헤더 */}
            {weekDays.map(d => <div key={d} className="calendar-header">{d}</div>)}
            {/* 날짜 셀 */}
            {days.map((d, i) => {
              const dateStr = d ? `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}` : '';
              const dateTodos = tasksByDate[dateStr] || [];

              return (
                <div
                  key={i}
                  className="calendar-cell"
                  onClick={() => d && setSelectedDate({ date: dateStr, tasks: dateTodos })}
                >
                  {d && <div className="calendar-day">{d}</div>}
                  {/* 할 일 목록 출력 */}
                  {dateTodos.map((t, idx) => (
                    <div key={idx} className={`calendar-task ${t.done ? 'done' : ''}`}>
                      {t.text.length > 10 ? t.text.slice(0, 10) + '...' : t.text}
                      {/* 반복 정보 표시 */}
                      {t.repeat && !t.done && (
                        <span style={{ fontSize: '11px', color: '#888', marginLeft: '4px' }}>
                          ({t.repeat === 'daily' ? '매일' : t.repeat === 'weekly' ? '매주' : '매월'})
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      );
    });
  };

  // 스크롤 이동 함수
  const scrollToBottom = () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

  return (
    <div className="calendar-view">
      {renderCalendar()}
      <div className="calendar-controls">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>맨 위로</button>
        <button onClick={scrollToBottom}>맨 아래로</button>
      </div>
    </div>
  );
};

export default CalendarView;