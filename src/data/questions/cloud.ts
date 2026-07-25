import { Question } from '../../types';

export const CLOUD_QUESTIONS: Question[] = [
  {
    id: 'cloud-1',
    title: 'Модели облачных сервисов: IaaS vs PaaS vs SaaS vs Serverless (FaaS) с примерами',
    category: 'cloud',
    difficulty: 'Junior',
    summaryAnswer: 'IaaS — виртуальные машины и сеть (EC2, Yandex Compute). PaaS — готовые среды и СУБД (Heroku, Cloud SQL). SaaS — готовый софт (Gmail). FaaS — запуск функций без серверов (AWS Lambda).',
    fullAnswer: `1. **IaaS (Infrastructure as a Service)**:
   - Вам предоставляются сырые виртуальные машины, диски и сети.
   - Вы сами ставите ОС, патчи безопасности, драйверы и софт.
   - *Примеры*: AWS EC2, GCP Compute Engine, Yandex Compute Cloud.

2. **PaaS (Platform as a Service)**:
   - Облако берет на себя управление ОС, бэкапами и репликацией БД. Вы разворачиваете только свой код или данные.
   - *Примеры*: Managed PostgreSQL, Heroku, AWS Elastic Beanstalk.

3. **FaaS / Serverless (Function as a Service)**:
   - Вы загружаете отдельную функцию (Python/Go/Node.js). Серверы поднимаются за миллисекунды под запрос и мгновенно гаснут. Платеж идет только за миллисекунды работы.
   - *Примеры*: AWS Lambda, Yandex Cloud Functions, Google Cloud Run.

4. **SaaS (Software as a Service)**:
   - Готовое пользовательское приложение под ключ.
   - *Примеры*: Google Workspace, Jira, Salesforce.`,
    codeSnippet: {
      language: 'text',
      code: `IaaS : Вы управляете ОС, Runtime, Кодом
PaaS : Облако управляет ОС, Вы управляете Кодом
FaaS : Вы пишете только короткую функцию`
    },
    interviewTips: [
      'Упомяните разделение ответственности (Shared Responsibility Model).'
    ],
    commonPitfalls: [
      'Пытаться запустить долгие 2-часовые процессы в AWS Lambda (у Lambda лимит таймаута 15 минут).'
    ],
    tags: ['Cloud', 'IaaS', 'PaaS', 'SaaS', 'Serverless', 'AWS']
  },
  {
    id: 'cloud-2',
    title: 'Что такое концепция Изолированных Облаков VPC (Virtual Private Cloud) и подсети (Public vs Private Subnets)?',
    category: 'cloud',
    difficulty: 'Junior',
    summaryAnswer: 'VPC — изолированная виртуальная сеть в облаке. Public Subnet имеет прямой выход в Интернет через Internet Gateway. Private Subnet изолирована и выходит в сеть только через NAT Gateway.',
    fullAnswer: `VPC даёт полную изоляцию инфраструктуры вашей компании в облаке.

**Архитектура безопасной VPC**:
1. **Public Subnet (Публичная подсеть)**:
   - Имеет маршрут к Internet Gateway (IGW).
   - В ней размещаются только Балансировщики нагрузки (ALB / Ingress) и Bastion-хосты.

2. **Private Subnet (Приватная подсеть)**:
   - НЕ имеет прямого публичного IP и маршрута к Internet Gateway.
   - В ней размещаются приложения, базы данных и микросервисы.
   - Для скачивания обновлений приватные поды выходят в Интернет через **NAT Gateway** в публичной подсети.`,
    codeSnippet: {
      language: 'text',
      code: `Internet -> Internet Gateway -> Public Subnet (ALB) -> Private Subnet (K8s Pods / DB)`
    },
    interviewTips: [
      'Подчеркните бест-практику: Базы данных ВСЕГДА размещаются строго в Private Subnets!'
    ],
    commonPitfalls: [
      'Вешать публичные IP на базы данных и серверы приложений.'
    ],
    tags: ['Cloud', 'VPC', 'Networking', 'Security', 'Subnets']
  },
  {
    id: 'cloud-3',
    title: 'Управление доступом IAM (Identity and Access Management): Users, Groups, Roles, Policies',
    category: 'cloud',
    difficulty: 'Middle',
    summaryAnswer: 'IAM управляет аутентификацией и авторизацией. Users — люди. Roles — временные права для сервисов/подов. Policies — JSON документы с разрешениями.',
    fullAnswer: `1. **IAM User / Service Account**:
   - Пользователь-человек или учетная запись сервиса с логином/паролем или статическими API ключами.

2. **IAM Role**:
   - Набор прав, который НЕ имеет постоянных секретных ключей.
   - Сервисы (EC2 инстансы, Kubernetes поды) временное запрашивают (AssumeRole) токен этой роли.

3. **IAM Policy**:
   - JSON документ, определяющий разрешенные или запрещенные действия (Effect: Allow/Deny, Action: s3:GetObject, Resource: arn:aws:s3:::my-bucket/*).

**Принцип наименьших привилегий (Principle of Least Privilege)**:
Выдавать СТРОГО только те действия и ресурсы, которые необходимы сервису для работы.`,
    codeSnippet: {
      language: 'json',
      code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject"],
      "Resource": "arn:aws:s3:::my-app-bucket/*"
    }
  ]
}`
    },
    interviewTips: [
      'Отметьте использование IAM Roles for Service Accounts (IRSA) в Kubernetes вместо создания static AWS keys.'
    ],
    commonPitfalls: [
      'Выдавать пользователям и сервисам права Action: "*", Resource: "*".'
    ],
    tags: ['Cloud', 'IAM', 'Security', 'AWS', 'Policies']
  },
  {
    id: 'cloud-4',
    title: 'Объектное хранилище (S3 / Object Storage): классы хранения, версионирование и presigned URLs',
    category: 'cloud',
    difficulty: 'Middle',
    summaryAnswer: 'S3 хранит файлы (объекты) с ключами в бакетах. Классы: Standard, Infrequent Access, Glacier (архив). Presigned URLs дают временный доступ без авторизации.',
    fullAnswer: `S3 (Simple Storage Service) — масштабируемое REST-хранилище файлов со 11 девятами надежности (99.999999999%).

