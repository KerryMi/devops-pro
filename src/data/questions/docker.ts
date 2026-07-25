import { Question } from '../../types';

export const DOCKER_QUESTIONS: Question[] = [
  {
    id: 'docker-1',
    title: 'Чем отличаются Docker image и Docker container? Из чего состоит образ?',
    category: 'docker',
    difficulty: 'Junior',
    summaryAnswer: 'Docker Image — это неизменяемый (read-only) шаблон со слоями файловой системы. Container — это запущенный экземпляр образа с добавленным поверх тонким слоем чтение-запись (Read-Write layer).',
    fullAnswer: `Docker Образ состоит из последовательности read-only слоев (UnionFS / OverlayFS). Каждый слой представляет собой изменения (diff) по сравнению с предыдущим.
При запуске контейнера движок Docker создаёт поверх всех слоев образа один тонкий слой запись/чтение (R/W Container Layer).
Если приложение внутри контейнера изменяет существующий файл из образа, срабатывает механизм Copy-on-Write (CoW): файл копируется из нижнего read-only слоя в верхний R/W слой, где и модифицируется.`,
    codeSnippet: {
      language: 'bash',
      code: `docker history my-app:latest # просмотр слоев образа
docker inspect my-container # данные о слоях и монтировании (GraphDriver/Overlay2)`
    },
    interviewTips: [
      'Упомяните термины Overlay2 и Copy-on-Write (CoW). Это покажет понимание работы Linux файловых систем.',
      'Расскажите, что очистка контейнера удаляет весь R/W слой, поэтому данные сохраняют через Volumes или Bind Mounts.'
    ],
    commonPitfalls: [
      'Путать контейнер с виртуальной машиной. В контейнерах нет своего ядра OS, они используют ядро хоста.'
    ],
    tags: ['Docker', 'Containers', 'OverlayFS', 'Storage']
  },
  {
    id: 'docker-2',
    title: 'Как устроена Multi-Stage сборка в Docker и зачем она нужна?',
    category: 'docker',
    difficulty: 'Middle',
    summaryAnswer: 'Multi-stage сборка позволяет использовать несколько инструкций FROM в одном Dockerfile. Это изолирует стадию компиляции со всеми тяжелыми SDK/зависимостями от финального легкого рантайм-образа.',
    fullAnswer: `Без multi-stage приходится либо собирать бинарник внешним скриптом, либо иметь финишный образ размером в гигабайты (содержащий gcc, go sdk, node_modules и исходники).
С multi-stage первая стадия (builder) компилирует проект, а вторая стадия использует минимальный базовый образ (например, alpine или scratch / distroless) и копирует только итоговый скомпилированный бинарник командой COPY --from=builder.`,
    codeSnippet: {
      language: 'dockerfile',
      code: `# Stage 1: Build
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# Stage 2: Minimal Runtime
FROM scratch
COPY --from=builder /app/main /main
ENTRYPOINT ["/main"]`
    },
    interviewTips: [
      'Отметьте сокращение размера образа с 1 ГБ+ до 15-20 МБ.',
      'Укажите безопасность: в финальном образе нет компиляторов и утилит, которыми может воспользоваться злоумышленник (Zero Trust).'
    ],
    commonPitfalls: [
      'Забывать использовать COPY --from=stage_name для переноса скомпилированных артефактов.'
    ],
    tags: ['Docker', 'Multi-stage', 'Optimization', 'Security']
  },
  {
    id: 'docker-3',
    title: 'В чем разница между ENTRYPOINT и CMD в Dockerfile?',
    category: 'docker',
    difficulty: 'Junior',
    summaryAnswer: 'ENTRYPOINT определяет бинарный файл/скрипт, который будет выполняться всегда при запуске. CMD задает параметры по умолчанию для ENTRYPOINT или команду по умолчанию, которую легко переопределить из CLI.',
    fullAnswer: `Существует два формата записи: Exec form (["executable", "param1"]) и Shell form ("command param1"). Всегда стоит использовать Exec form, чтобы команда запускалась как PID 1 без дополнительной оборачивающей оболочки /bin/sh -c (это критично для проброса сигнала SIGTERM).

Сценарии:
1. Только ENTRYPOINT ["/bin/app"]: всегда запускает /bin/app. Переданные параметры через "docker run image arg1" добавятся в конец.
2. Только CMD ["/bin/app", "--config"]: запускает /bin/app. Любой аргумент в "docker run image my-cmd" полностью заменяет CMD.
3. ENTRYPOINT ["/bin/app"] + CMD ["--default-arg"]: ENTRYPOINT задает исполняемый файл, CMD дает дефолтный флаг, который пользователь может переопределить при запуске.`,
    codeSnippet: {
      language: 'dockerfile',
      code: `# Рекомендуемый шаблонизированный подход
ENTRYPOINT ["/usr/bin/python3", "main.py"]
CMD ["--port", "8080"]`
    },
    interviewTips: [
      'Подчеркните важность сигнала SIGTERM и PID 1: shell-форма препятствует грациозной остановке (graceful shutdown).',
      'Расскажите про использование entrypoint.sh скрипта для вызова exec "$@".'
    ],
    commonPitfalls: [
      'Использование shell-формы ENTRYPOINT python app.py — это приводит к тому, что контейнер не реагирует на docker stop вовремя.'
    ],
    tags: ['Docker', 'Dockerfile', 'ENTRYPOINT', 'CMD', 'PID1']
  },
  {
    id: 'docker-4',
    title: 'Какие механизмы изоляции ядра Linux использует Docker?',
    category: 'docker',
    difficulty: 'Middle',
    summaryAnswer: 'Docker использует 3 ключевых фичи ядра Linux: Namespaces (для изоляции видимости ресурсов), Cgroups (для ограничения использования ресурсов CPU/RAM) и Capabilities/Seccomp/AppArmor (для ограничения прав).',
    fullAnswer: `1. Namespaces (Пространства имен) — отвечают за то, ЧТО процесс МОЖЕТ ВИДЕТЬ:
   - PID (изоляция процессов)
   - NET (изоляция сетевых интерфейсов, портов и IP)
   - MNT (изоляция точек монтирования ФС)
   - IPC (изоляция межпроцессного взаимодействия)
   - UTS (изоляция имени хоста и домена)
   - USER (изоляция UID/GID)

2. Cgroups (Control Groups v1/v2) — отвечают за то, СКОЛЬКО РЕСУРСОВ процесс МОЖЕТ ИСПОЛЬЗУЕТ:
   - Ограничение и лимиты по CPU, Памяти (Memory), Disk I/O, PIDs.

3. Capabilities & Seccomp — обеспечивают безопасность:
   - Capabilities разделяют полномочия root на мелкие права (например, CAP_NET_ADMIN, CAP_SYS_PTRACE).
   - Seccomp фильтрует системные вызовы к ядру.`,
    codeSnippet: {
      language: 'bash',
      code: `# Ограничение памяти и проброс прав
docker run -d --memory="512m" --cpus="1.5" --cap-drop=ALL --cap-add=NET_BIND_SERVICE my-app`
    },
    interviewTips: [
      'Сформулируйте емкое правило: "Namespaces — видимость, Cgroups — лимиты, Capabilities — права". Это приводит в восторг интервьюеров.'
    ],
    commonPitfalls: [
      'Отвечать "docker использует гипервизор". Контейнеризация — это изоляция на уровне ОС, а не аппаратная виртуализация.'
    ],
    tags: ['Docker', 'Linux', 'Namespaces', 'Cgroups', 'Security']
  },
  {
    id: 'docker-5',
    title: 'В чем разница между COPY и ADD в Dockerfile? Как использовать .dockerignore?',
    category: 'docker',
    difficulty: 'Junior',
    summaryAnswer: 'COPY просто копирует файлы с хоста в образ. ADD дополнительно умеет автоматически распаковывать локальные tar-архивы и скачивать файлы по URL. Рекомендуется всегда использовать COPY.',
    fullAnswer: `Инструкция COPY безопасна и предсказуема. Инструкция ADD обладает скрытым функционалом:
1. Распаковка архивов: если указать локальный tar.gz, ADD автоматически распакует его в целевую папку.
2. Скачивание по URL: скачивание файлов из интернета прямо при сборке (но это плохая практика, так как создаются неоптимизированные слои).

Официальные бест-практики Docker рекомендуют использовать COPY во всех случаях. Если нужно скачать и распаковать архив, лучше выполнить RUN curl/wget | tar в одном слое.

.dockerignore работает аналогично .gitignore. Он исключает из контекста сборки (Build Context) папки node_modules, .git, venv, логи и секретные файлы .env, ускоряя отправку контекста демону.`,
    codeSnippet: {
      language: 'dockerfile',
      code: `# Пример безопасного использования COPY
COPY package*.json ./
RUN npm ci
COPY . .`
    },
    interviewTips: [
      'Расскажите, что без .dockerignore Docker Client упаковывает всю папку проекта в tar и шлет демону (Sending build context to Docker daemon), что может длиться минуты из-за node_modules или .git.'
    ],
    commonPitfalls: [
      'Использовать ADD для обычной пересылки файлов.'
    ],
    tags: ['Docker', 'Dockerfile', 'COPY', 'ADD', 'Context']
  },
  {
    id: 'docker-6',
    title: 'Какие сетевые драйверы (Network Drivers) есть в Docker?',
    category: 'docker',
    difficulty: 'Middle',
    summaryAnswer: 'Основные драйверы: Bridge (виртуальный мост по умолчанию), Host (использует сетевой стек хоста напрямую), None (полная изоляция сети), Overlay (для связи контейнеров на разных хостах в Swarm).',
    fullAnswer: `1. **Bridge** (по умолчанию): Docker создает виртуальный мост (docker0). Контейнеры получают внутренние IP (172.17.x.x).
   - В кастомных (User-defined) bridge сетях работает встроенный DNS Docker, позволяя контейнерам связываться по именам сервисов! В дефолтной сети bridge DNS по именам не работает.
2. **Host**: Контейнер разделяет сетевое пространство хоста. Порт контейнера 80 становится портом 80 на хост-машине без NAT. Дает максимальную производительность сети.
3. **None**: Сетевой стек отключается, остаётся только loopback (127.0.0.1). Идеально для безопасных изолированных вычислений.
4. **Overlay**: Распределенная сеть поверх физической (VXLAN), используемая в Docker Swarm для связи контейнеров на разных физических серверах.`,
    codeSnippet: {
      language: 'bash',
      code: `# Создание кастомной bridge сети с внутренним DNS
docker network create my-net
docker run -d --name db --network my-net postgres
docker run -d --name app --network my-net my-app # теперь app может стучаться к 'db'`
    },
    interviewTips: [
      'Подчеркните разницу: в дефолтном bridge нет DNS по именам, а в custom bridge — есть!'
    ],
    commonPitfalls: [
      'Пробрасывать порты базовой БД наружу (-p 5432:5432) вместо того, чтобы связывать приложения через изолированную пользовательскую сеть.'
    ],
    tags: ['Docker', 'Networking', 'Bridge', 'DNS', 'Overlay']
  },
  {
    id: 'docker-7',
    title: 'Чем отличаются Docker Volumes от Bind Mounts?',
    category: 'docker',
    difficulty: 'Junior',
    summaryAnswer: 'Volumes управляются самим Docker и хранятся в /var/lib/docker/volumes. Bind Mounts привязывают произвольную папку с хост-машины внутрь контейнера.',
    fullAnswer: `По умолчанию данные в контейнере эфемерны (удаляются вместе с R/W слоем контейнера).

1. **Docker Volumes (Тома)**:
   - Полностью управляются Docker CLI (docker volume create).
   - Безопасны, переносимы, поддерживают драйверы (например, облачные хранилища S3/NFS).
   - Выделенная папка на сервере (/var/lib/docker/volumes/name/_data).
   - Рекомендуются для продакшна и баз данных (Postgres, MySQL).

2. **Bind Mounts**:
   - Привязывают конкретный абсолютный путь с хост-машины (например, -v /home/user/app:/app).
   - Зависят от структуры файловой системы конкретного сервера.
   - Идеальны для локальной разработки (hot-reload кода).`,
    codeSnippet: {
      language: 'bash',
      code: `# Запуск с Volume (Pro):
docker run -v pg_data:/var/lib/postgresql/data postgres

# Запуск с Bind Mount (Dev):
docker run -v $(pwd)/src:/app/src node`
    },
    interviewTips: [
      'Упомяните утилиту docker volume prune для очистки неиспользуемых "сиротских" томов.'
    ],
    commonPitfalls: [
      'Записывать базы данных прямо в слой записи контейнера без использования Volumes.'
    ],
    tags: ['Docker', 'Volumes', 'Storage', 'BindMount']
  },
  {
    id: 'docker-8',
    title: 'Почему использование тега :latest запрещено в продакшене?',
    category: 'docker',
    difficulty: 'Junior',
    summaryAnswer: ':latest не гарантирует неизменяемость (Immutability). Это просто указатель на последний загруженный образ. Перезапуск контейнера может скачать сломанную версию.',
    fullAnswer: `Тег :latest вешается по умолчанию, если тег не указан.
Проблемы в продакшене:
1. **Нарушение детерминированности**: два разных деплоя в разное время могут скачать разные сборки.
2. **Кэширование**: Kubernetes по умолчанию с политикой imagePullPolicy: IfNotPresent может не скачать обновленный :latest образ, если на ноде лежит старый.
3. **Невозможность быстрого отката (Rollback)**: нельзя откатиться на "предыдущую версию", так как у вас нет хэша или версии.

**Лучшие практики версионирования**:
- Использовать SemVer (v1.2.3) для релизов.
- Использовать Git Commit SHA (app:a1b2c3d) для CI/CD пайплайнов.`,
    codeSnippet: {
      language: 'dockerfile',
      code: `# Плохо:
FROM node:latest

# Хорошо:
FROM node:20.11-alpine`
    },
    interviewTips: [
      'Упомяните тегирование по хэшу коммита (Git SHA) для 100% прослеживаемости артефакта.'
    ],
    commonPitfalls: [
      'Полагаться на :latest в прод-манифестах Kubernetes.'
    ],
    tags: ['Docker', 'Registry', 'BestPractices', 'Versioning']
  },
  {
    id: 'docker-9',
    title: 'Что такое Kata Containers и в чем их отличие от обычных контейнеров?',
    category: 'docker',
    difficulty: 'Senior',
    summaryAnswer: 'Kata Containers — это контейнеры, работающие внутри облегченных виртуальных машин (QEMU/KVM). Они объединяют скорость контейнеров и аппаратную изоляцию VM.',
    fullAnswer: `Обычные контейнеры разделяют общее ядро Linux хоста. Если в ядре есть уязвимость (Container Breakout), злоумышленник может получить доступ к хост-системе.

Kata Containers заменяют стандартный рантайм runc на специализированный виртуализированный рантайм. Каждая группа контейнеров заводится в своей изолированной микро-ВМ со своим собственным выделенным ядром Linux.
Это обеспечивает мандатную безопасность при мультиарендности (Multi-tenancy) и запуске ненадежного пользовательского кода.`,
    codeSnippet: {
      language: 'bash',
      code: `# Запуск контейнера через Kata Runtime
docker run --runtime=kata-qemu -d nginx`
    },
    interviewTips: [
      'Упомяните соответствие спецификации OCI (Open Container Initiative) и подддержку CRI в Kubernetes.'
    ],
    commonPitfalls: [
      'Путать Kata с Docker Desktop на Windows/Mac.'
    ],
    tags: ['Docker', 'KataContainers', 'Security', 'Virtualization']
  },
  {
    id: 'docker-10',
    title: 'Как оптимизировать кэширование слоев (Layer Caching) при написании Dockerfile?',
    category: 'docker',
    difficulty: 'Middle',
    summaryAnswer: 'Располагать редко меняющиеся инструкции (установка системных пакетов, зависимостей) выше, а часто меняющиеся (исходный код) — ближе к концу Dockerfile.',
    fullAnswer: `Docker проверяет кэш слоев сверху вниз. Если один из слоев изменился (например, изменился захешированный файл в COPY), кэш инвалидируется для этого слоя и ВСЕХ последующих инструкций.

**Стратегия оптимизации**:
1. Копировать файлы манифеста зависимостей (package.json, go.mod, requirements.txt) и выполнять их установку ДО копирования исходного кода приложения.
2. Объединять команды установки системных утилит в один RUN с очисткой кэша пакетов (rm -rf /var/lib/apt/lists/*).
3. Использовать BuildKit маунты кэша: RUN --mount=type=cache,target=/root/.cache/go-build.`,
    codeSnippet: {
      language: 'dockerfile',
      code: `# Правильный порядок слоев:
COPY package.json package-lock.json ./
RUN npm ci # Эффективно кэшируется!
COPY . . # Меняется при каждом коммите`
    },
    interviewTips: [
      'Упомяните флаг DOCKER_BUILDKIT=1 и встроенные маунты RUN --mount=type=cache.'
    ],
    commonPitfalls: [
      'Делать COPY . . в самом начале Dockerfile перед RUN npm install.'
    ],
    tags: ['Docker', 'Optimization', 'BuildKit', 'Caching']
  },
  {
    id: 'docker-11',
    title: 'Зачем создавать не-root пользователя (Non-root user) внутри контейнера?',
    category: 'docker',
    difficulty: 'Middle',
    summaryAnswer: 'По умолчанию процессы в контейнере запущены от root (UID 0). При побеге из контейнера (Container Escape) злоумышленник получит права root на хост-системе.',
    fullAnswer: `Несмотря на cgroups и namespaces, запуск от root внутри контейнера повышает вектор атаки.
Создание выделенного системного пользователя без прав sudo снижает риски эскалации привилегий.

В Dockerfile нужно создать группу и пользователя и переключить контекст через инструкцию USER <uid>. Рекомендуется указывать числовой UID, а не имя, чтобы Kubernetes PodSecurityStandards могли валидировать runAsNonRoot без обращения к /etc/passwd внутри контейнера.`,
    codeSnippet: {
      language: 'dockerfile',
      code: `RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER 10001`
    },
    interviewTips: [
      'Укажите требование Kubernetes Security Standards: runAsNonRoot: true.'
    ],
    commonPitfalls: [
      'Оставлять дефолтного пользователя root в продуктовых контейнерах.'
    ],
    tags: ['Docker', 'Security', 'NonRoot', 'Kubernetes']
  },
  {
    id: 'docker-12',
    title: 'Что такое Docker Healthcheck и чем он отличается от K8s Probes?',
    category: 'docker',
    difficulty: 'Junior',
    summaryAnswer: 'Docker Healthcheck — инструкция в Dockerfile или Docker Compose для проверки работоспособности контейнера локально на уровне Docker демона.',
    fullAnswer: `Инструкция HEALTHCHECK заставляет Docker регулярно выполнять указанную команду внутри контейнера (например, curl -f http://localhost:8080/health).
Состояния контейнера: starting, healthy, unhealthy.

**Отличие от K8s Probes**:
При запуске контейнера в Kubernetes, K8s игнорирует инструкцию HEALTHCHECK из Dockerfile и полагается исключительно на собственную спецификацию Liveness/Readiness/Startup probes из Pod spec.`,
    codeSnippet: {
      language: 'dockerfile',
      code: `HEALTHCHECK --interval=30s --timeout=3s --retries=3 \\
  CMD curl -f http://localhost:8080/health || exit 1`
    },
    interviewTips: [
      'Укажите, что в Docker Compose HEALTHCHECK полезен для зависимости depends_on: condition: service_healthy.'
    ],
    commonPitfalls: [
      'Надеяться, что K8s будет автоматические читать Dockerfile HEALTHCHECK без настройки Probes.'
    ],
    tags: ['Docker', 'Healthcheck', 'Monitoring', 'DockerCompose']
  },
  {
    id: 'docker-13',
    title: 'В чем разница между docker stop и docker kill?',
    category: 'docker',
    difficulty: 'Junior',
    summaryAnswer: 'docker stop отправляет SIGTERM, ждет таймаут (по умолчанию 10 сек), затем шлет SIGKILL. docker kill сразу отправляет SIGKILL (Exit code 137).',
    fullAnswer: `1. **docker stop**:
   - Отправляет сигнал SIGTERM (15) главному процессу (PID 1).
   - Дает время приложению завершить активные запросы, закрыть соединения с БД и сбросить кэш (Graceful Shutdown).
   - Если за 10 секунд процесс не завершился, отправляется SIGKILL (9).

2. **docker kill**:
   - Сразу посылает сигнал SIGKILL (или указанный пользовательский сигнал, например --signal=SIGHUP).
   - Процесс мгновенно уничтожается ядром без сохранения состояния.`,
    codeSnippet: {
      language: 'bash',
      code: `docker stop -t 30 my-app # увеличить grace period до 30 секунд
docker kill my-app # мгновенное удаление`
    },
    interviewTips: [
      'Свяжите с корректной обработкой сигналов PID 1 в приложениях.'
    ],
    commonPitfalls: [
      'Использовать docker kill на базах данных, что может привести к повреждению данных в WAL/таблицах.'
    ],
    tags: ['Docker', 'Signals', 'GracefulShutdown', 'CLI']
  },
  {
    id: 'docker-14',
    title: 'Что такое Distroless образы и почему их используют?',
    category: 'docker',
    difficulty: 'Middle',
    summaryAnswer: 'Distroless — это минималистичные базовые образы от Google, содержащие только ваше приложение и его рантайм-зависимости, без пакетных менеджеров, командной оболочки (shell) и утилит.',
    fullAnswer: `Обычные базовые образы (Ubuntu, Debian, Alpine) включают в себя утилиты shell (bash/sh), apt/apk, curl, ls и т.д.
Если в приложении найден вектор атаки RCE (Remote Code Execution), злоумышленник использует эти встроенные утилиты для скачивания вредоносных скриптов.

**Плюсы Distroless**:
1. Минимальный размер (10-30 МБ).
2. Огромное сокращение вектора атак (отсутствуют bash, curl, nc, apt).
3. Прохождение любых сканеров уязвимостей (Trivy, Grype) без лишних сработок (Zero CVE).

*Минус*: затрудненная отладка внутри контейнера (нет sh для docker exec), требуется использование crictl debug или ephemereal debug containers в K8s.`,
    codeSnippet: {
      language: 'dockerfile',
      code: `# Использование Distroless для Go / Node / Java:
FROM gcr.io/distroless/static-debian12
COPY --from=builder /app/main /
CMD ["/main"]`
    },
    interviewTips: [
      'Подчеркните подход DevSecOps и принцип наименьших привилегий.'
    ],
    commonPitfalls: [
      'Пытаться сделать docker exec -it container sh в distroless образ — там нет оболочки!'
    ],
    tags: ['Docker', 'Distroless', 'Security', 'DevSecOps']
  },
  {
    id: 'docker-15',
    title: 'Как устроена спецификация OCI (Open Container Initiative)?',
    category: 'docker',
    difficulty: 'Senior',
    summaryAnswer: 'OCI — открытый стандарт индустрии, определяющий форматы образов (Image Spec), рантайма выполнения (Runtime Spec) и реестров (Distribution Spec).',
    fullAnswer: `Ранее Docker был монолитным инструментом. Чтобы избежать монополии, в 2015 году Docker, RedHat, Google и др. создали OCI под эгидой Linux Foundation.

OCI состоит из 3 спецификаций:
1. **Image Spec**: стандарт формата слоев образа, tar-архивов и файла manifest.json.
2. **Runtime Spec**: стандарт запуска контейнера из файловой структуры bundle (реализован в runc, crun, kata-runtime).
3. **Distribution Spec**: стандарт протокола API для OCI-реестров (Docker Hub, Harbor, GHCR).

Благодаря OCI, скомпилированный образ Docker можно без изменений запускать через Podman, containerd, CRI-O или Buildah.`,
    codeSnippet: {
      language: 'bash',
      code: `runc run my-container-id # низкоуровневый запуск контейнера напрямую через OCI runtime`
    },
    interviewTips: [
      'Упомяните отделение Docker CLI от движка containerd и низкоуровневого рантайма runc.'
    ],
    commonPitfalls: [
      'Считать, что Docker — единственная технология для работы с контейнерами.'
    ],
    tags: ['Docker', 'OCI', 'Architecture', 'runc', 'Podman']
  }
];
