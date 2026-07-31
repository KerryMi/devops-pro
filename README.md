# 🚀 DevOps Legend — Gamified DevOps & SRE Interview Prep Platform

**DevOps Legend** — интерактивная геймифицированная платформа для подготовки к собеседованиям и прокачки практических навыков DevOps, SRE и Cloud-инженеров.

---

## 🛠 Технологический стек

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Motion/React (framer-motion)
- **Backend / Server**: Express (Node.js API proxy & Static Serving)
- **Database & Auth**: Firebase Firestore & Firebase Authentication
- **State & Storage**: LocalStorage sync + Firestore Cloud Persistence

---

## 📂 Архитектура и структура проекта (Clean Architecture)

Вся проектная структура организована по принципам модульности и четкого разделения ответственности (Separation of Concerns):

```
.
├── server.ts                    # Backend-сервер Express (Vite Middleware в dev / static в prod)
├── index.html                   # HTML-точка входа приложения
├── vite.config.ts               # Конфигурация сборщика Vite и Tailwind CSS
├── tsconfig.json                # Настройки компилятора TypeScript
├── package.json                 # Зависимости и скрипты сборки
├── metadata.json                # Конфигурация платформы (название, права, возможности)
├── firebase-blueprint.json      # Схема структуры Firestore базы данных
├── firestore.rules              # Правила безопасности Firestore
├── .env.example                 # Шаблон переменных окружения
└── src/                         # Исходный код приложения
    ├── main.tsx                 # Точка запуска React приложения
    ├── App.tsx                  # Главный компонент и роутер вкладок
    ├── firebase.ts              # Клиентская инициализация Firebase (Auth & Firestore)
    ├── index.css                # Глобальные стили Tailwind CSS
    ├── types/                   # TypeScript интерфейсы и модели данных
    │   └── index.ts
    ├── data/                    # База знаний, вопросы, инциденты и квесты
    │   ├── questions/           # Каталог вопросов по категориям (Docker, K8s, CI/CD, Linux, etc.)
    │   ├── achievements.ts      # Определения ачивок и наград
    │   ├── categories.ts        # Метаданные категорий DevOps
    │   ├── cheatsheets.ts       # Командные шпаргалки (CLI)
    │   ├── incidents.ts         # Сценарии разбора инцидентов (Incident Management)
    │   ├── legendGuide.ts       # Шаблоны и генератор опыта для резюме
    │   ├── quizzes.ts           # Блиц-викторины и тесты
    │   ├── resumeGuide.ts       # Чек-лист и усилители резюме
    │   └── skillsOfDay.ts       # Daily Skill карточки
    ├── utils/                   # Бизнес-логика, расчеты и хелперы
    │   ├── customDataStorage.ts # Управление локальными пользовательскими материалами
    │   ├── gamification.ts      # Расчет XP, рангов, уровней и наград
    │   ├── quizUtils.ts         # Логика тасования и валидации тестов
    │   ├── readiness.ts         # Расчет готовности к собеседованию (Readiness Score)
    │   ├── roadmapUtils.ts      # Аналитика прохождения Roadmap
    │   └── storage.ts           # Синхронизация прогресса с LocalStorage
    └── components/              # Модульные React-компоненты
        ├── index.ts             # Индексный экспорт всех компонентов
        ├── layout/              # Каркас приложения (Header, Sidebar, Footer, Toasts)
        │   ├── Header.tsx
        │   ├── Sidebar.tsx
        │   ├── Footer.tsx
        │   └── ToastNotificationContainer.tsx
        ├── widgets/             # Повторно используемые виджеты и модальные окна
        │   ├── DailyBlitzSection.tsx
        │   ├── DashboardAchievementsWidget.tsx
        │   ├── RankAvatar.tsx
        │   ├── RankUpModal.tsx
        │   ├── SearchModal.tsx
        │   └── SkillOfDayCard.tsx
        └── views/               # Экраны и страницы приложения
            ├── AchievementsView.tsx  # Прогресс и дерево IT-рангов
            ├── AdminView.tsx         # Панель администратора (конструктор вопросов)
            ├── CheatsheetsView.tsx   # Интерактивные шпаргалки по CLI
            ├── Dashboard.tsx        # Главный обзорный дашборд
            ├── DevOpsRoadmap.tsx    # Дорожная карта DevOps с прогрессом
            ├── FlashcardsView.tsx   # Флеш-карточки для запоминания
            ├── IncidentsView.tsx    # Симулятор решения аварий в продакшене
            ├── LegendBuilderView.tsx # Конструктор крутых формулировок опыта
            ├── ProfileView.tsx      # Профиль инженера и синхронизация
            ├── QuestionsView.tsx    # База вопросов с фильтрами и разборами
            ├── QuizView.tsx         # Тесты и квизы по темам
            └── ResumeGuideView.tsx  # Чек-лист идеального DevOps резюме
```

---

## ⭐️ Основные возможности

1. **База вопросов & Флеш-карточки (Q&A)** — Содержит вопросы с подробными разборами по Docker, Kubernetes, Terraform, Linux, CI/CD, Networking, Cloud и Monitoring.
2. **Симулятор Incident Management** — Интерактивный режим разбора продакшен-аварий с выбором сценариев решения и анализом логов.
3. **DevOps Roadmap** — Интерактивная карта навыков от Linux/Git до Kubernetes и GitOps.
4. **Геймификация (XP & Ранги)** — Система прокачки от «Эникейщика на костылях» до «Бога Прод-Среды».
5. **Генератор Legend Builder** — Помогает перевести рутинные обязанности в сильные формулировки для резюме (STAR-метод).
6. **Быстрые CLI Шпаргалки** — Поиск и копирование команд по Linux, Docker, kubectl, git и terraform.
7. **Облачная синхронизация** — Сохранение прогресса в Firebase Firestore при авторизации.

---

## ⚡ Запуск и разработка

### 1. Установка зависимостей
```bash
npm install
```

### 2. Запуск в режиме разработки (Dev Server)
```bash
npm run dev
```
Приложение откроется по адресу `http://localhost:3000`.

### 3. Сборка для Production
```bash
npm run build
```

### 4. Запуск Production-сервера
```bash
npm start
```

---

## 🔒 Назначение служебных файлов в корне

- `metadata.json` — метаданные (название приложения, описание, разрешенные права браузера).
- `server.ts` — точки входа сервера приложений Express.
- `firebase-blueprint.json` & `firestore.rules` — конфигурации структуры и безопасности Firestore.
- `vite.config.ts`, `tsconfig.json`, `package.json` — стандартные конфигурации TypeScript/Vite/npm сборки.