**Классы хранения (Storage Classes)**:
1. **Standard**: Для часто запрашиваемых данных (картинки сайта, ассеты).
2. **Infrequent Access (IA)**: Дешевле хранение, но плата за запрос. Для редких бэкапов.
3. **Glacier / Glacier Deep Archive**: Супер-дешевое хранение архивов. Время извлечения файла от 1 минуты до 12 часов.

**Presigned URLs**:
Позволяет бэкенду сгенерировать временную ссылку с подписью на скачивание или загрузку файла напрямую в S3, не пропуская тяжелый трафик через бэкенд!`,
    codeSnippet: {
      language: 'python',
      code: `# Генерация временной ссылки на загрузку файла клиентом напрямую в S3
url = s3_client.generate_presigned_url(
    'put_object', Params={'Bucket': 'my-bucket', 'Key': 'user_avatar.png'}, ExpiresIn=3600
)`
    },
    interviewTips: [
      'Упомяните S3 Lifecycle Rules для автоматического перемещения старых логов в Glacier через 30 дней.'
    ],
    commonPitfalls: [
      'Прокачивать файлы пользователей через собственный Node.js API сервер вместо Presigned URL в S3.'
    ],
    tags: ['Cloud', 'S3', 'Storage', 'PresignedURL', 'AWS']
  },
  {
    id: 'cloud-5',
    title: 'Что такое стратегия Multi-AZ (Availability Zones) и Disaster Recovery (DR) в облаке?',
    category: 'cloud',
    difficulty: 'Middle',
    summaryAnswer: 'Multi-AZ разворачивает компоненты в разных физических дата-центрах одного региона для High Availability. DR варианты: Pilot Light, Warm Standby, Active-Active.',
    fullAnswer: `1. **Availability Zone (Зона доступности)**:
   - Один или несколько изолированных физических ЦОД со своей электросетью и охлаждением в одном регионе (на расстоянии 10-50км друг от друга).
   - Multi-AZ гарантирует, что при пожаре или отключении света в одной зоне, приложение автоматически продолжит работу в соседней AZ.

