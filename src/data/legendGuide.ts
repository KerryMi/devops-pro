export interface LegendTemplate {
  id: string;
  title: string;
  role: string;
  companyType: string;
  summary: string;
  stack: string[];
  architecture: string;
  incidentStory: string;
  metrics: string[];
}

export const LEGEND_TEMPLATES: LegendTemplate[] = [
  {
    id: 'tpl-fintech',
    title: 'Финтех / Высоконагруженный Банкинг (High-Load FinTech)',
    role: 'DevOps / Infrastructure Engineer',
    companyType: 'Крупный Финтех / Необанк (200+ микросервисов)',
    summary: 'Поддержка и развитие отказоустойчивой банковской платформы обработки транзакций. Переход с самописных скриптов на GitOps (ArgoCD + Helm) и IaC (Terraform).',
    stack: ['Kubernetes (Bare-metal + Kube-Spray)', 'Terraform', 'GitLab CI', 'ArgoCD', 'Prometheus', 'Grafana', 'Vault', 'Kafka', 'PostgreSQL'],
    architecture: 'Три географически распределенных дата-центра (Active-Active). Настройка BGP маршрутизации и Calico CNI. Хранение секретов в HashiCorp Vault с авторотацией.',
    incidentStory: 'Во время пиковых скидок 11.11 возник флуд логов в Elasticsearch, из-за чего Fluentbit исчерпал память и выпал в OOM. Настроили шину Kafka в качестве буфера логов перед индексацией и добавили rate-limiting на стороне приложения.',
    metrics: [
      'Уменьшил MTTR (Mean Time To Recovery) с 45 до 12 минут за счет алертинга в Telegram/Opsgenie.',
      'Ускорил сборку и проверку безопасность Docker-образов в CI/CD с 18 минут до 4 минут.',
      'Достиг показателя SLA 99.98% availability для сервиса платежного шлюза.'
    ]
  },
  {
    id: 'tpl-ecom',
    title: 'E-Commerce / Ритейл Платформа (Cloud Hybrid)',
    role: 'Middle/Senior DevOps Engineer',
    companyType: 'Маркетплейс / Онлайн-ритейлер',
    summary: 'Создание облачной инфраструктуры с нуля в Yandex Cloud / AWS. Миграция монолита на микросервисы в Managed Kubernetes.',
    stack: ['Yandex Cloud (YMK)', 'AWS EKS', 'Terraform', 'Helm', 'GitHub Actions', 'Datadog', 'Redis Cluster', 'Nginx Ingress'],
    architecture: 'Гибридная инфраструктура. Автомасштабирование нод через Cluster Autoscaler и подов через HPA/KEDA на основе очереди заказов в RabbitMQ.',
    incidentStory: 'База данных PostgreSQL под высокой нагрузкой исчерпала лимит соединений (max_connections). Быстро развернули PGBouncer для коннекшн-пулинга и настроили пробы готовности (Readiness Probes), спася сервис от падения.',
    metrics: [
      'Сократил затраты на облако (FinOps) на $3,500/мес за счет использования Spot/Preemptible инстансов.',
      'Автоматизировал разворачивание тестовых стендов (Feature Environments) по клику в Merge Request.'
    ]
  }
];

export const LEGEND_RULES = [
  {
    step: '1. Формулировка роли и сферы',
    rule: 'Не говорите "Я был единственным эникеем". Формулируйте так: "Я входил в команду инфраструктуры из 4 человек и отвечал за CI/CD, Kubernetes и IaC".'
  },
  {
    step: '2. Четкий стек и версии',
    rule: 'Интервьюер спросит "Какая версия K8s/Terraform у вас была?". Всегда знайте точный стек: например K8s 1.28, Terraform 1.5, GitLab CI, Helm v3.'
  },
  {
    step: '3. История факапа / инцидента (STAR метод)',
    rule: 'На собеседовании ВСЕГДА спрашивают: "Расскажите про самый тяжелый факап на проде". Подготовьте историю по схеме STAR: Situation (ситуация), Task (задача), Action (ваши действия), Result (выводы и внедренные предохранители).'
  },
  {
    step: '4. Метрики и цифры',
    rule: 'Технический лидер верит цифрам: "Уменьшил время деплоя с 40 мин до 5 мин", "Аптайм 99.95%", "Снизил облачный чек на 30%".'
  }
];
