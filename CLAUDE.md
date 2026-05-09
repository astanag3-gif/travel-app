# Инструкция проекта — GuidedTrip.kz

## О проекте
**Название:** GuidedTrip.kz — Гиды и экскурсии Астаны
**Тип:** Fullstack веб-приложение (Capstone-проект)
**Суть:** Сервис для просмотра и бронирования экскурсий по городу Астана. Экскурсии городские, продолжительность — от 1.5 до 5 часов. Категории: Популярные, Обзорные, Вечерние, Детские.

---

## Технологический стек

| Слой | Технология |
|------|-----------|
| Frontend | Next.js 14+ (App Router), TypeScript |
| Backend | NestJS 10+ (TypeScript) |
| База данных | PostgreSQL |
| ORM | Prisma |
| Аутентификация | Passport.js + JWT (@nestjs/passport) |
| Стилизация | Tailwind CSS + shadcn/ui |
| Деплой Frontend | Vercel |
| Деплой Backend | Render |
| Деплой БД | Railway (или Supabase) |

---

## Соглашения и правила

### Терминология
- Основная сущность называется **Excursion** (экскурсия), не Tour
- Поле duration — в **часах** (Float), не в днях
- Город — **Астана**, все экскурсии по Астане

### Код
- TypeScript strict mode в обоих проектах
- Именование: компоненты PascalCase, функции/переменные camelCase
- ESLint без ошибок, нет console.log в продакшне

### Frontend
- HTTP-клиент: **axios** (обёртка в /lib/api.ts)
- Формы: **react-hook-form + zod**
- Уведомления: **react-hot-toast**
- UI-компоненты: **shadcn/ui** (Button, Input, Card, Dialog, Select, Toast, Skeleton, Badge)
- Хранение токена: **localStorage** (ключ: "access_token")

### Backend
- Валидация: **class-validator + class-transformer**
- Хеширование: **bcryptjs**, saltRounds = 10
- JWT: **passport-jwt**, время жизни 7d
- Swagger: **@nestjs/swagger**, по адресу /api/docs
- CORS: `app.enableCors({ origin: process.env.CORS_ORIGIN })`

### Git
- Формат коммитов: feat: / fix: / docs: / chore: / refactor:
- Минимум 10 осмысленных коммитов
- Ветка: main

---

## Структура проекта

```
guidedtrip/
├── frontend/                   — Next.js
│   ├── app/
│   │   ├── (auth)/             — login, register
│   │   ├── (main)/             — каталог, детали
│   │   ├── (protected)/        — кабинет, создание/редактирование
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── ui/                 — shadcn/ui
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── excursion-card.tsx
│   │   └── booking-form.tsx
│   ├── lib/
│   │   ├── api.ts              — Axios-клиент
│   │   ├── auth.ts             — Работа с токеном
│   │   └── utils.ts
│   ├── types/
│   │   └── index.ts
│   ├── .env.local
│   └── .env.example
│
├── backend/                    — NestJS
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── auth/
│   │   ├── excursions/
│   │   ├── bookings/
│   │   ├── categories/
│   │   └── prisma/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   ├── .env
│   └── .env.example
│
├── .gitignore
└── README.md
```

---

## Переменные окружения

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/guidedtrip
JWT_SECRET=your-super-secret-key-at-least-32-chars
JWT_EXPIRES_IN=7d
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Команды запуска

### Backend
```bash
cd backend
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run start:dev
# Swagger: http://localhost:3001/api/docs
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Приложение: http://localhost:3000
```

---

## Текущий прогресс

- [x] Этап 1: Проектирование — схема БД, API-контракт, структура
- [x] Этап 2: Инициализация — Next.js, NestJS, Prisma, миграция, seed, Swagger
- [x] Этап 3: Backend Auth — регистрация, логин, JWT, Guard, Roles
- [x] Этап 4: Backend CRUD — экскурсии, бронирования, категории, фильтрация
- [ ] Этап 5: Frontend Auth — layout, формы, защита маршрутов
- [ ] Этап 6: Frontend каталог — список, детали, фильтры, пагинация
- [ ] Этап 7: Frontend CRUD + кабинет — формы ADMIN, дашборд пользователя
- [ ] Этап 8: Полировка — адаптивность, toast, скелетоны, lint
- [ ] Этап 9: Деплой — Vercel + Render + Railway
- [ ] Этап 10: Документация — README, скриншоты, подготовка к защите

---

## Дизайн-решения

### Цветовая схема
- Основной: синий/голубой (blue-600) — ассоциация со столицей, небом
- Фон: белый / серый (gray-50)
- Акцент: золотой/жёлтый (amber-500) — ассоциация с Байтереком
- Текст: gray-900 / gray-600

### Компоненты shadcn/ui
Button, Input, Card, Dialog, Select, Badge, Skeleton, Toast, Separator, DropdownMenu

### Карточка экскурсии (excursion-card)
- Изображение (16:9)
- Название
- Продолжительность (часы), формат
- Цена в тенге
- Теги (Badge)
- Кнопка «Подробнее»

### Header
- Логотип «GuidedTrip» слева
- Навигация: Главная, Экскурсии
- Справа: «Войти» или «Кабинет» + «Выйти»
- Мобильный: бургер-меню

---

## CLAUDE.md (для Claude Code в VS Code)

Создать в корне репозитория:

```markdown
# GuidedTrip.kz — Гиды и экскурсии Астаны

## Стек
- Frontend: Next.js 14, App Router, Tailwind, shadcn/ui, axios, react-hook-form, zod
- Backend: NestJS, Prisma, PostgreSQL, Passport JWT, class-validator, Swagger

## Команды
- Frontend: cd frontend && npm run dev (port 3000)
- Backend: cd backend && npm run start:dev (port 3001)
- Миграции: cd backend && npx prisma migrate dev
- Seed: cd backend && npx prisma db seed
- Type check: npx tsc --noEmit

## Ключевое
- Основная сущность: Excursion (не Tour)
- duration — в часах (Float), не в днях
- Город: Астана
- Категории: Популярные, Обзорные, Вечерние, Детские
- Формы: react-hook-form + zod
- HTTP: axios (lib/api.ts)
- Toast: react-hot-toast
- Коммиты: feat: / fix: / docs: / chore:
```