2. **Стратегии Disaster Recovery (Восстановление после катастроф)**:
   - **Backup & Restore**: Самый дешевый способ, восстановление из S3 бэкапа часов (RTO высокое).
   - **Pilot Light**: База данных реплицируется в другой регион, но серверы выключены. При аварии серверы поднимаются за 15 минут.
   - **Warm Standby**: Дублирующий минимальный стенд постоянно крутится в другом регионе.
   - **Active-Active Multi-Region**: Приложение одновременно обрабатывает трафик в двух регионах мира (минимальный RTO/RPO, но дорого).`,
    codeSnippet: {
      language: 'text',
      code: `RTO (Recovery Time Objective) — за какое время нужно подняться
RPO (Recovery Point Objective) — за какой период допустимо потерять данные`
    },
    interviewTips: [
      'Четко объясните разницу между метриками RTO и RPO.'
    ],
    commonPitfalls: [
      'Деплоить весь кластер Kubernetes и Master БД в ОДНУ зону доступности.'
    ],
    tags: ['Cloud', 'HighAvailability', 'DisasterRecovery', 'MultiAZ', 'SRE']
  },
  {
    id: 'cloud-6',
    title: 'Облачные Managed баз данных (Cloud SQL, AWS RDS) и почему их выбирают вместо self-hosted БД?',
    category: 'cloud',
    difficulty: 'Junior',
    summaryAnswer: 'Managed БД берет на себя автоматические бэкапы, репликацию, патчи ОС, автоматический failover мастера и автомасштабирование дисков.',
    fullAnswer: `Преимущества Managed PostgreSQL/MySQL (AWS RDS, Yandex Managed Postgres):
