# Link26 — React 프론트엔드

React 18 + TypeScript + Vite + Tailwind CSS + PWA

## 로컬 실행

```bash
npm install
# .env.local 에 백엔드 주소 설정 (기본값: http://localhost:3000)
npm run dev
# → http://localhost:3000
```

## 파일 구조

```
src/
├── api/          # axios 클라이언트 + API 함수 (Flutter api_client.dart 대응)
├── components/
│   ├── layout/   # BottomNav (Flutter NavigationBar)
│   └── ui/       # Card, Input, PrimaryButton 등 공통 컴포넌트
├── pages/        # 화면 (Flutter Screen → React Page)
│   ├── LoginPage.tsx     ← login_screen.dart
│   ├── SignupPage.tsx    ← signup_screen.dart
│   ├── HomePage.tsx      ← home_screen.dart
│   ├── ChatPage.tsx      ← ai_chat_screen.dart
│   └── MorePage.tsx      ← more_screen.dart
├── store/        # Zustand (Flutter ChangeNotifier + TokenStorage)
└── types/        # TypeScript 타입 (Flutter 모델과 1:1 대응)
```

## Vercel 배포

1. GitHub에 push
2. Vercel에서 New Project → 이 레포 선택
3. Framework Preset: **Vite**
4. Environment Variables:
   - `VITE_API_URL=https://your-backend.railway.app`
5. Deploy

## 백엔드 연결

이 프론트엔드는 `link26-web/backend/` 의 Fastify 서버와 연결됩니다.
`VITE_API_URL` 만 바꾸면 됩니다.
