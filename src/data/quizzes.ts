import { Quiz } from '../types';

export const QUIZZES: Quiz[] = [
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
          'CrashLoopBackOff со статусом OOMKilled в причинах',
          'Evicted',
          'Completed',
          'NodeLost'
        ],
        correctAnswerIndex: 0,
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
          'ss -tulpn',
          'ip addr show',
          'cat /etc/resolv.conf',
          'sysctl -a'
        ],
        correctAnswerIndex: 0,
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
          'Процесс завершил выполнение, но его родительский процесс еще не прочитал код завершения через sys_wait',
          'Процесс заблокирован в ожидании ввода-вывода диска',
          'Процесс превысил лимит по оперативной памяти'
        ],
        correctAnswerIndex: 1,
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
          'Чтобы предотвратить одновременное запуск terraform apply от нескольких инженеров и порчу state файла',
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
        question: 'Чем отличатся тип метрики Counter от Gauge в Prometheus?',
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
          'Способность выполнять плейбук повторно неограниченное количество раз с получением одного и того же целевого состояния без лишних изменений',
          'Автоматическое шифрование конфигов с помощью Vault',
          'Параллельное выполнение задач на 1000 серверах',
          'Удаление старых логов после деплоя'
        ],
        correctAnswerIndex: 0,
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
          'Он позволяет повторно использовать сокеты в состоянии TIME_WAIT для новых исходящих TCP подключений',
          'Он отключает брандмауэр iptables для ускорения роутинга',
          'Он увеличивает размер максимального пакета MTU до 9000',
          'Его нельзя использовать ни при каких условиях'
        ],
        correctAnswerIndex: 0,
        explanation: 'tcp_tw_reuse позволяет ядру безопасно задействовать TIME_WAIT сокеты для исходящих (outgoing) соединений, если временная метка пакета строго новее предыдущей. Это предотвращает исчерпание ephemeral ports под высокой нагрузкой.'
      },
      {
        id: 'qh2',
        category: 'k8s',
        question: 'Какой системный компонент Kubernetes отвечает за запуск контейнеров и проверку Liveness/Readiness проб на ноде?',
        options: [
          'kube-scheduler',
          'kubelet',
          'kube-controller-manager',
          'etcd'
        ],
        correctAnswerIndex: 1,
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
          'Маршрутизация, при которой один и тот же IP-адрес анонсируется из разных географических локаций по протоколу BGP, а клиент автоматически направляется к ближайшему узлу',
          'Метод защиты от спама в почтовых серверах',
          'Протокол динамического выделения IP внутри подсетей Kubernetes',
          'Технология сжатия видеопотока'
        ],
        correctAnswerIndex: 0,
        explanation: 'Anycast анонсирует один префикс через BGP от множества независимых Edge серверов. Сетевые провайдеры отправляют трафик по кратчайшему пути (AS-Path / IGP cost) к ближайшему датацентру.'
      }
    ]
  }
];