1. **Automated Failover (Multi-AZ)**: При падении первичного узла (Master) облако за 30-60 секунд автоматически переключает DNS на реплику (Standby) без участия инженера.
2. **Point-In-Time Recovery (PITR)**: Позволяет восстановить состояние БД на ЛЮБУЮ секунду за последние 35 дней из WAL-логов!
3. **Автоматическое масштабирование диска**: Облако само увеличивает размер SSD при заполнении на 90%.
4. **Безопасность**: Автоматическое накатывание патчей безопасности в выбранные Maintenance Windows.`,
    codeSnippet: {
      language: 'bash',
      code: `# Автоматический отказоустойчивый кворум создается за пару кликов или в HCL коде`
    },
    interviewTips: [
      'Назовите главную причину: сбережение рабочего времени инженеров (Operational Overhead).'
    ],
    commonPitfalls: [
      'Администрировать самописный PostgreSQL в Deployment K8s без оператора и без понимания WAL арбитража.'
    ],
    tags: ['Cloud', 'Databases', 'RDS', 'PostgreSQL', 'Managed']
  },
  {
    id: 'cloud-7',
    title: 'Что такое Infrastructure as Code (IaC) и сравнение Terraform vs Pulumi vs CloudFormation?',
    category: 'cloud',
    difficulty: 'Middle',
    summaryAnswer: 'IaC описывает инфраструктуру кодом. Terraform/OpenTofu использует декларативный HCL. Pulumi позволяет использовать настоящие языки (TypeScript, Python, Go).',
    fullAnswer: `Преимущества IaC:
Версионирование в Git, проведение Code Review инфраструктуры, исключение "ночных ручных кликов" в веб-консоли.

1. **Terraform / OpenTofu (HCL)**:
   - Декларативный предметно-ориентированный язык HCL.
   - Стандарт индустрии, крупнейшая экосистема провайдеров.

2. **Pulumi**:
   - Позволяет писать инфраструктуру на реальных языках программирования (TypeScript, Python, Go, C#).
   - *Плюсы*: Полноценные автодополнения в IDE, циклы for, условия if, юнит-тестирование кода инфраструктуры через Jest/PyTest.

3. **AWS CloudFormation / GCP Deployment Manager**:
   - Нативные вендорские инструменты облака (JSON/YAML).`,
    codeSnippet: {
      language: 'typescript',
      code: `// Pulumi на TypeScript
import * as aws from "@pulumi/aws";

const bucket = new aws.s3.Bucket("my-bucket", {
    website: { indexDocument: "index.html" },
});`
    },
    interviewTips: [
      'Отметьте, что Pulumi идеален для разработчиков, а Terraform — для класических DevOps.'
    ],
    commonPitfalls: [
      'Создавать ресурсы в консоли облака вручную мимо IaC (Drift).'
    ],
    tags: ['Cloud', 'IaC', 'Terraform', 'Pulumi', 'Automation']
  },
  {
    id: 'cloud-8',
    title: 'Что такое Cloud Cost Optimization (FinOps) и утилиты Infracost / AWS Cost Explorer?',
    category: 'cloud',
    difficulty: 'Middle',
    summaryAnswer: 'FinOps — практика управления и оптимизации затрат в облаке. Инструменты: Reserved Instances, Spot Instances, Infracost (расчет цены в Pull Request).',
    fullAnswer: `Способы снижения чека за облако на 30-70%:

1. **Spot Instances (Прерываемые инстансы)**:
   - Использование нераспроданных мощностей облака со скидкой 70-90%.
   - Облако может забрать инстанс, предупредив за 2 минуты. Идеально для K8s воркер-нод без состояния (Stateless) и сборок CI/CD.

2. **Reserved Instances (RI) / Savings Plans**:
   - Оплата ресурсов с обязательством использования на 1 или 3 года дают скидку 30-60%.

3. **Infracost в CI/CD**:
   - Утилита анализирует HCL код в Pull Request и выводит точную сумму изменение счета за месяц ($) прямо в комментариях PR!`,
    codeSnippet: {
      language: 'text',
      code: `Infracost output in PR:
Monthly cost will increase by +$42.50 (S3 Bucket + NAT Gateway)`
    },
    interviewTips: [
      'Упомяните отключение неиспользуемых NAT Gateways и неиспользуемых EBS/EIP в Dev окружениях на ночь.'
    ],
    commonPitfalls: [
      'Забывать удалять отмонтированные Unattached EBS диски после удаления виртуалок.'
    ],
    tags: ['Cloud', 'FinOps', 'Infracost', 'Optimization', 'Spot']
  },
  {
    id: 'cloud-9',
    title: 'Что такое Spot / Interruptible виртуальные машины и как правильно готовить приложения к их замене?',
    category: 'cloud',
    difficulty: 'Middle',
    summaryAnswer: 'Spot инстансы дешевле на 80%, но могут быть удалены облаком в любой момент. Приложение должно уметь корректно обрабатывать предупреждение за 2 минуты.',
    fullAnswer: `При получении от облака сигнала об изъятии Spot инстанса (Termination Notice):

1. **Обработка сигнала**:
   - Облако посылает событие через Metadata API и сигнал SIGTERM.

2. **Реакция Kubernetes**:
   - Агент Node Termination Handler перехватывает событие.
   - Выполняет \`kubectl drain\` для этой ноды.
   - Поды успевают завершить соединение (Graceful Shutdown) и пересоздаются на других стабильных или спасительных spot нодах.

*Где применять Spot*:
- Воркер-ноды Kubernetes для приложения с 3+ репликами.
- Раннеры CI/CD.
- Обучение нейросетей (ML training) с сохранением чекпоинтов.`,
    codeSnippet: {
      language: 'bash',
      code: `# AWS Node Termination Handler отслеживает смену Spot нод`
    },
    interviewTips: [
      'Никогда не запускайте базы данных и мастер-ноды на Spot инстансах!'
    ],
    commonPitfalls: [
      'Использовать Spot инстансы без автоматизированного дренажа подов.'
    ],
    tags: ['Cloud', 'Spot', 'Kubernetes', 'Optimization', 'FinOps']
  },
  {
    id: 'cloud-10',
    title: 'Что такое Cloud-Init и как он используется для первичной настройки виртуальных машин?',
    category: 'cloud',
    difficulty: 'Junior',
    summaryAnswer: 'Cloud-Init — мультиплатформенный стандарт первичной конфигурации ВМ при первом старте (создание юзеров, SSH-ключей, установка пакетов).',
    fullAnswer: `Когда облако поднимает чистую виртуальную машину из образа Ubuntu/Debian, Cloud-Init читает пользовательские данные (**User Data** / Metadata) и выполняет их при первом буте.

**Формат user-data (cloud-config)**:
YAML файл с командами:
- **users**: Создать пользователей и прописать их id_rsa.pub.
- **packages**: Установить базовые пакеты (docker, htop).
- **runcmd**: Выполнить произвольные bash команды.`,
    codeSnippet: {
      language: 'yaml',
      code: `#cloud-config
users:
  - name: devops
    sudo: ALL=(ALL) NOPASSWD:ALL
    ssh_authorized_keys:
      - ssh-rsa AAAAB3NzaC1...
packages:
  - docker.io
  - htop
runcmd:
  - systemctl enable --now docker`
    },
    interviewTips: [
      'Упомяните, что cloud-init логи хранятся в /var/log/cloud-init-output.log.'
    ],
    commonPitfalls: [
      'Пытаться писать в user-data тяжелую 20-минутную сборку приложения вместо создания готового Packer AMI образа.'
    ],
    tags: ['Cloud', 'CloudInit', 'UserData', 'Automation', 'Linux']
  },
  {
    id: 'cloud-11',
    title: 'Что такое Packer и концепция суверенных "золотых" образов (Golden Images)?',
    category: 'cloud',
    difficulty: 'Middle',
    summaryAnswer: 'Packer (от HashiCorp) автоматически собирает идентичные готовые образа ВМ (AMI, Compute Images) с предустановленным софтом для быстрой загрузки.',
    fullAnswer: `Проблема старта через Cloud-Init:
Каждый раз при масштабировании автоскейлингом новая ВМ тратит 10 минут на скачивание пакетов из интернета.

**Решение с Packer (Golden Image)**:
1. Packer запускает временную ВМ в облаке.
2. Запускает Ansible или Bash скрипты, устанавливая Docker, агенты мониторинга, конфигурации безопасности.
3. Сохраняет готовую ВМ как запеченный **Golden Image (AMI)**.
4. Новые инстансы из готового Golden Image стартуют за 15 секунд!`,
    codeSnippet: {
      language: 'hcl',
      code: `# Packer template (HCL)
source "amazon-ebs" "ubuntu" {
  ami_name      = "golden-image-v1"
  instance_type = "t3.micro"
  source_ami    = "ami-0123456789"
}`
    },
    interviewTips: [
      'Упомяните связку: Packer создает образ, Terraform деплоит ВМ из этого образа.'
    ],
    commonPitfalls: [
      'Запекать динамические конфиги и секреты прямо внутрь образа Packer.'
    ],
    tags: ['Cloud', 'Packer', 'AMI', 'Automation', 'GoldenImage']
  },
  {
    id: 'cloud-12',
    title: 'Как устроены сетевые диски (EBS / Block Storage) vs Сетевые файловые системы (EFS / NFS)?',
    category: 'cloud',
    difficulty: 'Junior',
    summaryAnswer: 'Block Storage (EBS) монтируется как физический диск к ОДНОЙ ВМ (ReadWriteOnce). File Storage (EFS/NFS) монтируется одновременно к сотням ВМ (ReadWriteMany).',
    fullAnswer: `1. **Block Storage (AWS EBS, Yandex Network Disks)**:
   - Высокая скорость I/O (IOPS, низкие latencies).
   - По умолчанию монтируется строго к ОДНОМУ инстансу (ReadWriteOnce - RWO).
   - Применяется для Баз Данных (Postgres, Redis).

2. **File Storage (AWS EFS, NFS)**:
   - Сетевая файловая система.
   - Могут одновременно монтировать и читать/писать сотни серверов или подов (ReadWriteMany - RWX).
   - Скорость I/O ниже, чем у блочных дисков.
   - Применяется для общего медиа-контента, WordPress uploads, общих логов.`,
    codeSnippet: {
      language: 'text',
      code: `EBS = Высокая скорость, 1 Сервер (RWO)
EFS = Сетевая папка, 100+ Серверов (RWX)`
    },
    interviewTips: [
      'Свяжите с типами доступа PVC в K8s: ReadWriteOnce vs ReadWriteMany.'
    ],
    commonPitfalls: [
      'Пытаться примонтировать один стандартный EBS диск одновременно к двум подам на разных нодах.'
    ],
    tags: ['Cloud', 'Storage', 'EBS', 'EFS', 'NFS', 'Kubernetes']
  },
  {
    id: 'cloud-13',
    title: 'Что такое Serverless Containers (AWS Fargate, Google Cloud Run) и чем отличаются от K8s?',
    category: 'cloud',
    difficulty: 'Middle',
    summaryAnswer: 'Serverless Containers запускают Docker-контейнеры по требованию без управления нодами и кластером. Автомасштабирование от 0 до N контейнеров.',
    fullAnswer: `Обычный Kubernetes требует управления нодами, CNI, воркер-серверами, обновлениями Control Plane.

**Serverless Containers (Google Cloud Run / AWS Fargate)**:
1. Вы просто передаете ссылку на свой Docker образ в Container Registry.
2. Облако само мгновенно выделяет изолированное микро-ядро под контейнер.
3. **Scale to Zero**: Если запросов нет, число контейнеров падает до 0, и вы платите ровно 0 рублей!
4. При приходе HTTP запроса контейнер поднимается за сотни миллисекунд (Cold Start) и обрабатывает запрос.

*Идеально для*: Микросервисов с нестабильным/периодическим трафиком, REST API, вебхуков.`,
    codeSnippet: {
      language: 'bash',
      code: `gcloud run deploy my-app --image gcr.io/my-project/my-app:latest --allow-unauthenticated`
    },
    interviewTips: [
      'Упомяните проблему Cold Start (задержка первого старта после простоя).'
    ],
    commonPitfalls: [
      'Деплоить приложения со статической памятью и фоновыми WebSocket соединениями на Scale-to-Zero планах.'
    ],
    tags: ['Cloud', 'Serverless', 'CloudRun', 'Fargate', 'Containers']
  },
  {
    id: 'cloud-14',
    title: 'Что такое Облачный Web Application Firewall (WAF) и защита от DDoS (Cloudflare, AWS WAF)?',
    category: 'cloud',
    difficulty: 'Middle',
    summaryAnswer: 'WAF фильтрует L7 трафик перед веб-приложением, блокируя SQL-инъекции, XSS, ботов и L7 DDoS атаки.',
    fullAnswer: `Обычные файрволы (Security Groups / iptables) фильтруют трафик по IP и портам (L3/L4). Они бесполезны, если атака идет легальным HTTP POST запросом на порт 443!

**Что делает WAF (Web Application Firewall)**:
1. Анализирует тело и заголовки L7 HTTP запросов.
2. Автоматически блокирует распространенные уязвимости из списков OWASP Top 10 (SQL Injections, Cross-Site Scripting - XSS, Remote Code Execution).
3. **DDoS Protection**: Отсекает волновые атаки HTTP Flood с помощью проверки капчи (JS Challenge), проверки сигнатур известных ботнетов и Rate Limiting.`,
    codeSnippet: {
      language: 'yaml',
      code: `# Правило WAF: Блокировать юзеров с >100 запросов в минуту на /login
rate_limit:
  path: "/login"
  limit: 100
  action: Block`
    },
    interviewTips: [
      'Назовите правила OWASP Top 10 как основу правил любого WAF.'
    ],
    commonPitfalls: [
      'Включать WAF с жесткими правилами блокировки без предварительного периода тестирования (Log / Audit mode), рискуя заблокировать реальных клиентов.'
    ],
    tags: ['Cloud', 'WAF', 'Security', 'Cloudflare', 'DDoS']
  }
];
