# 📋 To-Do List 프로젝트

하루 할 일과 일정 관리를 위한 **React 기반 To-Do List 앱**입니다.  
할 일 추가, 완료 체크, 삭제, 고정(pin), 날짜별 마감 관리, 반복 일정 등록 등 다양한 기능을 제공합니다.


## 📂 폴더 구조
```
to-do-list/
├── public/
│ └── index.html # 루트 HTML 파일
├── src/
│ ├── components/ # UI 구성 요소
│ │ ├── Calendar/ # 캘린더 뷰 관련 컴포넌트
│ │ ├── Stats/ # 통계 뷰 (아직 미구현 또는 확장 예정)
│ │ ├── Tabs/ # 상단 탭 컴포넌트 (할 일 / 캘린더 / 통계)
│ │ └── Todo/ # 할 일 목록 및 항목 컴포넌트
│ ├── context/ # 로그인 상태 관리용 Context API
│ ├── styles/ # CSS 스타일 파일들
│ ├── utils/ # 반복 일정 처리 유틸리티
│ ├── App.js # 라우팅 및 메인 앱 컴포넌트
│ └── index.js # React 진입점
├── .gitignore
├── package.json
├── README.md
└── README.old.md # 초기 create-react-app 생성 시 기본 파일
```

## ✨ 주요 기능

- ✅ 이름 기반 로그인 / 가입 (실제 인증은 없음)
- 📝 할 일 추가, 완료 체크 / 해제
- 📅 마감일 지정 + 달력에 자동 표시
- 📌 고정(Pin) 기능으로 상단 고정
- 🔁 반복 일정 설정 (일간 / 주간 / 월간)
- 🗑️ 할 일 삭제
- 📆 달력 뷰에서 날짜별 할 일 확인
- 📊 통계 기능 (확장 예정)


## 🛠 기술 스택

- **React**
- **React Router** - 페이지 라우팅 처리
- **Context API** - 사용자 로그인 상태 전역 관리
- **CSS** - 컴포넌트별 스타일링
- **LocalStorage** - 브라우저 로컬 데이터 저장


## 🧪 실행 방법

1. 프로젝트 폴더로 이동:
```
cd to-do-list
npm start
```
🔒 참고사항
이 앱은 백엔드 서버 없이 로컬 상태(LocalStorage) 기반으로 작동합니다.<br>
로그인 정보, 할 일 목록은 브라우저에 저장되며 새로고침 후에도 유지됩니다.
