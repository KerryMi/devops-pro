import { Quiz } from '../../types';

export const QUICK_QUIZZES: Quiz[] = [
  // --- JUNIOR LEVEL QUICK QUIZZES (4-5 questions) ---
  {
    id: 'quiz-junior-basics',
    title: 'Основы Linux & Командной строки',
    category: 'linux',
    difficulty: 'Junior',
    description: '5 экспресс-вопросов: базовые команды Linux, права доступа, процессы и навигация по файловой системе.',
    timeLimitMinutes: 6,
    questions: [
      {
        id: 'q-j1',
        category: 'linux',
        question: 'Какая команда используется для проверки текущей рабочей директории в терминале Linux?',
        options: [
          'ls -la',
          'pwd',
          'cd ~',
          'whoami'
        ],
        correctAnswerIndex: 1,
        explanation: 'Команда `pwd` (Print Working Directory) выводит полный абсолютный путь к текущему каталогу, в котором находится командный интерпретатор.'
      },
      {
        id: 'q-j2',
        category: 'linux',
        question: 'Что означают права доступа 755 на файл в символьном представлении?',
        options: [
          '-rw-r--r-- (Владелец: чтение и запись, остальные: только чтение)',
          '-rwxrwxrwx (Полный доступ для всех)',
          '-rwxr-xr-x (Владелец: чтение/запись/выполнение, Группа и Остальные: чтение/выполнение)',
          '-r-xr-xr-x (Только чтение и запуск для всех)'
        ],
        correctAnswerIndex: 2,
        explanation: 'В восьмеричной системе: 7 = rwx (4+2+1), 5 = r-x (4+0+1). Таким образом, 755 означает -rwxr-xr-x.'
      },
      {
        id: 'q-j3',
        category: 'linux',
        question: 'С помощью какой команды можно посмотреть использование оперативной памяти в реальном времени?',
        options: [
          'df -h',
          'du -sh *',
          'uname -a',
          'top (или htop / free -m)'
        ],
        correctAnswerIndex: 3,
        explanation: 'Команда `free -m` показывает объём доступной и занятой RAM в мегабайтах, а `top` или `htop` дают интерактивный просмотр загрузки процессов и памяти.'
      },
      {
        id: 'q-j4',
        category: 'linux',
        question: 'Какой сигнал посылает команда `kill -9 <PID>` процессу?',
        options: [
          'SIGTERM (запрос на корректное завершение)',
          'SIGKILL (немедленное принудительное завершение ядра без очистки)',
          'SIGHUP (перечитай конфигурацию)',
          'SIGSTOP (пауза процесса)'
        ],
        correctAnswerIndex: 1,
        explanation: 'Сигнал -9 — это SIGKILL. Процесс не может перехватить или проигнорировать этот сигнал, ядро немедленно уничтожает структуру процесса.'
      },
      {
        id: 'q-j5',
        category: 'linux',
        question: 'В каком файле хранится список соответствий IP-адресов и доменных имен для локального резолвинга в Linux?',
        options: [
          '/etc/resolv.conf',
          '/etc/fstab',
          '/etc/hosts',
          '/etc/environment'
        ],
        correctAnswerIndex: 2,
        explanation: 'Файл `/etc/hosts` используется операционной системой для статического сопоставления хостнеймов с IP-адресами в первую очередь перед обращением к DNS-серверам из `/etc/resolv.conf`.'
      }
    ]
  },

  {
    id: 'quiz-junior-docker',
    title: 'Docker & Контейнеризация: Старт',
    category: 'docker',
    difficulty: 'Junior',
    description: '5 экспресс-вопросов: разница между контейнером и образом, базовые команды CLI, проброс портов и инструкции Dockerfile.',
    timeLimitMinutes: 6,
    questions: [
      {
        id: 'q-jd1',
        category: 'docker',
        question: 'В чем ключевое отличие Docker образа (Image) от Docker контейнера (Container)?',
        options: [
          'Образ работает только на Linux, а контейнер на Windows',
          'Образ — это неизменяемый шаблон (чертеж), а контейнер — запущенный изолированный экземпляр этого образа',
          'Контейнер содержит исходный код, а образ только скомпилированные бинарники',
          'Никакой разницы нет, это синонимы'
        ],
        correctAnswerIndex: 1,
        explanation: 'Docker Image — это read only (только чтение) слои с приложением и зависимостями. Docker Container — это запущенный процесс, имеющий свой тонкий read/write (чтение/запись) слой поверх образа.'
      },
      {
        id: 'q-jd2',
        category: 'docker',
        question: 'Какой флаг в команде `docker run` запускает контейнер в фоновом режиме (detached mode)?',
        options: [
          '-it',
          '-p',
          '--rm',
          '-d'
        ],
        correctAnswerIndex: 3,
        explanation: 'Флаг `-d` (detached) запускает контейнер в фоновом режиме и выводит ID созданного контейнера в терминал.'
      },
      {
        id: 'q-jd3',
        category: 'docker',
        question: 'Что делает ключ `-p 8080:80` при запуске `docker run -p 8080:80 nginx`?',
        options: [
          'Пробрасывает порт 80 хост-машины на порт 8080 внутри контейнера',
          'Пробрасывает порт 8080 хост-машины на порт 80 внутри контейнера',
          'Ограничивает использование оперативной памяти до 8080 МБ',
          'Запускает 8080 параллельных копий контейнера'
        ],
        correctAnswerIndex: 1,
        explanation: 'Формат проброса портов `-p host_port:container_port`. Порт 8080 хоста связывается с портом 80 внутри контейнера.'
      },
      {
        id: 'q-jd4',
        category: 'docker',
        question: 'Какая команда удаляет все остановленные контейнеры, неиспользуемые сети и dangling-слои?',
        options: [
          'docker stop all',
          'docker rm -f $(docker ps)',
          'docker system prune',
          'docker rmi --all'
        ],
        correctAnswerIndex: 2,
        explanation: 'Команда `docker system prune` очищает остановленные контейнеры, неиспользуемые виртуальные сети и образы без тегов (dangling images).'
      },
      {
        id: 'q-jd5',
        category: 'docker',
        question: 'Чем отличается инструкция `CMD` от `ENTRYPOINT` в Dockerfile?',
        options: [
          'CMD выполняется во время сборки образа (build time), а ENTRYPOINT во время запуска (runtime)',
          'ENTRYPOINT задает неизменную исполняемую команду, а CMD задает параметры по умолчанию, которые легко переопределить при запуске',
          'ENTRYPOINT используется только для Python приложений',
          'CMD запускает процессы от пользователя root, а ENTRYPOINT от daemon'
        ],
        correctAnswerIndex: 1,
        explanation: 'ENTRYPOINT определяет постоянный исполняемый файл бинарника (например, `/usr/bin/python`), а CMD — аргументы по умолчанию. Аргументы из `docker run ...` легко перезаписывают `CMD`.'
      }
    ]
  },

  {
    id: 'quiz-junior-git-cicd',
    title: 'Git & Основы CI/CD',
    category: 'cicd',
    difficulty: 'Junior',
    description: '5 вопросов: основы контроля версий Git, ветвление, Merging, Pull Request и базовые понятия автоматических деплоев.',
    timeLimitMinutes: 6,
    questions: [
      {
        id: 'q-jg1',
        category: 'cicd',
        question: 'Какая команда создаст новую ветку `feature/login` и сразу переключит вас на нее?',
        options: [
          'git branch create feature/login',
          'git checkout -b feature/login (или git switch -c feature/login)',
          'git commit -b feature/login',
          'git pull origin feature/login'
        ],
        correctAnswerIndex: 1,
        explanation: 'Команда `git checkout -b <name>` или современный аналог `git switch -c <name>` создают новую ветку от текущего коммита и делают переключение на нее.'
      },
      {
        id: 'q-jg2',
        category: 'cicd',
        question: 'Как расшифровываются аббревиатуры CI и CD?',
        options: [
          'Code Inspection и Cloud Deployment',
          'Container Insulation и Central Database',
          'Continuous Integration (Непрерывная Интеграция) и Continuous Delivery / Deployment (Непрерывная Доставка / Развертывание)',
          'Computer Integration и Data Distribution'
        ],
        correctAnswerIndex: 2,
        explanation: 'CI — автоматическая сборка и тестирование кода при каждом коммите. CD — автоматизированная или автоматическая доставка готового релиза на тестовые и продакшн стенды.'
      },
      {
        id: 'q-jg3',
        category: 'cicd',
        question: 'Для чего используется файл `.gitignore` в корне репозитория?',
        options: [
          'Чтобы скрыть репозиторий от сторонних пользователей в интернете',
          'Чтобы отменить последний коммит',
          'Чтобы указать файлы и папки (например, node_modules, .env, логи), которые НЕ должны попадать в Git репозиторий',
          'Чтобы хранить пароли от продакшн серверов'
        ],
        correctAnswerIndex: 2,
        explanation: 'Файл `.gitignore` содержит шаблоны путей к временным бинарникам, кэшам, секретам и зависимостям, чтобы Git игнорировал их при индексации (git add).'
      },
      {
        id: 'q-jg4',
        category: 'cicd',
        question: 'В чем различие между `git fetch` и `git pull`?',
        options: [
          'git fetch только скачивает новые изменения из удаленного репозитория без слития, а git pull скачивает и сразу делает merge в текущую ветку',
          'git fetch удаляет старые ветки, а git pull скачивает код',
          'git pull отправляет код на GitHub, а git fetch скачивает обратно',
          'Это одна и та же команда'
        ],
        correctAnswerIndex: 0,
        explanation: 'По сути `git pull` является комбинацией двух команд: `git fetch` (скачать объекты) и `git merge` (объединить их с вашей локальной веткой).'
      },
      {
        id: 'q-jg5',
        category: 'cicd',
        question: 'Что такое "Fast-Forward" слияние (Merge) в Git?',
        options: [
          'Слияние, при котором создается отдельный коммит слияния с двумя родителями',
          'Слияние, при котором ветка-цель просто сдвигает указатель вперед без создания merge-коммита, так как в ней не было параллельных изменений',
          'Принудительная перезапись удаленного репозитория через push --force',
          'Слияние веток из разных удаленных репозиториев'
        ],
        correctAnswerIndex: 1,
        explanation: 'Fast-Forward возможен, если целевая ветка не имела новых коммитов с момента создания ветки с фичей. Git просто перемещает указатель HEAD вперед.'
      }
    ]
  },

  {
    id: 'quiz-junior-networking',
    title: 'Компьютерные Сети & Web',
    category: 'networking',
    difficulty: 'Junior',
    description: '5 вопросов: основы сетевых протоколов, IP адресация, DNS, порты 80/443 и HTTP статус коды.',
    timeLimitMinutes: 6,
    questions: [
      {
        id: 'q-jn1',
        category: 'networking',
        question: 'Какие стандартные порты используются по умолчанию для незащищенного протокола HTTP и защищенного HTTPS?',
        options: [
          'HTTP — 8080, HTTPS — 8443',
          'HTTP — 80, HTTPS — 443',
          'HTTP — 22, HTTPS — 21',
          'HTTP — 53, HTTPS — 3306'
        ],
        correctAnswerIndex: 1,
        explanation: 'По общепринятым стандартам IANA: порт 80 — HTTP, порт 443 — HTTPS (TLS/SSL).'
      },
      {
        id: 'q-jn2',
        category: 'networking',
        question: 'Что означает HTTP код ответа сервера 404 Not Found?',
        options: [
          'На сервере произошла внутренняя ошибка кода (Internal Server Error)',
          'Запрошенный ресурс или страница не найдены на сервере',
          'Доступ запрещен из-за отсутствия авторизации',
          'Сервер временно перегружен'
        ],
        correctAnswerIndex: 1,
        explanation: 'Семейство кодов 4xx указывает на ошибки клиента. 404 означает, что сервер понял запрос, но не нашел ресурс по указанному URI.'
      },
      {
        id: 'q-jn3',
        category: 'networking',
        question: 'За что отвечает служба DNS (Domain Name System)?',
        options: [
          'Шифрует пароли в браузерах',
          'Ускоряет загрузку картинок на сайте',
          'Преобразует понятные человеку доменные имена (например, google.com) в числовые IP-адреса (например, 142.250.180.206)',
          'Защищает сервер от вирусов'
        ],
        correctAnswerIndex: 2,
        explanation: 'DNS действует как "телефонная книга" интернета, превращая доменные имена в IP-адреса, необходимые компьютерам для маршрутизации пакетов.'
      },
      {
        id: 'q-jn4',
        category: 'networking',
        question: 'Какая из утилит позволяет проверить сетевую доступность хоста с помощью ICMP пакетов?',
        options: [
          'curl',
          'ssh',
          'git',
          'ping'
        ],
        correctAnswerIndex: 3,
        explanation: 'Утилита `ping` отправляет специальные пакеты ICMP Echo Request и измеряет время задержки (RTT) ответа ICMP Echo Reply.'
      },
      {
        id: 'q-jn5',
        category: 'networking',
        question: 'Какая маска подсети соответствует CIDR-нотации /24?',
        options: [
          '255.255.0.0',
          '255.255.255.0',
          '255.255.255.128',
          '255.0.0.0'
        ],
        correctAnswerIndex: 1,
        explanation: 'Маска /24 означает первые 24 бита, установленные в 1: 11111111.11111111.11111111.00000000, что в десятичном виде равно 255.255.255.0 (256 IP-адресов, из них 254 доступны хостам).'
      }
    ]
  },

  // --- MIDDLE LEVEL QUICK BLITZ QUIZZES (5 questions) ---
  {
    id: 'quiz-docker-k8s',
    title: 'Экспресс-Тест: Docker & Kubernetes Core',
    category: 'docker',
    difficulty: 'Middle',
    description: '5 практических вопросов на проверку сигналов процессов, OOMKilled, слоев Dockerfile и StatefulSet.',
    timeLimitMinutes: 7,
    questions: [
      {
        id: 'q-dk-1',
        category: 'docker',
        question: 'Что произойдет, если в контейнере процесс с PID 1 получит сигнал SIGTERM, но не имеет встроенного обработчика (signal handler)?',
        options: [
          'Ядро Linux принудительно завершит процесс через 1 секунду',
          'Сигнал SIGTERM будет проигнорирован ядром для процесса с PID 1',
          'Контейнер автоматически перейдет в состояние Pause',
          'Контейнер мгновенно упадет с кодом ошибки Exit 137'
        ],
        correctAnswerIndex: 1,
        explanation: 'В Linux процесс с PID 1 обрабатывается особым образом: ядро не применяет действие по умолчанию для SIGTERM к PID 1. Если приложение не зарегистрировало свой обработчик сигнала, SIGTERM будет проигнорирован до истечения таймаута (grace period), после чего пойдет SIGKILL (137).'
      },
      {
        id: 'q-dk-2',
        category: 'k8s',
        question: 'Какой статус у пода Kubernetes будет, если контейнер завершился из-за превышения лимита памяти (Memory Limit)?',
        options: [
          'Evicted',
          'Completed',
          'CrashLoopBackOff со статусом OOMKilled в причинах',
          'NodeLost'
        ],
        correctAnswerIndex: 2,
        explanation: 'При выходе за пределы указанного memory limit ядро Linux (или cgroup) убивает контейнер сигналом SIGKILL (код 137). Kubelet регистрирует причину OOMKilled и переводит под в цикл перезапусков CrashLoopBackOff.'
      },
      {
        id: 'q-dk-3',
        category: 'docker',
        question: 'Какая инструкция Dockerfile НЕ создает новый слой (layer) образа?',
        options: [
          'RUN apt-get update && apt-get install -y curl',
          'COPY package.json ./',
          'EXPOSE 8080',
          'ADD https://example.com/file.tar.gz /tmp/'
        ],
        correctAnswerIndex: 2,
        explanation: 'Инструкции EXPOSE, ENV, LABEL, WORKDIR, USER изменяют только метаданные образа и НЕ создают новые слои файловой системы. Инструкции RUN, COPY, ADD создают слои.'
      },
      {
        id: 'q-dk-4',
        category: 'k8s',
        question: 'В чем ключевое отличие StatefulSet от Deployment в Kubernetes?',
        options: [
          'StatefulSet не может использовать HPA для автомасштабирования',
          'Поды в StatefulSet имеют уникальные стабильные сетевые идентификаторы (pod-0, pod-1) и постоянные PVC',
          'Deployment работает только на утилите Docker, а StatefulSet на containerd',
          'StatefulSet нельзя перезапустить без удаления всего namespace'
        ],
        correctAnswerIndex: 1,
        explanation: 'StatefulSet гарантирует порядковый деплой (0, 1, 2...) и стабильные DNS имена (my-app-0.my-service) и постоянное монтирование volumeClaimTemplates к соответствующим репликам даже после перезапуска.'
      },
      {
        id: 'q-dk-5',
        category: 'k8s',
        question: 'Что такое Taints и Tolerations в Kubernetes?',
        options: [
          'Правила ограничения сетевого трафика между подами',
          'Taint отталкивает поды от ноды, если у пода нет соответствующей Toleration',
          'Настройки лимитов CPU и RAM на уровне namespace',
          'Параметры ротации логов контейнеров'
        ],
        correctAnswerIndex: 1,
        explanation: 'Taints (запятнанность) навешиваются на Node, чтобы отталкивать поды. Под запустится на такой ноде только в том случае, если в его спецификации явно указано послабление (Toleration).'
      }
    ]
  },

  {
    id: 'quiz-ansible-deepdrive',
    title: 'Ansible: Экспресс-проверка Playbooks & Roles',
    category: 'ansible',
    difficulty: 'Middle',
    description: '5 вопросов: идемпотентность, Playbooks, Roles, Handlers, Vault и Molecule.',
    timeLimitMinutes: 7,
    questions: [
      {
        id: 'q-ans-1',
        category: 'ansible',
        question: 'Как изменить поведение Ansible, чтобы при выполнении таски на множестве серверов ошибки на отдельных хостах не останавливали выполнение на остальных?',
        options: [
          'Свойство `ignore_errors: yes` для таски или настройка `ignore_unreachable: yes`',
          'Параметр `serial: 100%`',
          'Флаг `--skip-broken` в CLI',
          'Параметр `fail_fast: false`'
        ],
        correctAnswerIndex: 0,
        explanation: 'Использование `ignore_errors: yes` позволяет продолжить выполнение плейбука на хосте, даже если конкретная таска завершилась с ошибкой.'
      },
      {
        id: 'q-ans-2',
        category: 'ansible',
        question: 'Что гарантирует концепция Идемпотентности (Idempotency) в Ansible?',
        options: [
          'Повторный запуск плейбука с теми же параметрами не вносит повторных изменений и приводит систему к тому же целевому состоянию',
          'Плейбук выполняется параллельно со скоростью C++',
          'Пароли автоматически шифруются при передаче',
          'Результат выполнения сохраняется в базу данных'
        ],
        correctAnswerIndex: 0,
        explanation: 'Идемпотентность означает, что запуск модуля один или сто раз гарантирует одинаковое итоговое состояние хоста без дублирования конфигураций.'
      },
      {
        id: 'q-ans-3',
        category: 'ansible',
        question: 'В какой момент времени по умолчанию запускается блок `handlers` в Ansible?',
        options: [
          'Сразу после вызова таски notify',
          'В самом начале выполнения плейбука',
          'В конце секции tasks (или всей игры/play), только если вызывающая таска вернула статус changed',
          'Каждые 5 минут по таймеру'
        ],
        correctAnswerIndex: 2,
        explanation: 'Handlers откладываются и выполняются в конце текущего плея, если хотя бы одна таска с `notify` реально внесла изменения (changed: true).'
      },
      {
        id: 'q-ans-4',
        category: 'ansible',
        question: 'Для чего используется команда `ansible-vault encrypt_string`?',
        options: [
          'Шифрует весь файл плейбука целиком',
          'Зашифровывает отдельное значение переменной в виде блока `!vault | ...` для безопасного хранения в Git',
          'Генерирует SSH-ключи для хостов',
          'Создает SSL-сертификаты'
        ],
        correctAnswerIndex: 1,
        explanation: '`ansible-vault encrypt_string` зашифровывает конкретный секрет или пароль и позволяет вставить зашифрованную строку прямо в yaml-файл.'
      },
      {
        id: 'q-ans-5',
        category: 'ansible',
        question: 'Какая утилита позволяет тестировать роли Ansible в изолированных контейнерах с автоматической проверкой идемпотентности?',
        options: [
          'AWX',
          'Molecule',
          'Terraform',
          'Packer'
        ],
        correctAnswerIndex: 1,
        explanation: 'Molecule — стандартный фреймворк для тестирования ролей Ansible. Он поднимает тестовые контейнеры, прогоняет роль и проверяет идемпотентность.'
      }
    ]
  },

  {
    id: 'quiz-terraform-iac',
    title: 'IaC & Terraform: Экспресс-Тест',
    category: 'terraform',
    difficulty: 'Middle',
    description: '5 вопросов: блокировки стейта, Drift detection, декларативный импорт, lifecycle и Terragrunt.',
    timeLimitMinutes: 7,
    questions: [
      {
        id: 'q-tf-1',
        category: 'terraform',
        question: 'Какую функцию выполняет таблица AWS DynamoDB (или её аналог) при использовании S3 в качестве remote backend в Terraform?',
        options: [
          'Хранит бэкапы кода инфраструктуры',
          'Обеспечивает блокировку состояния (State Locking) для предотвращения одновременных изменений разными инженерами',
          'Шифрует пароли',
          'Ускоряет команду `terraform plan` в 10 раз'
        ],
        correctAnswerIndex: 1,
        explanation: 'При вызове `terraform plan/apply` Terraform записывает замок (lock) в DynamoDB. Если другой инженер попытается выполнить apply одновременно, операция заблокируется.'
      },
      {
        id: 'q-tf-2',
        category: 'terraform',
        question: 'Что происходит при фазе refresh в процессе работы `terraform plan`?',
        options: [
          'Terraform удаляет все ресурсы и создает заново',
          'Terraform опрашивает облачные API и обновляет локальное состояние `.tfstate` актуальными значениями ресурсов (Drift Detection)',
          'Скачивает свежие провайдеры',
          'Очищает кэш модуля'
        ],
        correctAnswerIndex: 1,
        explanation: 'Фаза refresh сопоставляет текущую конфигурацию `.tfstate` с реальным состоянием инфраструктуры у провайдера, выявляя ручные изменения (Drift).'
      },
      {
        id: 'q-tf-3',
        category: 'terraform',
        question: 'С помощью какого блока в Terraform 1.5+ можно декларативно импортировать существующий в облаке ресурс в код без ручного CLI метода?',
        options: [
          'Блок `import { to = ... id = ... }`',
          'Блок `resource "import" {}`',
          'Блок `external {}`',
          'Блок `provider "import" {}`'
        ],
        correctAnswerIndex: 0,
        explanation: 'В Terraform 1.5+ добавлен встроенный блок `import { to = aws_s3_bucket.my_bucket, id = "my-bucket-name" }`, генерирующий код и добавляющий ресурс в state.'
      },
      {
        id: 'q-tf-4',
        category: 'terraform',
        question: 'Как предотвратить случайное удаление критической базы данных при выполнении `terraform destroy` или изменении параметров ресурса?',
        options: [
          'Использовать мета-аргумент `lifecycle { prevent_destroy = true }`',
          'Переименовать файл в `.bak`',
          'Запретить доступ к файлу state',
          'Флаг `--no-destroy` в CLI'
        ],
        correctAnswerIndex: 0,
        explanation: 'Блок `lifecycle { prevent_destroy = true }` вызывает ошибку Terraform при любой попытке уничтожить данный ресурс.'
      },
      {
        id: 'q-tf-5',
        category: 'terraform',
        question: 'Какую главную задачу решает инструмент Terragrunt поверх Terraform?',
        options: [
          'Генерирует документацию',
          'Сокращает дублирование кода (DRY) за счет наследования backend-конфигураций и управления зависимостями между модулями',
          'Заменяет язык HCL на Python',
          'Автоматически оплачивает счета за облако'
        ],
        correctAnswerIndex: 1,
        explanation: 'Terragrunt помогает держать Terraform код DRY (Don\'t Repeat Yourself), убирая дублирование блоков backend и упрощая мульти-окружения (dev/stage/prod).'
      }
    ]
  },

  {
    id: 'quiz-observability-prometheus',
    title: 'Prometheus & Grafana: Экспресс-Тест',
    category: 'monitoring',
    difficulty: 'Middle',
    description: '5 вопросов: типы метрик (Counter/Gauge/Histogram), PromQL rate vs increase, Distributed Tracing и Inhibit Rules.',
    timeLimitMinutes: 7,
    questions: [
      {
        id: 'q-prom-1',
        category: 'monitoring',
        question: 'В чем принципиальное отличие функции `rate(http_requests_total[5m])` от `increase(http_requests_total[5m])` в PromQL?',
        options: [
          '`rate` считает среднее количество событий в секунду за период 5 минут, а `increase` считает суммарный прирост количества событий за 5 минут',
          'Никакого различия, это синонимы',
          '`increase` используется для Gauge, а `rate` для Counter',
          '`rate` работает только с логами Loki'
        ],
        correctAnswerIndex: 0,
        explanation: '`rate` вычисляет секундовую интенсивность роста Counter за интервал (событий/сек). `increase` вычисляет абсолютный прирост счетчика (событий) за этот интервал.'
      },
      {
        id: 'q-prom-2',
        category: 'monitoring',
        question: 'Какой тип метрики Prometheus идеален для измерения задержек сетевых запросов (latency) или размеров HTTP ответов?',
        options: [
          'Counter',
          'Gauge',
          'Histogram (или Summary)',
          'String'
        ],
        correctAnswerIndex: 2,
        explanation: 'Histogram распределяет измерения по корзинам (buckets) и позволяет с помощью `histogram_quantile()` точно рассчитывать 95-й и 99-й перцентили (p95/p99) задержки.'
      },
      {
        id: 'q-prom-3',
        category: 'monitoring',
        question: 'Что такое Trace ID и Span ID в концепции Distributed Tracing (OpenTelemetry / Jaeger)?',
        options: [
          'Номер порта и IP-адрес сервера',
          'Trace ID объединяет весь сквозной путь пользовательского запроса через микросервисы, а Span ID идентифицирует конкретную единицу работы внутри сервиса',
          'Пароль для доступа к базе данных',
          'Идентификатор контейнера в Docker'
        ],
        correctAnswerIndex: 1,
        explanation: 'Trace ID сохраняется неизменным при прохождении запроса через цепочку микросервисов, а каждый сервис создает свой Span ID для детального хронометража операции.'
      },
      {
        id: 'q-prom-4',
        category: 'monitoring',
        question: 'Как рассчитывается показатель SLO (Service Level Objective) на основе метрик SLI?',
        options: [
          'SLO = Количество серверов / Общий бюджет',
          'SLO определяет целевой процент успешных операций за период (например, 99.9% запросов ответили со статусом < 500 и задержкой < 200мс)',
          'SLO = Время работы без перезагрузки сервера',
          'SLO = Количество строк кода в сервисе'
        ],
        correctAnswerIndex: 1,
        explanation: 'SLI (Service Level Indicator) — фактическая метрика. SLO — согласованный целевой процент качества работы сервиса за учетный период.'
      },
      {
        id: 'q-prom-5',
        category: 'monitoring',
        question: 'Какая функция в Alertmanager позволяет автоматически подавить алерты от сервисов, если упал основной коммутатор датацентра?',
        options: [
          'Inhibit Rules (Правила ингибирования)',
          'Grouping',
          'Silences',
          'Routing Tree'
        ],
        correctAnswerIndex: 0,
        explanation: 'Inhibit rules автоматически подавляют (mute) алерты определенного уровня или узлов, если уже активен корневой критический алерт-источник.'
      }
    ]
  },

  {
    id: 'quiz-databases-devops',
    title: 'Базы данных: PostgreSQL & Redis Экспресс',
    category: 'cloud',
    difficulty: 'Middle',
    description: '5 вопросов: PgBouncer, WAL-логирование, репликация, Redis Persistence (RDB/AOF) и блокировки.',
    timeLimitMinutes: 7,
    questions: [
      {
        id: 'q-db-1',
        category: 'cloud',
        question: 'Зачем используется пул соединений (Connection Pooler, например PgBouncer) перед PostgreSQL?',
        options: [
          'PgBouncer сжимает таблицы базы данных на диске',
          'Создание нового процесса на каждое соединение в Postgres очень ресурсоемко; PgBouncer переиспользует готовый пул соединений, экономя RAM и CPU',
          'PgBouncer автоматически переводит запросы SELECT на Redis',
          'Он нужен только для шифрования SSL'
        ],
        correctAnswerIndex: 1,
        explanation: 'PostgreSQL использует модель process-per-connection. Управление тысячами открытых соединений приводит к огромным накладным расходам по памяти и context switching. PgBouncer позволяет держать тысячи клиентов с минимальным числом соединений к самой БД.'
      },
      {
        id: 'q-db-2',
        category: 'cloud',
        question: 'Что такое WAL (Write-Ahead Logging) в PostgreSQL и для чего он критически важен?',
        options: [
          'Лог ошибок веб-сервера',
          'Журнал предзаписи изменений, позволяющий восстановить целостность данных при сбое и использовать Point-In-Time Recovery (PITR)',
          'Список заблокированных IP-адресов',
          'Файл конфигурации пользователей базы'
        ],
        correctAnswerIndex: 1,
        explanation: 'WAL гарантирует транзакционность (ACID Durability). Все изменения сначала записываются на диск в WAL, а затем в файлы таблиц. Это основа стриминговой репликации и точного восстановления на любой момент времени (PITR).'
      },
      {
        id: 'q-db-3',
        category: 'cloud',
        question: 'Чем отличается механизм персистентности RDB от AOF в Redis?',
        options: [
          'RDB делает периодические point-in-time снимки (снапшоты) всей памяти на диск, а AOF логирует каждую операцию записи в append-only файл',
          'RDB работает только в облаке AWS, а AOF на локальных серверах',
          'AOF удаляет старые ключи по TTL, а RDB нет',
          'RDB используется только для очередей Celery'
        ],
        correctAnswerIndex: 0,
        explanation: 'RDB (Redis Database Dump) сохраняет компактный бинарный снимок памяти через заданные интервалы. AOF (Append Only File) последовательно дописывает каждую команду модификации данных, минимизируя потери при краше.'
      },
      {
        id: 'q-db-4',
        category: 'cloud',
        question: 'Какой тип блокировки (Lock) в PostgreSQL блокирует чтение таблицы другими транзакциями?',
        options: [
          'RowShareLock',
          'AccessExclusiveLock',
          'ShareLock',
          'AccessShareLock'
        ],
        correctAnswerIndex: 1,
        explanation: 'AccessExclusiveLock (вызывается при DROP TABLE, ALTER TABLE, TRUNCATE, VACUUM FULL) блокирует абсолютно все параллельные операции, включая SELECT (AccessShareLock).'
      },
      {
        id: 'q-db-5',
        category: 'cloud',
        question: 'Для чего в PostgreSQL служит параметр `max_connections` и почему не стоит ставить его в 5000+?',
        options: [
          'Он ограничивает объем диска',
          'Каждое соединение аллоцирует память под `work_mem` и создает процесс, что при большом числе соединений приводит к OOM и падению TPS из-за перегрузки планировщика ОС',
          'Он запрещает использование внешних IP',
          'Он влияет только на репликацию'
        ],
        correctAnswerIndex: 1,
        explanation: 'Слишком высокое значение `max_connections` приводит к исчерпанию оперативной памяти и колоссальным накладным расходам ядра на переключение контекста между тысячами форкнутых процессов.'
      }
    ]
  },

  {
    id: 'quiz-cloud-devsecops',
    title: 'Cloud Security & DevSecOps Экспресс',
    category: 'cloud',
    difficulty: 'Senior',
    description: '5 вопросов: HashiCorp Vault, PoLP, сканирование уязвимостей Trivy, RBAC и mTLS.',
    timeLimitMinutes: 7,
    questions: [
      {
        id: 'q-sec-1',
        category: 'cloud',
        question: 'Что означает принцип наименьших привилегий (Principle of Least Privilege - PoLP) в IAM?',
        options: [
          'Предоставление субъекту (пользователю/сервису) только минимально необходимых прав, необходимых для выполнения конкретной задачи',
          'Предоставление всем инженерам прав root на случай аварии',
          'Блокировка всех учетных записей после 18:00',
          'Пароль должен состоять минимум из 32 символов'
        ],
        correctAnswerIndex: 0,
        explanation: 'PoLP минимизирует поверхность атаки (blast radius): если микросервис или компрометированный ключ утекут, злоумышленник не сможет получить доступ к другим критическим ресурсам инфраструктуры.'
      },
      {
        id: 'q-sec-2',
        category: 'cloud',
        question: 'Какое главное преимущество использования динамических секретов (Dynamic Secrets) в HashiCorp Vault?',
        options: [
          'Динамические секреты не шифруются, поэтому работают быстрее',
          'Секреты создаются по запросу на лету с коротким временем жизни (TTL) и автоматически отзываются по истечении срока',
          'Их можно передавать по HTTP без TLS',
          'Они хранятся прямо в коде приложения'
        ],
        correctAnswerIndex: 1,
        explanation: 'Dynamic Secrets не существуют до момента запроса приложения. Vault создает временные учетные данные в базе/облаке со строгим TTL и автоматически удаляет их после использования.'
      },
      {
        id: 'q-sec-3',
        category: 'cloud',
        question: 'В чем различие между SAST (Static Application Security Testing) и DAST (Dynamic Application Security Testing)?',
        options: [
          'SAST сканирует исходный код без запуска приложения, а DAST тестирует работающее приложение "снаружи" черным ящиком',
          'SAST используется только для Docker, а DAST для Kubernetes',
          'DAST быстрее SAST в 100 раз',
          'SAST проверяет только SSL сертификаты'
        ],
        correctAnswerIndex: 0,
        explanation: 'SAST анализирует код и зависимости в репозитории (white box). DAST атакует запущенный веб-сервис симулированными эксплойтами (SQLi, XSS, SSRF) без доступа к коду.'
      },
      {
        id: 'q-sec-4',
        category: 'cloud',
        question: 'Что такое Mutual TLS (mTLS) и чем он отличается от стандартного одностороннего TLS?',
        options: [
          'mTLS быстрее обычного TLS за счет отключения шифрования',
          'При mTLS и клиент, и сервер взаимно проверяют X.509 сертификаты друг друга, подтверждая обоюдную подлинность',
          'mTLS не требует корневого центра сертификации (CA)',
          'mTLS работает только по протоколу UDP'
        ],
        correctAnswerIndex: 1,
        explanation: 'В обычном TLS только клиент проверяет сертификат сервера. В mTLS обе стороны предъявляют сертификаты, гарантируя доверенное шифрованное соединение внутри Service Mesh.'
      },
      {
        id: 'q-sec-5',
        category: 'cloud',
        question: 'Какой механизм в Kubernetes предотвращает запуск контейнеров с правами root и монтирование хостовых путей /proc и /sys?',
        options: [
          'Pod Security Standards (Restricted Profile) / Admission Webhooks (Kyverno / OPA Gatekeeper)',
          'ClusterIP Service',
          'Horizontal Pod Autoscaler',
          'CoreDNS Plugin'
        ],
        correctAnswerIndex: 0,
        explanation: 'Pod Security Standards (или admission-контроллеры Kyverno/OPA) блокируют манифесты с `securityContext.runAsNonRoot: false` или `privileged: true`.'
      }
    ]
  },

  {
    id: 'quiz-nginx-loadbalancing',
    title: 'Nginx, TLS & Reverse Proxy Экспресс',
    category: 'networking',
    difficulty: 'Middle',
    description: '5 вопросов: балансировка нагрузки (Round-Robin, Least_conn, IP_hash), HTTP/2, Keepalive и SSL Termination.',
    timeLimitMinutes: 7,
    questions: [
      {
        id: 'q-ngx-1',
        category: 'networking',
        question: 'Какой алгоритм балансировки Nginx направляет новый запрос на сервер с наименьшим количеством активных соединений?',
        options: [
          'round-robin',
          'ip_hash',
          'least_conn',
          'random'
        ],
        correctAnswerIndex: 2,
        explanation: 'Директива `least_conn` внутри блока `upstream` отслеживает текущее число незавершенных запросов к бэкендам и передает новый запрос наименее загруженному серверу.'
      },
      {
        id: 'q-ngx-2',
        category: 'networking',
        question: 'Что дает включение директивы `proxy_http_version 1.1;` и `proxy_set_header Connection "";` при проксировании запросов в Nginx?',
        options: [
          'Включает сжатие Gzip для всех картинок',
          'Активирует повторное использование постоянных TCP-соединений (Keepalive) к бэкендам из пула `upstream`, снижая overhead на 3-way handshake',
          'Блокирует спам-ботов по User-Agent',
          'Отключает таймауты чтения'
        ],
        correctAnswerIndex: 1,
        explanation: 'По умолчанию Nginx общается с бэкендами по HTTP/1.0, закрывая TCP-сокет после каждого запроса. HTTP/1.1 с пустым заголовком Connection переиспользует сокеты upstream keepalive.'
      },
      {
        id: 'q-ngx-3',
        category: 'networking',
        question: 'Что такое SSL Termination на уровне Nginx/Ingress?',
        options: [
          'Принудительное закрытие всех защищенных соединений',
          'Расшифровка входящего HTTPS трафика на балансировщике и передача во внутреннюю сеть приложениям по чистому HTTP',
          'Генерация самоподписанных сертификатов',
          'Блокировка клиентов с устаревшими браузерами'
        ],
        correctAnswerIndex: 1,
        explanation: 'SSL Termination снимает нагрузку по шифрованию TLS с бэкендов: Nginx берет на себя криптографию, а внутри защищенного кластера трафик идет на высокой скорости.'
      },
      {
        id: 'q-ngx-4',
        category: 'networking',
        question: 'В чем ключевое преимущество протокола HTTP/2 перед HTTP/1.1 в Nginx?',
        options: [
          'HTTP/2 не требует TCP',
          'Мультиплексирование запросов и ответов в рамках одного TCP-соединения без блокировки Head-of-Line на уровне приложения и сжатие заголовков HPACK',
          'HTTP/2 автоматически удаляет куки',
          'Разрешает передавать только файлы размером более 1 ГБ'
        ],
        correctAnswerIndex: 1,
        explanation: 'HTTP/2 разбивает поток на фреймы и передает сотни параллельных запросов через один TCP-сокет, устраняя необходимость открывать 6+ параллельных сокетов браузером.'
      },
      {
        id: 'q-ngx-5',
        category: 'networking',
        question: 'Какая директива Nginx настраивает ограничение частоты входящих запросов для защиты от DDoS и brute-force атак?',
        options: [
          'limit_req_zone и limit_req',
          'client_max_body_size',
          'proxy_read_timeout',
          'sendfile on'
        ],
        correctAnswerIndex: 0,
        explanation: 'Модуль `ngx_http_limit_req_module` использует алгоритм Leaky Bucket: `limit_req_zone $binary_remote_addr zone=one:10m rate=10r/s;` и `limit_req zone=one burst=20 nodelay;`.'
      }
    ]
  },

  {
    id: 'quiz-cicd-github-actions',
    title: 'GitHub Actions & GitLab CI/CD Экспресс',
    category: 'cicd',
    difficulty: 'Middle',
    description: '5 вопросов: кэширование зависимостей, Matrix builds, OIDC аутентификация в AWS/GCP, Artifacts и Environments.',
    timeLimitMinutes: 7,
    questions: [
      {
        id: 'q-gha-1',
        category: 'cicd',
        question: 'Как настроить аутентификацию GitHub Actions в AWS без сохранения долгоживущих AWS_ACCESS_KEY_ID в секретах репозитория?',
        options: [
          'Использовать OpenID Connect (OIDC) и assume-role-with-web-identity',
          'Сохранить пароль root пользователя в открытом README',
          'Отключить авторизацию в AWS S3',
          'Запускать раннеры только на локальном ноутбуке'
        ],
        correctAnswerIndex: 0,
        explanation: 'OIDC позволяет GitHub выдать временный подписанный JWT-токен раннеру. AWS IAM проверяет подпись токена и выдает короткоживущие credentials на время работы джобы.'
      },
      {
        id: 'q-gha-2',
        category: 'cicd',
        question: 'Для чего в GitHub Actions используется секция `strategy.matrix`?',
        options: [
          'Для отправки уведомлений в Slack',
          'Для запуска одной и той же джобы в нескольких параллельных комбинациях параметров (например, Node.js 18/20 на ubuntu/macos/windows)',
          'Для 3D визуализации пайплайна',
          'Для шифрования кода'
        ],
        correctAnswerIndex: 1,
        explanation: 'Matrix позволяет сгенерировать декартово произведение параметров и выполнить тесты сразу на разных версиях ОС и языков параллельно.'
      },
      {
        id: 'q-gha-3',
        category: 'cicd',
        question: 'В чем разница между `cache` и `artifacts` в GitLab CI / GitHub Actions?',
        options: [
          'Cache передает файлы на прод, а artifacts в dev',
          'Cache предназначен для ускорения сборки за счет сохранения зависимостей между запусками, а artifacts гарантированно передают результаты компиляции между разными стадиями пайплайна',
          'Artifacts удаляются через 1 секунду',
          'Разницы нет'
        ],
        correctAnswerIndex: 1,
        explanation: 'Cache может быть сброшен или отсутствовать на новом раннере без нарушения сборки. Artifacts строго сохраняются на сервере CI и передаются между зависимыми джобами.'
      },
      {
        id: 'q-gha-4',
        category: 'cicd',
        question: 'Какое ключевое слово в GitHub Actions workflow позволяет запускать шаг даже в случае падения предыдущих шагов (например, для публикации отчета о тестах)?',
        options: [
          'if: always()',
          'continue-on-error: force',
          'run: ignore',
          'retry: 3'
        ],
        correctAnswerIndex: 0,
        explanation: 'Условие `if: always()` заставляет GitHub Actions выполнить шаг независимо от того, упали ли предыдущие шаги в джобе.'
      },
      {
        id: 'q-gha-5',
        category: 'cicd',
        question: 'Что такое Self-Hosted Runner и когда его использование оправдано?',
        options: [
          'Раннер, который работает в браузере клиента',
          'Собственный сервер/ВМ для выполнения CI задач в закрытом сетевом контуре (VPC) с доступом к внутренним ресурсам, кастомным GPU или безлимитным CPU',
          'Раннер, который запускается без операционной системы',
          'Скрипт на Bash'
        ],
        correctAnswerIndex: 1,
        explanation: 'Self-Hosted раннеры запускаются в вашей собственной инфраструктуре, позволяя деплоить в закрытые подсети без открытия портов наружу и использовать мощное серверное железо.'
      }
    ]
  },

  {
    id: 'quiz-linux-internals-troubleshooting',
    title: 'Linux Kernel Internals & Performance Tuning',
    category: 'linux',
    difficulty: 'Senior',
    description: '5 вопросов: cgroups v2, Namespaces, eBPF, vm.swappiness и strace.',
    timeLimitMinutes: 8,
    questions: [
      {
        id: 'q-lin-1',
        category: 'linux',
        question: 'Какое ключевое архитектурное улучшение появилось в cgroups v2 по сравнению с cgroups v1?',
        options: [
          'Удалена поддержка Docker',
          'Единая иерархия процессов (single unified hierarchy) вместо независимых деревьев подсистем, что исключает состязание за ресурсы между контроллерами',
          'Память больше не ограничивается',
          'Поддержка только 32-битных систем'
        ],
        correctAnswerIndex: 1,
        explanation: 'В cgroups v1 каждый контроллер имел свое дерево. cgroups v2 объединяет все контроллеры в единую единую иерархию процессов.'
      },
      {
        id: 'q-lin-2',
        category: 'linux',
        question: 'Какой Namespace Linux обеспечивает изоляцию сетевых интерфейсов, таблиц маршрутизации, правил iptables и сокетов?',
        options: [
          'PID Namespace',
          'Net (Network) Namespace',
          'MNT (Mount) Namespace',
          'UTS Namespace'
        ],
        correctAnswerIndex: 1,
        explanation: 'Network Namespace создает полностью независимый сетевой стек для процесса или контейнера с собственными интерфейсами, IP и файрволом.'
      },
      {
        id: 'q-lin-3',
        category: 'linux',
        question: 'Что из перечисленного является главным преимуществом eBPF (Extended Berkeley Packet Filter) для SRE и DevOps?',
        options: [
          'Заменяет Bash скрипты',
          'Позволяет безопасно выполнять байткод внутри ядра Linux на лету без пересборки ядра и без загрузки нестабильных модулей ядра',
          'Увеличивает объем оперативной памяти',
          'Заменяет собой дисковые накопители'
        ],
        correctAnswerIndex: 1,
        explanation: 'eBPF позволяет внедрять программы в хуки ядра с проверкой верификатором безопасности, давая глубокую видимость системных событий без риска краша ядра.'
      },
      {
        id: 'q-lin-4',
        category: 'linux',
        question: 'Что произойдет, если значение `vm.swappiness` установить в 0 на современном ядре Linux?',
        options: [
          'Swap полностью отключится',
          'Ядро будет избегать вытеснения страниц памяти (anonymous memory) в swap до тех пор, пока память полностью не исчерпается',
          'Память очистится мгновенно',
          'Система уйдет в Kernel Panic'
        ],
        correctAnswerIndex: 1,
        explanation: '`swappiness=0` заставляет ядро отдавать приоритет кэшу страниц (page cache) и сбрасывать в swap анонимную память только при крайнем дефиците во избежание OOM.'
      },
      {
        id: 'q-lin-5',
        category: 'linux',
        question: 'Какая утилита позволяет отследить все системные вызовы (syscalls), совершаемые запущенным процессом Linux?',
        options: [
          'lsof',
          'strace',
          'tcpdump',
          'journalctl'
        ],
        correctAnswerIndex: 1,
        explanation: '`strace` перехватывает и записывает системные вызовы (open, read, write, connect, futex и т.д.), совершаемые процессом в реальном времени.'
      }
    ]
  }
];
