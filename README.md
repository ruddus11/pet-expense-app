# 하루친구 (HaruFriend)

반려동물 지출을 기록하고 관리하는 앱인토스 미니앱.

## 주요 기능

- **홈** — 이번 달 지출 현황과 예산 대비 사용량 확인
- **캘린더** — 날짜별 지출 내역 조회
- **통계** — 카테고리·월별 지출 차트 분석
- **프로필** — 반려동물 정보 및 월 예산 설정

## 기술 스택

- React 19 + TypeScript
- AppsInToss Web Framework (`@apps-in-toss/web-framework`)
- Zustand (상태 관리)
- Recharts (차트)
- Tailwind CSS v4

## 시작하기

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 앱인토스에 배포
npm run deploy
```

## 프로젝트 구조

```
src/
├── pages/
│   ├── Home.tsx        # 홈 화면
│   ├── Calendar.tsx    # 캘린더 화면
│   ├── Stats.tsx       # 통계 화면
│   ├── Profile.tsx     # 프로필 화면
│   ├── AddExpense.tsx  # 지출 추가 시트
│   └── Onboarding.tsx  # 온보딩 플로우
├── store/
│   └── usePetStore.ts  # 전역 상태 (반려동물 정보, 지출 내역)
├── components/
│   └── ui.tsx          # 공통 UI 컴포넌트
└── types/
    └── index.ts        # 타입 정의
```
