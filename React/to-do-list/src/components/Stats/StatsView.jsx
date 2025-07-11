import React from 'react';

const StatsView = ({ todos }) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // ✅ 이번 달 완료한 할 일 필터링
  const doneThisMonth = todos.filter(t => {
    if (!t.done || !t.completedAt) return false;
    const doneDate = new Date(t.completedAt);
    return (
      doneDate.getMonth() === currentMonth &&
      doneDate.getFullYear() === currentYear
    );
  });

  // ⏱ 평균 처리 시간 계산 (완료일 - 생성일)
  const avgTime = (() => {
    const times = doneThisMonth.map(t =>
      (new Date(t.completedAt) - new Date(t.createdAt)) / (1000 * 60 * 60 * 24)
    );
    if (!times.length) return 0;
    return (times.reduce((a, b) => a + b, 0) / times.length).toFixed(1);
  })();

  // 📅 이번 주 시작(일요일) ~ 종료(토요일) 범위 설정
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  // 이번 주 할 일 전체
  const totalThisWeek = todos.filter(t => {
    const due = new Date(t.dueDate);
    return due >= weekStart && due <= weekEnd;
  });

  // 이번 주 완료한 할 일
  const doneThisWeek = totalThisWeek.filter(t => t.done);

  // 이번 주 성취율 계산 (퍼센트)
  const rate =
    totalThisWeek.length === 0
      ? 0
      : Math.round((doneThisWeek.length / totalThisWeek.length) * 100);

  return (
    <div className="stats-box">
      <h3>📈 통계</h3>
      <p>✅ 이번 달 완료한 할 일 수: {doneThisMonth.length}개</p>
      <p>⏱ 평균 처리 시간: {avgTime}일</p>
      <p>📅 이번 주 성취률: {rate}%</p>
    </div>
  );
};

export default StatsView;