import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily/safely if GEMINI_API_KEY is available
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// API Routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "DevOps Pro API" });
});

// Mock Interview AI route
app.post("/api/ai/interview-chat", async (req, res) => {
  try {
    const { message, history, level, role } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Smart offline fallback
      const offlineReplies = [
        `Отличный ответ! Раскройте подробнее, как именно вы настраивали мониторинг и алертинг в вашем случае (Prometheus, Grafana, Alertmanager)? Какие метрики были ключевыми?`,
        `Принято. А если на продакшене у нас произошел Split-brain в Kubernetes кластере или узел перешел в NotReady, какие будут ваши первые 3 команды и действия для диагностики?`,
        `Хорошее техническое объяснение. Расскажите, как вы организовывали CI/CD пайплайн (например, в GitLab CI или GitHub Actions): использовались ли Docker-in-Docker, кэширование слоев, секреты и стратегии деплоя (Canary/Blue-Green)?`,
        `Спасибо за развернутый ответ! Оцените по шкале 1-10 ваш опыт работы с Terraform/IaC: как вы храните state, обрабатываете чувствительные переменные и защищаетесь от одновременных запусков (state locking)?`,
        `Интересный кейс. Можете привести пример реальной аварии (Incident), которую вы расследовали в Production? Какая была корневая причина (Root Cause) и как вы ее устранили?`
      ];
      const randomReply = offlineReplies[Math.floor(Math.random() * offlineReplies.length)];
      return res.json({
        reply: `[Демо-режим AI] ${randomReply}`,
        score: Math.floor(Math.random() * 3) + 7,
        feedback: "Ответ технически грамотный, использована хорошая терминология. Включает базовые архитектурные аспекты.",
      });
    }

    const systemPrompt = `Вы — Senior DevOps / Infrastructure Tech Lead, проводите техническое собеседование с кандидатом на позицию DevOps Engineer (уровень: ${level || 'Middle'}).
Задавайте глубокие практические вопросы, проверяйте знания Linux, Docker, Kubernetes, CI/CD, Terraform, мониторинга и сетей.
Если кандидат ответил, кратко оцените его ответ (плюсы и что стоит дополнить) и задайте 1 следующий уточняющий или новый технический вопрос.
Будьте профессиональны, доброжелательны, ответьте на русском языке.`;

    const chatContext = history && Array.isArray(history) 
      ? history.map((h: any) => `${h.sender === 'user' ? 'Кандидат' : 'Интервьюер'}: ${h.text}`).join('\n')
      : '';

    const fullPrompt = `${systemPrompt}\n\nИстория диалога:\n${chatContext}\n\nКандидат говорит: ${message}\n\nДай конструктивный ответ, краткую оценку ответа и следующий вопрос.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: fullPrompt,
    });

    res.json({
      reply: response.text || "Извините, не удалось сформировать ответ. Попробуйте еще раз.",
    });
  } catch (error: any) {
    console.error("AI Interview error:", error);
    res.status(500).json({
      error: "Ошибка генерации AI",
      reply: "Не удалось подключиться к AI серверу. Проверьте подключение.",
    });
  }
});

// Experience Legend Polish AI route
app.post("/api/ai/legend-polish", async (req, res) => {
  try {
    const { company, role, projectDesc, stack, architecture, metrics, incidentStory } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        polishedLegend: `Проект: ${company || "Enterprise Cloud Platform"}\nРоль: ${role || "DevOps / Infrastructure Engineer"}\n\nСтек: ${stack || "Kubernetes, Docker, Terraform, GitLab CI, Prometheus, Helm"}\n\nАрхитектура & Задачи:\n- Проектирование и сопровождение отказоустойчивой инфраструктуры на базе Kubernetes (3 кластера: Dev, Staging, Prod).\n- Внедрение GitOps подходов c ArgoCD и Helm чартами для автоматизации релизного цикла.\n- Оптимизация сборки Docker-образов (multi-stage builds, кэширование слоев) — сокращение времени CI/CD на 65%.\n- Настройка мониторинга (Prometheus + Grafana + Alertmanager) и трассировки (Jaeger) с более чем 40 готовыми дашбордами.\n\nКлючевой инцидент и решение:\n${incidentStory || "Успешное устранение OOMKilled падений пода во время распродажи путем перенастройки ресурсоемких лимитов (limits/requests), масштабирования HPA и оптимизации JVM heap."}\n\nМетрики и результаты:\n- ${metrics || "Аптайм 99.95%, время деплоя уменьшено с 35 до 6 минут."}`,
        tips: [
          "Обязательно выучите точные версии инструментов (например, K8s 1.28, Terraform 1.5, PostgreSQL 15).",
          "Будьте готовы нарисовать схему архитектуры проекта на виртуальной доске (Excalidraw).",
          "При ответе на вопросы о проекте фокусируйтесь на вашей личной роли и бизнесе, а не абстрактной команде."
        ]
      });
    }

    const prompt = `Вы — эксперт по карьерному консультированию DevOps инженеров.
Превратите следующие вводные данные о проекте кандидата в профессиональную, звучащую натурально и убедительно "Легенду коммерческого опыта" (Work Experience Story) для собеседования.

Вводные данные:
- Компания/Проект: ${company}
- Роль: ${role}
- Описание проекта: ${projectDesc}
- Стек технологий: ${stack}
- Архитектурные детали: ${architecture}
- Метрики и результаты: ${metrics}
- Описание разборок инцидента: ${incidentStory}

Напишите:
1) Готовый связный текст самопрезентации (Как говорить на собеседовании "Расскажите о вашем последнем проекте").
2) Список из 3-4 вероятных каверзных вопросов от интервьюера по этой легенде и как на них отвечать.
Ответьте на русском языке в красивом структурированном Markdown.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    res.json({
      polishedLegend: response.text,
      tips: [
        "Будьте готовы назвать конкретные метрики и цифры.",
        "Тренируйте рассказ перед зеркалом или на диктофон.",
        "Не заучивайте текст слово в слово — говорите как о реально пережитом опыте."
      ]
    });
  } catch (error: any) {
    console.error("AI Legend polish error:", error);
    res.status(500).json({ error: "Ошибка обработки легенды" });
  }
});

// Resume Feedback AI route
app.post("/api/ai/resume-feedback", async (req, res) => {
  try {
    const { resumeText } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        feedback: `Ваше резюме содержит хорошие ключевые слова (Kubernetes, Docker, CI/CD).
Рекомендации по улучшению:
1. Замените глаголы процесса ("Занимался поддержкой") на глаголы результата ("Внедрил", "Оптимизировал", "Сократил").
2. Добавьте больше метрик: время прохождения пайплайнов, процент покрытия IaC, показатели MTTR/MTTD, экономия облачного бюджета (FinOps).
3. Уберите устаревшие или второстепенные технологии из верхнего блока навыков.`,
        score: 82,
      });
    }

    const prompt = `Проанализируйте следующий фрагмент резюме DevOps инженера:\n\n${resumeText}\n\nДайте конструктивный фидбек:
1. Сильные стороны
2. Что исправить (формулировки, глаголы действия, метрики)
3. Оценка готовности к резюме Middle/Senior (в процентах от 0 до 100).
Ответьте на русском языке.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    res.json({
      feedback: response.text,
      score: 85
    });
  } catch (error: any) {
    console.error("AI Resume error:", error);
    res.status(500).json({ error: "Ошибка анализа резюме" });
  }
});

// Start Express + Vite
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 DevOps Pro Server running on http://localhost:${PORT}`);
  });
}

startServer();
