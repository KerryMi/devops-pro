import { Question } from '../../types';

export const K8S_QUESTIONS: Question[] = [
  {
    id: 'k8s-1',
    title: 'Из каких компонентов состоит Kubernetes Control Plane и Worker Nodes?',
    category: 'k8s',
    difficulty: 'Middle',
    summaryAnswer: 'Control Plane включает kube-apiserver, etcd, kube-scheduler и kube-controller-manager. Worker Node включает kubelet, kube-proxy и Container Runtime (например, containerd).',
    fullAnswer: `**Control Plane (Мастер узел):**
1. **kube-apiserver** — центральная точка входа REST API, валидирует и сохраняет состояние объектов в etcd.
2. **etcd** — распределенное строго согласованное хранилище "ключ-значение" (Raft consensus) состояния кластера.
3. **kube-scheduler** — отслеживает созданные поды без назначенного узла и выбирает подходящую воркер-ноду.
4. **kube-controller-manager** — запускает контроллеры (Deployment, ReplicaSet, NodeController, Endpoints).

**Worker Node:**
1. **kubelet** — агент на ноде, который общается с API-сервером и гарантирует запуск контейнеров через CRI.
2. **kube-proxy** — отвечает за сетевую маршрутизацию внутри ноды (iptables или IPVS) для служб Service.
3. **Container Runtime** — среды выполнения контейнеров (containerd, CRI-O).`,
    codeSnippet: {
      language: 'bash',
      code: 'kubectl get pods -n kube-system # просмотр подов control plane'
    },
    interviewTips: [
      'Упомяните cloud-controller-manager для облачных провайдеров (AWS, Yandex Cloud) для управления LoadBalancer/Storage.',
      'Подчеркните роль etcd как единственного источника правды (Single source of truth).'
    ],
    commonPitfalls: [
      'Забывать про etcd или называть Docker вместо containerd (начиная с K8s 1.24 dockershim полностью удален).'
    ],
    tags: ['Kubernetes', 'Architecture', 'ControlPlane', 'etcd', 'Kubelet']
  },
  {
    id: 'k8s-2',
    title: 'В чем разница между Liveness, Readiness и Startup пробами (Probes) в Kubernetes?',
    category: 'k8s',
    difficulty: 'Middle',
    summaryAnswer: 'Liveness перезапускает контейнер при сбое. Readiness убирает под из endpoints Service (трафик не идет). Startup блокирует остальные пробы на время медленного старта.',
    fullAnswer: `1. **Liveness Probe**: проверяет, жива ли программа. Если проба фейлится, kubelet убивает контейнер и перезапускает его согласно restartPolicy.
2. **Readiness Probe**: проверяет, готов ли под принимать сетевой трафик. Если фейлится, под не убивается, но его IP исключается из endpoints сервиса.
3. **Startup Probe**: используется для "тяжелых" приложений с долгим стартом (например, Java/Spring). Пока она не пройдет успешно, Liveness и Readiness пробы отключены.`,
    codeSnippet: {
      language: 'yaml',
      code: `livenessProbe:
  httpGet:
    path: /healthz
    port: 8080
  initialDelaySeconds: 15
  periodSeconds: 10
readinessProbe:
  httpGet:
    path: /ready
    port: 8080
  periodSeconds: 5`
    },
    interviewTips: [
      'Расскажите реальный кейс: если база данных временно недоступна, должна фейлиться Readiness (чтобы снять трафик), а НЕ Liveness (иначе все поды уйдут в бесконечный CrashLoopBackOff).'
    ],
    commonPitfalls: [
      'Делать Liveness пробу зависящей от внешних сервисов (БД, Redis).'
    ],
    tags: ['Kubernetes', 'Probes', 'HealthCheck', 'Reliability']
  },
  {
    id: 'k8s-3',
    title: 'Как работает Kubernetes HPA (Horizontal Pod Autoscaler) и какие метрики использует?',
    category: 'k8s',
    difficulty: 'Middle',
    summaryAnswer: 'HPA автоматически увеличивает или уменьшает число реплик Deployment/StatefulSet на основе загрузки CPU, RAM или пользовательских кастомных метрик (из Prometheus).',
    fullAnswer: `HPA опрашивает API metrics-server (или custom-metrics API) с периодом (по умолчанию 15 секунд).
Формула подсчета желаемого количества реплик:
desiredReplicas = ceil[ currentReplicas * ( currentMetricValue / targetMetricValue ) ]

Для использования обычных метрик CPU/Memory в спецификации подов обязательно должны быть указаны requests по ресурсам!
Для сложного автомасштабирования (например, количество сообщений в очереди RabbitMQ/Kafka, RPS) подключают Prometheus Adapter или KEDA.`,
    codeSnippet: {
      language: 'yaml',
      code: `apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70`
    },
    interviewTips: [
      'Упомяните KEDA как индустриальный стандарт для Event-driven автомасштабирования в современном DevOps.'
    ],
    commonPitfalls: [
      'Забывать про ресурсы request в контейнерах — без них HPA по процентному пользованию CPU/RAM не сможет рассчитать формулу!'
    ],
    tags: ['Kubernetes', 'Autoscaling', 'HPA', 'Prometheus', 'KEDA']
  },
  {
    id: 'k8s-4',
    title: 'Опишите пошагово, что происходит в кластере при выполнении kubectl apply -f pod.yaml',
    category: 'k8s',
    difficulty: 'Senior',
    summaryAnswer: 'Запрос аутентифицируется и валидируется в kube-apiserver, записывается в etcd, scheduler подбирает ноду, kubelet на ноде получает команду и через CRI запускает контейнеры.',
    fullAnswer: `1. **Client**: \`kubectl\` валидирует YAML локально и отправляет HTTP POST запрос к \`kube-apiserver\`.
2. **Authentication & Authorization**: API-сервер проверяет токен/сертификат (AuthN) и права пользователя через RBAC (AuthZ).
3. **Admission Control**: Запрос проходит через Mutating/Validating Webhooks (например, проставляются дефолтные значения или проверяются политики безопасности Kyverno/OPA Gatekeeper).
4. **ETCD Storage**: Валидный объект Pod записывается в \`etcd\` в состоянии \`Pending\` (без указания nodeName).
5. **Scheduler**: \`kube-scheduler\` видит новый под без \`nodeName\`, фильтрует ноды (Filtering) и ранжирует их (Scoring), после чего записывает выбранную ноду в поле \`spec.nodeName\` пода через API-сервер (Binding).
6. **Kubelet**: \`kubelet\` на целевой воркер-ноде через механизм Watch видит под, назначенный на его ноду.
7. **CRI & CNI**: Kubelet вызывает Container Runtime (containerd) через CRI для скачивания образа и запуска контейнеров, а также вызывает CNI плагин (Calico/Flannel) для выделения IP-адреса пода.
8. **Status Update**: Kubelet отправляет актуальный статус пода (Running) обратно в API-сервер.`,
    codeSnippet: {
      language: 'bash',
      code: 'kubectl get events --sort-by=.metadata.creationTimestamp # просмотр событий создания'
    },
    interviewTips: [
      'Упоминание Admission Webhooks и очереди задач/Watch механизмов показывает глубокое понимание архитектуры K8s.'
    ],
    commonPitfalls: [
      'Думать, что scheduler заходит по SSH на ноду и запускает там контейнер.'
    ],
    tags: ['Kubernetes', 'Lifecycle', 'Scheduler', 'Kubelet', 'ETCD']
  },
  {
    id: 'k8s-5',
    title: 'В чем отличие Deployment от StatefulSet?',
    category: 'k8s',
    difficulty: 'Middle',
    summaryAnswer: 'Deployment используется для Stateless сервисов без сохранения состояния. StatefulSet предназначается для Stateful приложений (БД, Kafka) и обеспечивает уникальные сетевые имена и диски для каждого пода.',
    fullAnswer: `1. **Deployment**:
   - Поды взаимно заменяемы и имеют случайные суффиксы в именах (app-5847b-x8z9l).
   - Все поды используют общий PVC (если тип доступа ReadWriteMany) или работают без дисков.
   - Поды создаются и удаляются в произвольном параллельном порядке.

2. **StatefulSet**:
   - Каждому поду присваивается порядковый индекс (db-0, db-1, db-2) и стабильное DNS-имя в Headless Service.
   - Шаблон volumeClaimTemplates динамически создает уникальный PV/PVC для КАЖДОГО пода отдельно.
   - Поды создаются и удаляются строго по порядку (0 -> 1 -> 2 при масштабировании, 2 -> 1 -> 0 при удалении).`,
    codeSnippet: {
      language: 'yaml',
      code: `apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
spec:
  serviceName: "postgres-headless"
  replicas: 3
  volumeClaimTemplates:
  - metadata:
      name: data
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 10Gi`
    },
    interviewTips: [
      'Укажите про Headless Service (clusterIP: None), который обязателен для StatefulSet для прямой адресации мастеров и реплик БД.'
    ],
    commonPitfalls: [
      'Пытаться запустить кластер PostgreSQL или ElasticSearch через обычный Deployment.'
    ],
    tags: ['Kubernetes', 'Deployment', 'StatefulSet', 'Databases']
  },
  {
    id: 'k8s-6',
    title: 'Как работают DaemonSet и DaemonSet RollingUpdate?',
    category: 'k8s',
    difficulty: 'Middle',
    summaryAnswer: 'DaemonSet гарантирует запуск по ровно одной копии пода на всех (или выбранных через nodeSelector/affinity) воркер-нодах кластера. Применяется для логов, мониторинга и CNI.',
    fullAnswer: `Типичные варианты применения DaemonSet:
1. Сборщики логов: Fluentbit, Logstash, Vector.
2. Мониторинг агенты: Prometheus node-exporter, Datadog agent.
3. Сетевые CNI плагины: Calico node, Cilium agent.

При обновлении спецификации DaemonSet по умолчанию применяется стратегия RollingUpdate (или OnDelete). В отличие от Deployment, у DaemonSet параметр maxSurge равен 0, так как нельзя запустить вторую копию на той же ноде; обновляется по одной ноде за раз через maxUnavailable.`,
    codeSnippet: {
      language: 'yaml',
      code: `apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: node-exporter
spec:
  selector:
    matchLabels:
      app: node-exporter
  template:
    metadata:
      labels:
        app: node-exporter
    spec:
      containers:
      - name: node-exporter
        image: prom/node-exporter:v1.7.0`
    },
    interviewTips: [
      'Укажите про Tolerations: DaemonSet обычно имеет tolerations для master/control-plane нод, чтобы собирать метрики и с них тоже.'
    ],
    commonPitfalls: [
      'Забывать добавить tolerations на master-nodes, удивляясь почему логгер не запустился на master нодах.'
    ],
    tags: ['Kubernetes', 'DaemonSet', 'Monitoring', 'Logging']
  },
  {
    id: 'k8s-7',
    title: 'В чем разница между ClusterIP, NodePort, LoadBalancer и ExternalName сервисами?',
    category: 'k8s',
    difficulty: 'Junior',
    summaryAnswer: 'ClusterIP дает внутренний виртуальный IP. NodePort открывает фиксированный порт (30000-32767) на всех нодах. LoadBalancer запрашивает внешний облачный балансировщик. ExternalName делает DNS CNAME маппинг.',
    fullAnswer: `1. **ClusterIP** (дефолт): Доступен ТОЛЬКО внутри кластера. Использует kube-proxy (iptables/ipvs) для балансировки между подами.
2. **NodePort**: Открывает статический порт в диапазоне 30000-32767 на каждом узле кластера. Трафик на NodeIP:NodePort проксируется на внутренние поды.
3. **LoadBalancer**: Интегрируется с Cloud Provider API (AWS ALB, GCP NLB, Yandex Cloud LB) и автоматически выделяет внешний публичный IP адресс, перенаправляющий трафик на NodePort сервиса.
4. **ExternalName**: Не имеет селекторов и IP. Возвращает DNS CNAME запись (например, на внешний сервис RDS PostgreSQL) для внутреннего кластерного приложения.`,
    codeSnippet: {
      language: 'yaml',
      code: `apiVersion: v1
kind: Service
metadata:
  name: external-db
spec:
  type: ExternalName
  externalName: db.prod.aws.com`
    },
    interviewTips: [
      'Отметьте, что для управления сотнями HTTP/HTTPS маршрутов вместо сотен LoadBalancer сервисов используют Ingress Controller или Gateway API.'
    ],
    commonPitfalls: [
      'Создавать отдельный Service type: LoadBalancer для каждого микросервиса (дорого и неоптимально).'
    ],
    tags: ['Kubernetes', 'Networking', 'Service', 'LoadBalancer', 'Ingress']
  },
  {
    id: 'k8s-8',
    title: 'Что такое Ingress Controller и в чем разница с Gateway API?',
    category: 'k8s',
    difficulty: 'Middle',
    summaryAnswer: 'Ingress Controller (Nginx, Traefik, HAProxy) управляет L7 роутингом (HTTP/HTTPS, TLS termination). Gateway API — современный более гибкий стандарт замены Ingress с разделением прав ролей.',
    fullAnswer: `Ingress — это ресурс K8s, описывающий правила маршрутизации HTTP(S) трафика на внутренние сервисы. Ingress Controller — это приложение (например ingress-nginx), которое реализует эти правила.

**Проблема Ingress**: ограниченный функционал, жесткая привязка к вендорским аннотациям (nginx.ingress.kubernetes.io/...).

**Gateway API**:
- Разделяет обязанности: Infrastructure Provider создает GatewayClass, Cluster Admin создает Gateway (слушает порты), а Developer создает HTTPRoute/TLSRoute.
- Втивно поддерживает замену заголовков, Canary роутинг по весам трафика, gRPC, TCP/UDP нативно без хаков с аннотациями.`,
    codeSnippet: {
      language: 'yaml',
      code: `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
spec:
  rules:
  - host: app.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: app-service
            port:
              number: 80`
    },
    interviewTips: [
      'Упомяните Cert-Manager для автоматического выпуска SSL-сертификатов Let\'s Encrypt.'
    ],
    commonPitfalls: [
      'Думать, что созданный манифест Ingress работает без установленного Ingress Controller.'
    ],
    tags: ['Kubernetes', 'Ingress', 'GatewayAPI', 'Nginx', 'TLS']
  },
  {
    id: 'k8s-9',
    title: 'Как работают Network Policies в Kubernetes и какие CNI их поддерживают?',
    category: 'k8s',
    difficulty: 'Middle',
    summaryAnswer: 'NetworkPolicies работают как встроенный файрвол для подов (L3/L4 фильтрация по лейблам и IP). По умолчанию вся сеть в K8s открыта (flat network). Поддерживается CNI: Calico, Cilium, Weave.',
    fullAnswer: `По умолчанию в Kubernetes любые поды могут свободно отправлять сетевые пакеты любым другим подам в любых namespaces.

При появлении хотя бы одной NetworkPolicy с подselector, совпадающим с подом, под переходит в режим "Default Deny" для данного направления трафика (Ingress или Egress). Все неразрешенные явно соединения блокируются.

*CNI поддержка*: стандартный Flannel НЕ поддерживает NetworkPolicies. Для их работы требуется установка продвинутого CNI (Calico, Cilium через eBPF).`,
    codeSnippet: {
      language: 'yaml',
      code: `apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: db-allow-backend
spec:
  podSelector:
    matchLabels:
      role: db
  ingress:
  - from:
    - podSelector:
        matchLabels:
          role: backend
    ports:
    - protocol: TCP
      port: 5432`
    },
    interviewTips: [
      'Упомяните eBPF в Cilium как супер-быстрый способ обработки NetworkPolicies без замедления iptables.'
    ],
    commonPitfalls: [
      'Применять NetworkPolicy на кластере с Flannel и удивляться, почему блокировка не работает.'
    ],
    tags: ['Kubernetes', 'Security', 'NetworkPolicy', 'CNI', 'Calico', 'Cilium']
  },
  {
    id: 'k8s-10',
    title: 'В чем разница между Request и Limit для ресурсов CPU и Memory?',
    category: 'k8s',
    difficulty: 'Junior',
    summaryAnswer: 'Request — гарантированное минимальное количество ресурсов, зарезервированное для пода при планировании (Scheduler). Limit — жесткий верхний порог потребления.',
    fullAnswer: `1. **CPU**:
   - Измеряется в миллиядрах (1000m = 1 CPU core).
   - CPU — восстанавливаемый ресурс (Compressible). Если под пытается превысить CPU Limit, ядро Linux применяет cgroup CPU throttling (замедление), но не убивает под!

2. **Memory**:
   - Измеряется в байтах (256Mi, 1Gi).
   - Memory — невосстанавливаемый ресурс (Uncompressible). Если под превысит Memory Limit, OOM Killer убивает контейнер (Exit Code 137).

3. **QoS классы подов**:
   - **Guaranteed**: Request == Limit для всех контейнеров. Последний кандидат на убиение при дефиците ноды.
   - **Burstable**: Request < Limit. Средний приоритет.
   - **BestEffort**: Request и Limit не указаны. Первым уничтожается при нехватке ресурсов.`,
    codeSnippet: {
      language: 'yaml',
      code: `resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"`
    },
    interviewTips: [
      'Объясните класс Guaranteed и его важность для критичных продуктовых приложений.'
    ],
    commonPitfalls: [
      'Задавать CPU Limit слишком маленьким, что приводит к сильному CPU Throttling и деградации latencies.'
    ],
    tags: ['Kubernetes', 'Resources', 'Limits', 'Requests', 'QoS']
  },
  {
    id: 'k8s-11',
    title: 'Что такое NodeAffinity, PodAffinity и PodAntiAffinity?',
    category: 'k8s',
    difficulty: 'Middle',
    summaryAnswer: 'Правила планирования (Scheduling): NodeAffinity привязывает поды к определенным нодам, PodAffinity сажает поды рядом друг с другом, PodAntiAffinity разносит поды по разным нодам/зонам.',
    fullAnswer: `1. **NodeAffinity**: Расширенная версия nodeSelector. Поддерживает гибкие операторы (In, NotIn, Exists) и две формы:
   - requiredDuringSchedulingIgnoredDuringExecution (жесткое правило - Hard)
   - preferredDuringSchedulingIgnoredDuringExecution (мягкое правило - Soft с весом weight)

2. **PodAffinity**: Просит разместить под на той же ноде/стойке/AZ, где уже крутится под с определенным label (например, разместить кэш Redis рядом с API).

3. **PodAntiAffinity**: Запрещает размещать поды с одинаковым label на одной ноде/зоне (High Availability). Гарантирует, что реплики приложения раскидаются по разным физическим серверам или Availability Zones.`,
    codeSnippet: {
      language: 'yaml',
      code: `podAntiAffinity:
  requiredDuringSchedulingIgnoredDuringExecution:
  - labelSelector:
      matchExpressions:
      - key: app
        operator: In
        values:
        - web-api
    topologyKey: "kubernetes.io/hostname"`
    },
    interviewTips: [
      'Укажите topologyKey: "topology.kubernetes.io/zone" для отказоустойчивого распределения по дата-центрам.'
    ],
    commonPitfalls: [
      'Использовать жесткий (required) PodAntiAffinity с 10 репликами на кластере из 3 нод — поды останутся в состоянии Pending!'
    ],
    tags: ['Kubernetes', 'Scheduling', 'Affinity', 'HighAvailability']
  },
  {
    id: 'k8s-12',
    title: 'Как работает RBAC (Role-Based Access Control) в Kubernetes?',
    category: 'k8s',
    difficulty: 'Middle',
    summaryAnswer: 'RBAC регулирует права доступа к объектам API K8s. Состоит из Ролей (Role/ClusterRole) и Привязок ролей (RoleBinding/ClusterRoleBinding) к субъектам (Users, Groups, ServiceAccounts).',
    fullAnswer: `1. **Субъекты**:
   - User Accounts (человеческие пользователи, идентифицируются X.509 сертификатами или OIDC).
   - ServiceAccounts (учетные записи для приложений/подов внутри кластера).

2. **Правила (Role vs ClusterRole)**:
   - **Role**: Задает разрешения (verbs: get, list, create, delete) для ресурсов (pods, services) ВНУТРИ конкретного namespace.
   - **ClusterRole**: Задает разрешения на уровне ВСЕГО кластера (nodes, namespaces, persistentvolumes).

3. **Привязка (RoleBinding vs ClusterRoleBinding)**:
   - Связывает субъекта с созданной ролью.`,
    codeSnippet: {
      language: 'yaml',
      code: `apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: dev
  name: pod-reader
rules:
- apiGroups: [""]
  resources: ["pods", "pods/log"]
  verbs: ["get", "watch", "list"]`
    },
    interviewTips: [
      'Упомяните утилиту kubectl auth can-i create pods --as=system:serviceaccount:default:my-sa для быстрой проверки прав.'
    ],
    commonPitfalls: [
      'Давать сервисам роль cluster-admin ради избежания отладки прав.'
    ],
    tags: ['Kubernetes', 'RBAC', 'Security', 'ServiceAccount']
  },
  {
    id: 'k8s-13',
    title: 'Что происходит при вызове kubectl drain node-name и чем отличается от cordon?',
    category: 'k8s',
    difficulty: 'Middle',
    summaryAnswer: 'cordon делает ноду Unschedulable (новые поды не приходят). drain дополнительно безопасным образом выселяет (evict) все существующие поды с ноды на другие рабочие узлы.',
    fullAnswer: `1. **kubectl cordon <node>**:
   - Навешивает на ноду пометку unschedulable: true.
   - Существующие поды продолжают нормально работать.
   - Новые поды K8s scheduler на эту ноду больше не распределяет.

2. **kubectl drain <node>**:
   - Автоматически выполняет cordon.
   - Посылает запрос Eviction API для каждого пода на этой ноде.
   - Контроллеры (Deployment/StatefulSet) пересоздают выселенные поды на других здоровых воркер-нодах.
   - По уважает настройки PodDisruptionBudget (PDB)!
   - Флаги: --ignore-daemonsets (обязателен, так как DaemonSet поды нельзя перенести) и --delete-emptydir-data.`,
    codeSnippet: {
      language: 'bash',
      code: `kubectl cordon node-1 # заблокировать
kubectl drain node-1 --ignore-daemonsets --delete-emptydir-data # выселить поды
kubectl uncordon node-1 # вернуть в работу после техобслуживания`
    },
    interviewTips: [
      'Упомяните PodDisruptionBudget (PDB), гарантирующий минимальное количество доступных подов во время drain.'
    ],
    commonPitfalls: [
      'Выполнять reboot ноды без предварительного drain, вызывая простой сервисов.'
    ],
    tags: ['Kubernetes', 'Operations', 'Drain', 'Cordon', 'Maintenance']
  },
  {
    id: 'k8s-14',
    title: 'Что такое CRD (Custom Resource Definition) и Operator Pattern?',
    category: 'k8s',
    difficulty: 'Senior',
    summaryAnswer: 'CRD расширяет API Kubernetes пользовательскими типами ресурсов. Оператор — это сочетание CRD и кастомного контроллера, автоматизирующего управление сложными приложениями (БД, Kafka).',
    fullAnswer: `1. **CRD (Custom Resource Definition)**:
   - Регистрирует новый вид объекта в API K8s (например, kind: PostgresCluster, kind: CertManager).
   - Kube-apiserver начинает валидировать и сохранять эти ресурсы в etcd.

2. **Operator Pattern (Паттерн Оператор)**:
   - Реализует управляющий цикл (Reconciliation Loop).
   - Непрерывно сравнивает желаемое состояние (описанное в CRD) с реальным состоянием ресурсов в кластере.
   - Пример: Оператор PostgreSQL автоматически поднимет Master, 2 реплики, настроит streaming replication, сделает резервные копии в S3 и при падении Мастера сам сделает Failover и промоут реплики!`,
    codeSnippet: {
      language: 'yaml',
      code: `apiVersion: postgres-operator.zalando.org/v1
kind: postgresql
metadata:
  name: acid-minimal-cluster
spec:
  teamId: "acid"
  volume:
    size: 10Gi
  numberOfInstances: 2
  users:
    zalando: [superuser, createdb]`
    },
    interviewTips: [
      'Назовите популярные операторы: Zalando Postgres Operator, Strimzi Kafka Operator, Prometheus Operator.'
    ],
    commonPitfalls: [
      'Писать сложные Helm чарты там, где требуется оператор с умной логикой реакций на сбои stateful сервиса.'
    ],
    tags: ['Kubernetes', 'CRD', 'Operator', 'Automation', 'Architecture']
  },
  {
    id: 'k8s-15',
    title: 'Как работает etcd в Kubernetes кластере и почему число нод должно быть нечетным?',
    category: 'k8s',
    difficulty: 'Senior',
    summaryAnswer: 'etcd — это распределенная key-value БД на алгоритме консенсуса Raft. Нечетное количество нод (3, 5, 7) требуется для формирования большинства (кворума) при авариях Split-Brain.',
    fullAnswer: `etcd хранит ВСЕ состояние кластера K8s.
Алгоритм Raft требует кворум для подтверждения записи и выбора Лидера.
Формула кворума: Q = (N / 2) + 1, где N — общее количество нод etcd.

- При N=3 кворум Q=2. Система переживет падение 1 ноды (3-1=2 >= 2).
- При N=4 кворум Q=3. Система ВСЁ ЕЩЕ переживет падение ТОЛЬКО 1 ноды (4-1=3 >= 3).
Добавление 4-й ноды НЕ увеличивает отказоустойчивость, но увеличивает сетевые задержки на синхронизацию! Поэтому число мастеров всегда делают НЕЧЕТНЫМ (3, 5).`,
    codeSnippet: {
      language: 'bash',
      code: `ETCDCTL_API=3 etcdctl endpoint status --write-out=table # проверка состояния кворума etcd`
    },
    interviewTips: [
      'Упомяните важность быстрых SSD дисков для etcd (высокие требования к fsync latency).'
    ],
    commonPitfalls: [
      'Делать кластер с 2 или 4 нодами Control Plane.'
    ],
    tags: ['Kubernetes', 'etcd', 'Raft', 'Consensus', 'HighAvailability']
  },
  {
    id: 'k8s-16',
    title: 'Что такое Ingress и Ingress Controller? Чем они отличаются от Service типа LoadBalancer или NodePort?',
    category: 'k8s',
    difficulty: 'Middle',
    summaryAnswer: 'Ingress — это объект-описание правил маршрутизации L7-трафика (HTTP/HTTPS) к сервисам. Ingress Controller — это запущенный под-прокси (например, Nginx, Traefik), который эти правила физически выполняет. Service типа LoadBalancer — это L4 балансировщик облачного провайдера.',
    fullAnswer: `Для предоставления доступа к приложениям извне в Kubernetes есть несколько способов:

1. **NodePort**:
   - Открывает фиксированный порт (30000-32767) на ВСЕХ нодах кластера. Запрос на IP любой ноды с этим портом перенаправляется на нужный под.
   - *Минус*: Неудобно для продакшна (пользователю нужно знать IP нод и нестандартный порт).

2. **LoadBalancer**:
   - Напрямую интегрируется с облаком (AWS, GCP). Автоматически заказывает физический балансировщик (L4) у провайдера, выделяя внешний статический IP.
   - *Минус*: На каждый сервис создается отдельный дорогой облачный балансировщик. Нет маршрутизации по путям (например, \`/api\` на один под, \`/static\` — на другой).

3. **Ingress + Ingress Controller (L7 маршрутизация)**:
   - **Ingress**: Декларативный ресурс, где вы пишете: "Если запрос пришел на домен \`app.com/api\`, перенаправить в сервис \`api-service\`".
   - **Ingress Controller**: Фактический сервер (часто Nginx, Envoy или Traefik), запущенный внутри кластера в одном экземпляре. Он слушает порты 80/443 и проксирует трафик внутри кластера.
   - Вы заказываете ровно ОДИН Service типа LoadBalancer, который указывает на Ingress Controller. Все домены и пути вы бесплатно маршрутизируете через Ingress-ресурсы!`,
    codeSnippet: {
      language: 'yaml',
      code: `# Пример Ingress-правила
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: minimal-ingress
spec:
  ingressClassName: nginx
  rules:
  - host: myapp.ru
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 80`
    },
    interviewTips: [
      'Укажите на разницу L4 (LoadBalancer, оперирует IP и портами) и L7 (Ingress, понимает заголовки HTTP, куки, домены, пути и SSL).'
    ],
    commonPitfalls: [
      'Создавать Ingress-ресурс, но забывать установить в кластер Ingress Controller. Сам по себе Ingress — это просто конфиг в etcd, без контроллера он работать не будет.'
    ],
    tags: ['Kubernetes', 'Ingress', 'Service', 'LoadBalancer', 'Nginx']
  },
  {
    id: 'k8s-17',
    title: 'Как работают сетевые политики (Network Policies) в Kubernetes? Как ограничить доступ между подами?',
    category: 'k8s',
    difficulty: 'Senior',
    summaryAnswer: 'Network Policy — это аналог встроенного фаервола в Kubernetes. По умолчанию в кластере разрешен любой сетевой трафик между всеми подами (All-Allow). Сетевые политики позволяют настроить правила фильтрации L3/L4 (Ingress/Egress) на основе селекторов.',
    fullAnswer: `По умолчанию сеть Kubernetes плоская: любой под из пространства имен \`dev\` может свободно слать запросы поду в пространство имен \`prod\`.

**Как работают Network Policies**:
1. Сетевые политики применяются к подам с помощью меток (Labels).
2. Вы указываете селектор подов (\`podSelector\`), на которые действует политика.
3. Описываете правила:
   - **Ingress** (входящий трафик): откуда разрешено принимать пакеты (по селекторам подов, пространств имен или IP-блокам CIDR).
   - **Egress** (исходящий трафик): куда разрешено слать пакеты.
4. **Важное свойство**: как только к поду применяется хотя бы одна NetworkPolicy, этот под переходит в режим "Default Deny" для неподходящего трафика. Все неразрешенные соединения будут блокироваться!

**Важное требование — CNI**:
Сетевые политики — это чисто декларативные абстракции API. Чтобы они работали, CNI-плагин кластера должен поддерживать спецификацию NetworkPolicy (например, **Calico**, **Cilium**, **Weave Net**). Стандартный плагин **Flannel сетевые политики НЕ поддерживает** (они будут молча игнорироваться).`,
    codeSnippet: {
      language: 'yaml',
      code: `# Блокировать весь входящий трафик к базе данных, кроме пода бэкенда
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: db-netpolicy
  namespace: app-prod
spec:
  podSelector:
    matchLabels:
      role: db
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          role: backend`
    },
    interviewTips: [
      'Подчеркните: "Если в кластере используется Flannel CNI, сетевые политики будут создаваться без ошибок, но фактически работать не будут". Этот нюанс показывает глубокие практические знания сетевого рантайма.'
    ],
    commonPitfalls: [
      'Думать, что Network Policy может фильтровать трафик по доменным именам на уровне L7. Стандартные сетевые политики K8s работают только на уровнях L3 (IP) и L4 (Port/Protocol). Для L7 фильтрации (например, разрешить доступ только к \`api.stripe.com\`) используют Service Mesh (Istio, Linkerd) или продвинутый Cilium CNI.'
    ],
    tags: ['Kubernetes', 'NetworkPolicy', 'Security', 'CNI', 'Calico', 'Cilium']
  }
];
