# 📱 EF (E-Friend) - Frontend

> **관심사 기반 매칭 및 커뮤니티 애플리케이션 'EF'**
> 사용자의 취향과 아날로그 감성을 연결하는 따뜻한 커뮤니티 서비스를 지향합니다.

---

## 📌 Project Overview

- **Service Name**: EF (E-Friend)
- **Organization**: EF-APP
- **Repository**: EF-FE (Front-End)
- **Target Platform**: Android, iOS (Cross-platform)

## 🛠 Tech Stack

### 핵심 라이브러리 (Dependencies)

- **Framework**: `Expo` (SDK 50+)
- **Navigation**: `Expo Router` (File-based Routing)
- **State Management**:
  - `Zustand`: 전역 클라이언트 상태 관리
  - `TanStack Query (v5)`: 서버 데이터 페칭 및 캐싱
- **Network**: `Axios`
- **Styling**: `React Native StyleSheet` (기본 제공)

### 개발 도구 (Dev Tools)

- **Language**: `TypeScript`
- **Linting**: `ESLint`, `Prettier`
- **JS Engine**: `Hermes` (성능 최적화 및 메모리 관리)

---

## 📂 Project Architecture (Directory)

```text
ef-fe/
├── .expo/                # Expo 실행 캐시 및 설정
├── .vscode/              # VS Code 작업 영역 설정
├── api/                  # 글로벌 API 설정 및 인스턴스
├── app/                  # Expo Router 기반 페이지 레이아웃(파일 기반 라우팅)
│   ├── (auth)/           # 인증 관련 페이지 그룹
│   ├── (onboarding)/     # 온보딩 화면 그룹
│   ├── (tabs)/           # 하단 탭 네비게이션 그룹
│   │   ├── chat-list/
│   │   ├── hi/
│   │   ├── home/
│   │   ├── my/
│   │   └── noti/
│   ├── chat-room/        # 개별 채팅방 화면
│   ├── _layout.tsx       # Root 레이아웃 (Provider 등 설정)
│   └── index.tsx         # 앱 진입점 (첫 화면)
├── assets/               # 정적 리소스(이미지, 아이콘, 폰트 리소스)
│   ├── fonts/
│   ├── icons/
│   └── images/
├── common/               # 공용 재사용 모듈
│   ├── components/
│   ├── hooks/
│   └── types/
├── constants/        # 전역 상수 관리 및 컬러시스템
│   ├── Colors.ts     # 브랜드 컬러 (#9686BF, #F5F3F1)
│   └── Config.ts     # API Endpoint 등 설정값
├── features/             # 도메인별 기능 단위 분리
│   ├── auth/             # 인증 기능 (api, components, hooks, types)
│   ├── chat/             # 채팅 기능 (api, components, hooks, types)
│   ├── hi/               # 'Hi' 기능 (매칭 등) (api, components, hooks, types)
│   ├── home/             # 홈 기능 (api, components, hooks, types)
│   ├── my/               # 마이페이지 기능 (api, components, hooks, types)
│   ├── noti/             # 공지 기능 (api, components, hooks, types)
│   └── onboarding/       # 온보딩 기능 (api, components, hooks, types)
├── node_modules/         # 설치된 라이브러리 폴더 (Git 제외)
├── store/                # 전역 상태 관리 (Zustand 등)
├── utils/                # 기타 유틸리티 함수
├── .gitignore            # Git 추적 제외 설정
├── app.json              # Expo 프로젝트 설정 파일
├── index.ts              # 메인 엔트리 (필요 시 제거 가능)
├── package-lock.json     # 의존성 버전 잠금 파일
├── package.json          # 프로젝트 정보 및 라이브러리 목록
├── README.md             # 프로젝트 설명서
└── tsconfig.json         # TypeScript 설정 파일
```
