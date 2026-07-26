import { Question } from '../../types';

export const DOCKER_QUESTIONS: Question[] = [
  // =========================================================================
  // ============================ JUNIOR LEVEL ===============================
  // =========================================================================
  {
    id: 'docker-1',
    title: 'Чем отличаются Docker image и Docker container? Из чего состоит образ?',
    category: 'docker',
    difficulty: 'Junior',
    summaryAnswer: 'Docker Image — это неизменяемый (read-only) шаблон со слоями файсовой системы. Container — это запущенный экземпляр образа с добавленным поверх тонким слоем чтения-записи (Read-Write layer).',
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
      'Надеяться, что K8s будет автоматически читать Dockerfile HEALTHCHECK без настройки Probes.'
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
    id: 'docker-16',
    title: 'Что такое Build Context в Docker и как его оптимизировать?',
    category: 'docker',
    difficulty: 'Junior',
    summaryAnswer: 'Build Context — это набор локальных файлов и папок, которые клиент Docker отправляет Docker-демону при сборке. Оптимизация заключается в уменьшении объема передаваемых данных через .dockerignore.',
    fullAnswer: `При выполнении 'docker build .' текущая директория принимается за контекст сборки. Перед началом сборки Docker-клиент рекурсивно упаковывает все файлы и папки (кроме описанных в .dockerignore) в tar-архив и передает его демону по Unix-сокету или сети.
Если контекст весит гигабайты (из-за node_modules, виртуальных окружений, тяжелых логов или медиа), сборка будет начинаться очень медленно, а хост будет тратить лишние ресурсы.`,
    codeSnippet: {
      language: 'dockerfile',
      code: `# Пример типичного .dockerignore в корне проекта
.git
.github
node_modules
dist
*.log
venv/
.env`
    },
    interviewTips: [
      'Подчеркните: файлы отправляются демону ДО того, как Dockerfile начнет обрабатываться. Любой COPY . . опирается на этот переданный массив данных.'
    ],
    commonPitfalls: [
      'Запускать docker build из корневой домашней директории пользователя (~), что приводит к отправке всех личных файлов гигабайтного объема на демон.'
    ],
    tags: ['Docker', 'Build', 'Context', '.dockerignore']
  },
  {
    id: 'docker-17',
    title: 'Что такое Docker Compose и для чего он используется? Опишите основные команды.',
    category: 'docker',
    difficulty: 'Junior',
    summaryAnswer: 'Docker Compose — инструмент декларативного описания и запуска многоконтейнерных приложений. Он использует YAML-файл для конфигурации сервисов, сетей и томов.',
    fullAnswer: `Docker Compose избавляет инженера от написания гигантских bash-скриптов с ручным запуском контейнеров, сетей и связей между ними. Вся топология инфраструктуры описывается в файле 'docker-compose.yml'.
Основные команды:
- 'docker compose up -d': собрать образы (если отсутствуют), создать сети/тома и запустить стек сервисов в фоновом режиме.
- 'docker compose down': остановить и полностью удалить контейнеры и сети, созданные стеком.
- 'docker compose ps': посмотреть статус запущенных контейнеров в рамках текущего стека.
- 'docker compose logs -f': смотреть логи всего приложения в реальном времени.`,
    codeSnippet: {
      language: 'yaml',
      code: `version: '3.8'
services:
  web:
    image: nginx:alpine
    ports:
      - "80:80"
    depends_on:
      - redis
  redis:
    image: redis:6-alpine`
    },
    interviewTips: [
      'Упомяните, что начиная со 2-й версии Compose пишется без дефиса ("docker compose"), так как утилита интегрирована напрямую в Docker CLI.'
    ],
    commonPitfalls: [
      'Путать depends_on с проверкой готовности (ready) базы данных. depends_on гарантирует лишь старт процесса контейнера, но не его функциональную готовность.'
    ],
    tags: ['Docker', 'Docker Compose', 'YAML', 'Orchestration']
  },
  {
    id: 'docker-18',
    title: 'Как посмотреть логи контейнера? Как ограничить размер лог-файлов на хосте?',
    category: 'docker',
    difficulty: 'Junior',
    summaryAnswer: 'Логи смотрят через "docker logs <container_id>". Ограничить размер можно глобально через файл /etc/docker/daemon.json, задав параметры max-size и max-file для драйвера логирования.',
    fullAnswer: `По умолчанию Docker перехватывает потоки stdout и stderr процессов в контейнере и записывает их в файлы в формате JSON по пути /var/lib/docker/containers/<id>/<id>-json.log.
Если приложение активно пишет логи и они не ограничиваются, диск хост-системы со временем неизбежно переполнится.
Для настройки ротации логов используют опции json-file драйвера.`,
    codeSnippet: {
      language: 'json',
      code: `// Содержимое файла /etc/docker/daemon.json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}`
    },
    interviewTips: [
      'Укажите ключи: "-f" для стриминга логов, "--tail 100" для вывода последних 100 строк, "--since" для фильтрации по времени.'
    ],
    commonPitfalls: [
      'Писать логи в файлы внутри самого контейнера (например, в /var/log/myapp.log) вместо вывода в stdout/stderr. Такие логи не видны через "docker logs" и раздувают эфемерный R/W слой контейнера.'
    ],
    tags: ['Docker', 'Logs', 'Administration', 'Storage']
  },
  {
    id: 'docker-19',
    title: 'Чем отличаются команды docker run, docker start, docker exec и docker create?',
    category: 'docker',
    difficulty: 'Junior',
    summaryAnswer: 'docker create создает структуру контейнера на основе образа. docker start запускает остановленный контейнер. docker run совмещает создание и запуск. docker exec выполняет новую команду внутри запущенного контейнера.',
    fullAnswer: `Разница в их влиянии на жизненный цикл контейнера:
1. **docker create**: скачивает образ и создает файловую систему контейнера (R/W слой), но не запускает процесс. Статус контейнера: Created.
2. **docker start**: берет уже существующий (созданный или ранее остановленный) контейнер и запускает его процесс PID 1 с сохранением изменений в R/W слое.
3. **docker run**: делает "create" + "start". Каждый запуск создает совершенно новую изолированную инстанцию контейнера.
4. **docker exec**: не запускает контейнер. Команда подключается к уже работающему пространству имен контейнера и порождает в нем дочерний процесс (например, shell-сессию).`,
    codeSnippet: {
      language: 'bash',
      code: `# Пример цепочки создания и запуска контейнера:
docker create --name app-srv -p 8080:8080 my-app:v1
docker start app-srv

# Выполнение отладочной утилиты внутри:
docker exec -it app-srv sh`
    },
    interviewTips: [
      'Поясните, что docker run с флагом --rm автоматически удалит контейнер после завершения его работы, что предотвратит засорение диска остановленными контейнерами.'
    ],
    commonPitfalls: [
      'Использовать docker run каждый раз для перезапуска приложения, плодя десятки дублирующих контейнеров, вместо использования docker restart или docker start.'
    ],
    tags: ['Docker', 'CLI', 'Lifecycle', 'Containers']
  },

  // =========================================================================
  // ============================ MIDDLE LEVEL ===============================
  // =========================================================================
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

2. Cgroups (Control Groups v1/v2) — отвечают за то, СКОЛЬКО РЕСУРСОВ процесс МОЖЕТ ИСПОЛЬЗОВАТЬ:
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

*Минус*: затрудненная отладка внутри контейнера (нет sh для docker exec), требуется использование crictl debug или ephemeral debug containers в K8s.`,
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
    id: 'docker-20',
    title: 'Что такое dangling и unused сущности в Docker и как их очистить?',
    category: 'docker',
    difficulty: 'Middle',
    summaryAnswer: 'Dangling-образы — это "висящие" слои без тега (обычно возникают при пересборке с тем же именем). Unused — неиспользуемые в данный момент контейнеры, сети или тома. Очистка выполняется через docker system prune.',
    fullAnswer: `В процессе активной разработки, сборки и деплоя на хосте скапливается большое количество "мусорных" данных.
- **Dangling Images**: образы без имени и тега (в выводе "docker images" они отображаются как <none>:<none>). Возникают, когда вы собираете образ заново с тем же тегом (например, app:latest) — старые слои теряют тег, но остаются на диске.
- **Unused Entities**: контейнеры в статусе Exited, неиспользуемые сети, тома или образы, к которым не привязан ни один запущенный контейнер.
Очистить систему можно точечно или комплексно с помощью семейства команд "prune".`,
    codeSnippet: {
      language: 'bash',
      code: `# Удалить только "висящие" (dangling) образы:
docker image prune

# Комплексная очистка (удаляет остановленные контейнеры, сети и неиспользуемые образы):
docker system prune -a

# Полная очистка с принудительным удалением томов (volumes):
docker system prune -a --volumes -f`
    },
    interviewTips: [
      'Сделайте акцент на том, что по умолчанию "docker system prune" НЕ удаляет тома (volumes) из соображений безопасности. Чтобы их удалить, нужно явно передавать флаг "--volumes".'
    ],
    commonPitfalls: [
      'Запустить "docker system prune -a" на сервере, где временно остановлены важные контейнеры (например, вспомогательные базы данных). Docker посчитает их неиспользуемыми и сотрет их образы.'
    ],
    tags: ['Docker', 'Garbage Collection', 'Prune', 'Administration']
  },
  {
    id: 'docker-21',
    title: 'Как передавать переменные окружения и секреты в Docker-контейнер? В чем риски инструкции ENV?',
    category: 'docker',
    difficulty: 'Middle',
    summaryAnswer: 'Переменные передаются через инструкцию ENV в Dockerfile, флаг -e в CLI или .env файл в Compose. Запекание секретов в ENV внутри Dockerfile небезопасно, так как они попадают в публичную историю слоев образа.',
    fullAnswer: `Для конфигурирования приложений часто используют переменные окружения. Однако важно разграничивать обычные переменные и конфиденциальные данные (секреты: пароли, токены, ключи).
- **Инструкция ENV в Dockerfile**: удобна для дефолтных настроек, но жестко вшивает данные в метаданные образа. Любой, у кого есть доступ к образу, выполнив "docker inspect" или "docker history", сможет извлечь эти секреты.
- **Инструкция ARG**: действует только на этапе сборки, но слои сборщика также кэшируются, и секреты можно извлечь.
**Как безопасно передавать секреты**:
1. Использовать механизм секретов при сборке BuildKit: "RUN --mount=type=secret".
2. Передавать в рантайме через переменные окружения хоста ("docker run -e MY_SECRET=$SECRET").
3. Использовать специализированные решения (Vault, AWS Secrets Manager) или Docker/Kubernetes Secrets.`,
    codeSnippet: {
      language: 'dockerfile',
      code: `# syntax=docker/dockerfile:1.2
# Безопасное чтение секретов при сборке с использованием BuildKit
FROM python:3.10-alpine
WORKDIR /app
# Секрет монтируется временно, не сохраняется в итоговом слое
RUN --mount=type=secret,id=pip_conf_secret \\
    pip install --config-file=/run/secrets/pip_conf_secret -r requirements.txt`
    },
    interviewTips: [
      'Различайте ARG (переменные сборки, build-time) и ENV (переменные окружения рантайма, run-time).'
    ],
    commonPitfalls: [
      'Прописывать пароли к базам данных и приватные SSH-ключи прямо в Dockerfile через инструкцию ENV/ARG.'
    ],
    tags: ['Docker', 'Security', 'Env', 'Secrets', 'BuildKit']
  },
  {
    id: 'docker-22',
    title: 'Что такое Docker Socket (/var/run/docker.sock) и в чем опасность его монтирования внутрь контейнера?',
    category: 'docker',
    difficulty: 'Middle',
    summaryAnswer: 'Docker Socket — это Unix-сокет, являющийся основной точкой входа для Docker API. Монтирование его внутрь контейнера дает этому контейнеру полные root-права на управление Docker-демоном хоста.',
    fullAnswer: `Файл /var/run/docker.sock используется клиентом CLI для передачи команд локальному демону Docker (dockerd).
Иногда разработчики монтируют этот сокет внутрь контейнера (например, чтобы запустить мониторинг вроде Portainer или настроить агента CI/CD, собирающего образы).
**Опасность**:
Любой процесс внутри контейнера, имеющий доступ к смонтированному сокету, может послать команду демону на запуск нового привилегированного контейнера, примонтировать корневую файловую систему хоста "/" и получить абсолютный контроль над сервером. Это эквивалентно беспрепятственному root-доступу на хосте.`,
    codeSnippet: {
      language: 'bash',
      code: `# Запуск контейнера с монтированием Docker Socket (ОПАСНО):
docker run -v /var/run/docker.sock:/var/run/docker.sock -it alpine sh

# Внутри такого контейнера злоумышленник может выполнить:
# apk add docker-cli
# docker run --privileged -v /:/host-root alpine chroot /host-root`
    },
    interviewTips: [
      'Укажите, что если монтирование сокета неизбежно (например, для Traefik/Portainer), его нужно монтировать в режиме read-only (дописать ":ro" в конце) и жестко ограничивать права доступа к контейнеру.'
    ],
    commonPitfalls: [
      'Монтировать docker.sock в веб-приложения (API, Frontend), имеющие публичный доступ. В случае взлома уязвимости RCE в приложении, злоумышленник мгновенно захватит всю виртуальную машину/сервер.'
    ],
    tags: ['Docker', 'Security', 'Socket', 'Privileges']
  },
  {
    id: 'docker-23',
    title: 'Каким образом можно ограничить ресурсы контейнера (Memory Limit, CPU Limit) и что происходит при OOM (Out of Memory)?',
    category: 'docker',
    difficulty: 'Middle',
    summaryAnswer: 'Ограничения задаются через cgroups флагами --memory и --cpus. При выходе за лимит памяти процесс контейнера завершается ядром с ошибкой OOMKilled (Exit code 137). При превышении лимита CPU процесс дросселируется (throttling).',
    fullAnswer: `Docker использует механизм cgroups ядра Linux для ограничения аллокации ресурсов.
- **Ограничение оперативной памяти (Memory Limits)**:
  Если запущенный процесс внутри контейнера начинает потреблять больше выделенного лимита (--memory="512m"), срабатывает встроенный oom-killer ядра Linux. Процесс мгновенно уничтожается, контейнер переходит в статус Exited с кодом выхода 137.
- **Ограничение процессора (CPU Limits)**:
  Параметр --cpus="1.5" указывает планировщику CFS (Completely Fair Scheduler), какую долю процессорного времени может утилизировать контейнер. При превышении лимита процесс не уничтожается, а искусственно замедляется (CPU throttling), что повышает время отклика приложения.`,
    codeSnippet: {
      language: 'bash',
      code: `# Запустить контейнер с ограничением в 256MB RAM и 0.5 CPU:
docker run -d --name my-heavy-app --memory="256m" --cpus="0.5" nginx

# Проверка текущего потребления и лимитов в реальном времени:
docker stats my-heavy-app`
    },
    interviewTips: [
      'Расскажите, как расшифровать Exit Code 137: это 128 + 9 (код системного сигнала SIGKILL), что указывает на принудительное убийство процесса операционной системой.'
    ],
    commonPitfalls: [
      'Запускать JVM-приложения (Java) в контейнерах без указания флагов памяти внутри JVM (например -XX:MaxRAMPercentage). Java может увидеть всю память хост-машины, попытаться ее выделить и будет мгновенно убита OOM-killer.'
    ],
    tags: ['Docker', 'Cgroups', 'Resources', 'Troubleshooting']
  },
  {
    id: 'docker-24',
    title: 'Как работает механизм DNS-резолвинга между контейнерами в одной Docker сети?',
    category: 'docker',
    difficulty: 'Middle',
    summaryAnswer: 'Docker поднимает встроенный DNS-сервер по адресу 127.0.0.11 для всех пользовательских сетей. Он автоматически резолвит имена контейнеров в их внутренние IP-адреса.',
    fullAnswer: `Внутри Docker существует два типа сетей типа "bridge":
1. **Стандартный мост по умолчанию (default bridge)**: в нем DNS-резолвинг по именам контейнеров НЕ работает. Контейнеры могут общаться только напрямую по IP-адресам (или через устаревший механизм --link).
2. **Пользовательские сети (user-defined bridge networks)**: в них Docker автоматически запускает легковесный DNS-сервер по зарезервированному адресу 127.0.0.11. Контейнеры могут резолвить друг друга просто по имени контейнера или по сетевому алиасу (alias).
При поиске внешних доменов запрос перенаправляется на DNS-сервера, настроенные на хост-машине.`,
    codeSnippet: {
      language: 'bash',
      code: `# 1. Создаем кастомную сеть
docker network create my-custom-net

# 2. Запускаем базу данных с именем 'postgres-db'
docker run -d --name postgres-db --network my-custom-net postgres:alpine

# 3. Запускаем приложение в той же сети, оно сможет подключиться к 'postgres-db'
docker run -it --network my-custom-net alpine ping postgres-db`
    },
    interviewTips: [
      'Упомяните, что в файле /etc/resolv.conf внутри контейнера при использовании кастомной сети всегда прописан IP "nameserver 127.0.0.11".'
    ],
    commonPitfalls: [
      'Пытаться настроить взаимодействие контейнеров по именам в стандартной сети "bridge", получая ошибки "Host not found".'
    ],
    tags: ['Docker', 'Networking', 'DNS', 'Bridge']
  },

  // =========================================================================
  // ============================ SENIOR LEVEL ===============================
  // =========================================================================
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
      'Упомяните соответствие спецификации OCI (Open Container Initiative) и поддержку CRI в Kubernetes.'
    ],
    commonPitfalls: [
      'Путать Kata с Docker Desktop на Windows/Mac.'
    ],
    tags: ['Docker', 'KataContainers', 'Security', 'Virtualization']
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
  },
  {
    id: 'docker-25',
    title: 'Какая архитектура лежит в основе Docker? Опишите связку Docker Daemon, containerd, runc и shim.',
    category: 'docker',
    difficulty: 'Senior',
    summaryAnswer: 'Современный Docker декомпозирован согласно стандартам OCI. Архитектура представляет собой конвейер: Docker CLI отправляет gRPC-запросы к dockerd. Тот делегирует управление containerd, который запускает контейнер через runc. Для слежения за процессом создается легковесный containerd-shim.',
    fullAnswer: `Изначально Docker был монолитным демоном, выполняющим все задачи. Чтобы сделать экосистему модульной и стандартизированной, ее разделили на отдельные слои:
1. **Docker CLI (docker)**: интерфейс командной строки, переводящий команды пользователя в HTTP/gRPC REST API запросы.
2. **Docker Daemon (dockerd)**: высокоуровневый системный сервис. Отвечает за пользовательский API, управление сетями, томами, образами и сборкой.
3. **containerd**: промышленный контейнерный рантайм. Он управляет жизненным циклом контейнеров, скачивает образы из реестров, управляет сетевыми интерфейсами и хранилищем. Именно containerd интегрируется в Kubernetes через интерфейс CRI.
4. **runc**: низкоуровневая утилита OCI. Она создается containerd для непосредственного выполнения системных вызовов ядра Linux (clone, setns, unshare), настраивает namespaces и cgroups, запускает процесс контейнера (PID 1) и сразу завершает работу.
5. **containerd-shim**: легковесный процесс, запускаемый на каждый контейнер. Он "перехватывает" процесс контейнера после закрытия runc. Shim удерживает открытыми файловые дескрипторы stdin/stdout/stderr, сообщает containerd о коде завершения процесса контейнера и позволяет перезапускать dockerd/containerd без прерывания работы запущенных контейнеров.`,
    codeSnippet: {
      language: 'bash',
      code: `# Посмотреть древовидную схему процессов на хосте:
pstree -p | grep dockerd
# Выведет цепочку: systemd -> dockerd -> containerd -> containerd-shim -> nginx`
    },
    interviewTips: [
      'Объясните, почему Kubernetes отказался от самого dockerd в пользу работы напрямую с containerd через CRI: это избавило систему от лишней REST-прослойки, снизило потребление памяти и убрало лишнюю точку отказа.'
    ],
    commonPitfalls: [
      'Считать, что runc постоянно работает и следит за контейнером. runc — это утилита одноразового запуска (CLI), которая сразу делает exit после создания процесса.'
    ],
    tags: ['Docker', 'Architecture', 'containerd', 'runc', 'DeepDive']
  },
  {
    id: 'docker-26',
    title: 'Как работает сетевой мост (bridge) под капотом Linux? Как Docker настраивает iptables для публикации портов?',
    category: 'docker',
    difficulty: 'Senior',
    summaryAnswer: 'Docker создает виртуальный сетевой мост docker0 на хосте. Для каждого контейнера создается пара виртуальных интерфейсов veth-pair. Публикация портов реализуется с помощью правил DNAT в цепочках IPTables (таблица nat).',
    fullAnswer: `При установке Docker создает виртуальный свитч - сетевой мост "docker0" с приватной подсетью (обычно 172.17.0.0/16).
**Как контейнер подключается к сети**:
1. Ядро создает пару виртуальных кабелей (veth-pair).
2. Один конец кабеля (например, veth1234a) помещается в сетевой стек хоста и привязывается к мосту "docker0".
3. Второй конец помещается внутрь изолированного сетевого пространства имен (Network Namespace) контейнера и переименовывается в "eth0".
4. Контейнер получает приватный IP из подсети моста, а шлюзом по умолчанию (default gateway) становится IP самого интерфейса docker0 на хосте.

**Как работает публикация портов (-p 80:80)**:
Контейнеры используют немаршрутизируемые серые IP. Чтобы пробросить порт, Docker Daemon взаимодействует с подсистемой ядра Netfilter через утилиту **iptables**:
- При запуске контейнера в таблицу **nat** в цепочку **PREROUTING** добавляется правило перенаправления (DNAT): все входящие на порт 80 хоста TCP-пакеты перенаправляются на IP-адрес контейнера (например, 172.17.0.2:80).
- Также создаются разрешающие правила в цепочке FORWARD таблицы filter.`,
    codeSnippet: {
      language: 'bash',
      code: `# Посмотреть созданные Docker правила трансляции сетевых адресов:
sudo iptables -t nat -L DOCKER -n -v

# Проверить список veth интерфейсов, подключенных к сетевым мостам:
brctl show # или: ip link show master docker0`
    },
    interviewTips: [
      'Если вас спросят, как заблокировать доступ к опубликованному порту контейнера извне, укажите, что стандартные правила в цепочке INPUT в iptables НЕ сработают, так как трафик идет транзитом. Блокировать его нужно в специальной цепочке DOCKER-USER.'
    ],
    commonPitfalls: [
      'Думать, что Docker использует полноценную виртуализацию сетевых карт. Это виртуальные интерфейсы (veth) и стандартная маршрутизация Linux.'
    ],
    tags: ['Docker', 'Networking', 'iptables', 'Linux Kernel', 'Security']
  },
  {
    id: 'docker-27',
    title: 'Как устроены драйверы хранения (Storage Drivers), в частности overlay2? Что такое лимит inode?',
    category: 'docker',
    difficulty: 'Senior',
    summaryAnswer: 'Overlay2 использует OverlayFS ядра Linux, которая объединяет слои образа (lowerdir) и слой контейнера (upperdir) в единую смонтированную директорию (merged). Проблема лимита inode возникает из-за переполнения таблицы метаданных ФС при генерации миллионов мелких файлов.',
    fullAnswer: `Overlay2 — это основной драйвер хранения для Docker в Linux. Он работает на уровне файловой системы ядра, объединяя несколько директорий в одно виртуальное представление.
Компоненты монтирования OverlayFS:
- **lowerdir**: слои Docker-образа (read-only). Для экономии места слои разделяются между разными контейнерами.
- **upperdir**: изменяемый слой контейнера (read-write). Все новые файлы и изменения записываются сюда.
- **merged**: единое результирующее представление файловой системы, которое видит процесс внутри контейнера.
- **workdir**: внутренняя директория OverlayFS, используемая для подготовки файлов перед записью (атомарность транзакций).

**Механизм Copy-on-Write (CoW)**:
Если процесс в контейнере пытается прочитать файл, OverlayFS берет его из upperdir, а если его там нет — из lowerdir. Если процесс пытается записать/изменить существующий в образе файл, ядро копирует файл целиком из lowerdir в upperdir (это накладывает оверхед на дисковый ввод-вывод) и только затем производит запись.

**Проблема Inode Exhaustion (исчерпание инод)**:
В файловых системах Linux (например, ext4) каждый файл или папка требует наличия индексного дескриптора (Inode). Их количество фиксируется при форматировании диска. При сборке образов, содержащих миллионы мелких файлов (например, node_modules в JS), свободные Inodes могут закончиться раньше, чем физическое дисковое пространство. В этом случае диск выдаст ошибку "No space left on device", хотя свободные гигабайты еще будут.`,
    codeSnippet: {
      language: 'bash',
      code: `# Посмотреть информацию о задействованных путях overlay2 для контейнера:
docker inspect my-container --format '{{json .GraphDriver.Data}}'

# Проверить утилизацию индексных дескрипторов (inodes):
df -i`
    },
    interviewTips: [
      'Подчеркните, что из-за специфики механизма Copy-on-Write (CoW), тяжелые базы данных (PostgreSQL, MySQL, Cassandra) с интенсивной записью категорически запрещено запускать в R/W слое контейнера. Данные обязаны писаться на Docker Volumes, которые монтируются в обход OverlayFS напрямую к диску.'
    ],
    commonPitfalls: [
      'Пытаться удалять большие файлы из R/W слоя контейнера, надеясь уменьшить вес Docker-образа при многоэтапной сборке. Если файл был создан на предыдущем шаге (слое), его удаление на следующем шаге лишь пометит его как удаленный в upperdir, но физически он останется лежать в нижнем слое lowerdir.'
    ],
    tags: ['Docker', 'Storage', 'OverlayFS', 'Linux Kernel', 'Troubleshooting']
  },
  {
    id: 'docker-28',
    title: 'Как собирать Docker-образы в CI/CD без Docker-in-Docker (DinD)? Расскажите про Kaniko.',
    category: 'docker',
    difficulty: 'Senior',
    summaryAnswer: 'Docker-in-Docker требует опасного --privileged режима. Альтернативы: 1) Монтирование сокета (DooD); 2) Kaniko — безиздательский сборщик в user-space; 3) Использование Podman / Buildah в rootless режиме.',
    fullAnswer: `Сборка образов внутри систем контейнеризации (например, в Kubernetes-подах или GitLab CI раннерах) сопряжена с проблемами безопасности:
1. **Docker-in-Docker (DinD)**: требует запуска контейнера сборщика с флагом "--privileged". Это дает контейнеру полный доступ к аппаратному обеспечению хоста, позволяя обойти namespaces и захватить ноду.
2. **Docker-out-of-Docker (DooD)**: монтирует хостовый сокет "/var/run/docker.sock". Позволяет собирать образы на самом хосте, но дает контейнеру сборщика права root над хостом.

**Решение: Kaniko от Google**:
Kaniko — это инструмент, разработанный специально для безопасной сборки образов в контейнерах без зависимости от запущенного Docker-демона.
**Как работает Kaniko**:
- Запускается как стандартный непривилегированный контейнер.
- Считывает Dockerfile и скачивает базовый образ напрямую из Registry, распаковывая его слои как tar-архивы в оперативную память или на диск.
- Выполняет каждую команду из Dockerfile в своем собственном пространстве пользователя (user-space).
- После каждой команды делает "снимок" файловой системы, высчитывает разницу (diff), создает новый слой в формате OCI и отправляет итоговый образ в целевой Registry.`,
    codeSnippet: {
      language: 'yaml',
      code: `# Пример шага сборки с Kaniko в GitLab CI без privileged-режима:
build-job:
  stage: build
  image:
    name: gcr.io/kaniko-project/executor:debug
    entrypoint: [""]
  script:
    - mkdir -p /kaniko/.docker
    - echo "{\\"auths\\":{\\"$CI_REGISTRY\\":{\\"username\\":\\"$CI_REGISTRY_USER\\",\\"password\\":\\"$CI_REGISTRY_PASSWORD\\"}}}" > /kaniko/.docker/config.json
    - /kaniko/executor --context $CI_PROJECT_DIR --dockerfile $CI_PROJECT_DIR/Dockerfile --destination $CI_REGISTRY_IMAGE:$CI_COMMIT_TAG`
    },
    interviewTips: [
      'Сделайте сильный упор на безопасность (DevSecOps): Kaniko позволяет полностью соответствовать стандартам безопасности Kubernetes (например, запрету на запуск Privileged контейнеров).'
    ],
    commonPitfalls: [
      'Пытаться использовать Kaniko для сборки Docker-образов локально на рабочей машине разработчика. Kaniko деструктивен для корневой файловой системы среды, в которой он запущен (он перезаписывает файлы в процессе сборки), поэтому его можно использовать ТОЛЬКО внутри одноразовых контейнеров/подов.'
    ],
    tags: ['Docker', 'CI/CD', 'Kaniko', 'Security', 'Build']
  },
  {
    id: 'docker-29',
    title: 'Что такое побег из контейнера (Container Escape) и как защитить систему?',
    category: 'docker',
    difficulty: 'Senior',
    summaryAnswer: 'Побег из контейнера — это компрометация изоляции и получение процессом контейнера root-прав на хосте. Защита включает: запуск от non-root, запрет --privileged, User Namespaces, ограничение capabilities, seccomp-профили.',
    fullAnswer: `Компрометация контейнера и "побег" на хост-систему обычно происходят из-за трех факторов:
1. **Уязвимости ядра Linux**: например, Dirty COW или системные вызовы, позволяющие выйти за пределы MNT пространства имен.
2. **Избыточные привилегии**: запуск контейнера с флагом "--privileged" отключает seccomp-фильтрацию и восстанавливает все Capabilities ядра. Взломанный root-процесс может смонтировать диск "/dev/sda1" хоста и перезаписать системные файлы.
3. **Небезопасное монтирование**: проброс docker.sock, /proc, /sys или корневой папки хоста.

**Методы глубокой защиты (Hardening)**:
- **User Namespaces**: сопоставляет UID 0 (root) внутри контейнера с непривилегированным UID (например, 100000) на хосте. В случае побега злоумышленник окажется бесправным пользователем на сервере.
- **Снижение Linux Capabilities**: Docker по умолчанию отключает большую часть capabilities. Для максимальной безопасности нужно сбросить все и выдать только необходимые: "--cap-drop=ALL --cap-add=NET_BIND_SERVICE".
- **Seccomp (Secure Computing Mode)**: профиль фильтрации системных вызовов к ядру. Docker по умолчанию блокирует около 40 потенциально опасных системных вызовов (например, mount, reboot, kexec_load).
- **Read-only RootFS**: монтирование корневой ФС контейнера только для чтения ("--read-only"), что блокирует скачивание и исполнение вредоносных бинарников в "/tmp" или "/var".`,
    codeSnippet: {
      language: 'bash',
      code: `# Запуск максимально защищенного контейнера:
docker run --read-only \\
           --cap-drop=ALL \\
           --cap-add=NET_BIND_SERVICE \\
           --security-opt="no-new-privileges:true" \\
           --security-opt seccomp=default_profile.json \\
           -d my-secure-app`
    },
    interviewTips: [
      'Упомяните концепцию "Defense in Depth" (эшелонированная оборона) в контексте контейнеризации: изоляция не должна полагаться только на одно ядро. Нужно комбинировать лимиты, права пользователей и внешние профили безопасности (AppArmor/SELinux).'
    ],
    commonPitfalls: [
      'Полагаться на стандартные настройки Docker по умолчанию для запуска недоверенного или уязвимого кода.'
    ],
    tags: ['Docker', 'Security', 'Hardening', 'Linux Kernel', 'AppArmor']
  },
  {
    id: 'docker-30',
    title: 'Как собираются мультиархитектурные (Multi-platform) образы в Docker?',
    category: 'docker',
    difficulty: 'Senior',
    summaryAnswer: 'Мультиархитектурные образы собираются с помощью утилиты Docker Buildx. Сборщик использует эмуляцию QEMU для сборки слоев под разные архитектуры и создает общий Manifest List в реестре под единым тегом.',
    fullAnswer: `С распространением процессоров ARM (например, Apple Silicon M1/M2/M3, процессоры AWS Graviton) возникла необходимость собирать образы под разные архитектуры процессоров (обычно linux/amd64 и linux/arm64).
Раньше приходилось собирать образы на физически разных машинах и настраивать сложные пайплайны.
**Современный подход с Docker Buildx**:
Buildx — это расширение Docker CLI, основанное на движке сборки BuildKit.
1. **Эмуляция с помощью QEMU**: Buildx регистрирует обработчики binfmt_misc в ядре хоста, позволяя прозрачно запускать бинарные файлы ARM на процессорах x86 (и наоборот) через эмулятор QEMU. Это медленнее нативной сборки, но не требует физического ARM-железа.
2. **Манифесты образов (Manifest List)**: Buildx собирает отдельные образы для каждой платформы, заливает их в Docker Registry и генерирует единый "Manifest List" (мультиархитектурный образ). Когда клиент делает "docker pull", докер-клиент запрашивает манифест, определяет архитектуру текущего процессора и скачивает только подходящие слои.`,
    codeSnippet: {
      language: 'bash',
      code: `# 1. Создаем и активируем новый драйвер сборщика Buildx
docker buildx create --name multi-builder --use
docker buildx bootstrap

# 2. Собираем образ сразу под две платформы и отправляем его в реестр (Manifest List)
docker buildx build --platform linux/amd64,linux/arm64 \\
                    -t my-registry.ru/app:v1.0.0 \\
                    --push .`
    },
    interviewTips: [
      'Объясните, почему эмуляция через QEMU может приводить к сбоям при сборке сложных пакетов (например, компиляции C-зависимостей), и укажите, что для критически важных CI/CD конвейеров лучше использовать нативные агенты сборки (архитектурно соответствующие целевой платформе).'
    ],
    commonPitfalls: [
      'Собрать образ на Mac M1/M2 (ARM) по умолчанию без указания платформы, залить в Registry и получить ошибку "standard_init_linux.go:211: exec user process caused: exec format error" при запуске этого образа на продакшн-сервере x86_64.'
    ],
    tags: ['Docker', 'Buildx', 'Multi-platform', 'Architecture']
  }
];
