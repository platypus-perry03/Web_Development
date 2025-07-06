// 반복 할 일을 생성하는 유틸 함수들

// ✅ 기존 반복 할 일을 기반으로 다음 반복 항목을 생성
export const generateNextRepeatTask = (task) => {
  // 기존 task를 복사하고 완료 상태 초기화
  const nextTask = { ...task, done: false };
  const dueDate = new Date(task.dueDate); // 기존 마감일 기준으로 계산

  // 반복 유형에 따라 다음 마감일 계산
  switch (task.repeat) {
    case 'daily':
      dueDate.setDate(dueDate.getDate() + 1); // 하루 후
      break;
    case 'weekly':
      dueDate.setDate(dueDate.getDate() + 7); // 일주일 후
      break;
    case 'monthly':
      dueDate.setMonth(dueDate.getMonth() + 1); // 한 달 후
      break;
    default:
      return null; // 반복이 없으면 새 task를 생성하지 않음
  }

  // 새 task 속성 설정
  nextTask.dueDate = dueDate.toISOString().split('T')[0]; // 'YYYY-MM-DD' 형식
  nextTask.createdAt = new Date().toISOString(); // 생성 시각 현재로 설정
  nextTask.completedAt = null; // 아직 완료되지 않음

  return nextTask;
};

// ✅ 오늘 완료한 반복 할 일을 기반으로 다음 반복 task 자동 생성
export const checkAndGenerateRepeatTasks = (todos, setTodos) => {
  const todayStr = new Date().toISOString().split('T')[0]; // 오늘 날짜 (문자열)
  const newTasks = [];

  todos.forEach(task => {
    // 반복 설정이 있고, 완료됐고, 완료일이 오늘인 경우
    if (task.repeat && task.done && task.completedAt) {
      const completedDate = new Date(task.completedAt).toISOString().split('T')[0];

      if (completedDate === todayStr) {
        const next = generateNextRepeatTask(task); // 다음 반복 항목 생성
        if (next) newTasks.push(next);
      }
    }
  });

  // 새로운 반복 할 일이 있으면 기존 목록에 추가
  if (newTasks.length > 0) {
    setTodos(prev => [...prev, ...newTasks]);
  }
};