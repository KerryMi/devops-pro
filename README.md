# 🛠️ DevOps Pro — Enterprise DevOps & SRE Interview Preparation Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-10b981.svg)](LICENSE.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.0-61dafb.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8.svg)](https://tailwindcss.com/)

**DevOps Pro** — это профессиональная геймифицированная платформа для подготовки к собеседованиям, тестирования знаний и развития практических компетенций DevOps, SRE и Cloud-инженеров.

Платформа включает в себя интерактивную базу вопросов с подробными разборами, симулятор инцидентов в продакшене, тренировочные тесты, CLI-шпаргалки, конструктор формулировок опыта (STAR-метод) и автоматическую синхронизацию прогресса.

---

## ⚡ Быстрый старт (Quick Start)

### Требования к окружению
- **Node.js**: `v18.x` или выше
- **npm**: `v9.x` или выше

### 1. Клонирование и установка зависимостей
```bash
git clone <repository-url>
cd devops-pro
npm install
```

### 2. Настройка переменных окружения
Создайте файл `.env` на основе шаблона `.env.example`:
```bash
cp .env.example .env
```
Заполните ключи доступа для Firebase (если используется облачная синхронизация Firestore/Auth).

### 3. Запуск в режиме разработки
```bash
npm run dev
```
Приложение будет доступно по адресу: `http://localhost:3000`

---

## 🏗 Сборка и Deployment в Production

### 1. Проверка типов и линтинг
```bash
npm run lint
```

### 2. Сборка приложения
Компиляция клиентского SPA бандела Vite и серверного entrypoint `server.ts` в `dist/`:
```bash
npm run build
```

### 3. Запуск Production-сервера
```bash
npm start
```
Сервер запускается на `0.0.0.0:3000` и обслуживает API-эндпоинты и статическую сборку приложения.

---

## 🛠 Технологический стек

### Frontend
- **Framework**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide Icons, Motion (`motion/react`)
- **State & Architecture**: React Hooks, Modular View/Widget Hierarchy

### Backend & Infrastructure
- **Server**: Express (Node.js runtime, bundled via `esbuild` for production)
- **Database**: Firebase Firestore (Persistence & Cloud Progress Sync)
- **Authentication**: Firebase Auth (Anonymous & Multi-provider authentication)
- **Configuration & Rules**: `firestore.rules`, `firebase-blueprint.json`

---

## 📂 Структура проекта (Project Architecture)

Проект спроектирован по принципам модульности, атомарного разделения компонентов и чистой архитектуры:

