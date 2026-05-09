# Структура базы данных — GuidedTrip.kz

## О проекте
Сервис экскурсий и туров по городу Астана. Пользователь выбирает экскурсию, смотрит описание и записывается на неё. Администратор управляет каталогом экскурсий.

---

## Модели данных (6 таблиц)

### 1. User (Пользователи)

| Поле | Тип | Описание |
|------|-----|----------|
| id | Int, autoincrement, @id | Уникальный идентификатор |
| email | String, @unique | Электронная почта |
| name | String | Имя пользователя |
| passwordHash | String | Хеш пароля (bcrypt, saltRounds >= 10) |
| role | Enum: USER / ADMIN | Роль, по умолчанию USER |
| createdAt | DateTime, @default(now()) | Дата регистрации |

**Связи:** 1:N с Booking (один пользователь → много бронирований)

---

### 2. Excursion (Экскурсии) — главная сущность CRUD

| Поле | Тип | Описание |
|------|-----|----------|
| id | Int, autoincrement, @id | Уникальный идентификатор |
| title | String | Название экскурсии |
| description | String | Описание |
| price | Float | Стоимость в тенге |
| duration | Float | Продолжительность в часах (например 1.5, 2, 3) |
| imageUrl | String | Ссылка на изображение |
| format | String | Формат проведения (пешая, автобусная, индивидуальная, групповая) |
| maxPeople | Int | Максимум участников |
| categoryId | Int | Ссылка на категорию |
| createdAt | DateTime, @default(now()) | Дата создания |

**Связи:**
- N:1 с Category (много экскурсий → одна категория)
- 1:N с Booking (одна экскурсия → много бронирований)
- N:M с Tag через ExcursionTag

**Индексы:** @@index([categoryId])

---

### 3. Category (Категории экскурсий)

Категории взяты с guidedtrip.kz.

| Поле | Тип | Описание |
|------|-----|----------|
| id | Int, autoincrement, @id | Уникальный идентификатор |
| name | String, @unique | Название категории |
| slug | String, @unique | URL-slug |
| createdAt | DateTime, @default(now()) | Дата создания |

**Категории:**
1. Популярные (slug: populyarnye)
2. Обзорные (slug: obzornye)
3. Вечерние (slug: vechernie)
4. Детские (slug: detskie)

**Связи:** 1:N с Excursion

---

### 4. Booking (Бронирования)

| Поле | Тип | Описание |
|------|-----|----------|
| id | Int, autoincrement, @id | Уникальный идентификатор |
| userId | Int | Ссылка на пользователя |
| excursionId | Int | Ссылка на экскурсию |
| people | Int | Количество человек |
| totalPrice | Float | Итого (excursion.price × people) |
| status | Enum: PENDING / CONFIRMED / CANCELLED | Статус, по умолчанию PENDING |
| date | DateTime | Желаемая дата и время экскурсии |
| phone | String | Контактный телефон |
| createdAt | DateTime, @default(now()) | Дата создания |

**Связи:**
- N:1 с User
- N:1 с Excursion

**Индексы:** @@index([userId]), @@index([excursionId])

---

### 5. Tag (Теги)

| Поле | Тип | Описание |
|------|-----|----------|
| id | Int, autoincrement, @id | Уникальный идентификатор |
| name | String, @unique | Название тега |

**Теги:** история, архитектура, природа, искусство, семейный, ночной, пешая, автобусная

**Связи:** N:M с Excursion через ExcursionTag

---

### 6. ExcursionTag (Связь Excursion ↔ Tag, многие-ко-многим)

| Поле | Тип | Описание |
|------|-----|----------|
| excursionId | Int | Ссылка на экскурсию |
| tagId | Int | Ссылка на тег |

**Составной ключ:** @@id([excursionId, tagId])

---

## Диаграмма связей

```
User 1 ──── N Booking N ──── 1 Excursion
                                   │
                            N:1 Category
                                   │
                            N:M Tag (через ExcursionTag)
```

- User → Booking: 1:N
- Excursion → Booking: 1:N
- Category → Excursion: 1:N
- Excursion ↔ Tag: N:M

---

## Seed-данные

При запуске `prisma db seed` загружаются:

**Пользователи (2):**
- admin@guidedtrip.kz (ADMIN), пароль: password123
- user@guidedtrip.kz (USER), пароль: password123

**Категории (4):** Популярные, Обзорные, Вечерние, Детские

**Теги (8):** история, архитектура, природа, искусство, семейный, ночной, пешая, автобусная

**Экскурсии (12):** по 3 в каждой категории, например:
- Популярные: «Главная мечеть Казахстана» (1.5ч, индивидуальная), «Городские картины» (2.5ч, пешая), «Астана қаласының бас мешіті» (2ч)
- Обзорные: «Астана — от крепости к величию» (4ч), «Столичный калейдоскоп» (3.5ч), «Город двух берегов» (3.5ч)
- Вечерние: «Астана в свете фонарей» (3ч), «Огни ночного города» (2ч), «Северное сияние столицы» (2.5ч)
- Детские: «Зелёный пояс» (3ч, групповая), «Сказочный мир» (3ч), «Dolce Vita столицы» (3ч)

**Бронирования (3):** от тестового пользователя со статусами PENDING, CONFIRMED, CANCELLED

---

## Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  USER
  ADMIN
}

enum BookingStatus {
  PENDING
  CONFIRMED
  CANCELLED
}

model User {
  id           Int       @id @default(autoincrement())
  email        String    @unique
  name         String
  passwordHash String
  role         Role      @default(USER)
  createdAt    DateTime  @default(now())
  bookings     Booking[]
}

model Excursion {
  id          Int             @id @default(autoincrement())
  title       String
  description String
  price       Float
  duration    Float
  imageUrl    String
  format      String
  maxPeople   Int
  categoryId  Int
  createdAt   DateTime        @default(now())
  category    Category        @relation(fields: [categoryId], references: [id])
  bookings    Booking[]
  tags        ExcursionTag[]

  @@index([categoryId])
}

model Category {
  id         Int         @id @default(autoincrement())
  name       String      @unique
  slug       String      @unique
  createdAt  DateTime    @default(now())
  excursions Excursion[]
}

model Booking {
  id          Int           @id @default(autoincrement())
  userId      Int
  excursionId Int
  people      Int
  totalPrice  Float
  status      BookingStatus @default(PENDING)
  date        DateTime
  phone       String
  createdAt   DateTime      @default(now())
  user        User          @relation(fields: [userId], references: [id])
  excursion   Excursion     @relation(fields: [excursionId], references: [id])

  @@index([userId])
  @@index([excursionId])
}

model Tag {
  id         Int            @id @default(autoincrement())
  name       String         @unique
  excursions ExcursionTag[]
}

model ExcursionTag {
  excursionId Int
  tagId       Int
  excursion   Excursion @relation(fields: [excursionId], references: [id])
  tag         Tag       @relation(fields: [tagId], references: [id])

  @@id([excursionId, tagId])
}
```
