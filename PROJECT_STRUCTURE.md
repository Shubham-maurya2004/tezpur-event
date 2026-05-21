# Project Structure

```
tezpur-university-events/
├── backend/
│   ├── src/
│   │   ├── config/database.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Event.ts
│   │   │   └── LiveScore.ts
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── eventController.ts
│   │   │   └── liveScoreController.ts
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── eventRoutes.ts
│   │   │   └── liveScoreRoutes.ts
│   │   ├── middleware/auth.ts
│   │   ├── utils/generateToken.ts
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
├── src/
│   ├── app/
│   │   ├── components/ui/
│   │   ├── context/AuthContext.tsx
│   │   ├── pages/
│   │   ├── services/api.ts
│   │   ├── types/index.ts
│   │   └── App.tsx
│   ├── styles/
│   ├── main.tsx
│   └── vite-env.d.ts
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── vite.config.ts
└── index.html
```
