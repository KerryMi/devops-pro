import { Question } from '../../types';

export const TERRAFORM_QUESTIONS: Question[] = [
  {
    id: 'terraform-1',
    title: 'Как устроена работа с состоянием (State File) в Terraform и зачем нужна блокировка (State Locking)?',
    category: 'terraform',
    difficulty: 'Middle',
    summaryAnswer: 'State файл (terraform.tfstate) хранит соответствие описанных ресурсов реальным ID в облаке. State Locking предотвращает одновременную модификацию из разных пайплайнов.',
    fullAnswer: `Файл terraform.tfstate — это единственная база данных соответствий декларируемого HCL кода и реальной инфраструктуры (Cloud Resource IDs, IP-адресов).

**Проблема локального файла**:
Если запускать Terraform на локальных ПК разных инженеров, произойдет рассинхрон или перезапись инфраструктуры.

**Remote Backend & Locking**:
Для командной работы настраивается удаленный Backend (S3 Bucket, Yandex Object Storage) и замок State Locking (DynamoDB table или встроенная блокировка YDB/Consul).
При любом выполнении terraform plan/apply Terraform захватывает Lock. Если другой инженер или CI в это же время пытается запустить apply, операция падает с ошибкой 'State Locked', предотвращая порчу данных.`,
    codeSnippet: {
      language: 'hcl',
      code: `terraform {
  backend "s3" {
    bucket         = "company-tf-states"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"
  }
}`
    },
    interviewTips: [
      'Упомяните, что state файл содержит секреты в ОТКРЫТОМ виде (пароли к БД), поэтому S3 бакет со стейтом должен быть зашифрован (KMS) и иметь закрытый доступ.'
    ],
    commonPitfalls: [
      'Коммитить terraform.tfstate в Git репозиторий.'
    ],
    tags: ['Terraform', 'State', 'S3', 'Locking', 'IaC']
  },
  {
    id: 'terraform-2',
    title: 'В чем отличие команды terraform plan от terraform apply и что такое Drifts?',
    category: 'terraform',
    difficulty: 'Junior',
    summaryAnswer: 'terraform plan рассчитывает разницу (diff) между кодом и реальным состоянием без внесения изменений. terraform apply применяет план в облаке. Drift — это ручные изменения мимо кода.',
    fullAnswer: `1. **terraform plan**:
   - Читает текущий state файл.
   - Опрашивает API облака (Refresh) для обновления текущего реального состояния.
   - Сравнивает HCL код с полученным реальным состоянием и выводит план действий: + create, ~ update in-place, - destroy, -/+ replace.

2. **terraform apply**:
   - Повторно запрашивает подтверждение (или при -auto-approve пропускает) и вызывает API облачного провайдера для создания/изменения ресурсов.

3. **Infrastructure Drift**:
   - Ситуация, когда кто-то вручную из веб-консоли облака изменил размер диска или добавил правило файрвола.
   - При следующем terraform plan Terraform обнаружит Дрифт и предложит вернуть значение к описанному в HCL коде.`,
    codeSnippet: {
      language: 'bash',
      code: `terraform plan -out=tfplan # Сохранить план для гарантированного применения
terraform apply tfplan # Применить строго сохраненный план`
    },
    interviewTips: [
      'Сохранение плана terraform plan -out=tfplan перед apply в CI/CD гарантирует, что между шагами plan и apply никто не изменил состояние облака.'
    ],
    commonPitfalls: [
      'Запускать terraform apply -auto-approve в прод пайплайнах без предварительного ревью terraform plan.'
    ],
    tags: ['Terraform', 'Plan', 'Apply', 'Drift', 'IaC']
  },
  {
    id: 'terraform-3',
    title: 'В чем разница между Модулями (Modules) и Модулями-Воркспейсами (Workspaces) в Terraform?',
    category: 'terraform',
    difficulty: 'Middle',
    summaryAnswer: 'Modules — переиспользуемые блоки HCL кода (аналог функций). Workspaces — механизм создания независимых состояний (State) для одной и той же конфигурации.',
    fullAnswer: `1. **Terraform Modules**:
   - Позволяют упаковать группу ресурсов (например: VPC + Subnets + NAT Gateways) в один конструктор.
   - Модули можно переиспользовать в разных проектах, передавая входные переменные (variables) и получая результаты (outputs).
   - Источники: локальный путь, Git репозиторий (git::https://...), Terraform Registry.

2. **Terraform Workspaces**:
   - Позволяют иметь НЕСКОЛЬКО изолированных state файлов для одного и того же HCL кода (например workspace dev, staging, prod).
   - Выбор текущего воркспейса переключает файл состояния.
   - *Минус*: Легко перепутать воркспейс и случайно затереть прод! В сложных проектах предпочитают разделять окружения по РАЗНЫМ директориям/репозиториям, а не использовать workspaces.`,
    codeSnippet: {
      language: 'hcl',
      code: `module "vpc" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-vpc.git?ref=v5.0.0"
  name   = "my-prod-vpc"
  cidr   = "10.0.0.0/16"
}`
    },
    interviewTips: [
      'Отметьте бест-практику: фиксировать версию модуля через аргумент ?ref=v1.2.3.'
    ],
    commonPitfalls: [
      'Использовать Workspaces для кардинально отличающихся сред Dev и Prod.'
    ],
    tags: ['Terraform', 'Modules', 'Workspaces', 'IaC', 'BestPractices']
  },
  {
    id: 'terraform-4',
    title: 'Как импортировать в Terraform существующую инфраструктуру, созданную вручную (terraform import)?',
    category: 'terraform',
    difficulty: 'Middle',
    summaryAnswer: 'Использовать команду terraform import или блок import {} (начиная с TF 1.5) для связывания облачного ID ресурса с объектом в State файле.',
    fullAnswer: `Допустим, сервер был создан вручную через веб-консоль облака.
Раньше приходилось сначала вручную писать HCL код, а затем запускать:
terraform import aws_instance.my_web i-1234567890abcdef0.

**Современный подход (Terraform 1.5+)**:
Использование декларативного блока import:
1. Пишем блок import в коде с указанием ID и целевого имени.
2. Запускаем terraform plan -generate-config-out=generated_resources.tf.
3. Terraform САМ автоматически сгенерирует готовый HCL код для импортированного ресурса!`,
    codeSnippet: {
      language: 'hcl',
      code: `# Terraform 1.5+
import {
  to = aws_instance.legacy_server
  id = "i-1234567890abcdef0"
}`
    },
    interviewTips: [
      'Продемонстрируйте знание фичи -generate-config-out из Terraform 1.5+.'
    ],
    commonPitfalls: [
      'Забывать, что старый terraform import добавлял ресурс в state, но НЕ создавал HCL код.'
    ],
    tags: ['Terraform', 'Import', 'IaC', 'Migration']
  },
  {
    id: 'terraform-5',
    title: 'В чем разница между count, for_each и dynamic blocks в HCL?',
    category: 'terraform',
    difficulty: 'Middle',
    summaryAnswer: 'count создает список ресурсов по индексу [0, 1]. for_each создает карту ресурсов по уникальному ключу (map/set). dynamic создает повторяющиеся блоки внутри ресурса.',
    fullAnswer: `1. **count**:
   - Использует числовые индексы (aws_instance.server[0], aws_instance.server[1]).
   - *Проблема count*: Если удалить элемент из середины списка, Terraform сдвинет индексы и пересоздаст ВСЕ последующие ресурсы!

2. **for_each**:
   - Привязывает ресурсы к ключам словаря или множества (aws_instance.server["web"], aws_instance.server["db"]).
   - Безопасно для точечного удаления элементов.

3. **Dynamic Blocks**:
   - Используются для генерации повторяющихся внутренних вложенных блоков внутри ресурса (например, много правил ingress в Security Group).`,
    codeSnippet: {
      language: 'hcl',
      code: `# for_each с множеством
resource "aws_iam_user" "users" {
  for_each = toset(["alice", "bob", "charlie"])
  name     = each.key
}

# Dynamic block
resource "aws_security_group" "sg" {
  dynamic "ingress" {
    for_each = [80, 443, 8080]
    content {
      from_port   = ingress.value
      to_port     = ingress.value
      protocol    = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
    }
  }
}`
    },
    interviewTips: [
      'Отметьте правило: По возможности всегда предпочитайте for_each вместо count для предотвращения случайного уничтожения ресурсов.'
    ],
    commonPitfalls: [
      'Использовать count для списка объектов, элементы которого меняют порядок.'
    ],
    tags: ['Terraform', 'HCL', 'ForEach', 'Count', 'DynamicBlocks']
  },
  {
    id: 'terraform-6',
    title: 'Как устроена фаза Terraform Dependency Graph и мета-аргумент depends_on?',
    category: 'terraform',
    difficulty: 'Junior',
    summaryAnswer: 'Terraform автоматически строит ориентированный граф зависимостей (DAG) для параллельного создания ресурсов. depends_on явно задает порядок при скрытых зависимостях.',
    fullAnswer: `Автоматическое построение графа:
Если Ресурс B ссылается на атрибут Ресурса A (например aws_instance.app.subnet_id = aws_subnet.main.id), Terraform автоматически понимает, что нужно СНАЧАЛА создать Subnet, а ЗАТЕМ Instance. Ресурсы без взаимных связей создаются параллельно!

**Зачем нужен depends_on**:
Иногда зависимость косвенная или скрытая (например, приложение требует поднятого IAM Role или ровно поднятого NAT Gateway для качивания скриптов при старте).
Мета-аргумент depends_on = [aws_nat_gateway.example] явно указывает Terraform подождать создания целевого ресурса перед началом создания текущего.`,
    codeSnippet: {
      language: 'hcl',
      code: `resource "aws_instance" "example" {
  ami           = "ami-123456"
  instance_type = "t3.micro"

  depends_on = [aws_iam_role_policy_attachment.example]
}`
    },
    interviewTips: [
      'Упомяните команду terraform graph | dot -Tpng > graph.png для визуализации графа зависимостей.'
    ],
    commonPitfalls: [
      'Злоупотреблять depends_on там, где есть явные текстовые ссылки на атрибуты.'
    ],
    tags: ['Terraform', 'Graph', 'DependsOn', 'Architecture']
  },
  {
    id: 'terraform-7',
    title: 'Что такое OpenTofu и почему произошел форк Terraform?',
    category: 'terraform',
    difficulty: 'Middle',
    summaryAnswer: 'OpenTofu — это открытый community-driven форк Terraform под лицензией MPL 2.0, созданный после смены лицензии HashiCorp на BSL (Business Source License).',
    fullAnswer: `В августе 2023 года компания HashiCorp сменила open-source лицензию MPL 2.0 на проприетарную BSL для всех своих продуктов (Terraform, Vault, Consul). Это запретило вендорам делать конкурентные облачные сервисы на базе Terraform.

В ответ Linux Foundation, Gruntwork, Spacelift и сотни компаний создали форк **OpenTofu**.
OpenTofu обратно совместим с кодом Terraform и провайдерами, развивает собственные фичи (поддержка шифрования state файла из коробки) и управляется открытым сообществом без риска смены лицензии.`,
    codeSnippet: {
      language: 'bash',
      code: `tofu init
tofu plan
tofu apply # Капля замена CLI команд terraform на tofu`
    },
    interviewTips: [
      'Упомяните Linux Foundation как гарант открытости OpenTofu.'
    ],
    commonPitfalls: [
      'Думать, что OpenTofu требует переписывать HCL код.'
    ],
    tags: ['Terraform', 'OpenTofu', 'OpenSource', 'Licensing']
  },
  {
    id: 'terraform-8',
    title: 'Как обрабатывать чувствительные данные в Terraform (sensitive variables & outputs)?',
    category: 'terraform',
    difficulty: 'Junior',
    summaryAnswer: 'Флаг sensitive = true скрывает значения из вывода CLI в terraform plan/apply, но НЕ шифрует их внутри файла terraform.tfstate.',
    fullAnswer: `Маркировка переменной sensitive = true:
variable "db_password" {
  type      = string
  sensitive = true
}

При выполнении plan/apply CLI напечатает: db_password = (sensitive value).

**Критически важный нюанс**:
Аргумент sensitive предохраняет только от случайного вывода логов в консоли CI/CD. Внутри файла состояний **terraform.tfstate** значение пароля хранится в открытом незашифрованном виде!
Поэтому защиту стейта организуют на уровне S3 Server-Side Encryption (KMS) и IAM ролей доступа.`,
    codeSnippet: {
      language: 'hcl',
      code: `output "db_password" {
  value     = aws_db_instance.db.password
  sensitive = true
}`
    },
    interviewTips: [
      'Четко объясните: sensitive НЕ шифрует данные в tfstate файле!'
    ],
    commonPitfalls: [
      'Забыть поставить sensitive = true на output с паролем, получая утечку в консоли GitLab CI.'
    ],
    tags: ['Terraform', 'Security', 'Sensitive', 'State']
  },
  {
    id: 'terraform-9',
    title: 'Что такое Terragrunt и какие проблемы Terraform он решает?',
    category: 'terraform',
    difficulty: 'Middle',
    summaryAnswer: 'Terragrunt — тонкая обертка над Terraform, обеспечивающая соблюдение принципа DRY (Don\'t Repeat Yourself) для конфигураций backend, переменных и модулей в окружениях.',
    fullAnswer: `Проблемы чистого Terraform при деплое мульти-окружений (Dev, Stage, Prod):
1. Приходится копировать блоки backend "s3" {...} в каждую папку.
2. Дублирование конфигураций модулей.

**Что дает Terragrunt**:
1. **DRY Backend**: Описывает конфигурацию S3 backend один раз в корневом terragrunt.hcl и автоматически наследует ее.
2. **DRY CLI flags**: Передача одинаковых переменных.
3. **Зависимости между модулями (dependencies)**: Определение графа выполнения независимых terraform директорий командой terragrunt run-all apply.`,
    codeSnippet: {
      language: 'hcl',
      code: `# terragrunt.hcl
include "root" {
  path = find_in_parent_folders()
}

terraform {
  source = "git::git@github.com:foo/modules.git//app?ref=v0.0.1"
}`
    },
    interviewTips: [
      'Упомяните terragrunt run-all apply для каскадного создания инфраструктуры.'
    ],
    commonPitfalls: [
      'Переусложнение структуры каталогов Terragrunt для маленьких одностраничных проектов.'
    ],
    tags: ['Terraform', 'Terragrunt', 'DRY', 'IaC']
  },
  {
    id: 'terraform-10',
    title: 'Как работают Провайдеры (Providers) в Terraform и их блокировки версий?',
    category: 'terraform',
    difficulty: 'Junior',
    summaryAnswer: 'Провайдер — плагин, переводящий HCL код в API вызовы конкретного облака (AWS, GCP, Yandex, Kubernetes). Версии фиксируются в required_providers.',
    fullAnswer: `Terraform CLI сам по себе не умеет общаться ни с одним облаком.
При вызове terraform init Terraform скачивает скомпилированный gRPC плагин провайдера (например hashicorp/aws или yandex-cloud/yandex) из registry.

Фиксация версий в required_providers:
Необходимо явно указывать диапазоны версий (например ~> 5.0) и генерировать файл блокировки **.terraform.lock.hcl**.
Файл .terraform.lock.hcl гарантирует, что все участники команды и CI пайплайны скачают ровно тот же бинарник провайдера с совпадающей контрольной суммой (checksum).`,
    codeSnippet: {
      language: 'hcl',
      code: `terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}`
    },
    interviewTips: [
      'Обязательно коммитьте .terraform.lock.hcl файл в Git репозиторий!'
    ],
    commonPitfalls: [
      'Не фиксировать версию провайдера, получая сбои сборки при выходе мажорного обновления.'
    ],
    tags: ['Terraform', 'Providers', 'LockFile', 'Init']
  },
  {
    id: 'terraform-11',
    title: 'Что такое Data Sources в Terraform и чем они отличаются от Resources?',
    category: 'terraform',
    difficulty: 'Junior',
    summaryAnswer: 'Resources создают и управляют объектами в облаке. Data Sources только читают данные о СУЩЕСТВУЮЩИХ объектах в облаке (read-only).',
    fullAnswer: `1. **Resource (resource "aws_s3_bucket" "b")**:
   - Создает, обновляет или удаляет объект в облаке. Управляет его жизненным циклом.

2. **Data Source (data "aws_ami" "ubuntu")**:
   - Выполняет read-only запрос к API облака во время выполнения terraform plan/apply.
   - Используется для динамического получения ID существующих ресурсов (например найти ID последнего образа Ubuntu 22.04, узнать список доступных подсетей в VPC, прочитать сертификат).`,
    codeSnippet: {
      language: 'hcl',
      code: `# Получить свежий AMI образ Ubuntu
data "aws_ami" "ubuntu" {
  most_recent = true
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
  owners = ["099720109477"] # Canonical
}

resource "aws_instance" "web" {
  ami = data.aws_ami.ubuntu.id # Ссылка на найденный ID
}`
    },
    interviewTips: [
      'Упомяните использование Data Sources для безопасного получения инфраструктуры, созданной другой командой.'
    ],
    commonPitfalls: [
      'Пытаться изменить свойства объекта через блок data.'
    ],
    tags: ['Terraform', 'DataSources', 'HCL', 'IaC']
  },
  {
    id: 'terraform-12',
    title: 'Как устроена стратегия обработки жизненного цикла ресурсов lifecycle (prevent_destroy, create_before_destroy)?',
    category: 'terraform',
    difficulty: 'Middle',
    summaryAnswer: 'Блок lifecycle кастомизирует поведение ресурсов при изменении и удалении: prevent_destroy блокирует удаление, create_before_destroy снижает downtime.',
    fullAnswer: `Ключевые директивы lifecycle:
1. **prevent_destroy = true**: Выдаст ошибку и запретит terraform destroy или замену ресурса. Идеально для БД и продуктовых S3 бакетов.
2. **create_before_destroy = true**: При изменении аргумента, требующего пересоздания ресурса (Replace), Terraform сначала СОЗДАСТ новый ресурс, переключит зависимости и только потом УДАЛИТ старый (Zero Downtime).
3. **ignore_changes = [tags, user_data]**: Игнорирует изменения конкретных атрибутов в облаке (полезно, если теги вешаются внешней системой автоматизации).`,
    codeSnippet: {
      language: 'hcl',
      code: `resource "aws_db_instance" "database" {
  allocated_storage = 20
  engine            = "postgres"

  lifecycle {
    prevent_destroy = true
    ignore_changes  = [tags]
  }
}`
    },
    interviewTips: [
      'Расскажите кейс применения prevent_destroy для спасения производственной базы данных от случайного удаления.'
    ],
    commonPitfalls: [
      'Забывать, что prevent_destroy нужно временно закомментировать, если ресурс реально требуется удалить.'
    ],
    tags: ['Terraform', 'Lifecycle', 'Safety', 'IaC']
  },
  {
    id: 'terraform-13',
    title: 'Что такое Null Resource и Terraform Local Exec / Remote Exec Provisioners?',
    category: 'terraform',
    difficulty: 'Middle',
    summaryAnswer: 'Provisioners позволяют запускать произвольные shell скрипты локально или на целевом сервере. Null Resource — пустышка для запуска этих скриптов по триггерам.',
    fullAnswer: `Provisioners (local-exec, remote-exec) считаются "средством последней надежды" (Last Resort) в Terraform, так как они нарушают декларативность и идемпотентность.

**null_resource**:
Ресурс, который ничего не создает в облаке, но позволяет запустить local-exec скрипт при изменении определенных переменных (аргумент triggers).

*Альтернатива*: Использование Ansible для конфигурации ПО на серверах вместо remote-exec provisioners.`,
    codeSnippet: {
      language: 'hcl',
      code: `resource "null_resource" "cluster_setup" {
  triggers = {
    cluster_id = aws_eks_cluster.example.id
  }

  provisioner "local-exec" {
    command = "aws eks update-kubeconfig --name \${aws_eks_cluster.example.name}"
  }
}`
    },
    interviewTips: [
      'Подчеркните, что официальная документация рекомендует избегать provisioners в пользу Cloud-init или Ansible.'
    ],
    commonPitfalls: [
      'Пытаться писать сложную логику установки софта через длинные bash скрипты в remote-exec.'
    ],
    tags: ['Terraform', 'Provisioners', 'NullResource', 'Ansible']
  },
  {
    id: 'terraform-14',
    title: 'Как организовать тестирование Terraform кода (tftest, Checkov, TFLint)?',
    category: 'terraform',
    difficulty: 'Middle',
    summaryAnswer: 'TFLint проверяет синтаксис и специфичные ошибки провайдера. Checkov/tfsec проверяют безопасность (Security Scanning). tftest (TF 1.6+) проводит интграционные тесты.',
    fullAnswer: `Пирамида тестирования IaC:

1. **Статический анализ (Linter)**:
   - **TFLint**: Проверяет невалидные типы инстансов облака, отсутствие обязательных атрибутов.

2. **Сканеры безопасности (SAST for IaC)**:
   - **Checkov / tfsec / Trivy**: Ищут открытые во внешний мир S3 бакеты, 0.0.0.0/0 в Security Groups, отсутствие шифрования дисков.

3. **Интеграционные тесты (Native Test Framework / Terratest)**:
   - Начиная с Terraform 1.6 появилась встроенная команда **terraform test**. Выполняет реальный деплой тестовых ресурсов во временном окружении, считывает outputs и удаляет их через destroy.`,
    codeSnippet: {
      language: 'hcl',
      code: `# main.tftest.hcl (Terraform 1.6+)
run "verify_bucket_name" {
  command = plan

  assert {
    condition     = aws_s3_bucket.main.bucket == "my-expected-name"
    error_message = "S3 bucket name did not match expected value"
  }
}`
    },
    interviewTips: [
      'Упомяните Checkov в CI/CD пайплайне для блокировки создания небезопасных ресурсов.'
    ],
    commonPitfalls: [
      'Не проверять IaC код сканерами безопасности перед запуск apply.'
    ],
    tags: ['Terraform', 'Testing', 'TFLint', 'Checkov', 'Security']
  }
];
