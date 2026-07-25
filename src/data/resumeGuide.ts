import { ResumeChecklistItem } from '../types';

export const RESUME_CHECKLIST: ResumeChecklistItem[] = [
  {
    id: 'chk-1',
    category: 'Structure',
    title: 'Лаконичный объем (1-2 страницы PDF)',
    description: 'Резюме не должно превышать 2 страницы. Нанимающие менеджеры тратят на просмотр в среднем 10-15 секунд.',
    impact: 'Essential'
  },
  {
    id: 'chk-2',
    category: 'Skills',
    title: 'Релевантные ключевые слова для ATS (Applicant Tracking System)',
    description: 'Включите точные названия технологий: Kubernetes, Docker, Terraform, Helm, GitLab CI, Prometheus, Linux, Bash, Python, Go, Ansible, Vault.',
    impact: 'High'
  },
  {
    id: 'chk-3',
    category: 'Metrics',
    title: 'Каждая обязанность — это результат с цифрой',
    description: 'Вместо "Занимался настройкой мониторинга" пишите: "Внедрил мониторинг Prometheus+Grafana, сократив время обнаружения аварией (MTTD) на 60%".',
    impact: 'High'
  },
  {
    id: 'chk-4',
    category: 'Structure',
    title: 'Краткое резюме "О себе" (Summary / Profile)',
    description: '3-4 строчки вверху резюме: "DevOps Engineer с 3+ годами опыта в автоматизации CI/CD, управлении Kubernetes кластерами и IaC (Terraform). Сфокусирован на высокой доступности и FinOps".',
    impact: 'Medium'
  },
  {
    id: 'chk-5',
    category: 'Language',
    title: 'Сильные глаголы действия (Action Verbs)',
    description: 'Используйте глаголы прошедшего времени: Внедрил, Спроектировал, Оптимизировал, Сократил, Автоматизировал, Перевел, Устранил.',
    impact: 'High'
  }
];

export const POWER_PHRASES = [
  'Спроектировал и развернул отказоустойчивые Kubernetes кластеры (Bare-metal / Managed Yandex Cloud / EKS)',
  'Перевел 50+ микросервисов с ручного деплоя на автоматизированный GitOps (ArgoCD + Helm)',
  'Оптимизировал сборку Docker образов с применением Multi-stage сборок, уменьшив размер образов на 70%',
  'Разработал модули Terraform с поддержкой Remote State S3 + DynamoDB locking для описания всей инфраструктуры',
  'Внедрил стек Observability (Prometheus, Grafana, Loki, Alertmanager) с гибкой системой оповещений в Telegram/PagerDuty',
  'Внедрил практики DevSecOps: сканирование уязвимостей (Trivy, SonarQube) и централизованное хранение секретов в HashiCorp Vault'
];
