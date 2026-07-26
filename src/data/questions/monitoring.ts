import { Question } from '../../types';

export const MONITORING_QUESTIONS: Question[] = [
  {
    id: 'monitoring-1',
    title: 'Что такое Push-based и Pull-based модели сбора метрик? Сравнение Prometheus vs Graphite/InfluxDB',
    category: 'monitoring',
    difficulty: 'Middle',
    summaryAnswer: 'Pull-based (Prometheus) сам опрашивает targets по HTTP. Push-based (Graphite, InfluxDB, Telegraf) отправляет метрики от агентов на центральный сервер.',
    fullAnswer: `1. **Pull-based модель (Prometheus)**:
   - Сервер Prometheus регулярно (scrape_interval) сам приходит к агентам (Exporters) по HTTP /metrics и забирает метрики.
   - *Плюсы*: Легко обнаруживать упавшие сервисы (если метрика не забралась — сервис упал), централизованное управление частотой сбора, отсутствие риска перегрузить сервер мониторинга миллионами агентов.

2. **Push-based модель (Graphite, Datadog, OpenTelemetry Collector)**:
   - Приложения или экспортёры сами отправляют метрики на сервер мониторинга при их возникновении.
   - *Плюсы*: Удобно для короткоживущих задач (Serverless / Batch / Cron jobs), где под может умереть до прихода скрейпера Prometheus (для этого в экосистеме Prometheus создан Pushgateway).`,
    codeSnippet: {
      language: 'yaml',
      code: `# Prometheus scrape config
scrape_configs:
  - job_name: 'node_exporter'
    scrape_interval: 15s
    static_configs:
      - targets: ['10.0.0.1:9100', '10.0.0.2:9100']`
    },
    interviewTips: [
      'Упомяните Prometheus Pushgateway для короткоживущих Batch Jobs.'
    ],
    commonPitfalls: [
      'Использовать Pushgateway для обычных веб-сервисов (он превращает Prometheus в сингл-поинт фаилуре push сервер).'
    ],
    tags: ['Monitoring', 'Prometheus', 'PullVSPush', 'Architecture']
  },
  {
    id: 'monitoring-2',
    title: 'Какие бывают типы метрик в Prometheus (Counter, Gauge, Histogram, Summary)?',
    category: 'monitoring',
    difficulty: 'Junior',
    summaryAnswer: 'Counter — монотонно растущий счетчик (RPS, ошибки). Gauge — число, которое растет и падает (CPU, RAM, Connections). Histogram/Summary — распределения квантилей латентности.',
    fullAnswer: `1. **Counter (Счетчик)**:
   - Значение может ТОЛЬКО увеличиваться (или сбрасываться в 0 при перезапуске).
   - Используется с функцией \`rate()\` или \`increase()\` для вычисления скорости/RPS.
   - Примеры: http_requests_total, errors_count.

2. **Gauge (Датчик)**:
   - Значение может произвольно расти и уменьшаться.
   - Используется напрямую или с функцией \`avg_over_time()\`.
   - Примеры: node_memory_MemFree_bytes, active_db_connections, temperature.

3. **Histogram (Гистограмма)**:
   - Раскладывает значения по фиксированным бакетам (buckets).
   - Позволяет рассчитывать точные перцентили (p50, p95, p99) через функцию \`histogram_quantile()\`.

4. **Summary**:
   - Вычисляет перцентили прямо на стороне клиента. Нельзя агрегировать между несколькими подами!`,
    codeSnippet: {
      language: 'promql',
      code: `# Подсчет 95-го перцентиля задержки запросов (p95 latency)
histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))`
    },
    interviewTips: [
      'Запомните золотое правило: rate() применяется ТОЛЬКО к Counter метрикам!'
    ],
    commonPitfalls: [
      'Применять rate() к Gauge метрикам (получите бессмысленные значения).'
    ],
    tags: ['Monitoring', 'Prometheus', 'Metrics', 'PromQL']
  },
  {
    id: 'monitoring-3',
    title: 'В чем разница между функциями rate() и irate() в PromQL?',
    category: 'monitoring',
    difficulty: 'Middle',
    summaryAnswer: 'rate() усредняет скорость прироста за весь временной интервал (плавный график). irate() берет только 2 последних мгновенных точки (мгновенные всплески).',
    fullAnswer: `1. **rate(http_requests_total[5m])**:
   - Рассчитывает среднюю секунду задержку на основе Первой и Последней точки за 5 минут.
   - Сглаживает кратковременные пики (spikes).
   - Идеально для алертинга и общего анализа трендов.

2. **irate(http_requests_total[5m])**:
   - Рассчитывает мгновенную скорость прироста на основе ДВУХ самых последних точек внутри 5-минутного окна.
   - Быстро реагирует на резкие спайки и всплески нагрузки.
   - Идеально для высокочастотного мониторинга и дашбордов Grafana с частым обновлением.`,
    codeSnippet: {
      language: 'promql',
      code: `# Плавный средний RPS:
rate(http_requests_total[5m])

# Мгновенный спайк RPS:
irate(http_requests_total[2m])`
    },
    interviewTips: [
      'Для алертов всегда используйте rate(), а для детализированных графиков Grafana — irate().'
    ],
    commonPitfalls: [
      'Использовать irate() в алертинге, вызывая шторм ложных сработок от миллисекундных всплесков.'
    ],
    tags: ['Monitoring', 'PromQL', 'Prometheus', 'Rate', 'Irate']
  },
  {
    id: 'monitoring-4',
    title: 'Что такое High Cardinality (высокая кардинальность) метрик в Prometheus и к чему она приводит?',
    category: 'monitoring',
    difficulty: 'Senior',
    summaryAnswer: 'High Cardinality — уникальное сочетание имени метрики и лейблов. Возникает при засорении лейблов уникальными UUID, User ID, IP-адресами. Приводит к падению Prometheus по OOM.',
    fullAnswer: `Кардинальность метрики — это количество уникальных временных рядов (Time Series), создаваемых комбинациями лейблов.

**Пример катастрофы**:
Метрика http_requests_total{user_id="12345", ip="192.168.1.1"}.
Если в систему придет 1,000,000 уникальных пользователей, Prometheus создаст 1,000,000 независимых временных рядов в оперативной памяти!

**Последствия**:
1. Экспоненциальный рост потребления RAM Prometheus.
2. Падение по OOM Killer.
3. Невозможность выполнить PromQL запросы из-за таймаутов.

**Как бороться**:
Никогда не добавлять динамические ID пользователей, UUID, email, JWT токены или случайные хеши в лейблы метрик! Подобные данные должны отправляться в ЛОГИ или ТРЕЙСЫ.`,
    codeSnippet: {
      language: 'promql',
      code: `# Плохо:
http_requests_total{user_id="123", path="/user/123/checkout"}

# Хорошо (параметризованный path, без user_id):
http_requests_total{path="/user/:id/checkout", status="200"}`
    },
    interviewTips: [
      'Упомяните утилиту promtool и запрос topk(10, count by (__name__) ({__name__=~".+"})) для поиска раздутых метрик.'
    ],
    commonPitfalls: [
      'Пробрасывать User ID или Email в лейблы метрик Prometheus.'
    ],
    tags: ['Monitoring', 'Prometheus', 'Cardinality', 'Performance', 'Troubleshooting']
  },
  {
    id: 'monitoring-5',
    title: 'Что такое Четыре Золотых Сигнала (4 Golden Signals) SRE и RED / USE методологии?',
    category: 'monitoring',
    difficulty: 'Middle',
    summaryAnswer: '4 Golden Signals (Google SRE): Latency, Traffic, Errors, Saturation. RED (для сервисов): Rate, Errors, Duration. USE (для железа): Utilization, Saturation, Errors.',
    fullAnswer: `1. **4 Golden Signals (Google SRE)**:
   - **Latency** (Задержка): Время ответа на запросы.
   - **Traffic** (Трафик): Нагрузка на систему (RPS, Bps).
   - **Errors** (Ошибки): Доля упавших запросов (5xx, timeouts).
   - **Saturation** (Насыщение): Заполненность ресурсов (память, очереди, CPU throttling).

2. **RED Method (для Request-driven микросервисов)**:
   - **Rate**: Количество запросов в секунду.
   - **Errors**: Количество ошибок.
   - **Duration**: Длительность обработки запросов.

3. **USE Method (для инфраструктуры / серверов)**:
   - **Utilization**: % времени загрузки ресурса (CPU utilization).
   - **Saturation**: Длина очереди к ресурсу (Load Average, Disk I/O Queue).
   - **Errors**: Аппаратные и системные ошибки (Dropped packets, Bad sectors).`,
    codeSnippet: {
      language: 'text',
      code: `RED = Rate, Errors, Duration (Микросервисы)
USE = Utilization, Saturation, Errors (Серверы)`
    },
    interviewTips: [
      'Отличный ответ: использовать RED методологию для сервисов приложения, а USE для узлов Kubernetes!'
    ],
    commonPitfalls: [
      'Мониторить только процент CPU и не видеть, что пользователи получают ошибки 500 (отсутствие RED метрик).'
    ],
    tags: ['Monitoring', 'SRE', 'RED', 'USE', 'GoldenSignals']
  },
  {
    id: 'monitoring-6',
    title: 'Как устроена трассировка (Distributed Tracing), OpenTelemetry и термины Trace ID / Span ID?',
    category: 'monitoring',
    difficulty: 'Senior',
    summaryAnswer: 'Distributed Tracing отслеживает путь одного пользовательского запроса через каскад микросервисов. Trace ID — единый ID цепочки. Span ID — конкретная операция.',
    fullAnswer: `Когда пользователь нажимает кнопку на фронтенде, запрос проходит через API Gateway -> Auth Service -> Payment Service -> Database.

**Контекст распределенного вызова (Context Propagation)**:
1. Входящий HTTP запрос получает заголовок \`traceparent\` (стандарт W3C Trace Context).
2. **Trace ID**: Единый случайный хэш для всего пути вызова.
3. **Span ID**: Уникальный ID конкретного шага (например, запрос SELECT к БД).
4. Каждый сервис транслирует заголовок \`traceparent\` дальше по цепи вызовов.

**OpenTelemetry (OTel)**:
Унифицированный стандарт вендоро-независимого сбора метрик, логов и трейсов. Данные собираются OTel Collector и отправляются в системы визуализации (Jaeger, Tempo, Datadog).`,
    codeSnippet: {
      language: 'text',
      code: `HTTP Header: traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
                       |  |                                |                |
                    version  Trace ID                          Span ID          Flags`
    },
    interviewTips: [
      'Упомяните Jaeger или Grafana Tempo для визуализации Gantt-диаграмм трейсов.'
    ],
    commonPitfalls: [
      'Забывать пробрасывать HTTP заголовки traceparent в коде при вызове соседних сервисов.'
    ],
    tags: ['Monitoring', 'Tracing', 'OpenTelemetry', 'Jaeger', 'Tempo']
  },
  {
    id: 'monitoring-7',
    title: 'Что такое SLA, SLO и SLI в методологии SRE?',
    category: 'monitoring',
    difficulty: 'Middle',
    summaryAnswer: 'SLI — фактическая метрика (например 99.8% успешных ответов). SLO — целевая цель команды (99.9%). SLA — юридический договор с финансовыми штрафами перед клиентом.',
    fullAnswer: `1. **SLI (Service Level Indicator)**:
   - Измеряемая числовая метрика качества.
   - *Пример*: Количество ответов 200 OK / Общее количество запросов = 99.85%.

2. **SLO (Service Level Objective)**:
   - Внутренняя целевая планка качества, согласованная командами разработки и эксплуатации.
   - *Пример*: SLI успешности за 30 дней должен быть >= 99.9%.

3. **SLA (Service Level Agreement)**:
   - Внешнее соглашение с бизнес-клиентами с финансовыми гарантиями и штрафами за простой.
   - *Пример*: Если доступность ниже 99.5%, возвращаем 20% стоимости подписки.
   - SLA ВСЕГДА слабее и ниже, чем внутренний SLO!`,
    codeSnippet: {
      language: 'text',
      code: `SLI (Что есть) <= SLO (К чему стремимся) <= SLA (Что обещали юзерам)`
    },
    interviewTips: [
      'Упомяните термин Error Budget (Бюджет ошибок = 100% - SLO). Если бюджет не израсходован, можно катить фичи быстро!'
    ],
    commonPitfalls: [
      'Делать SLO равным 100% (это нереализуемо и уничтожает скорость разработки).'
    ],
    tags: ['Monitoring', 'SRE', 'SLO', 'SLI', 'SLA', 'ErrorBudget']
  },
  {
    id: 'monitoring-8',
    title: 'Как устроена централизованная система сбора логов (Loki, ELK/EFK, Vector)?',
    category: 'monitoring',
    difficulty: 'Middle',
    summaryAnswer: 'Сборщик на ноде (Promtail, Fluentbit, Vector) собирает логи файлов контейнеров и отправляет в индексатор (Loki, Elasticsearch), доступный в Grafana/Kibana.',
    fullAnswer: `1. **ELK / EFK (Elasticsearch, Logstash/Fluentd, Kibana)**:
   - Индексирует КАЖДОЕ слово в логах (Full-text search).
   - *Минусы*: Огромное потребление RAM и диска под индексы.

2. **Grafana Loki + Promtail**:
   - Подход "Like Prometheus, but for logs".
   - Индексирует ТОЛЬКО лейблы (app, namespace, pod), а сам текст лога сжимает и кладет в дешевое S3 хранилище!
   - Потребляет в 10 раз меньше ресурсов, чем Elasticsearch.

3. **Vector**:
   - Супер-быстрый легкий агента-сборщик на Rust, заменяющий тяжелые Logstash и Fluentd.`,
    codeSnippet: {
      language: 'yaml',
      code: `# LogQL запрос в Loki
{app="web-api", env="prod"} |= "error" | json | status_code >= 500`
    },
    interviewTips: [
      'Сравните экономию ресурсов Loki перед Elasticsearch за счет индексации только лейблов.'
    ],
    commonPitfalls: [
      'Пытаться делать точный полнотекстовый поиск с регулярками по петабайтам логов в Loki.'
    ],
    tags: ['Monitoring', 'Logging', 'Loki', 'Elasticsearch', 'Vector']
  },
  {
    id: 'monitoring-9',
    title: 'Что такое Prometheus Alertmanager и стратегии группировки / подавления алертов (Grouping, Inhibition, Silences)?',
    category: 'monitoring',
    difficulty: 'Middle',
    summaryAnswer: 'Alertmanager принимает алерты от Prometheus, группирует их, подавляет каскадные сбои (Inhibition), отправляет уведомления в Telegram/Slack/PagerDuty.',
    fullAnswer: `1. **Grouping (Группировка)**:
   - Объединяет сотни однотипных алертов от разных подов одного сервиса в ОДНО сообщение в Telegram (group_by: ['alertname', 'cluster', 'service']).

2. **Inhibition (Подавление)**:
   - Заглушает второстепенные алерты, если уже горит критический главный алерт.
   - *Пример*: Если весь ЦОД/Дата-центр недоступен (DC_Down), Alertmanager глушит 500 алертов о недоступности отдельных БД и микросервисов в этом ЦОД.

3. **Silences (Заглушки)**:
   - Временное отключение уведомлений через UI на время проведения плановых технических работ (Maintenance window).`,
    codeSnippet: {
      language: 'yaml',
      code: `# Alertmanager config
route:
  group_by: ['alertname', 'namespace']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  receiver: 'telegram-notifications'`
    },
    interviewTips: [
      'Упомяните параметр repeat_interval, чтобы не спамить в чат дежурных каждые 5 минут.'
    ],
    commonPitfalls: [
      'Настраивать Alertmanager так, чтобы дежурному инженеру прилетало 300 сообщений в секунду при падении одной ноды.'
    ],
    tags: ['Monitoring', 'Alertmanager', 'Prometheus', 'Alerting']
  },
  {
    id: 'monitoring-10',
    title: 'Как настроить экспортеры Prometheus (Node Exporter, kube-state-metrics, Blackbox Exporter)?',
    category: 'monitoring',
    difficulty: 'Junior',
    summaryAnswer: 'Exporters транслируют метрики сторонних систем в формат Prometheus. Node Exporter — метрики железа OS. kube-state-metrics — состояние объектов K8s. Blackbox — внешние пробы.',
    fullAnswer: `1. **Node Exporter**:
   - Собирает метрики ядра Linux (CPU, RAM, Disk I/O, Network, Systemd) прямо со спец-файлов /proc и /sys.

2. **kube-state-metrics (KSM)**:
   - Слушает API-сервер Kubernetes и генерирует метрики о состоянии объектов (сколько реплик у Deployment, статус подов, истечение сертификатов, лимиты ресурсов).

3. **Blackbox Exporter**:
   - Выполняет внешние синтетические проверки по протоколам HTTP, HTTPS, TCP, ICMP, DNS.
   - Проверяет доступность сайта снаружи и срок годности SSL сертификатов.`,
    codeSnippet: {
      language: 'yaml',
      code: `# Проверка SSL сертификата через Blackbox Exporter
probe_ssl_earliest_cert_expiry - time() < 86400 * 7 # Алерт: SSL истекает через 7 дней`
    },
    interviewTips: [
      'Укажите разницу: kube-state-metrics опрашивает API K8s, а cAdvisor дает метрики использования ресурсов контейнерами.'
    ],
    commonPitfalls: [
      'Путать метрики cAdvisor (фактическое потребление CPU контейнером) и kube-state-metrics (запрошенный spec.requests).'
    ],
    tags: ['Monitoring', 'Exporters', 'Prometheus', 'Kubernetes']
  },
  {
    id: 'monitoring-11',
    title: 'Что такое VictoriaMetrics и ThanOS? Как организовать долгосрочное хранение (Long-term Storage) метрик?',
    category: 'monitoring',
    difficulty: 'Senior',
    summaryAnswer: 'Prometheus хранит данные локально на диске. Thanos и VictoriaMetrics обеспечивают распределенное долгосрочное хранилище (S3/Object Storage), дедупликацию и глобальный PromQL.',
    fullAnswer: `Ограничение стандартного Prometheus:
Он хранит метрики локально в папочке data/ (TSDB) и плохо масштабируется при хранении историй за 1-2 года.

**Решения**:
1. **Thanos**:
   - Добавляет sidecar контейнер к Prometheus, который каждые 2 часа отгружает сжатые блоки метрик в дешевый S3 бакет.
   - Thanos Querier дает единый глобальный интерфейс PromQL для поверх сотен кластеров.
   - Поддерживает Downsampling (уменьшение разрешения старых метрик до 5m/1h интервалов для экономии места).

2. **VictoriaMetrics**:
   - Супер-быстрая альтернатива Prometheus.
   - В 10 раз эффективнее сжимает данные на диске и тратит в 5 раз меньше RAM.
   - Нативно поддерживает протокол Prometheus Remote Write.`,
    codeSnippet: {
      language: 'yaml',
      code: `# Prometheus Remote Write в VictoriaMetrics
remote_write:
  - url: "http://victoriametrics:8428/api/v1/write"`
    },
    interviewTips: [
      'Упомяните Downsampling в Thanos как способ смотреть годовые графики за секунды.'
    ],
    commonPitfalls: [
      'Пытаться раздувать диск локального Prometheus до 10 ТБ ради хранения годовой истории.'
    ],
    tags: ['Monitoring', 'Thanos', 'VictoriaMetrics', 'Prometheus', 'S3']
  },
  {
    id: 'monitoring-12',
    title: 'Как устроена витрина визуализации Grafana (Dashboards, Variables, Templating)?',
    category: 'monitoring',
    difficulty: 'Junior',
    summaryAnswer: 'Grafana визуализирует метрики, логи и трейсы из десятков источников (Prometheus, Loki, Postgres). Использует динамические переменные для фильтрации окружений.',
    fullAnswer: `Grafana — стандарт индустрии для UI панелей.

**Ключевые возможности**:
1. **Data Sources**: Возможность на одном дашборде сочетать метрики из Prometheus, логи из Loki и трейсы из Tempo!
2. **Variables (Динамические переменные)**: Позволяют фильтровать дашборд по выбору $cluster, $namespace, $pod без переписывания PromQL запросов.
3. **Annotations**: Отображение событий деплоев или перезапусков подов прямо поверх графиков латентности.`,
    codeSnippet: {
      language: 'promql',
      code: `# Запрос с переменной Grafana $namespace
sum(rate(container_cpu_usage_seconds_total{namespace="$namespace"}[5m])) by (pod)`
    },
    interviewTips: [
      'Упомяните концепцию "Dashboard as Code" (сохранение JSON дашбордов в Git через Terraform или ConfigMaps).'
    ],
    commonPitfalls: [
      'Pадавать жесткие хардкод имена подов в запросах дашборда Grafana.'
    ],
    tags: ['Monitoring', 'Grafana', 'Dashboards', 'Visualization']
  },
  {
    id: 'monitoring-13',
    title: 'Что такое Synthetic Monitoring и чем он отличается от Real User Monitoring (RUM)?',
    category: 'monitoring',
    difficulty: 'Middle',
    summaryAnswer: 'Synthetic Monitoring имитирует действия пользователей роботами по расписанию. RUM собирает реальную телеметрию из браузеров живых пользователей.',
    fullAnswer: `1. **Synthetic Monitoring (Синтетический мониторинг)**:
   - Роботы (Playwright, Selenium, Blackbox) каждые 1-5 минут выполняют типичный сценарий: "Зайти на сайт -> Войти -> Добавить в корзину -> Оплатить".
   - *Плюс*: Находит проблемы ДО того, как придут реальные пользователи (например, ночью после кривого деплоя).

2. **RUM (Real User Monitoring)**:
   - JS-скрипт внедряется в веб-страницу и собирает честную телеметрию (Core Web Vitals, JS errors, реальный сетевой ping из Бразилии или Токио).
   - *Плюс*: Показывает реальный пользовательский опыт на реальных смартфонах и каналах связи.`,
    codeSnippet: {
      language: 'javascript',
      code: `// RUM Snippet
window.addEventListener('error', (event) => {
    sendTelemetryToDatadog({ error: event.error.stack });
});`
    },
    interviewTips: [
      'Идеально сочетать оба подхода: Synthetic для раннего алертинга, RUM для анализа конверсии и UX.'
    ],
    commonPitfalls: [
      'Полагаться только на RUM для сервиса с нулевым ночным трафиком.'
    ],
    tags: ['Monitoring', 'RUM', 'Synthetic', 'UX', 'Blackbox']
  },
  {
    id: 'monitoring-14',
    title: 'Что такое Profiling и утилиты Pyroscope / pprof для поиска утечек памяти в коде?',
    category: 'monitoring',
    difficulty: 'Senior',
    summaryAnswer: 'Profiling анализирует исполнение кода на уровне отдельных функций и строк (CPU/Memory Flamegraphs). Pyroscope делает непрерывный Continuous Profiling.',
    fullAnswer: `Когда метрики показывают высокое потребление CPU или утечку RAM, метрики не могут сказать, КАКАЯ ИМЕННО строка кода виновата.

**Continuous Profiling (Pyroscope, Parca)**:
1. Минималистичные агенты с интервалом раз в секунду снимают стек вызовов (Stacktrace) процесса.
2. Визуализируют данные в виде **Flame Graph (Огненный граф)**:
   - Ширина блока равна проценту времени CPU или объема RAM, потраченного этой функцией.
3. Позволяет мгновенно кликнуть на самый широкий блок и увидеть: "Функция parseJSON() занимает 70% всего CPU сервера!".`,
    codeSnippet: {
      language: 'go',
      code: `import _ "net/http/pprof"
// Подключение pprof в Go приложениях для профайлинга на лету`
    },
    interviewTips: [
      'Упомяните термины Flame Graph и CPU/Heap profiling.'
    ],
    commonPitfalls: [
      'Оставлять незащищенным HTTP эндпоинт /debug/pprof в публичной сети.'
    ],
    tags: ['Monitoring', 'Profiling', 'Pyroscope', 'FlameGraph', 'Go']
  },
  {
    id: 'monitoring-15',
    title: 'Что такое метрики RED, USE и Golden Signals в мониторинге? Какие метрики и когда следует использовать?',
    category: 'monitoring',
    difficulty: 'Middle',
    summaryAnswer: 'Это методологические фреймворки мониторинга. USE применяется для инфраструктуры (железа), RED — для веб-сервисов (микросервисов), а Golden Signals от Google — это универсальный гибридный подход.',
    fullAnswer: `При проектировании мониторинга важно собирать правильные метрики, чтобы не утонуть в терабайтах бесполезных данных. Для этого используют три стандарта:

1. **USE Method (для инфраструктуры — CPU, Диски, RAM)**:
   - **U**tilization (Утилизация): процент времени, когда ресурс был занят (например, CPU на 85%).
   - **S**aturation (Насыщение / Очередь): наличие невыполненной работы, стоящей в очереди (например, CPU Load Average или глубина очереди диска). Показывает, что системе не хватает мощности еще до 100% утилизации!
   - **E**rrors (Ошибки): количество ошибок (например, битые секторы диска или ошибки сетевой карты).

2. **RED Method (для сервисов, приложений и API)**:
   - **R**ate (Интенсивность): количество запросов в секунду (RPS).
   - **E**rrors (Ошибки): количество неуспешных запросов (например, 5xx ошибки HTTP).
   - **D**uration (Длительность / Латентность): время обработки запросов (обычно измеряется перцентилями: p50, p95, p99).

3. **Four Golden Signals (Четыре золотых сигнала Google SRE)**:
   - **Latency** (Латентность): время обработки успешных и неуспешных запросов отдельно.
   - **Traffic** (Трафик): спрос на систему (RPS, пропускная способность сети).
   - **Errors** (Ошибки): доля упавших запросов.
   - **Saturation** (Насыщение): загруженность самых дефицитных ресурсов системы (например, квота памяти, лимиты CPU).`,
    codeSnippet: {
      language: 'promql',
      code: `# Запрос RED: Подсчет процента ошибок (Error Rate) в Prometheus
sum(rate(http_requests_total{status=~"5.."}[5m])) 
/ 
sum(rate(http_requests_total[5m])) * 100`
    },
    interviewTips: [
      'Объясните, почему среднее арифметическое время ответа (Average Latency) — бесполезная и вредная метрика. Всегда нужно смотреть на перцентили (например, p95 означает, что 95% пользователей получили ответ быстрее этого времени, а 5% столкнулись с большими задержками).'
    ],
    commonPitfalls: [
      'Использовать RED-метрики для мониторинга физических серверов или баз данных. Наоборот, применение USE для веб-сервисов не покажет реальный опыт пользователя.'
    ],
    tags: ['Monitoring', 'SRE', 'RED', 'USE', 'Metrics', 'Prometheus']
  },
  {
    id: 'monitoring-16',
    title: 'Что такое SLA, SLO, SLI и Error Budget? Как рассчитать бюджет ошибок и управлять им?',
    category: 'monitoring',
    difficulty: 'Senior',
    summaryAnswer: 'SLA — юридическое соглашение о надежности с клиентом. SLO — внутренняя техническая цель надежности. SLI — реальный показатель (метрика), по которому оценивают выполнение SLO. Error Budget — допустимое время простоя, рассчитываемое как 100% - SLO.',
    fullAnswer: `Эти термины составляют фундамент методологии Google SRE (Site Reliability Engineering) для баланса между скоростью разработки и надежностью сервиса.

**Основные понятия**:
- **SLI (Service Level Indicator)**: Конкретная метрика, измеряющая надежность. Например: *"Процент HTTP-запросов, выполненных успешно (не 5xx) за < 200 мс"*. Formula: \`(Успешные события / Всего событий) * 100\`.
- **SLO (Service Level Objective)**: Целевое значение для SLI, которое команда обязуется держать. Например: *"SLI должен быть >= 99.9% за месяц"*.
- **SLA (Service Level Agreement)**: Бизнес-договор с клиентами, описывающий последствия нарушения SLO (например, возврат денег). Обычно SLA мягче, чем технический SLO (например, SLO — 99.9%, а SLA — 99.0%).

**Бюджет ошибок (Error Budget)**:
Это допустимый порог нестабильности. Если ваш SLO равен **99.9%**, то ваш Error Budget составляет **0.1%**.
- Если за месяц к вам пришло 1,000,000 запросов, то вы имеете право отдать с ошибкой ровно 1,000 запросов.
- Любые падения, проведение планового обслуживания или баги тратят (выжигают) этот бюджет.

**Как им управлять**:
- **Бюджет свободен**: Команда имеет право быстро катить новые фичи, проводить рискованные деплои и эксперименты.
- **Бюджет исчерпан (Error Budget Exhausted)**: Фичи блокируются! Все силы команды разработки перебрасываются исключительно на стабилизацию, рефакторинг и написание автотестов, пока бюджет не восстановится.`,
    codeSnippet: {
      language: 'yaml',
      code: `# Пример Alerting Rule в Prometheus на критическое выжигание бюджета ошибок (Multi-window multi-burn-rate)
expr: (sum(rate(http_requests_total{status=~"5.."}[1h])) / sum(rate(http_requests_total[1h]))) > 0.02
# Алерт сработает, если за 1 час мы выжгли более 2% месячного Error Budget`
    },
    interviewTips: [
      'Упомяните, что Error Budget — это лучший способ разрешить конфликт между разработчиками (которые хотят выпускать фичи как можно быстрее) и сисадминами/SRE (которые хотят, чтобы ничего не падало и не менялось). Бюджет ошибок дает математически обоснованный компромисс.'
    ],
    commonPitfalls: [
      'Устанавливать нереалистичный SLO в 100%. Это невозможно технически и сделает бюджет ошибок нулевым, полностью заблокировав разработку.'
    ],
    tags: ['Monitoring', 'SRE', 'SLO', 'SLA', 'ErrorBudget', 'Alerting']
  }
];