```
.
├── server.ts                    # Серверный entrypoint Express (Vite dev middleware & prod static server)
├── index.html                   # Точка входа HTML
├── vite.config.ts               # Конфигурация Vite & Tailwind CSS
├── tsconfig.json                # Конфигурация компилятора TypeScript
├── package.json                 # Зависимости и npm-скрипты
├── metadata.json                # Метаданные приложения и права доступа
├── firebase-blueprint.json      # Схема Firestore коллекции и индексов
├── firestore.rules              # Правила безопасности Firestore
├── .env.example                 # Шаблон переменных окружения
└── src/                         # Исходный код приложения
    ├── main.tsx                 # Главная точка входа React (DOM render)
    ├── App.tsx                  # Корневой компонент управления глобальным состоянием и навигацией
    ├── firebase.ts              # Инициализация Firebase SDK (Auth & Firestore)
    ├── index.css                # Глобальные стили Tailwind CSS
    ├── types/                   # TypeScript интерфейсы и модели данных
    │   └── index.ts             # Единый экспортер типов (Question, Quiz, UserProgress, etc.)
    ├── data/                    # База знаний, справочники и квесты
    │   ├── questions/           # Интерактивная база вопросов по категориям (Docker, K8s, Linux, CI/CD, IaC, etc.)
    │   ├── achievements.ts      # Реестр достижений и система системных наград
    │   ├── categories.ts        # Справочник DevOps-доменов и фильтров
    │   ├── cheatsheets.ts       # База готовых CLI-команд с возможностью поиска
    │   ├── incidents.ts         # Сценарии симуляции аварий в продакшене (Incident Management)
    │   ├── legendGuide.ts       # Шаблоны и генератор опыта для резюме
    │   ├── quizzes.ts           # База вопросов для ежедневного блица и викторин
    │   ├── resumeGuide.ts       # Чек-лист и гайд по составлению резюме DevOps
    │   └── skillsOfDay.ts       # Карточки «Навык дня»
    ├── utils/                   # Сервисная бизнес-логика и хелперы
    │   ├── customDataStorage.ts # Локальное сохранение пользовательских вопросов и заметок
    │   ├── gamification.ts      # Расчет XP, уровней, рангов и прогрессии инженера
    │   ├── quizUtils.ts         # Генерация и валидация тестовых наборов
    │   ├── readiness.ts         # Метрика готовности к собеседованию (Readiness Score)
    │   ├── roadmapUtils.ts      # Анализ прохождения компетенций Roadmap
    │   └── storage.ts           # Синхронизация данных с LocalStorage и Firestore
    └── components/              # React-компоненты
        ├── index.ts             # Индексный экспорт компонентов
        ├── layout/              # Элементы интерфейса (Header, Sidebar, Footer, Toasts)
        │   ├── Header.tsx
        │   ├── Sidebar.tsx
        │   ├── Footer.tsx
        │   └── ToastNotificationContainer.tsx
        ├── widgets/             # Автономные виджеты и модальные окна
        │   ├── DailyBlitzSection.tsx      # Виджет ежедневного блица
        │   ├── DashboardAchievementsWidget.tsx # Модуль активных ачивок
        │   ├── RankAvatar.tsx              # Отображение ранга и аватара
        │   ├── RankUpModal.tsx             # Модалка повышения уровня
        │   ├── SearchModal.tsx             # Глобальный поиск по платформе
        │   └── SkillOfDayCard.tsx          # Карточка навыка дня
        └── views/               # Основные экраны приложения
            ├── AchievementsView.tsx  # Дерево достижений и IT-рангов
            ├── AdminView.tsx         # Кастомный конструктор вопросов
            ├── CheatsheetsView.tsx   # Интерактивные CLI-шпаргалки
            ├── Dashboard.tsx        # Главная панель управления и аналитика
            ├── DevOpsRoadmap.tsx    # Интерактивная карта развития (Roadmap)
            ├── FlashcardsView.tsx   # Режим интервального повторения (Флеш-карточки)
            ├── IncidentsView.tsx    # Симулятор решения инцидентов
            ├── LegendBuilderView.tsx # Конструктор профессиональных формулировок
            ├── ProfileView.tsx      # Профиль инженера и настройки аккаунта
            ├── QuestionsView.tsx    # База вопросов с фильтрацией по этапам и сложности
            ├── QuizView.tsx         # Интерактивные тесты и блицы
            └── ResumeGuideView.tsx  # Чек-лист DevOps резюме
```

---

## 🌟 Ключевой функционал платформы

1. **База вопросов со ступенчатой градацией (Junior / Middle / Senior)** — Детальные разборы архитектурных, концептуальных и практических вопросов по Docker, Kubernetes, Terraform, Linux, CI/CD, Сети и Мониторингу.
2. **Симулятор Incident Management** — Практические сценарии ликвидации продакшен-аварий с анализом логов, гипотезами и разбором ошибок.
3. **DevOps Roadmap** — Пошаговая карта навыков с отслеживанием прогресса по каждой категории.
4. **Ежедневный Блиц (Daily Blitz)** — Уникальный набор из 5 вопросов каждый день для сохранения непрерывного трека обучения (Daily Streak).
5. **Геймификация и ранги** — Система XP, уровней и наград для поддержания высокой мотивации.
6. **Конструктор формулировок опыта (STAR Legend Builder)** — Инструмент для перевода ежедневных задач в сильные достижения для резюме.
7. **Интерактивные CLI-шпаргалки** — Команды Linux, Docker, kubectl, Git, Terraform с быстрым поиском и копированием в один клик.
8. **Облачная синхронизация** — Поддержка бесшовной синхронизации прогресса с Firebase Firestore.

---

## 📄 Лицензия (License)

Этот проект распространяется под открытой лицензией **[MIT License](LICENSE.md)**.

```text
Copyright (c) 2026 DevOps Pro

Данное программное обеспечение предоставляется «как есть» (AS IS), без каких-либо гарантий.
Вы можете свободно использовать, модифицировать, копировать, распространять и интегрировать 
его в коммерческие и некоммерческие проекты.
```

Полный текст лицензионного соглашения находится в файле **[LICENSE.md](LICENSE.md)**.

