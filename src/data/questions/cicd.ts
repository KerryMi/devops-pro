import { Question } from '../../types';

export const CICD_QUESTIONS: Question[] = [
  {
    id: 'cicd-1',
    title: 'Чем отличается подход Push-based CI/CD от Pull-based (GitOps)?',
    category: 'cicd',
    difficulty: 'Middle',
    summaryAnswer: 'Push-based (GitLab CI, Jenkins) подключается извне к кластеру и выталкивает манифесты. Pull-based (ArgoCD, Flux) работает агентом ВНУТРИ кластера и подтягивает изменения из Git.',
    fullAnswer: `**Push-based:**
CI/CD пайплайн выполняет сборку, тесты и запускает утилиту типа kubectl apply или helm upgrade, подключаясь к API кластера.
*Минусы*: требуются учетные данные с правами админа внутри CI среды, риск рассинхронизации кластера (Configuration Drift).

**Pull-based (GitOps):**
Оператор (ArgoCD / Flux) установлен ВНУТРИ кластера. Он непрерывно сравнивает текущее состояние целевого кластера с желаемым состоянием в Git-репозитории.
*Плюсы*:
1. Безопасность: Ключи доступа не покидают кластер.
2. Автоматическое устранение дрифта (Self-Healing).
3. Простой rollback: достаточно сделать git revert.`,
    codeSnippet: {
      language: 'yaml',
      code: `# ArgoCD Application CRD (Pull-based)
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: guestbook
spec:
  source:
    repoURL: 'https://github.com/argoproj/argocd-example-apps.git'
    targetRevision: HEAD
    path: guestbook
  destination:
    server: 'https://kubernetes.default.svc'
    namespace: default
  syncPolicy:
    automated:
      prune: true
      selfHeal: true`
    },
    interviewTips: [
      'Упомяните термины "Configuration Drift" и "Self-healing" как ключевые преимущества GitOps.'
    ],
    commonPitfalls: [
      'Хранить секреты в открытом виде в Git-репозитории (нужно использовать SealedSecrets или Vault Secrets Operator).'
    ],
    tags: ['CICD', 'GitOps', 'ArgoCD', 'Flux', 'Kubernetes']
  },
  {
    id: 'cicd-2',
    title: 'Какие бывают стратегии деплоя: Blue-Green, Canary, Rolling Update, Shadow?',
    category: 'cicd',
    difficulty: 'Middle',
    summaryAnswer: 'Rolling Update обновляет поды по очереди. Blue-Green мгновенно переключает весь трафик на новое окружение. Canary направляет % трафика на новую версию. Shadow дублирует трафик без влияния на юзеров.',
    fullAnswer: `1. **Rolling Update**: Дефолт в K8s. Поды старой версии постепенно заменяются новыми (параметры maxSurge, maxUnavailable). Нет простоя, но в кластере одновременно работают 2 разные версии кода.

2. **Blue-Green (Red-Black)**: Поднимается параллельно ВТОРОЙ изолированный стенд (Green) с новой версией. После прохождения дымовых тестов балансировщик (Ingress/Service) мгновенно переключает 100% трафика с Blue на Green. Мгновенный откат. Требует 2x ресурсов.

3. **Canary (Канареечный)**: Новая версия деплоится на 5-10% пользователей. Метрики (ошибки 5xx, latency) анализируются автоматикой (Flagger/Argo Rollouts). Если метрики отличные, процент трафика повышается до 100%.

4. **Shadow (Traffic Mirroring)**: Трафик копируется на L7 (через Istio/Envoy) и отправляется в новую версию. Ответы новой версии отбрасываются и не видны юзерам. Идеально для тестирования нагрузки на реальном трафике.`,
    codeSnippet: {
      language: 'yaml',
      code: `# Пример стратегии RollingUpdate в Kubernetes Deployment
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 25%
    maxUnavailable: 0`
    },
    interviewTips: [
      'Упомяните инструмент Argo Rollouts или Flagger для реализации Canary деплоя на основе метрик Prometheus.'
    ],
    commonPitfalls: [
      'Забывать про обратную совместимость миграций баз данных при Rolling Update!'
    ],
    tags: ['CICD', 'DeploymentStrategy', 'Canary', 'BlueGreen', 'Kubernetes']
  },
  {
    id: 'cicd-3',
    title: 'Как безопасно управлять секретами в CI/CD и GitOps (HashiCorp Vault, SOPS, Sealed Secrets)?',
    category: 'cicd',
    difficulty: 'Senior',
    summaryAnswer: 'Секреты нельзя коммитить в Git в открытом виде. Подходы: HashiCorp Vault (динамические секреты), SOPS (PGP/KMS зашифрованные файлы), Sealed Secrets (асимметричное шифрование под K8s).',
    fullAnswer: `1. **HashiCorp Vault**:
   - Централизованное хранилище секретов.
   - Поддерживает динамические секреты (выдача одноразовых токенов к БД со сроком жизни TTL).
   - Поды авторизуются через Kubernetes Auth Method с помощью ServiceAccount токена.

2. **Mozilla SOPS (Secrets OPeration Support)**:
   - Шифрует только значения (values) в YAML/JSON файлах, оставляя ключи открытыми для удобства diff в Git.
   - Использует ключи AWS KMS, GCP KMS или PGP.

3. **Bitnami Sealed Secrets**:
   - Специфично для K8s GitOps.
   - Утилита kubeseal шифрует секрет публичным ключом контроллера кластера.
   - Зашифрованный манифест SealedSecret безопасно коммитится в Git; расшифровать его может ТОЛЬКО контроллер внутри K8s.`,
    codeSnippet: {
      language: 'bash',
      code: `# Зашифровать секрет через SealedSecrets:
kubeseal --fetch-cert > pub-cert.pem
kubeseal --format yaml --cert pub-cert.pem < secret.yaml > sealed-secret.yaml`
    },
    interviewTips: [
      'Упомяните External Secrets Operator (ESO) как унифицированный инструмент синхронизации секретов из Vault/AWS Secrets Manager в K8s Secrets.'
    ],
    commonPitfalls: [
      'Кодировать base64 в обычный Kubernetes Secret и думать, что это шифрование (Base64 — это просто кодирование!).'
    ],
    tags: ['CICD', 'Security', 'Vault', 'Secrets', 'SOPS', 'GitOps']
  },
  {
    id: 'cicd-4',
    title: 'Как устроена оптимизация времени выполнения (Speedup) CI/CD пайплайнов?',
    category: 'cicd',
    difficulty: 'Middle',
    summaryAnswer: 'Оптимизация включает: кэширование зависимостей (npm, go, maven), Docker Layer Caching (BuildKit), параллелизацию тестов (Matrix builds), DAG пайплайны и запуск только изменившихся модулей (Monorepo tooling).',
    fullAnswer: `Стратегии ускорения пайплайнов:
1. **Кэширование артефактов и зависимостей**: Сохранение папок .npm, .m2, go/pkg/mod между запуском раннеров в S3 / локальном storage.
2. **Docker BuildKit & Remote Cache**: Использование --cache-from с выгрузкой слоев кэша в Container Registry.
3. **Параллелизация и Matrix Jobs**: Разделение юнит-тестов на N независимых потоков.
4. **DAG (Directed Acyclic Graph)**: В GitLab CI использование needs: [] позволяет стадии деплоя не ждать завершения всех независимых задач стадии тестирования.
5. **Monorepo инструменты (Nx, Turborepo, Bazel)**: Сборка и тестирование ТОЛЬКО тех пакетов монорепозитория, которые реально изменились в данном PR.`,
    codeSnippet: {
      language: 'yaml',
      code: `# Пример GitLab CI с кэшированием и DAG
test_job:
  stage: test
  cache:
    key: \${CI_COMMIT_REF_SLUG}
    paths:
      - .npm/
  script:
    - npm ci --cache .npm --prefer-offline
    - npm test

deploy_job:
  stage: deploy
  needs: ["test_job"] # Не ждет остальные тяжелые тесты!`
    },
    interviewTips: [
      'Назовите метрику Lead Time to Changes (из DORA metrics) как главный показатель эффективности быстрых пайплайнов.'
    ],
    commonPitfalls: [
      'Запускать npm install или pip install с нуля при каждом запуске CI пайплайна.'
    ],
    tags: ['CICD', 'Optimization', 'Caching', 'GitLabCI', 'DORA']
  },
  {
    id: 'cicd-5',
    title: 'Что такое DORA метрики и почему они критичны для DevOps команд?',
    category: 'cicd',
    difficulty: 'Middle',
    summaryAnswer: '4 ключевые метрики эффективности DevOps (DevOps Research and Assessment): Deployment Frequency, Lead Time for Changes, Change Failure Rate, Time to Restore Service (MTTR).',
    fullAnswer: `DORA метрики измеряют скорость и надежность доставки ПО:

1. **Deployment Frequency (Частота деплоев)**: Как часто код успешного релиза попадает в продакшен. (Elite: несколько деплоев в день).
2. **Lead Time for Changes (Время выполнения изменений)**: Время от создания коммита до его успешной работы в продакшене. (Elite: менее 1 часа).
3. **Change Failure Rate (Процент сбоев при изменениях)**: Доля деплоев, приведших к критическим сбоям, требующим хотфикса или отката. (Elite: 0-15%).
4. **Failed Service Recovery Time / MTTR (Время восстановления)**: Время, необходимое для восстановления работоспособности после инцидента на проде. (Elite: менее 1 часа).`,
    codeSnippet: {
      language: 'text',
      code: `Скорость: Deployment Frequency + Lead Time for Changes
Надежность: Change Failure Rate + Time to Restore Service`
    },
    interviewTips: [
      'Подчеркните баланс: оптимизация скорости (Lead time) не должна ухудшать надежность (Change failure rate).'
    ],
    commonPitfalls: [
      'Измерять производительность инженеров по количеству написанных строк кода или числу закрытых тасок вместо DORA.'
    ],
    tags: ['CICD', 'DORA', 'Metrics', 'DevOpsCulture', 'Management']
  },
  {
    id: 'cicd-6',
    title: 'Как настроить безопасные GitLab CI Runner / GitHub Actions Self-Hosted Runners?',
    category: 'cicd',
    difficulty: 'Middle',
    summaryAnswer: 'Использовать одноразовые (Ephemeral) раннеры в K8s, разграничивать доступ к окружениям (Protected Environments) и запрещать запуск чужого кода с Fork PR.',
    fullAnswer: `Риски Self-hosted раннеров:
Пользователь через Pull Request может выполнить произвольный bash скрипт, прочитав секретные переменные пайплайна или захватив хост-машину.

**Лучшие практики безопасности**:
1. **Ephemeral (Одноразовые) Pods**: Использование GitLab Runner Kubernetes Executor или GitHub Actions Runner Controller (ARC). Каждый runner запускается в изолированном поде K8s и сразу уничтожается после завершения джобы.
2. **Защищенные ветки и токены**: Ограничить доступ к прод-секретам только для защищенных тегов и веток (Protected Branches/Tags).
3. **PULL REQUEST FROM FORKS**: Запретить автоматический запуск CI на селф-хостед раннерах для внешних Pull Request от публичных форков.`,
    codeSnippet: {
      language: 'yaml',
      code: `# Использование короткоживущего раннера в K8s
runners:
  config: |
    [[runners]]
      executor = "kubernetes"
      [runners.kubernetes]
        image = "alpine:latest"`
    },
    interviewTips: [
      'Упомяните GitHub Actions Runner Controller (ARC) как индустриальный стандарт управления self-hosted runner подами.'
    ],
    commonPitfalls: [
      'Запускать runner с правами root и docker.sock маунтом без изоляции.'
    ],
    tags: ['CICD', 'GitLabCI', 'GitHubActions', 'Runners', 'Security']
  },
  {
    id: 'cicd-7',
    title: 'Что такое OIDC (OpenID Connect) авторизация в CI/CD и почему она лучше статических токенов?',
    category: 'cicd',
    difficulty: 'Senior',
    summaryAnswer: 'OIDC позволяет CI/CD пайплайну получать временные короткоживущие токены от Cloud Provider (AWS, Yandex Cloud, Vault) без сохранения долгоживущих API ключей в Git.',
    fullAnswer: `Проблема статических токенов (AWS_ACCESS_KEY_ID):
Если разработчик или злоумышленник скомпрометирует переменные CI/CD, секретные ключи утекают навсегда до их ручного отзыва.

**Как работает OIDC в CI/CD**:
1. При запуске пайплайна CI провайдер (GitHub/GitLab) генерирует подписной JWT токен с метаданными о репозитории, ветке и комитере.
2. Пайплайн предъявляет этот JWT токен в AWS STS или Vault.
3. Облачный провайдер валидирует подпись JWT и выдает ВРЕМЕННЫЕ credentials со сроком жизни 15-60 минут.
4. Долгоживущие ключи хранить в CI не нужно от слова совсем!`,
    codeSnippet: {
      language: 'yaml',
      code: `# GitHub Actions OIDC для AWS
permissions:
  id-token: write
  contents: read
steps:
- uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: arn:aws:iam::123456789012:role/my-github-role
    aws-region: us-east-1`
    },
    interviewTips: [
      'Подчеркните принцип "Short-lived Credentials" и полное исключение человеческого фактора при ротации ключей.'
    ],
    commonPitfalls: [
      'Хранить AWS/Yandex Cloud master ключи в файле .env или CI/CD Variables.'
    ],
    tags: ['CICD', 'OIDC', 'Security', 'AWS', 'Vault']
  },
  {
    id: 'cicd-8',
    title: 'В чем разница между Semantic Versioning (SemVer) и Calendar Versioning (CalVer)?',
    category: 'cicd',
    difficulty: 'Junior',
    summaryAnswer: 'SemVer (MAJOR.MINOR.PATCH) отражает ломающие изменения в API. CalVer (YYYY.MM.MICRO) версионирует релизы по дате их выхода (Ubuntu, Python, Ubuntu).',
    fullAnswer: `1. **SemVer (Semantic Versioning - v1.2.3)**:
   - **MAJOR**: Содержит ломающие изменения API (Incompatible API changes).
   - **MINOR**: Добавляет новую функциональность с обратной совместимостью (Backwards-compatible features).
   - **PATCH**: Содержит багфиксы с обратной совместимостью (Backwards-compatible bug fixes).

2. **CalVer (Calendar Versioning - 2024.04.1)**:
   - Зависит от даты календаря (например Ubuntu 24.04).
   - Удобно для проектов с регулярным графиком релизов (раз в месяц или раз в полгода).`,
    codeSnippet: {
      language: 'text',
      code: `SemVer: v2.4.12
CalVer: 2024.03.0`
    },
    interviewTips: [
      'Упомяните инструмент Semantic Release для автоматической генерации SemVer тегов и CHANGELOG.md на основе Conventional Commits.'
    ],
    commonPitfalls: [
      'Поднимать MAJOR версию при обычных багфиксах.'
    ],
    tags: ['CICD', 'Versioning', 'SemVer', 'CalVer', 'Git']
  },
  {
    id: 'cicd-9',
    title: 'Что такое Conventional Commits и как они автоматизируют генерацию CHANGELOG?',
    category: 'cicd',
    difficulty: 'Junior',
    summaryAnswer: 'Conventional Commits — соглашение о формате коммитов (feat, fix, docs, refactor, BREAKING CHANGE). Позволяет утилитам автоматически поднимать версию и собирать чейнджлог.',
    fullAnswer: `Формат коммита:
<type>(<scope>): <short summary>

[optional body]
[optional footer(s)]

**Типы (Type)**:
- **feat**: Новая фича (триггерит MINOR версию в SemVer).
- **fix**: Исправление бага (триггерит PATCH версию).
- **BREAKING CHANGE:** в футере или восклицательный знак (feat!: ...) триггерит MAJOR версию.
- **docs, style, refactor, test, chore**: Не меняют версию продукта.`,
    codeSnippet: {
      language: 'text',
      code: `feat(auth): add OAuth2 login support

BREAKING CHANGE: login endpoint moved from /login to /v2/login`
    },
    interviewTips: [
      'Упомяните husky + commitlint для валидации формата коммитов на этапе git commit.'
    ],
    commonPitfalls: [
      'Писать неинформативные коммиты вроде "fixed bug", "wip", "test".'
    ],
    tags: ['CICD', 'Git', 'ConventionalCommits', 'Automation']
  },
  {
    id: 'cicd-10',
    title: 'Как работает сканирование уязвимостей в CI/CD (SAST, DAST, SCA, Container Scanning)?',
    category: 'cicd',
    difficulty: 'Middle',
    summaryAnswer: 'SAST анализирует исходный код. SCA ищет уязвимые сторонние зависимости. Container Scanning ищет CVE в слоях Docker. DAST тестирует работающее приложение извне.',
    fullAnswer: `DevSecOps конвейер безопасности:

1. **SCA (Software Composition Analysis - Trivy, Dependency-Check, Snyk)**:
   - Сканирует package.json, go.sum, requirements.txt на известные уязвимости (CVE) в сторонних библиотеках.

2. **SAST (Static Application Security Testing - SonarQube, Semgrep)**:
   - Анализирует исходный код без его запуска (SQL injections, hardcoded keys, buffer overflows).

3. **Container Scanning (Trivy, Grype)**:
   - Проверяет системные пакеты ОС базового Docker-образа и скомпилированные слои.

4. **DAST (Dynamic Application Security Testing - OWASP ZAP)**:
   - Имитирует атаки на РАБОТАЮЩИЙ тестовый стенд (XSS, CSRF, Fuzzing).`,
    codeSnippet: {
      language: 'yaml',
      code: `# Пример запуска Trivy сканера в CI
- name: Run Trivy vulnerability scanner
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: 'my-app:latest'
    exit-code: '1' # Фейлить пайплайн при найденных HIGH/CRITICAL CVE
    severity: 'CRITICAL,HIGH'`
    },
    interviewTips: [
      'Отметьте "Shift Left" подход — сдвиг проверок безопасности на самые ранние этапы создания кода.'
    ],
    commonPitfalls: [
      'Игнорировать сработки сканеров или отключение проверки перед релизом.'
    ],
    tags: ['CICD', 'DevSecOps', 'SAST', 'DAST', 'Trivy', 'Security']
  },
  {
    id: 'cicd-11',
    title: 'Что такое Artifact Registry (Harbor, Nexus, JFrog Artifactory) и зачем нужен свой репозиторий?',
    category: 'cicd',
    difficulty: 'Middle',
    summaryAnswer: 'Private Registry хранит собранные скомпилированные артефакты (Docker образы, Helm чарты, npm/maven пакеты) внутри собственного контура организации.',
    fullAnswer: `Причины использования собственного Harbor / Nexus:
1. **Безопасность**: Публичные образы могут содержать бэкдоры. Собственные прокси-реестры кэшируют и сканируют внешние зависимости.
2. **Лимиты скачивания (Rate Limits)**: Docker Hub ограничивает 100-200 скачиваний на анонимный IP. Собственный репозиторий защищает от сбоев.
3. **Скорость**: Скачивание образов по локальной 10-гигабитной сети кластера происходит за секунды.
4. **Управление жизненным циклом (Retention policy)**: Автоматическая очистка старых временных веток и хранение только релизных артефактов.`,
    codeSnippet: {
      language: 'bash',
      code: `docker tag my-app:v1.0.0 harbor.company.com/prod/my-app:v1.0.0
docker push harbor.company.com/prod/my-app:v1.0.0`
    },
    interviewTips: [
      'Упомяните Harbor как Open-Source CNCF Graduated проект с встроенным Trivy сканером и подписью Cosign/Notary.'
    ],
    commonPitfalls: [
      'Забивать диск реестра без настройки Retention Policies (правил удаления старых тегов).'
    ],
    tags: ['CICD', 'Harbor', 'Registry', 'Artifacts', 'Security']
  },
  {
    id: 'cicd-12',
    title: 'Как реализовать матричные сборки (Matrix Builds) в GitHub Actions и GitLab CI?',
    category: 'cicd',
    difficulty: 'Junior',
    summaryAnswer: 'Matrix strategy позволяет параллельно запускать одну и ту же задачу для множества комбинаций параметров (версии Node.js, ОС, архитектуры CPU).',
    fullAnswer: `Matrix стратегии экономят сотни строк дублирующегося YAML кода.
Особенно полезны для Open-Source библиотек и мультиплатформенных приложений.

Пример применения:
Протестировать приложение на Node.js версии 18, 20, 22 на операционных системах ubuntu-latest и windows-latest. GitHub Actions создаст 3 x 2 = 6 параллельных задач.`,
    codeSnippet: {
      language: 'yaml',
      code: `strategy:
  matrix:
    node-version: [18.x, 20.x, 22.x]
    os: [ubuntu-latest, windows-latest]
steps:
- uses: actions/setup-node@v4
  with:
    node-version: \${{ matrix.node-version }}`
    },
    interviewTips: [
      'Упомяните параметр fail-fast: false, чтобы падение одной ветки матрицы не отменяло остальные.'
    ],
    commonPitfalls: [
      'Запускать слишком большую матрицу, упираясь в лимиты параллелизма CI.'
    ],
    tags: ['CICD', 'GitHubActions', 'Matrix', 'Automation']
  },
  {
    id: 'cicd-13',
    title: 'Что такое Feature Flags и как они связаны с непрерывной доставкой (Continuous Delivery)?',
    category: 'cicd',
    difficulty: 'Middle',
    summaryAnswer: 'Feature Flags (Флаги фич) позволяют отделить деплой кода от его активации для пользователей. Код сливается в main регулярно, а фича включается переключателем.',
    fullAnswer: `Без Feature Flags команды вынуждены держать долгоживущие Feature Branches в Git и страдать от мега-конфликтов при слиянии (Merge Hell).

**С Feature Flags**:
1. Разработчик вливает незавершенную фичу в main под условием: if (featureFlags.isEnabled('NEW_CHECKOUT')) { ... }.
2. Код безопасно релижится в прод без рисков для пользователей.
3. Менеджеры или QA включают флаг через UI системы (Unleash, LaunchDarkly, Flagsmith) для 1% юзеров, затем для 10%, затем для всех.
4. При проблемах флаг мгновенно выключается БЕЗ необходимости срочного отката или пересобирания кода!`,
    codeSnippet: {
      language: 'typescript',
      code: `if (await flags.isEnabled('new-payment-gateway', userId)) {
    return processStripePayment();
} else {
    return processLegacyPayment();
}`
    },
    interviewTips: [
      'Назовите класс систем: Unleash, LaunchDarkly.'
    ],
    commonPitfalls: [
      'Забывать удалять устаревшие Feature Flags из кода, накапливая технический долг.'
    ],
    tags: ['CICD', 'FeatureFlags', 'ContinuousDelivery', 'Unleash']
  },
  {
    id: 'cicd-14',
    title: 'Что такое Helm и Kustomize? В чем их отличия при деплое в Kubernetes?',
    category: 'cicd',
    difficulty: 'Middle',
    summaryAnswer: 'Helm — менеджер пакетов с шаблонизацией (Go templates). Kustomize — инструмент декларативного оверлея манифестов без шаблонизации.',
    fullAnswer: `1. **Helm**:
   - Шаблонизирует YAML файлы через {{ .Values.image.repository }}.
   - Хранит историю релизов (Helm Release) внутри K8s Secrets и умеет делать helm rollback.
   - Подходит для дистрибуции сторонних сложных приложений (PostgreSQL, Redis, Ingress).

2. **Kustomize**:
   - Нативно встроен в kubectl (kubectl apply -k .).
   - Использует концепцию Base и Overlays (Dev, Staging, Prod) БЕЗ шаблонизации.
   - Чистые YAML файлы накладываются патчами друг на друга.

*Тренды*: Использование Kustomize для собственного кода приложений и Helm для сторонних чартов.`,
    codeSnippet: {
      language: 'yaml',
      code: `# Kustomization.yaml (Overlay)
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
- ../base
patches:
- path: replica_count.yaml`
    },
    interviewTips: [
      'Укажите, что Helm v3 убрал небезопасную серверную часть Tiller, сделав его полностью клиентской утилитой.'
    ],
    commonPitfalls: [
      'Превращать Go-шаблоны Helm в монструозный нечитаемый код с глубокой вложенностью if/else.'
    ],
    tags: ['CICD', 'Helm', 'Kustomize', 'Kubernetes', 'Templating']
  },
  {
    id: 'cicd-15',
    title: 'В чем разница между GitOps-инструментами ArgoCD и FluxCD при непрерывной доставке в Kubernetes?',
    category: 'cicd',
    difficulty: 'Senior',
    summaryAnswer: 'ArgoCD предоставляет мощный веб-интерфейс (UI), ориентирован на управление множеством кластеров (Multi-tenant) и использует pull-модель. FluxCD — более легковесный инструмент, глубоко интегрированный с Kubernetes-native экосистемой (через Custom Resources) без выделенного UI.',
    fullAnswer: `Оба инструмента реализуют методологию **GitOps** в Kubernetes: они отслеживают репозиторий Git (Source of Truth) и автоматически синхронизируют желаемое состояние с реальным состоянием кластера, устраняя ручной запуск \`kubectl apply\`.

**Ключевые различия**:

1. **Пользовательский интерфейс (UI)**:
   - **ArgoCD**: Имеет красивый, функциональный веб-UI, показывающий граф ресурсов кластера в реальном времени, статус синхронизации и логи подов. Это делает его крайне популярным среди разработчиков и QA.
   - **FluxCD**: Веб-интерфейса из коробки нет (управляется строго через CLI \`flux\` и Custom Resources). Вся настройка происходит декларативно.

2. **Архитектура и мультикластерность**:
   - **ArgoCD**: Может работать как централизованный сервер управления, который подключается к десяткам удаленных внешних кластеров (через kubeconfig) и деплоит в них.
   - **FluxCD**: Следует микросервисной философии Unix. Рекомендуемый подход — устанавливать Flux локально в каждый кластер. Он состоит из набора независимых K8s контроллеров (source-controller, helm-controller, kustomize-controller).

3. **Гибкость интеграций**:
   - **ArgoCD**: Поддерживает Argo Rollouts для сложных стратегий канареечного релиза (Canary/Blue-Green deployments).
   - **FluxCD**: Отлично работает с Flagger для прогрессивной доставки и более нативно встраивается в kustomize/helm потоки.`,
    codeSnippet: {
      language: 'yaml',
      code: `# Пример ресурса ArgoCD Application
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: myapp-prod
  namespace: argocd
spec:
  project: default
  source:
    repoURL: 'https://github.com/myorg/myapp-gitops.git'
    targetRevision: HEAD
    path: envs/prod
  destination:
    server: 'https://kubernetes.default.svc'
    namespace: prod
  syncPolicy:
    automated:
      prune: true
      selfHeal: true`
    },
    interviewTips: [
      'Упомяните свойство selfHeal (самолечение) в GitOps: если кто-то вручную изменит конфигурацию пода через kubectl, GitOps-контроллер обнаружит дрейф конфигураций (Configuration Drift) и автоматически перезапишет ручные изменения конфигурацией из Git.'
    ],
    commonPitfalls: [
      'Использовать GitOps для сред разработки (Dev), где разработчикам требуется мгновенный цикл деплоя без необходимости коммитить каждое мелкое изменение кода в Git.'
    ],
    tags: ['CICD', 'GitOps', 'ArgoCD', 'FluxCD', 'Kubernetes']
  },
  {
    id: 'cicd-16',
    title: 'Что такое концепция «Shift Left» в безопасности CI/CD и какие инструменты применяются на каждом этапе?',
    category: 'cicd',
    difficulty: 'Senior',
    summaryAnswer: '«Shift Left» — это подход в DevSecOps, при котором проверки безопасности переносятся на самые ранние этапы разработки (налево по шкале жизненного цикла), включая проверку кода при коммите, а не перед релизом.',
    fullAnswer: `Традиционный подход ("безопасность в конце") приводил к тому, что уязвимости обнаруживались перед самым релизом во время пентеста, блокируя запуск продукта.
**Shift Left** переносит безопасность прямо в руки разработчика.

**Этапы и инструменты DevSecOps**:

1. **Код (Static Application Security Testing — SAST)**:
   - Анализ исходного кода на наличие уязвимостей, SQL-инъекций, небезопасного шифрования.
   - *Инструменты*: SonarQube, Semgrep, Snyk.

2. **Зависимости (Software Composition Analysis — SCA)**:
   - Проверка сторонних open-source библиотек и пакетов (npm, pip, maven) на известные уязвимости (CVE).
   - *Инструменты*: Snyk, OWASP Dependency-Check, GitHub Dependabot.

3. **Секреты (Secret Detection)**:
   - Поиск жестко закодированных в коде паролей, токенов, приватных ключей до отправки в Git.
   - *Инструменты*: GitLeaks, Trufflehog.

4. **Образы контейнеров (Container Scanning)**:
   - Анализ слоев Docker-образов на уязвимости системных пакетов ОС.
   - *Инструменты*: Trivy, Clair, Anchore Engine.

5. **Инфраструктура как код (IaC Scanning)**:
   - Проверка Terraform, Ansible и Helm манифестов на ошибки конфигурации (например, открытые наружу порты 22 или запуск привилегированных контейнеров).
   - *Инструменты*: Checkov, tfsec, Terrascan.`,
    codeSnippet: {
      language: 'yaml',
      code: `# Шаг сканирования Docker-образа в GitLab CI с помощью Trivy
scan_image:
  stage: test
  image: docker:stable
  services:
    - docker:dind
  script:
    - docker build -t myapp:$CI_COMMIT_SHA .
    - wget https://github.com/aquasecurity/trivy/releases/download/v0.40.0/trivy_0.40.0_Linux-64bit.tar.gz
    - tar -xzf trivy_0.40.0_Linux-64bit.tar.gz
    - ./trivy image --exit-code 1 --severity HIGH,CRITICAL myapp:$CI_COMMIT_SHA`
    },
    interviewTips: [
      'Упомяните разницу между SAST (статический анализ исходного кода без запуска) и DAST (динамический анализ запущенного веб-приложения путем отправки вредоносных запросов типа SQLi, XSS). В Shift Left всегда доминирует SAST/SCA.'
    ],
    commonPitfalls: [
      'Настраивать жесткое падение сборки (fail build) при обнаружении любых мелких CVE. Это парализует работу команд разработки, так как многие CVE являются ложноположительными (False Positive) или не влияют на рантайм. Начинать нужно с блокировки только Critical уязвимостей.'
    ],
    tags: ['CICD', 'DevSecOps', 'ShiftLeft', 'SAST', 'SCA', 'Trivy']
  },
  {
    id: 'cicd-17',
    title: 'Что такое Артефакты (Artifacts) и Кэш (Cache) в CI/CD пайплайнах? В чем их ключевые различия?',
    category: 'cicd',
    difficulty: 'Junior',
    summaryAnswer: 'Кэш сохраняет промежуточные файлы независимых сборок (node_modules, .m2, cargo) для ускорения CI. Артефакты — это итоговые результаты работы конкретного этапа (бинари, zip, junit отчеты), передаваемые между stage или пользователю.',
    fullAnswer: `Понимание разницы между Cache и Artifacts критично для оптимизации времени и стоимости CI/CD:

1. **Кэш (Cache)**:
   - **Назначение**: Ускорение выполнения идентичных задач за счет повторного использования зависимостей (скачанные npm-пакеты, pip wheels, maven/gradle репозиторий, ccache).
   - **Жизненный цикл**: Кэш является не гарантированным и может удаляться сервером. Пайплайн НЕ должен падать, если кэш отсутствует или очищен (он просто перекачает пакеты заново).
   - **Шаринг**: Обычно распределен по ключу (например, hash от \`package-lock.json\`) между всеми ветками одного репозитория.

2. **Артефакты (Artifacts)**:
   - **Назначение**: Передача готовых результатов работы одного stage в другой (например, скомпилированный файл \`dist/\` с этапа \`build\` передается на этап \`test\` или \`deploy\`), либо сохранение отчетов о покрытии кода (coverage report) для скачивания через UI.
   - **Жизненный цикл**: Гарантированно сохраняются и привязываются строго к конкретному запуску пайплайна (Pipeline ID / Commit SHA). Имеют явный срок жизни (TTL / Expiration).`,
    codeSnippet: {
      language: 'yaml',
      code: `# Пример конфигурации Cache и Artifacts в GitLab CI:
build_app:
  stage: build
  cache:
    key: files-$CI_COMMIT_REF_SLUG
    paths:
      - .npm/ # Сохраняем кэш npm пакетов
  script:
    - npm ci --cache .npm --prefer-offline
    - npm run build
  artifacts:
    expire_in: 1 week
    paths:
      - dist/ # Передаем собранный бинарник/bundle далее`
    },
    interviewTips: [
      'Упомяните, что кэш нельзя использовать для передачи критических бинарников на этап деплоя, так как кэш может инвалидироваться или быть поврежден соседней сборкой в другой ветке.'
    ],
    commonPitfalls: [
      'Сохранять каталог node_modules/ в artifacts вместо cache, из-за чего гигабайты зависимостей скачиваются и загружаются на каждый коммит во все инстансы GitLab/GitHub.'
    ],
    tags: ['CICD', 'Cache', 'Artifacts', 'GitLabCI', 'GitHubActions', 'Optimization']
  },
  {
    id: 'cicd-18',
    title: 'Как безопасно передавать Секреты (API ключи, пароли) в CI/CD пайплайн и предотвратить их утечку в логи?',
    category: 'cicd',
    difficulty: 'Junior',
    summaryAnswer: 'Секреты должны храниться в зашифрованных Vault/CI переменной со скрытием (Masked/Protected). Пайплайн не должен выводить переменные через set -x или echo. В прод-средах рекомендуется бесключевая OIDC-аутентификация.',
    fullAnswer: `Утечка секретов в логи CI/CD — одна из частых причин взломов инфраструктуры.

**Правила безопасной работы с секретами**:

1. **Использование встроенных Secret Variables**:
   - Вносить токены и пароли ТОЛЬКО через специальное меню CI/CD переменных (GitHub Secrets, GitLab Masked Variables).
   - Включать атрибут **Masked** (автоматически заменяет значение ключа на \`[MASKED]\` в логах, если его случайно выведет скрипт).
   - Включать атрибут **Protected** (секрет доступен только пайплайнам, запущенным на защищенных ветках/тегах, например \`main\`).

2. **Запрет печати переменных в скриптах**:
   - Избегать отладочных команд \`printenv\`, \`env\`, \`set -x\`, \`echo $SECRET_KEY\`.

3. **Загрузка секретов на лету (HashiCorp Vault)**:
   - В больших компаниях CI запрашивает временные динамические токены у HashiCorp Vault с коротким TTL (например, на 10 минут) прямо во время выполнения job.

4. **OIDC (OpenID Connect / Keyless)**:
   - Отказ от долгоживущих AWS_ACCESS_KEY_ID / GCP Service Account keys.
   - CI-раннер аутентифицируется в облаке AWS/GCP/Azure напрямую через OIDC токен, получая кратковременную роль без сохранения паролей.`,
    codeSnippet: {
      language: 'yaml',
      code: `# Пример использования OIDC в GitHub Actions для входа в AWS без статичных ключей:
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      id-token: write # Требуется для OIDC
      contents: read
    steps:
      - name: Configure AWS credentials via OIDC
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/my-github-ci-role
          aws-region: us-east-1`
    },
    interviewTips: [
      'Упомяните инструмент GitLeaks или Trufflehog, который запускается в pre-commit хуках или на первом этапе CI для отлавливания случайных секретов, закоммиченных в исходный код.'
    ],
    commonPitfalls: [
      'Передавать секреты через `--build-arg` в `docker build`. Все `--build-arg` навсегда сохраняются в истории слоев Docker-образа и могут быть извлечены командой `docker history`!'
    ],
    tags: ['CICD', 'Security', 'Secrets', 'OIDC', 'Vault', 'GitHubActions']
  },
  {
    id: 'cicd-19',
    title: 'Как ускорить сборку Docker-образов в CI/CD с помощью Docker Layer Caching и BuildKit (inline-cache)?',
    category: 'cicd',
    difficulty: 'Middle',
    summaryAnswer: 'Docker кэширует слои. Инструкции, меняющиеся реже всего (COPY package.json, RUN npm install), должны располагаться ВЫШЕ частых изменений (COPY . .). В CI кэш сохраняется через BuildKit backend или --cache-from из registry.',
    fullAnswer: `По умолчанию каждый раннер CI/CD стартует с чистой файловой системой, поэтому локальный кэш \`docker build\` теряется.

**Техники оптимизации сборки в CI**:

1. **Правильный порядок инструкций в Dockerfile**:
   - Слои инвалидируются сверху вниз. Если изменился хотя бы один файл в инструкции \`COPY\`, все последующие слои пересобираются с нуля.
   - *Неправильно*: сначала \`COPY . .\`, потом \`RUN npm install\`.
   - *Правильно*: сначала \`COPY package*.json .\`, затем \`RUN npm install\`, и только в самом конце \`COPY . .\`.

2. **Включение Docker BuildKit & Remote Cache**:
   - BuildKit позволяет экспортировать манифест кэша прямо в Container Registry (Docker Registry) при сборке образ-хранилища.
   - В параметрах сборки задается \`--cache-to type=registry,ref=app:buildcache\` и \`--cache-from type=registry,ref=app:buildcache\`.
   - Раннер перед сборкой скачивает только таблицы слоев кэша, избегая повторной прогонки тяжелых \`apt-get\` и \`pip install\`.`,
    codeSnippet: {
      language: 'bash',
      code: `# Включение BuildKit и сборка с экспортом/импортом удаленного кэша в реестр:
export DOCKER_BUILDKIT=1

docker build \\
  --build-arg BUILDKIT_INLINE_CACHE=1 \\
  --cache-from myregistry.com/app:build-cache \\
  -t myregistry.com/app:latest \\
  -t myregistry.com/app:$CI_COMMIT_SHA .`
    },
    interviewTips: [
      'Расскажите про Multi-stage builds: они не только уменьшают размер финального образа с 1 ГБ до 20 МБ, но и ускоряют CI, так как стадии с компиляцией можно эффективно кэшировать.'
    ],
    commonPitfalls: [
      'Забывать добавлять `.dockerignore`, из-за чего изменившийся лог-файл или локальная папка `.git` нечаянно сбрасывает кэш тяжелого слоя `COPY . .`.'
    ],
    tags: ['CICD', 'Docker', 'BuildKit', 'Caching', 'Performance']
  },
  {
    id: 'cicd-20',
    title: 'В чем разница между стратегиями развертывания Blue-Green, Canary и Rolling Update?',
    category: 'cicd',
    difficulty: 'Middle',
    summaryAnswer: 'Rolling Update постепенно заменяет старые поды новыми. Blue-Green разворачивает параллельный дублирующий окружение и мгновенно переключает трафик. Canary направляет маленький % пользователей (5-10%) на новую версию для проверки метрик.',
    fullAnswer: `Сравнение стратегий плавного релиза приложений без простоя (Zero Downtime Deployment):

1. **Rolling Update (Волновое обновление)**:
   - Поды обновляются по очереди (например, по 25% за раз).
   - *Плюсы*: Не требует удвоения серверных ресурсов.
   - *Минусы*: Во время обновления в кластере одновременно живут и обрабатывают запросы обе версии кода (v1 и v2). Обратная совместимость БД обязательна.

2. **Blue-Green Deployment**:
   - Создаются два абсолютно одинаковых окружения: Blue (текущий прод v1) и Green (новое v2).
   - Новая версия полностью поднимается и тестируется в Green. После этого роутер/балансировщик мгновенно переключает 100% трафика на Green.
   - *Плюсы*: Мгновенный откат (Rollback) — достаточно вернуть переключатель обратно на Blue.
   - *Минусы*: Требует x2 ресурсов инфраструктуры на время деплоя.

3. **Canary Deployment (Канареечный релиз)**:
   - Новая версия v2 разворачивается рядом с v1, но на нее направляется лишь небольшой процент пользователей (например, 5% трафика).
   - Автоматика (например, Argo Rollouts / Service Mesh Istio) отслеживает метрики ошибок (HTTP 5xx, latency).
   - Если за 10 минут ошибок нет, трафик плавно повышается: 25% -> 50% -> 100%. При росте ошибок трафик автоматически сбрасывается на 0%.`,
    codeSnippet: {
      language: 'yaml',
      code: `# Пример Canary стратегии в Argo Rollouts для Kubernetes:
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: rollout-canary
spec:
  replicas: 5
  strategy:
    canary:
      steps:
        - setWeight: 20 # Направить 20% трафика
        - pause: { duration: 10m } # Ждать 10 минут анализа
        - setWeight: 50
        - pause: { duration: 10m }`
    },
    interviewTips: [
      'Упомяните, что при Canary и Blue-Green всегда критично проектировать миграции схемы базы данных так, чтобы v1 и v2 версии кода могли одновременно работать с одной и той же БД (Паттерн Expand and Contract).'
    ],
    commonPitfalls: [
      'Делать деструктивные изменения в БД (например, удаление столбца таблицы) до того, как Canary релиз завершится и v1 инстансы полностью завершат работу.'
    ],
    tags: ['CICD', 'Deployments', 'BlueGreen', 'Canary', 'Kubernetes', 'ArgoRollouts']
  },
  {
    id: 'cicd-21',
    title: 'Как организовать автоматическое версионирование (Semantic Versioning) и ченджлог в CI/CD с помощью Conventional Commits?',
    category: 'cicd',
    difficulty: 'Senior',
    summaryAnswer: 'Разработчики пишут коммиты по стандарту Conventional Commits (feat:, fix:, BREAKING CHANGE:). CI-инструмент (semantic-release / release-please) анализирует коммиты, сам повышает версию SemVer (v1.2.3), генерирует CHANGELOG.md и создает Git Tag.',
    fullAnswer: `Ручное проставление версий и ведение файлов изменений приводит к ошибкам и путанице. Автоматизация решает эту проблему через **Conventional Commits**.

**Правила написания коммитов**:
- \`fix: resolve null pointer in user auth\` -> Повышает **PATCH** версию (v1.0.0 -> v1.0.1).
- \`feat: add dark theme toggle\` -> Повышает **MINOR** версию (v1.0.0 -> v1.1.0).
- \`feat!: drop node 14 support\` или \`BREAKING CHANGE:\` -> Повышает **MAJOR** версию (v1.0.0 -> v2.0.0).

**Автоматический пайплайн (Semantic Release / Release Please)**:
1. Разработчик мержит PR с правильным заголовком коммита в \`main\` ветку.
2. CI запустит утилиту \`semantic-release\` (или \`release-please\` от Google).
3. Утилита выкачивает историю коммитов с момента последнего тега.
4. Вычисляет новую версию по SemVer (например, \`v2.4.1\`).
5. Генерирует/обновляет файл \`CHANGELOG.md\` со списком фич и багфиксов.
6. Публикует Git Tag \`v2.4.1\` и GitHub/GitLab Release.
7. Запускает сбоку и публикацию Docker-образа \`myapp:2.4.1\` и \`myapp:2.4\` в реестр.`,
    codeSnippet: {
      language: 'json',
      code: `// Пример файла .releaserc.json для semantic-release
{
  "branches": ["main"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/git",
    "@semantic-release/github"
  ]
}`
    },
    interviewTips: [
      'Упомяните линтер коммитов (commitlint) в git pre-receive / pre-commit хуках или в pull request валидации CI. Он заблокирует мерж PR, если заголовок написан не по стандарту Conventional Commits.'
    ],
    commonPitfalls: [
      'Использовать мутабельный тег `latest` на продуктивном сервере в Kubernetes вместо неизменяемых (immutable) тегов с номерами версий SemVer или Git Commit SHA.'
    ],
    tags: ['CICD', 'SemVer', 'Git', 'Release', 'Automation', 'ConventionalCommits']
  }
];

