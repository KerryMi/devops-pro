export interface SkillOfDay {
  id: string;
  title: string;
  category: 'docker' | 'k8s' | 'linux' | 'cicd' | 'terraform' | 'networking' | 'monitoring';
  categoryLabel: string;
  code?: string;
  description: string;
  whyImportant: string;
  targetTab: 'questions' | 'flashcards' | 'cheatsheet' | 'incidents';
  targetCategoryFilter?: string;
}

export const SKILLS_OF_THE_DAY: SkillOfDay[] = [
  {
    id: 'skill-docker-multistage',
    title: 'Мультистадийная сборка (Multi-stage builds) в Docker',
    category: 'docker',
    categoryLabel: 'Docker',
    code: `FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY . .
RUN go build -o server .

FROM alpine:3.19
COPY --from=builder /app/server /server
CMD ["/server"]`,
    description: 'Разделение процесса сборки и финального runtime-образа позволяет уменьшить размер итогового контейнера с 800MB до 15MB и скрыть компиляторы и исходный код.',
    whyImportant: 'Спрашивают на 90% собеседований по Docker для проверки навыка оптимизации безопасных и легких продакшн-образов.',
    targetTab: 'questions',
    targetCategoryFilter: 'docker'
  },
  {
    id: 'skill-k8s-probes',
    title: 'Liveness vs Readiness vs Startup Probes в Kubernetes',
    category: 'k8s',
    categoryLabel: 'Kubernetes',
    code: `livenessProbe:
  httpGet:
    path: /healthz
    port: 8080
readinessProbe:
  httpGet:
    path: /ready
    port: 8080`,
    description: 'Liveness перезапускает застрявший контейнер, Readiness временно исключает под из трафика Service, а Startup защищает медленно стартующие сервисы.',
    whyImportant: 'Неверная Liveness проба при падении внешней БД приведет к каскадному перезапуску всей системы (Cascading Failure).',
    targetTab: 'questions',
    targetCategoryFilter: 'k8s'
  },
  {
    id: 'skill-k8s-debug-netshoot',
    title: 'Сетевая отладка подов с помощью netshoot',
    category: 'k8s',
    categoryLabel: 'Kubernetes',
    code: `kubectl run tmp-shell --rm -i --tty --image=nicolaka/netshoot -- bash`,
    description: 'Запуск одноразового пода с утилитами curl, tcpdump, dig, iproute2 и mtr прямо в кластере для мгновенной проверки сетевой связности.',
    whyImportant: 'Незаменимый инструмент SRE-инженера для поиска заблокированных портов, DNS-сбоев и проблем с CNI.',
    targetTab: 'cheatsheet',
    targetCategoryFilter: 'kubectl'
  },
  {
    id: 'skill-linux-proc',
    title: 'Анализ процессов через виртуальную FS /proc',
    category: 'linux',
    categoryLabel: 'Linux',
    code: `cat /proc/<PID>/status | grep -E "VmSize|VmRSS|Threads"`,
    description: 'Файловая система /proc — прямое окно в ядро Linux. Чтение файлов /proc/<PID>/ позволяет узнать потребление памяти и лимиты без установки сторонних утилит.',
    whyImportant: 'Показывает глубокое понимание устройства ядра Linux и системы виртуальной памяти на собеседованиях.',
    targetTab: 'questions',
    targetCategoryFilter: 'linux'
  },
  {
    id: 'skill-docker-pid1',
    title: 'Проблема PID 1 и обработка сигналов SIGTERM',
    category: 'docker',
    categoryLabel: 'Docker',
    code: `#!/bin/sh
# Использование exec подменяет PID 1 shell-скрипта на приложение
exec java -jar /app/service.jar`,
    description: 'Команда exec подменяет текущий процесса оболочки. Без нее приложение в контейнере не получит SIGTERM от Docker и будет грубо убито по таймауту через 10 сек.',
    whyImportant: 'Защищает сервис от потери активных пользовательских транзакций при автомасштабировании и деплое.',
    targetTab: 'questions',
    targetCategoryFilter: 'docker'
  },
  {
    id: 'skill-tf-statelock',
    title: 'Блокировка состояния (State Lock) в Terraform',
    category: 'terraform',
    categoryLabel: 'Terraform',
    code: `terraform {
  backend "s3" {
    bucket         = "tf-state-prod"
    key            = "prod/terraform.tfstate"
    dynamodb_table = "terraform-locks"
  }
}`,
    description: 'Удаленный бэкенд с DynamoDB или Postgres предотвращает одновременный запуск terraform apply несколькими инженерами и затирание инфраструктуры.',
    whyImportant: 'Критическое требование для организации безопасной командной работы с IaC в продакшне.',
    targetTab: 'questions',
    targetCategoryFilter: 'terraform'
  },
  {
    id: 'skill-cicd-cache',
    title: 'Оптимизация скорости CI/CD через кэширование',
    category: 'cicd',
    categoryLabel: 'CI/CD',
    code: `- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: \${{ runner.os }}-node-\${{ hashFiles('**/package-lock.json') }}`,
    description: 'Сохранение каталогов зависимостей пакетов ускоряет прохождение пайплайнов в 5-10 раз и снижает нагрузку на внешний интернет.',
    whyImportant: 'Оценивает экономическое понимание DevOps: ускоряет поставку фич (Time-to-Market) и снижает счета за CI-раннеры.',
    targetTab: 'questions',
    targetCategoryFilter: 'cicd'
  },
  {
    id: 'skill-net-timewait',
    title: 'Борьба с сокетами в состоянии TIME_WAIT',
    category: 'networking',
    categoryLabel: 'Networks',
    code: `ss -s && netstat -an | grep TIME_WAIT | wc -l`,
    description: 'Множество сокетов в TIME_WAIT возникает при частых коротких TCP-соединениях. Включение HTTP Keep-Alive позволяет переиспользовать сокеты под высокой нагрузкой.',
    whyImportant: 'Фундаментальная тема при отладке высоких нагрузок (Highload) и микросервисного взаимодействия.',
    targetTab: 'questions',
    targetCategoryFilter: 'networking'
  }
];

/**
 * Gets a skill based on current date, or allows random index
 */
export function getSkillOfTheDay(customIndex?: number): SkillOfDay {
  if (customIndex !== undefined) {
    const idx = Math.abs(customIndex) % SKILLS_OF_THE_DAY.length;
    return SKILLS_OF_THE_DAY[idx];
  }
  
  // Calculate index based on current date (YYYY-MM-DD)
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  const idx = dayOfYear % SKILLS_OF_THE_DAY.length;
  return SKILLS_OF_THE_DAY[idx];
}
