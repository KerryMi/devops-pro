import { Quiz } from '../types';

export const QUIZZES: Quiz[] = [
  // --- JUNIOR LEVEL QUIZZES ---
  {
    id: 'quiz-junior-basics',
    title: 'Основы Linux & Командной строки',
    category: 'linux',
    difficulty: 'Junior',
    description: 'Базовые команды Linux, права доступа, процессы и навигация по файловой системе для начинающих DevOps специалистов.',
    timeLimitMinutes: 8,
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
        explanation: 'Команда `pwd` (Print Working Directory) выводит полный путь к текущему каталогу, в котором вы находитесь.'
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
        explanation: 'Сигнал -9 — это SIGKILL. Процесс не может перехватить или проигнорировать этот сигнал, ядро немедленно уничтожает процесс.'
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
        explanation: 'Файл `/etc/hosts` используется операционной системой для локального сопоставления хостнеймов с IP-адресами в первую очередь перед обращением к DNS-серверам из `/etc/resolv.conf`.'
      }
    ]
  },

  {
    id: 'quiz-junior-docker',
    title: 'Docker & Контейнеризация: Старт',
    category: 'docker',
    difficulty: 'Junior',
    description: 'Основы Docker, разница между контейнером и образом, базовые команды CLI и проброс портов.',
    timeLimitMinutes: 8,
    questions: [
      {
        id: 'q-jd1',
        category: 'docker',
        question: 'В чем ключевое отличие Docker образа (Image) от Docker контейнера (Container)?',
        options: [
          'Образ работает только на Linux, а контейнер на Windows',
          'Образ — это неизменяемый шаблон (шаблон/чертеж), а контейнер — запущенный изолированный экземпляр этого образа',
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
        explanation: 'Флаг `-d` (detached) запускает контейнер в фоновом режиме и выводит ID созданного контейнера.'
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
        question: 'Какая команда удаляет все остановленные контейнеры и неиспользуемые Docker ресурсы?',
        options: [
          'docker stop all',
          'docker rm -f $(docker ps)',
          'docker system prune',
          'docker rmi --all'
        ],
        correctAnswerIndex: 2,
        explanation: 'Команда `docker system prune` очищает остановленные контейнеры, неиспользуемые сети и виртуальные слои без тегов (dangling images).'
      },
      {
        id: 'q-jd5',
        category: 'docker',
        question: 'Чем отличается инструкция `CMD` от `ENTRYPOINT` в Dockerfile?',
        options: [
          'CMD выполняется во время сборки образа (build time), а ENTRYPOINT во время запуска (runtime)',
          'ENTRYPOINT задает основную исполняемую команду, а CMD задает аргументы по умолчанию, которые легко переопределить при запуске',
          'ENTRYPOINT используется только для Python приложений',
          'CMD запускает процессы от пользователя root, а ENTRYPOINT от daemon'
        ],
        correctAnswerIndex: 1,
        explanation: 'ENTRYPOINT определяет постоянный исполняемый файл бинарника (например, `/usr/bin/python`), а CMD аргументы по умолчанию. Аргументы из `docker run ...` легко перезаписывают `CMD`.'
      }
    ]
  },

  {
    id: 'quiz-junior-git-cicd',
    title: 'Git & Основы CI/CD',
    category: 'cicd',
    difficulty: 'Junior',
    description: 'Основы контроля версий Git, ветвление, Merging, Pull Request и базовые понятия автоматических деплоев.',
    timeLimitMinutes: 8,
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
      }
    ]
  },

  {
    id: 'quiz-junior-networking',
    title: 'Компьютерные Сети & Web',
    category: 'networking',
    difficulty: 'Junior',
    description: 'Основы сетевых протоколов, IP адресация, DNS, порт 80/443, HTTP статус коды для новичков.',
    timeLimitMinutes: 8,
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
        explanation: 'Семейство кодов 4xx указывает на ошибки клиента. 404 означает, что сервер понял запрос, но не нашел объект по указанному URI.'
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
      }
    ]
  },

  // --- MIDDLE & SENIOR QUIZZES ---
  {
    id: 'quiz-docker-k8s',
    title: 'Экспресс-Тест: Docker & Kubernetes Core',
    category: 'docker',
    difficulty: 'Middle',
    description: 'Практические вопросы на проверку знаний контейнеризации, сети подов и оркестрации.',
    timeLimitMinutes: 10,
    questions: [
      {
        id: 'q1',
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
        id: 'q2',
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
        id: 'q3',
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
        id: 'q4',
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
        id: 'q5',
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
    id: 'quiz-k8s-deep-dive',
    title: 'Kubernetes Deep Dive & Network Policies',
    category: 'k8s',
    difficulty: 'Middle',
    description: 'Продвинутый тест по CNI плагинам, Ingress Controllers, NetworkPolicy, Probes и CRD.',
    timeLimitMinutes: 12,
    questions: [
      {
        id: 'q-k8s-1',
        category: 'k8s',
        question: 'Какая NetworkPolicy изолирует все входящие соединения к подам с селектором app=backend в namespace, если правила ingress пусты?',
        options: [
          'Поды продолжат принимать весь трафик без ограничений',
          'Поды перестанут принимать любой входящий трафик извне (Default Deny Ingress)',
          'Kubelet принудительно перезапустит поды',
          'NetworkPolicy выдаст ошибку валидации'
        ],
        correctAnswerIndex: 1,
        explanation: 'Если под выбран в NetworkPolicy, к нему начинает применяться политика "запрещено все, что явно не разрешено" (Default Deny). Если секция ingress пуста, блокируется весь входящий трафик.'
      },
      {
        id: 'q-k8s-2',
        category: 'k8s',
        question: 'В чем разница между ReadinessProbe и LivenessProbe в Kubernetes?',
        options: [
          'ReadinessProbe отключает под от Endpoints сервиса при провале, а LivenessProbe перезапускает контейнер',
          'LivenessProbe проверяет только диски, а ReadinessProbe только CPU',
          'ReadinessProbe запускается один раз при старте, а LivenessProbe раз в секунду',
          'Различий нет, они вызывают один и тот же обработчик'
        ],
        correctAnswerIndex: 0,
        explanation: 'При провале ReadinessProbe под считается не готовым принимать трафик и удаляется из балансировки Service. При провале LivenessProbe Kubelet убивает контейнер и запускает заново.'
      },
      {
        id: 'q-k8s-3',
        category: 'k8s',
        question: 'Какой тип Kubernetes Service создает внешний облачный балансировщик нагрузки (Cloud Load Balancer)?',
        options: [
          'NodePort',
          'ClusterIP',
          'LoadBalancer',
          'ExternalName'
        ],
        correctAnswerIndex: 2,
        explanation: 'Тип `LoadBalancer` автоматически запрашивает у облачного провайдера (AWS ELB, GCP Cloud Load Balancer, Yandex Cloud NLB) выделение внешнего IP-адреса и настраивает маршрутизацию.'
      }
    ]
  },

  {
    id: 'quiz-linux-networking',
    title: 'Linux Internals & Networks Quiz',
    category: 'linux',
    difficulty: 'Middle',
    description: 'Системные вызовы, сети, утилиты диагностики и сетевой стек Linux.',
    timeLimitMinutes: 12,
    questions: [
      {
        id: 'q6',
        category: 'linux',
        question: 'Какая команда покажет открытые сетевые порты и процессы, удерживающие их в Linux?',
        options: [
          'ip addr show',
          'ss -tulpn',
          'cat /etc/resolv.conf',
          'sysctl -a'
        ],
        correctAnswerIndex: 1,
        explanation: 'Команда ss -tulpn (или lsof -i -P -n) выводит таблицу TCP/UDP сокетов, их состояния и PID с именами процессов.'
      },
      {
        id: 'q7',
        category: 'networking',
        question: 'Что произойдет с TCP соединением во время вызова трехстороннего рукопожатия (3-way handshake)?',
        options: [
          'SYN -> SYN-ACK -> ACK',
          'ACK -> SYN -> FIN',
          'CONNECT -> ACCEPT -> READY',
          'HELLO -> WELCOME -> OK'
        ],
        correctAnswerIndex: 0,
        explanation: 'Установление TCP-связи проходит по протоколу: 1) Клиент отправляет SYN, 2) Сервер отвечает SYN-ACK, 3) Клиент отправляет ACK. После этого соединение переходит в состояние ESTABLISHED.'
      },
      {
        id: 'q8',
        category: 'linux',
        question: 'Что обозначает статус процесса "Z" (Zombie) в выводе команды ps aux?',
        options: [
          'Процесс принудительно заморожен в гибернацию',
          'Процесс заблокирован в ожидании ввода-вывода диска',
          'Процесс завершил выполнение, но его родительский процесс еще не прочитал код завершения через sys_wait',
          'Процесс превысил лимит по оперативной памяти'
        ],
        correctAnswerIndex: 2,
        explanation: 'Процесс-зомби уже освободил свою память и ресурсы, но сохраняет запись в таблице процессов ядра до тех пор, пока родительский процесс не вызовет wait() / waitpid().'
      },
      {
        id: 'q9',
        category: 'networking',
        question: 'Чем отличается TCP от UDP?',
        options: [
          'TCP является протоколом без установления соединения, а UDP обеспечивает гарантию доставки',
          'TCP обеспечивает надежную доставку с подтверждением (ACK) и контролем потока, а UDP — быстрый протокол без гарантированной доставки и установления соединения',
          'UDP работает на прикладном уровне (L7), а TCP на канальном (L2)',
          'TCP используется только в локальных сетях, а UDP только в интернете'
        ],
        correctAnswerIndex: 1,
        explanation: 'TCP (Transmission Control Protocol) ориентирован на надежную доставку данных в нужном порядке с подтверждениями и повторными отправками. UDP не гарантирует порядок или доставку, но имеет минимальные накладные расходы (идеален для стриминга и DNS).'
      }
    ]
  },

  {
    id: 'quiz-cicd-terraform',
    title: 'CI/CD & Infrastructure as Code (Terraform)',
    category: 'terraform',
    difficulty: 'Middle',
    description: 'Тест по автоматизации деплоев, управлению стейтом Terraform и оптимизации пайплайнов.',
    timeLimitMinutes: 10,
    questions: [
      {
        id: 'q10',
        category: 'terraform',
        question: 'Зачем нужен файл блокировки стейта (State Lock) в Terraform?',
        options: [
          'Чтобы скрыть пароли и токены от разработчиков',
          'Чтобы предотвратить одновременный запуск terraform apply от нескольких инженеров и порчу state файла',
          'Чтобы ускорить скачивание провайдеров из registry',
          'Чтобы заблокировать изменение кодовой базы в Git'
        ],
        correctAnswerIndex: 1,
        explanation: 'State Locking (например, через DynamoDB для S3 backend или Consul) защищает файл состояния от параллельной записи двумя пайплайнами одновременно, избегая Race Condition и повреждений.'
      },
      {
        id: 'q11',
        category: 'cicd',
        question: 'Что такое Дрейф Инфраструктуры (Infrastructure Drift)?',
        options: [
          'Автоматический перенос ресурсов в другой датацентр при аварии',
          'Расхождение между текущим реальным состоянием ресурсов в облаке и описанием в коде (IaC)',
          'Постепенное угасание активности в репозитории проекта',
          'Замена образа ОС на сервере без согласия администратора'
        ],
        correctAnswerIndex: 1,
        explanation: 'Drift возникает, когда кто-то руками меняет конфигурацию ресурса в веб-консоли AWS/GCP или с помощью сторонних скриптов в обход Terraform/Ansible.'
      },
      {
        id: 'q12',
        category: 'cicd',
        question: 'В чем различие между стратегиями деплоя Blue-Green и Canary?',
        options: [
          'Blue-Green держит две одинаковые идентичные среды и переключает 100% трафика, Canary постепенно перенаправляет небольшой процент трафика (1-5%) на новую версию',
          'Canary используется только для баз данных, а Blue-Green для фронтенда',
          'Blue-Green требует полного отключения серверов (Downtime), а Canary только ночью',
          'Различий нет, это синонимы'
        ],
        correctAnswerIndex: 0,
        explanation: 'При Blue-Green разворачивается полноценный новый стенд Green и трафик мгновенно переключается. При Canary новая версия выкатывается на маленькую группу пользователей для валидации метрик ошибок.'
      }
    ]
  },

  {
    id: 'quiz-databases-devops',
    title: 'Базы данных для DevOps: PostgreSQL & Redis',
    category: 'cloud',
    difficulty: 'Middle',
    description: 'Репликация, бэкапы WAL-g, Connection Pooling (PgBouncer), асинхронные очереди и кэширование.',
    timeLimitMinutes: 10,
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
      }
    ]
  },

  {
    id: 'quiz-monitoring-ansible',
    title: 'Monitoring, Observability & Ansible',
    category: 'monitoring',
    difficulty: 'Senior',
    description: 'Сбор метрик Prometheus, PromQL запросы, Grafana, Ansible Playbooks и роли.',
    timeLimitMinutes: 15,
    questions: [
      {
        id: 'q13',
        category: 'monitoring',
        question: 'Чем отличается тип метрики Counter от Gauge в Prometheus?',
        options: [
          'Counter только растет (или сбрасывается в 0 при перезапуске), а Gauge может увеличиваться и уменьшаться',
          'Gauge сохраняет текстовые логи, а Counter только числа',
          'Counter используется для измерений температуры CPU, а Gauge для количества запросов',
          'Прометеус не поддерживает тип Gauge'
        ],
        correctAnswerIndex: 0,
        explanation: 'Counter отражает монотонно возрастающее число (например, всего обработано HTTP запросов http_requests_total), для которого применяют функцию rate(). Gauge — произвольное текущее значение (занятая RAM, число потоков).'
      },
      {
        id: 'q14',
        category: 'ansible',
        question: 'Что такое Идемпотентность (Idempotency) в Ansible?',
        options: [
          'Автоматическое шифрование конфигов с помощью Vault',
          'Способность выполнять плейбук повторно неограниченное количество раз с получением одного и того же целевого состояния без лишних изменений',
          'Параллельное выполнение задач на 1000 серверах',
          'Удаление старых логов после деплоя'
        ],
        correctAnswerIndex: 1,
        explanation: 'Идемпотентный модуль проверяет текущее состояние целевой системы: если нужный файл или пакет уже установлены и соответствуют эталону, модуль не совершает повторных действий и возвращает ok (changed: false).'
      },
      {
        id: 'q15',
        category: 'ansible',
        question: 'Когда вызывается Handler в Ansible Playbook?',
        options: [
          'В самом начале прогона перед gathering facts',
          'В конце плейбука (или при вызове flush_handlers), если таск уведомил его через notify и был в статусе changed',
          'Каждые 5 минут по таймеру',
          'Только при наличии ошибок в скриптах'
        ],
        correctAnswerIndex: 1,
        explanation: 'Handler срабатывает один раз в конце секции или всей игры, только если хотя бы один из тасков, содержащих notify: handler_name, привел к реальным изменениям (changed).'
      }
    ]
  },

  {
    id: 'quiz-cloud-devsecops',
    title: 'Cloud Security & DevSecOps Practice',
    category: 'cloud',
    difficulty: 'Senior',
    description: 'Управление секретами (HashiCorp Vault), сканирование уязвимостей (Trivy), IAM роли и принцип Least Privilege.',
    timeLimitMinutes: 15,
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
      }
    ]
  },

  {
    id: 'quiz-senior-hardcore',
    title: 'Комплексный Senior DevOps Хардкор Тест',
    category: 'all',
    difficulty: 'Senior',
    description: '15 вопросов по всем направлениям: System Design, K8s Internals, Kernel Tuning, BGP, Security & Observability.',
    timeLimitMinutes: 20,
    questions: [
      {
        id: 'qh1',
        category: 'linux',
        question: 'Что за параметр ядра Linux net.ipv4.tcp_tw_reuse и когда его безопасно включать?',
        options: [
          'Он отключает брандмауэр iptables для ускорения роутинга',
          'Он позволяет повторно использовать сокеты в состоянии TIME_WAIT для новых исходящих TCP подключений',
          'Он увеличивает размер максимального пакета MTU до 9000',
          'Его нельзя использовать ни при каких условиях'
        ],
        correctAnswerIndex: 1,
        explanation: 'tcp_tw_reuse позволяет ядру безопасно задействовать TIME_WAIT сокеты для исходящих (outgoing) соединений, если временная метка пакета строго новее предыдущей. Это предотвращает исчерпание ephemeral ports под высокой нагрузкой.'
      },
      {
        id: 'qh2',
        category: 'k8s',
        question: 'Какой системный компонент Kubernetes отвечает за запуск контейнеров и проверку Liveness/Readiness проб на ноде?',
        options: [
          'kube-scheduler',
          'kube-controller-manager',
          'kubelet',
          'etcd'
        ],
        correctAnswerIndex: 2,
        explanation: 'Kubelet — это агент, работающий непосредственно на каждой ноде. Он взаимодействует с Container Runtime (CRI), проверяет Health check пробы и отправляет статусы подов в API Server.'
      },
      {
        id: 'qh3',
        category: 'sysdesign',
        question: 'Что утверждает теорема CAP в распределенных системах?',
        options: [
          'Распределенная система может одновременно обеспечить только 2 из 3 свойств: Согласованность (Consistency), Доступность (Availability) и Устойчивость к разделению (Partition Tolerance)',
          'Любая система может обрабатывать бесконечный трафик при наличии авто-масштабирования',
          'Скорость передачи данных ограничена скоростью света в оптическом кабеле',
          'Шифрование SSL добавляет 50% задержки к сетевым запросам'
        ],
        correctAnswerIndex: 0,
        explanation: 'При возникновении сетевого разрыва (Partition Tolerance) распределенная система вынуждена выбирать между отказом в обслуживании (сохраняя Consistency) либо выдачей ответов из разных партиций (сохраняя Availability, но теряя Consistency).'
      },
      {
        id: 'qh4',
        category: 'networking',
        question: 'Что такое BGP Anycast и как он используется в DNS и CDN сервисах?',
        options: [
          'Метод защиты от спама в почтовых серверах',
          'Маршрутизация, при которой один и тот же IP-адрес анонсируется из разных географических локаций по протоколу BGP, а клиент автоматически направляется к ближайшему узлу',
          'Протокол динамического выделения IP внутри подсетей Kubernetes',
          'Технология сжатия видеопотока'
        ],
        correctAnswerIndex: 1,
        explanation: 'Anycast анонсирует один префикс через BGP от множества независимых Edge серверов. Сетевые провайдеры отправляют трафик по кратчайшему пути (AS-Path / IGP cost) к ближайшему датацентру.'
      }
    ]
  }
];
