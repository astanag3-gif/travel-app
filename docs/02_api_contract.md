# API-контракт — GuidedTrip.kz

Базовый URL: `{NEXT_PUBLIC_API_URL}` (локально: http://localhost:3001)

Все ответы в формате JSON. Защищённые маршруты требуют заголовок:
```
Authorization: Bearer <jwt_token>
```

---

## 1. Аутентификация (Auth)

### POST /auth/register
Регистрация нового пользователя.

**Доступ:** Публичный

**Body:**
```json
{
  "email": "user@example.com",
  "name": "Иван Петров",
  "password": "mypassword123"
}
```

**Валидация:** email — формат email; name — не пустое; password — минимум 6 символов.

**Ответы:**
- `201` — пользователь создан
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "Иван Петров",
  "role": "USER"
}
```
- `400` — невалидные данные
- `409` — email уже зарегистрирован

---

### POST /auth/login
Вход в систему, возвращает JWT.

**Доступ:** Публичный

**Body:**
```json
{
  "email": "user@example.com",
  "password": "mypassword123"
}
```

**Ответы:**
- `200` — успешный вход
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "Иван Петров",
    "role": "USER"
  }
}
```
- `401` — неверный email или пароль

---

### GET /auth/me
Данные текущего пользователя по токену.

**Доступ:** JWT (любая роль)

**Ответы:**
- `200`
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "Иван Петров",
  "role": "USER",
  "createdAt": "2025-01-15T10:30:00.000Z"
}
```
- `401` — токен отсутствует или невалиден

---

## 2. Экскурсии (Excursions) — основной CRUD

### GET /excursions
Список экскурсий с пагинацией, поиском и фильтрацией.

**Доступ:** Публичный

**Query-параметры:**
| Параметр | Тип | По умолчанию | Описание |
|----------|-----|-------------|----------|
| page | number | 1 | Номер страницы |
| limit | number | 9 | Записей на страницу |
| search | string | — | Поиск по title (contains, insensitive) |
| categoryId | number | — | Фильтр по категории |

**Ответ `200`:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Главная мечеть Казахстана",
      "description": "Авторская ознакомительная экскурсия...",
      "price": 5000,
      "duration": 1.5,
      "imageUrl": "https://...",
      "format": "индивидуальная",
      "maxPeople": 3,
      "createdAt": "2025-01-10T08:00:00.000Z",
      "category": { "id": 1, "name": "Популярные", "slug": "populyarnye" },
      "tags": [
        { "tag": { "id": 1, "name": "история" } },
        { "tag": { "id": 2, "name": "архитектура" } }
      ]
    }
  ],
  "meta": {
    "total": 12,
    "page": 1,
    "limit": 9,
    "totalPages": 2
  }
}
```

---

### GET /excursions/:id
Одна экскурсия с полной информацией.

**Доступ:** Публичный

**Ответы:**
- `200` — экскурсия (с category и tags)
- `404` — не найдена

---

### POST /excursions
Создание экскурсии.

**Доступ:** ADMIN

**Body:**
```json
{
  "title": "Астана — от крепости к величию",
  "description": "Экскурсия от исторической части до нового центра...",
  "price": 8000,
  "duration": 4,
  "imageUrl": "https://...",
  "format": "автобусная",
  "maxPeople": 20,
  "categoryId": 2,
  "tagIds": [1, 2]
}
```

**Валидация:** title — не пустое; price — > 0; duration — > 0; categoryId — существует в БД; tagIds — массив существующих id.

**Ответы:**
- `201` — создана
- `400` — невалидные данные
- `401` — не авторизован
- `403` — не ADMIN

---

### PATCH /excursions/:id
Обновление экскурсии.

**Доступ:** ADMIN

**Body:** любые поля из POST (все опциональные)
```json
{
  "price": 10000,
  "tagIds": [1, 2, 5]
}
```

**Ответы:**
- `200` — обновлена
- `400` — невалидные данные
- `401` — не авторизован
- `403` — не ADMIN
- `404` — не найдена

---

### DELETE /excursions/:id
Удаление экскурсии.

**Доступ:** ADMIN

**Ответы:**
- `200` — `{ "message": "Экскурсия удалена" }`
- `401` — не авторизован
- `403` — не ADMIN
- `404` — не найдена

---

## 3. Бронирования (Bookings)

### POST /bookings
Запись на экскурсию.

**Доступ:** JWT (любая роль)

**Body:**
```json
{
  "excursionId": 1,
  "people": 2,
  "date": "2025-07-15T10:00:00.000Z",
  "phone": "+7 777 123 4567"
}
```

**Логика:** totalPrice = excursion.price × people, status = PENDING

**Ответы:**
- `201` — бронирование создано
```json
{
  "id": 1,
  "excursionId": 1,
  "userId": 1,
  "people": 2,
  "totalPrice": 10000,
  "status": "PENDING",
  "date": "2025-07-15T10:00:00.000Z",
  "phone": "+7 777 123 4567",
  "createdAt": "2025-06-01T12:00:00.000Z"
}
```
- `400` — невалидные данные
- `401` — не авторизован
- `404` — экскурсия не найдена

---

### GET /bookings/my
Бронирования текущего пользователя.

**Доступ:** JWT (любая роль)

**Ответ `200`:**
```json
[
  {
    "id": 1,
    "people": 2,
    "totalPrice": 10000,
    "status": "PENDING",
    "date": "2025-07-15T10:00:00.000Z",
    "phone": "+7 777 123 4567",
    "createdAt": "2025-06-01T12:00:00.000Z",
    "excursion": {
      "id": 1,
      "title": "Главная мечеть Казахстана",
      "imageUrl": "https://...",
      "duration": 1.5
    }
  }
]
```

---

### DELETE /bookings/:id
Отмена бронирования.

**Доступ:** JWT (только своё бронирование)

**Ответы:**
- `200` — отменено
- `401` — не авторизован
- `403` — чужое бронирование
- `404` — не найдено

---

## 4. Категории (Categories)

### GET /categories
Список категорий.

**Доступ:** Публичный

**Ответ `200`:**
```json
[
  { "id": 1, "name": "Популярные", "slug": "populyarnye" },
  { "id": 2, "name": "Обзорные", "slug": "obzornye" },
  { "id": 3, "name": "Вечерние", "slug": "vechernie" },
  { "id": 4, "name": "Детские", "slug": "detskie" }
]
```

---

## Сводная таблица эндпоинтов

| # | Метод | Путь | Доступ | Описание |
|---|-------|------|--------|----------|
| 1 | POST | /auth/register | Публичный | Регистрация |
| 2 | POST | /auth/login | Публичный | Вход, возврат JWT |
| 3 | GET | /auth/me | JWT | Текущий пользователь |
| 4 | GET | /excursions | Публичный | Список + фильтры + пагинация |
| 5 | GET | /excursions/:id | Публичный | Одна экскурсия |
| 6 | POST | /excursions | ADMIN | Создать |
| 7 | PATCH | /excursions/:id | ADMIN | Обновить |
| 8 | DELETE | /excursions/:id | ADMIN | Удалить |
| 9 | POST | /bookings | JWT | Записаться |
| 10 | GET | /bookings/my | JWT | Мои бронирования |
| 11 | DELETE | /bookings/:id | JWT (своё) | Отменить бронирование |
| 12 | GET | /categories | Публичный | Список категорий |

**Итого:** 12 эндпоинтов (минимум по ТЗ — 7)
