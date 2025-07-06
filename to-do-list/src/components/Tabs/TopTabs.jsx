// components/TopTabs.jsx
import React from 'react';
import '../../styles/TodoList.css';

// 상단 탭 메뉴: 할 일 / 캘린더 / 통계 선택 UI
const TopTabs = ({ activeCategory, setActiveCategory }) => {
  return (
    <div className="top-tabs">
      {/* '할 일' 탭 버튼 */}
      <button
        className={activeCategory === '할 일' ? 'active' : ''}
        onClick={() => setActiveCategory('할 일')}
      >
        할 일
      </button>

      {/* '캘린더' 탭 버튼 */}
      <button
        className={activeCategory === '캘린더' ? 'active' : ''}
        onClick={() => setActiveCategory('캘린더')}
      >
        캘린더
      </button>

      {/* '통계' 탭 버튼 */}
      <button
        className={activeCategory === '통계' ? 'active' : ''}
        onClick={() => setActiveCategory('통계')}
      >
        통계
      </button>
    </div>
  );
};

export default TopTabs;