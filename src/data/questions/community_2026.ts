import { Question } from '../../types';

export const COMMUNITY_2026_QUESTIONS: Question[] = [
  // =========================================================================
  // ============================ JUNIOR LEVEL ===============================
  // =========================================================================
  {
    id: 'comm-1',
    title: 'Что делать, если df -h показывает свободное место, но при создании файла Linux пишет "No space left on device"?',
    category: 'linux',
    difficulty: 'Junior',
    summaryAnswer: 'Причина — исчерпание свободных индексных дескрипторов (inodes). Проверяется через команду "df -i". Лечится удалением миллионов мелких файлов или логов.',
    fullAnswer: `В файловых системах Linux (ext4, xfs) каждый файл и директория занимают не только дисковые блоки данных, но и запись в таблице индексных дескрипторов (inode), где хранятся метаданные (права, владелец, ссылки, метки времени).

**Сценарий возникновения**:
Если приложение создает миллионы утилитарных файлов нулевого или очень маленького размера (например, сессии PHP, кэш, файлы сокетов, старые пинги), то иноды закончатся раньше, чем дисковое пространство.

**Диагностика и решение**:
1. Проверить свободные иноды: \`df -i\`
2. Найти директорию с максимальным количеством файлов:
   \`find / -xdev -type f | cut -d "/" -f 2 | sort | uniq -c | sort -n\`
3. Удалить скопившиеся файлы (например, через \`find . -name "*.tmp" -delete\`, так как обычный \`rm -rf *\` выдаст ошибку "Argument list too long").`,
    codeSnippet: {
      language: 'bash',
      code: `# Диагностика использования inode на монтированных разделах
df -i

# Подсчет количества файлов в поддиректориях текущего каталога
find . -maxdepth 2 -type d -exec sh -c 'echo -n "{}: "; find "{}" -type f | wc -l' \\;`
    },
    interviewTips: [
      'Упомяните, что количество inode задается при форматировании ext4 файловой системы и его нельзя динамически увеличить без переформатирования (в отличие от Btrfs/ZFS).'
    ],
    commonPitfalls: [
      'Пытаться очищать место с помощью \`rm -rf *\` в папке с миллионами файлов — команда зависнет из-за лимитов аргументов шелла.'
    ],
    tags: ['Linux', 'Troubleshooting', 'Inodes', 'Storage', 'FileSystem']
  },
  {
    id: 'comm-2',
    title: 'Что такое Load Average в Linux и чем он отличается от процентной загрузки CPU (CPU Utilization)?',
    category: 'linux',
    difficulty: 'Junior',
    summaryAnswer: 'CPU Utilization покажет текущий процент использования процессорного времени. Load Average — среднее количество процессов, находящихся в очереди на выполнение (TASK_RUNNING) или ожидающих ввода-вывода (UNINTERRUPTIBLE_SLEEP) за 1, 5 и 15 минут.',
    fullAnswer: `**Load Average (LA)** отражает среднее количество процессов в состоянии:
- **R (TASK_RUNNING)**: выполняются на CPU или ждут выделения кванта времени.
- **D (TASK_UNINTERRUPTIBLE)**: ожидают аппаратного ввода-вывода (чтение/запись на диск, ответы по NFS/сети).

**Ключевые отличия от CPU Utilization**:
1. LA может превышать количество ядер сервера (например, LA = 16 на 4-ядерном сервере означает, что 12 процессов постоянно стоят в очереди).
2. Высокий LA при НИЗКОЙ загрузке CPU (например, CPU 10%, но LA 25) указывает на узкое место в дисковой подсистеме (I/O Wait), когда процессы зависают в ожидании записи на медленный диск или блокировки NFS.`,
    codeSnippet: {
      language: 'bash',
      code: `# Просмотр Load Average и загрузки по ядрам
uptime
top # смотрим на верхнюю строку и параметр %wa (I/O Wait)
htop

# Просмотр процессов в состоянии D (ожидание диска/сети)
ps aux | awk '$8 ~ /D/'`
    },
    interviewTips: [
      'Для 8-ядерного сервера значение LA = 8.0 означает 100% полную утилизацию ресурсов без простоя и без очереди.'
    ],
    commonPitfalls: [
      'Думать, что Load Average = 100 означает 100% загрузку CPU. В Linux LA считает также дисковые блокировки (Uninterruptible Sleep).'
    ],
    tags: ['Linux', 'LoadAverage', 'CPU', 'Monitoring', 'Troubleshooting']
  },
  {
    id: 'comm-3',
    title: 'В чем разница между distroless, alpine и scratch базовыми образами для Docker?',
    category: 'docker',
    difficulty: 'Junior',
    summaryAnswer: 'scratch — абсолютно пустой образ для статически скомпилированных бинарей (Go/Rust). alpine — легкий дистрибутив на базе musl/busybox с пакетами apk. distroless — образ от Google с рантаймом и библиотеками, но БЕЗ оболочки (shell) и утилит ОС для максимальной безопасности.',
    fullAnswer: `Сравнение базовых образов для сборки продакшен-контейнеров:

1. **\`scratch\`**:
   - Размер: 0 байт.
   - Не содержит ни файловой системы, ни пакетов, ни командной оболочки.
   - Используется для компилируемых языков (Go, Rust), где все зависимости вшиты в один статичный бинарник (\`CGO_ENABLED=0\`).

2. **\`alpine\`**:
   - Размер: ~5 МБ.
   - Содержит оболочку \`ash\`, менеджер пакетов \`apk\` и системную библиотеку \`musl libc\` вместо \`glibc\`.
   - *Нюанс*: Некоторые C-расширения Python или Java могут работать медленнее или требовать перекомпиляции под musl.

3. **\`distroless\` (Google)**:
   - Размер: ~20-50 МБ.
   - Содержит только ваше приложение и его рантайм-зависимости (Node.js, Python, OpenJDK, glibc).
   - НЕ содержит \`bash/sh\`, \`apt/apk\`, \`ls\`, \`curl\`. Взломать такой контейнер методом удаленного выполнения команд (RCE) крайне сложно, так как хакеру негде исполнять шелл-скрипты.`,
    codeSnippet: {
      language: 'dockerfile',
      code: `# Multi-stage сборка Go приложения с финальным scratch образом
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o server .

FROM scratch
COPY --from=builder /app/server /server
ENTRYPOINT ["/server"]`
    },
    interviewTips: [
      'Упомяните, что в distroless образах отладка через "docker exec -it" невозможна из-за отсутствия bash, поэтому используют k8s ephemeral containers или копируют отладочные инструменты.'
    ],
    commonPitfalls: [
      'Забывать сбрасывать CGO_ENABLED=0 при сборке Go бинарника для образа scratch (бинарь потребует glibc и упадет с "file not found").'
    ],
    tags: ['Docker', 'Security', 'Alpine', 'Distroless', 'MultiStage']
  },

  // =========================================================================
  // ============================ MIDDLE LEVEL ===============================
  // =========================================================================
  {
    id: 'comm-4',
    title: 'Диск забит на 100% (df -h). Вы удалили огромный лог-файл (rm app.log), но свободное место НЕ появилось. Почему и как исправить?',
    category: 'linux',
    difficulty: 'Middle',
    summaryAnswer: 'Процесс приложения все еще держит файловый дескриптор открытым. Файл удален из дерева директорий, но место освободится только после закрытия дескриптора или перезапуска процесса. Лечится очисткой через /proc/<PID>/fd/ или truncate.',
    fullAnswer: `В файловых системах Linux место освобождается только тогда, когда количество ссылок на иноду (link count) становится равным 0 И ни один процесс не держит открытый дескриптор этого файла.

**Что произошло**:
Команда \`rm app.log\` удалила имя файла из каталога (уменьшила link count). Но приложение (например, Nginx или Java) продолжает писать в этот дескриптор. Дисковое пространство остается зарезервированным.

**Способы решения**:
1. Найти удержанные файлы через \`lsof\`:
   \`lsof | grep deleted\`
2. Очистить файл без перезапуска приложения, обнулив файловый дескриптор:
   \`> /proc/<PID>/fd/<FD_NUM>\` или \`truncate -s 0 /proc/<PID>/fd/<FD_NUM>\`
3. Выполнить перезапуск или graceful reload службы (например, \`systemctl reload nginx\` или отправка сигнала USR1 для ротации логов).`,
    codeSnippet: {
      language: 'bash',
      code: `# Поиск процессов, удерживающих удаленные файлы большой длины:
lsof +L1

# Пример очистки места в процедуре recovery без перезапуска приложения (PID 1234, FD 3):
:> /proc/1234/fd/3`
    },
    interviewTips: [
      'Укажите, что поэтому для ротации логов нельзя использовать простые rm/mv, а нужно применять logrotate с параметром copytruncate или отправкой сигнала SIGUSR1 процессом.'
    ],
    commonPitfalls: [
      'Перезагружать весь сервер из-за того, что не знали о комбинации lsof + procfs.'
    ],
    tags: ['Linux', 'Troubleshooting', 'ProcFS', 'lsof', 'Storage']
  },
  {
    id: 'comm-5',
    title: 'Как устроена блокировка состояния (State Locking) в Terraform / OpenTofu и что делать при сбое в CI/CD?',
    category: 'terraform',
    difficulty: 'Middle',
    summaryAnswer: 'State Locking предотвращает одновременный запуск нескольких terraform apply, избегая race conditions и corruption стейта. Реализуется через DynamoDB (AWS S3 backend), Consul или встроенную блокировку (GCS/Terraform Cloud). При падении CI блокировка снимается через "terraform force-unlock <ID>".',
    fullAnswer: `При выполнении \`terraform plan\` или \`terraform apply\` движок генерирует уникальный ID блокировки (Lock ID) и записывает его в удаленный бэкенд (например, запись в таблице DynamoDB при хранении стейта в AWS S3).

**Если CI/CD упал посередине операции**:
Запись блокировки остается в базе. При следующем запуске Terraform выдает ошибку: \`Error: Error acquiring the state lock: ConditionalCheckFailedException\`.

**Безопасный алгоритм исправления**:
1. Убедиться, что ни один другой pipeline или коллега не выполняет \`apply\` в данный момент.
2. Скопировать \`Lock ID\` из текста ошибки.
3. Выполнить команду разблокировки:
   \`terraform force-unlock <LOCK_ID>\`
4. Проверить \`terraform plan\` на корректность текущего состояния.`,
    codeSnippet: {
      language: 'hcl',
      code: `# Пример конфигурации бэкенда S3 с блокировкой через DynamoDB
terraform {
  backend "s3" {
    bucket         = "company-tf-states"
    key            = "prod/network/terraform.tfstate"
    region         = "eu-central-1"
    dynamodb_table = "terraform-locks" # Таблица для State Locking
  }
}`
    },
    interviewTips: [
      'Подчеркните, что нельзя использовать force-unlock в автоматических пайплайнах с ключом -force без предварительного выяснения причин, иначе можно испортить инфраструктуру.'
    ],
    commonPitfalls: [
      'Удалять запись из таблицы DynamoDB вручную через AWS Console вместо штатной команды terraform force-unlock.'
    ],
    tags: ['Terraform', 'OpenTofu', 'Backend', 'StateLock', 'CI/CD']
  },
  {
    id: 'comm-6',
    title: 'В чем разница между метриками Histogram и Summary в Prometheus? Когда что выбирать?',
    category: 'monitoring',
    difficulty: 'Middle',
    summaryAnswer: 'Histogram агрегирует наблюдения по заранее заданным корзинам (buckets) на стороне сервера Prometheus через функцию histogram_quantile(). Summary вычисляет точные квантили (95-й, 99-й перцентили) прямо на клиенте, но их нельзя усреднять между несколькими инстансами.',
    fullAnswer: `Сравнение двух ключевых типов метрик Prometheus для оценки латентности и времени ответов (SLO/SLA):

1. **\`Histogram\` (Рекомендуемый стандарт)**:
   - Клиент раскладывает значения по диапазонам (например, \`le="0.1"\`, \`le="0.5"\`, \`le="+Inf"\`).
   - Позволяет вычислять любая перцентили (p50, p90, p99) глобально по ВСЕМ инстансам приложения с помощью PromQL функции \`histogram_quantile()\`.
   - Позволяет объединять метрики из 100 подов в один общий перцентиль.

2. **\`Summary\`**:
   - Вычисляет точные квантили (например, \`quantile="0.99"\`) сразу внутри кода приложения со скользящим окном времени.
   - **Главный минус**: Квантили из разных инстансов (подов) математически НЕЛЬЗЯ складывать или усреднять.
   - Нагружает CPU/память самого приложения для расчета квантилей.`,
    codeSnippet: {
      language: 'promql',
      code: `# Расчет 99-го перцентиля времени ответа API за последние 5 минут по всем подам:
histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))`
    },
    interviewTips: [
      'Запомните правило: если у вас микросервисы и несколько реплик — ВСЕГДА используйте Histogram, так как Summary невозможно агрегировать.'
    ],
    commonPitfalls: [
      'Пытаться делать avg(summary_metric_quantile) в Grafana — это грубейшая математическая ошибка при работе с перцентилями.'
    ],
    tags: ['Prometheus', 'Monitoring', 'Metrics', 'Grafana', 'PromQL']
  },
  {
    id: 'comm-7',
    title: 'Что такое GitOps (ArgoCD / FluxCD) и чем он отличается от Push-based CI/CD (GitLab CI / GitHub Actions)?',
    category: 'cicd',
    difficulty: 'Middle',
    summaryAnswer: 'При Push-based подход CI-раннер напрямую подключается к прод-кластеру с админ-правами и выполняет kubectl apply. В GitOps (Pull-based) внутри кластера работает оператор (ArgoCD), который сам постоянно сравнивает желаемое состояние из Git с реальным состоянием в K8s и устраняет рассинхрон (Reconciliation Loop).',
    fullAnswer: `**Сравнение архитекторов деплоя**:

1. **Push-based (GitLab CI, GitHub Actions, Jenkins)**:
   - CI-сервер должен хранить секретный \`kubeconfig\` с высокими привилегиями доступа к продуктивному кластеру.
   - Если конфигурацию в кластере кто-то поменяет вручную (\`kubectl edit\`), CI об этом не узнает до следующего деплоя (проблема Drift).

2. **Pull-based GitOps (ArgoCD, FluxCD)**:
   - **Безопасность**: Кластер сам забирает манифесты из Git. Секретные ключи доступа к K8s API не покидают контур кластера.
   - **Single Source of Truth**: Репозиторий Git — единственный источник правды.
   - **Self-Healing & Drift Detection**: ArgoCD каждые 3 минуты проверяет кластер. Если кто-то удалил Deployment или поменял Env-переменные вручную, ArgoCD автоматически откатит изменения к состоянию из Git.`,
    codeSnippet: {
      language: 'yaml',
      code: `# Пример манифеста ArgoCD Application
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: payment-service
  namespace: argocd
spec:
  project: default
  source:
    repoURL: 'https://github.com/my-org/k8s-manifests.git'
    targetRevision: HEAD
    path: apps/payment-service/prod
  destination:
    server: 'https://kubernetes.default.svc'
    namespace: prod
  syncPolicy:
    automated:
      prune: true
      selfHeal: true # Автоматическое исправление Drift`
    },
    interviewTips: [
      'Упомяните, что GitOps идеально работает с декларативными инструментами вроде Helm, Kustomize и Jsonnet.'
    ],
    commonPitfalls: [
      'Запускать билд Docker-образов внутри ArgoCD. Запомните: ArgoCD занимается ТОЛЬКО деплоем манифестов, а сборку образов выполняет CI (GitLab CI / GitHub Actions).'
    ],
    tags: ['GitOps', 'ArgoCD', 'FluxCD', 'Kubernetes', 'CICD']
  },

  // =========================================================================
  // ============================ SENIOR LEVEL ===============================
  // =========================================================================
  {
    id: 'comm-8',
    title: 'Что происходит пошагово при выполнении "kubectl apply -f deployment.yaml" в Kubernetes?',
    category: 'k8s',
    difficulty: 'Senior',
    summaryAnswer: 'Запрос проходит валидацию и аутентификацию в API Server -> записывается в etcd -> Controller Manager создаёт ReplicaSet и Pods -> Scheduler назначает ноду -> Kubelet на ноде запрашивает CRI (Docker/containerd), CNI (сеть) и CSI (диски) для запуска контейнера.',
    fullAnswer: `Полная цепочка обработки запроса в контрол-плейне Kubernetes:

1. **Client & Transport**: \`kubectl\` проверяет синтаксис YAML, выполняет Client-side dry-run и отправляет HTTP POST/PUT запрос на **kube-apiserver**.
2. **Authentication & Authorization**: API Server аутентифицирует пользователя (Client Certs/OIDC/ServiceAccount) и проверяет права через RBAC (ClusterRole/Role).
3. **Admission Control**:
   - **Mutating Webhooks**: Могут изменить объект (например, Istio подмешивает sidecar-контейнер).
   - **Validating Webhooks**: Проверяют соответствие политикам безопасности (OPA Gatekeeper, Kyverno).
4. **Persistence**: Очищенный манифест сохраняется в распределенную базу данных **etcd**.
5. **Controllers (kube-controller-manager)**:
   - **Deployment Controller** замечает новое состояние через Watch API и создаёт объект **ReplicaSet**.
   - **ReplicaSet Controller** создает нужное количество объектов **Pod** со статусом \`Pending\`.
6. **Scheduling (kube-scheduler)**:
   - Сканирует нераспределенные поды.
   - Фильтрует ноды (Filtering/Predicates: taints, nodeSelector, resources) и ранжирует их (Scoring/Priorities).
   - Записывает имя выбранной ноды в поле \`spec.nodeName\` пода.
7. **Execution on Node (Kubelet)**:
   - Kubelet на целевой ноде видит новый под через Watch API.
   - Вызывает **CSI (Container Storage Interface)** для монтирования дисков (PV).
   - Вызывает **CNI (Container Network Interface)** для выделения IP-адреса.
   - Вызывает **CRI (Container Runtime Interface)** — \`containerd\`/\`CRI-O\` для скачивания образа и запуска контейнеров.`,
    codeSnippet: {
      language: 'bash',
      code: `# Мониторинг событий создания пода в реальном времени
kubectl get events --sort-by='.metadata.creationTimestamp' -w

# Просмотр статусов вебхуков валидации
kubectl get validatingwebhookconfigurations`
    },
    interviewTips: [
      'Подробное объяснение фаз Admission Control (Mutating -> Schema Validation -> Validating) мгновенно показывает глубокий уровень Senior знания архитектуры Kubernetes.'
    ],
    commonPitfalls: [
      'Думать, что kubectl напрямую подключается к нодам и запускает Docker. Все коммуникации идут исключительно через центральный API Server.'
    ],
    tags: ['Kubernetes', 'Architecture', 'APIServer', 'Etcd', 'Kubelet', 'CRI', 'CNI']
  },
  {
    id: 'comm-9',
    title: 'Что такое eBPF (Extended Berkeley Packet Filter) и как он меняет observability, сеть и безопасность (Cilium, Falco)?',
    category: 'linux',
    difficulty: 'Senior',
    summaryAnswer: 'eBPF позволяет выполнять безопасный изолированный байт-код прямо в ядре Linux без модификации исходного кода ядра и без загрузки рискованных модулей ядра (kernel modules). Применяется для сверхскоростной фильтрации сети (Cilium CNI), безопасного аудита (Falco) и трейсинга.',
    fullAnswer: `До eBPF для анализа событий ядра приходилось либо писать тяжелые модули ядра (Kernel Modules), рискуя вызвать Kernel Panic, либо копировать весь трафик в User Space (медленно из-за контекстных переключений).

**Как работает eBPF**:
1. Программа на C/Rust компилируется в байт-код eBPF через LLVM/Clang.
2. Верификатор ядра (**eBPF Verifier**) проверяет байт-код на отсутствие бесконечных циклов, падений и невалидных доступов к памяти.
3. JIT-компилятор превращает байт-код в машинные инструкции CPU.
4. Программа навешивается на хуки ядра: системные вызовы (\`kprobes\`), сетевые пакеты (\`XDP / tc\`), точки трассировки (\`tracepoints\`).

**Применение в DevOps**:
- **Cilium CNI**: Обходит сетевой стек Linux и iptables/kube-proxy, пересылая пакеты напрямую на уровне сокетов ядра. Ускоряет сеть K8s в 2-5 раз.
- **Falco**: Фиксирует подозрительные действия в контейнерах (например, запуск \`bash\` внутри пода Nginx или чтение \`/etc/shadow\`) на уровне системных вызовов ядра без задержек.`,
    codeSnippet: {
      language: 'bash',
      code: `# Просмотр загруженных eBPF программ в ядре Linux
bpftool prog list

# Пример правила Falco для отслеживания запуска shell в контейнерах
- rule: Terminal shell in container
  desc: A shell was spawned HAS_SHELL inside a container
  condition: container.id != host and proc.name in (bash, sh, zsh)
  output: "Notice Shell spawned in container (user=%user.name pod=%k8s.pod.name)"
  priority: WARNING`
    },
    interviewTips: [
      'Упомяните XDP (eXpress Data Path) — технологию обработку сетевых пакетов на уровне драйвера сетевой карты до выделения SKB (socket buffer) структуры в ядре.'
    ],
    commonPitfalls: [
      'Путать eBPF с инструментами User-Space вроде iptables или tcpdump.'
    ],
    tags: ['Linux', 'eBPF', 'Cilium', 'Falco', 'Security', 'Networking', 'Kernel']
  },
  {
    id: 'comm-10',
    title: 'Как устроена система cgroups v1 vs cgroups v2 в Linux и почему Java/Go приложения падали по OOMKilled в старых контейнерах?',
    category: 'linux',
    difficulty: 'Senior',
    summaryAnswer: 'В cgroups v1 каждый ресурс (memory, cpu, blkio) имел независимую иерархию, из-за чего JVM и Go рантайм видоизмененно считывали количество ядер и память системы. В cgroups v2 создана единая иерархическая дерево-структура и внедрены адекватные счетчики memory.max и memory.high.',
    fullAnswer: `**Проблема cgroups v1**:
В cgroups v1 контроллеры памяти, CPU и диска были разрознены. Старые версии Java (JDK 8u121 и ранее) не умели читать лимиты из cgroups и при вызове \`Runtime.getRuntime().availableProcessors()\` видоизмененно видели ВСЕ 64 ядра и 256 ГБ RAM хостовой машины вместо выделенных контейнеру 2 ядер и 2 ГБ RAM.
В результате JVM выделяла гигантский Heap size, вылезала за лимит Docker и моментально уничтожалась ядром через Linux OOM Killer.

**Преимущества cgroups v2**:
1. **Единая иерархия процессов**: Каждый процесс принадлежит ровно одной группе.
2. **Улучшенный контроль памяти**: Появился параметр \`memory.high\` (мягкий лимит с проактивной очисткой кэша) и \`memory.max\` (жесткий лимит c OOM).
3. **Pressure Stall Information (PSI)**: Позволяет отслеживать голодание ресурсов (CPU, Memory, I/O) до того, как система упадет.`,
    codeSnippet: {
      language: 'bash',
      code: `# Проверка версии cgroups на сервере (если замонтирован /sys/fs/cgroup/cgroup.controllers - это v2)
stat -fc %T /sys/fs/cgroup

# Для cgroups v2 просмотр лимита памяти процесса:
cat /sys/fs/cgroup/docker/<CONTAINER_ID>/memory.max`
    },
    interviewTips: [
      'Упомяните флаг JVM "-XX:+UseContainerSupport", который был бэкпортирован в JDK 8u191 и включен по умолчанию в JDK 11+.'
    ],
    commonPitfalls: [
      'Не выставлять Swap limits в контейнерах, из-за чего при исчерпании RAM контейнер начинает дико тормозить, уходя в своп на диске.'
    ],
    tags: ['Linux', 'CGroups', 'Docker', 'Kubernetes', 'JVM', 'Memory']
  },
  {
    id: 'comm-11',
    title: 'Как устроен архитектурный паттерн HA-кластера PostgreSQL (Patroni + etcd + PgBouncer)?',
    category: 'cloud',
    difficulty: 'Senior',
    summaryAnswer: 'Patroni выступает демоном-управляющим над PostgreSQL. Он использует etcd как распределенное хранилище конфигурации и лидера (DCS). При падении Master, Patroni через etcd проводит выборы нового Лидера и переводит Standby в Master. PgBouncer пулрует соединения и перенаправляет трафик.',
    fullAnswer: `Стандарт построения отказоустойчивых реляционных баз данных в enterprise-контуре:

1. **etcd (Distributed Consensus Store / DCS)**:
   - Хранит информацию о том, какой узел является текущим Мастером (Leader Key) с таймаутом (TTL/Lease).
2. **Patroni (Daemon на каждом узле БД)**:
   - Запущен рядом с PostgreSQL. Постоянно продлевает Lease в etcd.
   - Если Patroni на Master не успевает продлить Lease (падение железа, сетевая изоляция Split-Brain), TTL истекает.
   - Patroni на здоровых Standby узлах видит свободу ключа, запускает выборы и продвигает узел с наиболее свежей WAL-репликацией до нового Primary.
3. **Репликация (PostgreSQL Streaming Replication)**:
   - Синхронная или асинхронная передача WAL-логов с Master на Replicas.
4. **Маршрутизация трафика (PgBouncer / HAProxy / VIP)**:
   - Клиенты подключаются к PgBouncer или HAProxy, который через Patroni REST API (\`http://node:8008/primary\`) всегда знает актуальный IP-адрес текущего Мастера.`,
    codeSnippet: {
      language: 'yaml',
      code: `# Запрос состояния кластера Patroni
patronictl -c /etc/patroni/patroni.yml list

# Ручной контроллируемый switchover (смена Мастера)
patronictl -c /etc/patroni/patroni.yml switchover`
    },
    interviewTips: [
      'Объясните защиту от Split-Brain: если старый Мастер потерял связь с etcd, его Patroni немедленно переводит PostgreSQL в режим Read-Only или завершает процесс (Fencing).'
    ],
    commonPitfalls: [
      'Использовать обычный Keepalived с плавающим IP без DCS при асинхронной репликации — можно получить запись в два мастера одновременно (Split-Brain) и потерять данные.'
    ],
    tags: ['PostgreSQL', 'Patroni', 'etcd', 'HighAvailability', 'Databases', 'Cloud']
  }
];
