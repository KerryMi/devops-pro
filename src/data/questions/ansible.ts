import { Question } from '../../types';

export const ANSIBLE_QUESTIONS: Question[] = [
  {
    id: 'ansible-1',
    title: 'Что такое Идемпотентность (Idempotency) в Ansible и почему она принципиальна?',
    category: 'ansible',
    difficulty: 'Junior',
    summaryAnswer: 'Идемпотентность — свойство таски при повторных запусках приводить систему к целевому состоянию без повторных изменений, если состояние уже достигнуто.',
    fullAnswer: `Если запустить Ansible Playbook 1 раз или 100 раз подряд на одном и том же сервере, результат будет идентичным (состояние \`OK\` вместо \`CHANGED\`).

**Зачем нужна идемпотентность**:
1. Безопасность повторных запусков в CI/CD.
2. Предотвращение случайного перезапуска работающих сервисов или повреждения конфигов.
3. Модули Ansible (file, yum, systemd, template) изначально спроектированы идемпотентными.

*Одинственный неидемпотентный модуль*: Модуль \`command\` / \`shell\` — запуск произвольного bash-скрипта всегда возвращает статус \`CHANGED\`, если не указаны параметры \`creates\` или \`changed_when\`.`,
    codeSnippet: {
      language: 'yaml',
      code: `# Идемпотентная установка и включение Nginx
- name: Ensure nginx is installed
  ansible.builtin.apt:
    name: nginx
    state: present

- name: Ensure nginx service is running
  ansible.builtin.systemd:
    name: nginx
    state: started
    enabled: true`
    },
    interviewTips: [
      'Упомяните параметр changed_when для предотвращения неидемпотентности в shell модулях.'
    ],
    commonPitfalls: [
      'Писать все плейбуки через shell/command модули вместо специализированных apt/copy/template.'
    ],
    tags: ['Ansible', 'Idempotency', 'IaC', 'Automation']
  },
  {
    id: 'ansible-2',
    title: 'Архитектура Ansible: Agentless подход, SSH и инвентарь (Inventory Files)',
    category: 'ansible',
    difficulty: 'Junior',
    summaryAnswer: 'Ansible не требует установки агентов на целевых серверах (Agentless). Управление происходит по протоколу SSH (для Linux) или WinRM (для Windows).',
    fullAnswer: `1. **Agentless (Без агентов)**:
   - В отличие от Puppet или Chef, на управляемые узлы не нужно ставить никакого фонового демона.
   - Единственное требование к целевой ноде — наличие Python и SSH.

2. **Инвентарь (Inventory)**:
   - Файл (INI или YAML), описывающий список серверов и их группировку (web, db, k8s_cluster).
   - Поддерживает **Dynamic Inventory** для автоматического получения списка серверов из API AWS/Yandex Cloud/Kubernetes.`,
    codeSnippet: {
      language: 'ini',
      code: `# Inventory file (hosts.ini)
[webservers]
web1.company.com ansible_host=10.0.0.1
web2.company.com ansible_host=10.0.0.2

[dbservers]
db1.company.com ansible_host=10.0.0.5

[prod:children]
webservers
dbservers`
    },
    interviewTips: [
      'Подчеркните экономию системных ресурсов благодаря отсутствию фонового агента.'
    ],
    commonPitfalls: [
      'Забывать прописать ssh_authorized_keys перед первым запуском Ansible.'
    ],
    tags: ['Ansible', 'Agentless', 'Inventory', 'SSH']
  },
  {
    id: 'ansible-3',
    title: 'В чем разница между Playbook, Play, Task, Module и Role в Ansible?',
    category: 'ansible',
    difficulty: 'Junior',
    summaryAnswer: 'Playbook — YAML документ. Play — связывает группы хостов с задачами. Task — вызов модуля. Module — скомпилированный питон-код. Role — структурная упаковка.',
    fullAnswer: `Иерархия объектов Ansible:

1. **Playbook**: Верхнеуровневый YAML файл, содержащий список Plays.
2. **Play**: Задает target-группу хостов (hosts: webservers) и перечень задач для них.
3. **Task**: Единичная команда, вызывающая конкретный модуль с аргументами.
4. **Module**: Маленькая программа (на Python), отправляемая по SSH на целевой сервер для выполнения действия.
5. **Role**: Стандартизированная структура каталогов (tasks/, handlers/, templates/, vars/, defaults/) для повторного использования логики.`,
    codeSnippet: {
      language: 'yaml',
      code: `- name: Configure Webservers # Play
  hosts: webservers
  roles:
    - role: nginx_role # Role`
    },
    interviewTips: [
      'Назовите репозиторий Ansible Galaxy как источник готовых комьюнити ролей.'
    ],
    commonPitfalls: [
      'Сваливать тысячи строк задач в один сплошной playbook.yml без разбиения на роли.'
    ],
    tags: ['Ansible', 'Playbook', 'Roles', 'Structure']
  },
  {
    id: 'ansible-4',
    title: 'Что такое Handlers (Обработчики) и чем они отличаются от обычных Tasks?',
    category: 'ansible',
    difficulty: 'Middle',
    summaryAnswer: 'Handlers — особые таски, которые вызываются через notify и исполняются ОДИН раз в самом конце Playbook, если хотя бы одна таска вернула статус CHANGED.',
    fullAnswer: `Зачем нужны Handlers:
Представьте, что 5 разных задач обновляют разные файлы конфигураций Nginx (nginx.conf, ssl.conf, vhost.conf). Без handlers пришлось бы делать restart nginx после каждого файла.

**С Handlers**:
1. Каждая таска при изменении файла вызывает \`notify: reload nginx\`.
2. Ansible запоминает это событие.
3. Перезапуск службы Nginx произойдет СТРОГО ЕДИНОЖДЫ в самом конце плейбука, сберегая аптайм сервиса!`,
    codeSnippet: {
      language: 'yaml',
      code: 'tasks:\n  - name: Copy nginx config\n    ansible.builtin.copy:\n      src: nginx.conf\n      dest: /etc/nginx/nginx.conf\n    notify: Reload Nginx\n\nhandlers:\n  - name: Reload Nginx\n    ansible.builtin.service:\n      name: nginx\n      state: reloaded'
    },
    interviewTips: [
      'Отметьте, что если предыдущие таски упали с ошибкой, Handlers по умолчанию НЕ выполняются (пока не указано \`flush_handlers\` или \`force_handlers: true\`).'
    ],
    commonPitfalls: [
      'Ждать от Handlers моментального исполнения посередине плейбука.'
    ],
    tags: ['Ansible', 'Handlers', 'Notify', 'Automation']
  },
  {
    id: 'ansible-5',
    title: 'Как устроено шаблонизирование Jinja2 и работа с переменными (Variables & Facts)?',
    category: 'ansible',
    difficulty: 'Middle',
    summaryAnswer: 'Jinja2 позволяет генерировать динамические конфиги на основе переменных и Facts (автосбор информации о хосте через setup module).',
    fullAnswer: `1. **Ansible Facts**:
   - Автоматический сбор параметров сервера при старте плейбука (модуль setup).
   - Включает IP-адреса (\`ansible_default_ipv4.address\`), объем RAM, количество ядер CPU, диски.

2. **Jinja2 Шаблоны (.j2)**:
   - Использование переменных {{ ansible_hostname }}, циклов {% for %}, условий {% if %}.
   - Фильтры Jinja2 (\`{{ my_var | default('8080') }}\`, \`{{ my_list | to_nice_json }}\`).`,
    codeSnippet: {
      language: 'jinja2',
      code: `# Шаблон nginx.conf.j2
server {
    listen {{ http_port | default(80) }};
    server_name {{ ansible_fqdn }};
    worker_processes {{ ansible_processor_vcpus }};
}`
    },
    interviewTips: [
      'Упомяните отключение сбора фактов \`gather_facts: false\` для ускорения работы с сотнями ВМ.'
    ],
    commonPitfalls: [
      'Использовать хардкод значений вместо Jinja2 переменных.'
    ],
    tags: ['Ansible', 'Jinja2', 'Facts', 'Variables', 'Templates']
  },
  {
    id: 'ansible-6',
    title: 'Как безопасно шифровать секреты в Ansible (Ansible Vault)?',
    category: 'ansible',
    difficulty: 'Junior',
    summaryAnswer: 'Ansible Vault позволяет зашифровать пароли и API ключи в YAML файлах (AES-256) и безопасно хранить их в Git.',
    fullAnswer: `Проблема: Пароли к БД и SSH ключи нельзя коммитить в Git в открытом виде.

**Как работает Ansible Vault**:
1. Команда \`ansible-vault encrypt vars/vault.yml\` запрашивает секретный мастер-пароль.
2. Содержимое файла шифруется алгоритмом AES-256.
3. Зашифрованный файл коммитится в Git.
4. При запуске плейбука передается флаг \`--ask-vault-pass\` или ссылка на файл с паролем \`--vault-password-file .vault_pass\`.`,
    codeSnippet: {
      language: 'bash',
      code: `ansible-vault create vars/vault.yml # Создать зашифрованный файл
ansible-playbook site.yml --vault-password-file ~/.vault_pass`
    },
    interviewTips: [
      'Упомяните редактирование зашифрованного файла на лету командой \`ansible-vault edit vars/vault.yml\`.'
    ],
    commonPitfalls: [
      'Забыть добавить файл с мастер-паролем .vault_pass в .gitignore.'
    ],
    tags: ['Ansible', 'AnsibleVault', 'Security', 'Encryption']
  },
  {
    id: 'ansible-7',
    title: 'Порядок приоритета переменных в Ansible (Variable Precedence)',
    category: 'ansible',
    difficulty: 'Senior',
    summaryAnswer: 'Ansible имеет 22 уровня приоритета переменных! Включает: extra vars (-e) > role params > host_vars > group_vars > role defaults.',
    fullAnswer: `Приоритеты переменных (от самого наивысшего к наинизшему):

1. **Extra vars (\`-e "key=val"\`)** — Абсолютный приоритет, переопределяет всё!
2. **Task vars** (vars под конкретной таской).
3. **Block / Play vars**.
4. **Host facts** (собранные факты о системе).
5. **host_vars** (файлы переменных конкретного хоста).
6. **group_vars** (файлы переменных группы).
7. **Role defaults (defaults/main.yml)** — Самый НИЗКИЙ приоритет (удобный дефолт для переопределения).`,
    codeSnippet: {
      language: 'bash',
      code: `ansible-playbook site.yml -e "http_port=8080" # Самый высокий приоритет`
    },
    interviewTips: [
      'Назовите \`role defaults\` идеальным местом для дефолтных значений и \`extra vars\` для переопределения из CI.'
    ],
    commonPitfalls: [
      'Путать приоритеты role defaults и role vars.'
    ],
    tags: ['Ansible', 'Variables', 'Precedence', 'Architecture']
  },
  {
    id: 'ansible-8',
    title: 'Что такое Ansible Strategy (linear vs free vs mitogen) и распараллеливание (forks)?',
    category: 'ansible',
    difficulty: 'Middle',
    summaryAnswer: 'Параметр forks определяет количество параллельных SSH соединений (дефолт 5). Стратегии: linear (пошаговая синхронизация), free (без ожидания отстающих).',
    fullAnswer: `1. **Forks (Параллелизм)**:
   - Настройка \`forks = 30\` в ansible.cfg указывает исполнять плейбук одновременно на 30 серверах (вместо дефолтных 5).

2. **Linear Strategy (Дефолт)**:
   - Ansible выполняет Таску 1 на ВСЕХ серверах, ждет их завершения, и только потом переходит к Таске 2.

3. **Free Strategy**:
   - Каждый сервер исполняет таски плейбука с максимально возможной для него скоростью, не дожидаясь остальных серверов.

4. **Mitogen for Ansible**:
   - Плагин на Python, замещающий стандартный перегруженный процесс вызовов SSH на быстрый бинарный протокол multiplexing. Ускоряет Ansible в 3-7 раз!`,
    codeSnippet: {
      language: 'ini',
      code: `# ansible.cfg
[defaults]
forks = 50
strategy = free`
    },
    interviewTips: [
      'Упомяните Mitogen как эффективный способ ускорить старые медленные плейбуки.'
    ],
    commonPitfalls: [
      'Запускать роллаут на 1000 серверов с дефолтным значением forks = 5.'
    ],
    tags: ['Ansible', 'Performance', 'Forks', 'Mitogen', 'Optimization']
  },
  {
    id: 'ansible-9',
    title: 'Управление ошибками в Ansible: ignore_errors, failed_when, changed_when и blocks (block/rescue/always)',
    category: 'ansible',
    difficulty: 'Middle',
    summaryAnswer: 'Позволяет перехватывать ошибки. block объявляет таски, rescue срабатывает при аварии (аналог try/catch), always выполняется всегда (finally).',
    fullAnswer: `1. **ignore_errors: true**: Игнорирует код возврата != 0 и продолжает выполнение.
2. **failed_when**: Кастомное условие фейла (например, если в выводе stdout есть "Fatal error").
3. **changed_when: false**: Запрещает таске помечать статус CHANGED (например при выполнении проверочных скриптов).
4. **Конструкция Block / Rescue / Always**:
   - **block**: Выполняет главные задачи.
   - **rescue**: Запускается ТОЛЬКО при падении задач из блока block (rollback логика).
   - **always**: Запускается ВСЕГДА (очистка временных файлов, закрытие соединений).`,
    codeSnippet: {
      language: 'yaml',
      code: `- name: Try-Catch Block
  block:
    - name: Run dangerous action
      ansible.builtin.shell: /tmp/deploy.sh
  rescue:
    - name: Rollback on error
      ansible.builtin.shell: /tmp/rollback.sh
  always:
    - name: Cleanup temp files
      ansible.builtin.file:
        path: /tmp/deploy.sh
        state: absent`
    },
    interviewTips: [
      'Сравните block/rescue/always с блоком try/catch/finally в языках программирования.'
    ],
    commonPitfalls: [
      'Злоупотреблять ignore_errors вместо правильной обработки кодов возврата.'
    ],
    tags: ['Ansible', 'ErrorHandling', 'Block', 'Rescue', 'TryCatch']
  },
  {
    id: 'ansible-10',
    title: 'Как организовать тестирование Ansible кода с помощью Molecule и Testinfra?',
    category: 'ansible',
    difficulty: 'Senior',
    summaryAnswer: 'Molecule — фреймворк тестирования Ansible ролей. Поднимает изолированные контейнеры Docker, применяет роль, проверяет идемпотентность и запускает тесты Testinfra.',
    fullAnswer: `Этапы проверки роли в Molecule (\`molecule test\`):

1. **Lint**: Проверка синтаксиса и стиля (ansible-lint, yamllint).
2. **Create**: Подъем тестовых Docker-контейнеров или ВМ (Driver Docker/Delegated).
3. **Converge**: Выполнение исследуемой Ansible роли на созданном контейнере.
4. **Idempotence**: ВТОРИЧНЫЙ запуск роли. Если роли оставила статусы \`changed > 0\`, тест фейлится (нарушена идемпотентность!).
5. **Verify**: Запуск Python тестов (Testinfra / Goss) для проверки портов, файлов, пользователей.
6. **Destroy**: Уничтожение тестового контейнера.`,
    codeSnippet: {
      language: 'yaml',
      code: `# molecule/default/molecule.yml
driver:
  name: docker
platforms:
  - name: instance
    image: geerlingguy/docker-ubuntu2204-ansible:latest`
    },
    interviewTips: [
      'Назовите имя Jeff Geerling (Geerlingguy) как главного популяризатора Ansible и автора отличных Docker-образов для Molecule.'
    ],
    commonPitfalls: [
      'Тестировать Ansible роли на живых дев-серверах вместо чистых Docker-контейнеров Molecule.'
    ],
    tags: ['Ansible', 'Molecule', 'Testing', 'Testinfra', 'CI']
  },
  {
    id: 'ansible-11',
    title: 'Что такое AWX / Red Hat Ansible Automation Platform (AAP) и их задачи?',
    category: 'ansible',
    difficulty: 'Middle',
    summaryAnswer: 'AWX — open-source веб-интерфейс и REST API для управления Ansible. Предоставляет RBAC права, планировщик задач, логирование запусков и аудит.',
    fullAnswer: `Зачем нужен AWX / AAP компании:

1. **UI и REST API**: Запуск плейбуков по кнопке в веб-интерфейсе или вызовом через Webhook из GitLab CI.
2. **Централизованный аудит**: Сохранение подробных логов вывода каждого запуска.
3. **RBAC и секреты**: Защита Vault-паролей. Разработчик может нажать кнопку "Deploy Staging" в AWX, не имея доступа к SSH-ключам и секретам прод-серверов.
4. **Инвентаризация и Крон**: Запуск сбора фактов и проверок по расписанию.`,
    codeSnippet: {
      language: 'bash',
      code: `# AWX разворачивается в Kubernetes кластере через AWX Operator`
    },
    interviewTips: [
      'Отметьте разницу: AWX — это open-source upstream проект для коммерческой Red Hat Ansible Automation Platform (AAP).'
    ],
    commonPitfalls: [
      'Давать всем инженерам прямой SSH доступ к серверам вместо вызова плейбуков через AWX.'
    ],
    tags: ['Ansible', 'AWX', 'AAP', 'Management', 'UI']
  },
  {
    id: 'ansible-12',
    title: 'Как оптимизировать вызовы SSH в Ansible (ControlMaster & ControlPersist)?',
    category: 'ansible',
    difficulty: 'Middle',
    summaryAnswer: 'ControlMaster переиспользует единое установленное SSH сокет-соединение для отправки множества команд, исключая задержки повторных TCP и SSH рукопожатий.',
    fullAnswer: `При выполнении плейбука с 50 задачами Ansible по умолчанию открывает и закрывает SSH подключение 50 раз подряд!
Накладные расходы на TCP Handshake + TLS/SSH Handshake съедают до 80% времени работы.

**Оптимизация в ssh_args (OpenSSH Multiplexing)**:
- **ControlMaster auto**: Автоматически создает мастер-сокет SSH при первом подключении.
- **ControlPersist 60m**: Удерживает сокет открытым в фоновом режиме в течение 60 минут после завершения таски.
- Все последующие таски отправляют команды мгновенно через созданный сокет!`,
    codeSnippet: {
      language: 'ini',
      code: `# ansible.cfg
[ssh_connection]
ssh_args = -o ControlMaster=auto -o ControlPersist=60m
pipelining = True`
    },
    interviewTips: [
      'Упомяните параметр pipelining = True, исполняющий Python скрипты в stdin без передачи временных файлов.'
    ],
    commonPitfalls: [
      'Забывать включить pipelining в ansible.cfg.'
    ],
    tags: ['Ansible', 'SSH', 'Performance', 'Optimization']
  },
  {
    id: 'ansible-13',
    title: 'Модули copy vs template vs synchronize: в чем разница и что когда использовать?',
    category: 'ansible',
    difficulty: 'Junior',
    summaryAnswer: 'copy пересылает готовый файл 1:1. template обрабатывает файл через рендеринг Jinja2. synchronize использует быстрый протокол rsync для больших каталогов.',
    fullAnswer: `1. **ansible.builtin.copy**:
   - Просто копирует статичный файл с локальной машины на удаленную 1 в 1.
   - Медленно работает на тысячах маленьких файлов.

2. **ansible.builtin.template**:
   - Пропускает файл через движок Jinja2, подставляя значения переменных.
   - Применяется для конфигов (nginx.conf, my.cnf).

3. **ansible.posix.synchronize**:
   - Обертка над утилитой **rsync**.
   - В десятки раз быстрее передает большие директории, синхронизирует delta-изменения и бинарные файлы.`,
    codeSnippet: {
      language: 'yaml',
      code: `- name: Fast sync build directory
  ansible.posix.synchronize:
    src: dist/
    dest: /var/www/html/`
    },
    interviewTips: [
      'Для передачи тяжелых папок всегда выбирайте synchronize (rsync).'
    ],
    commonPitfalls: [
      'Пытаться копировать папки гигабайтного размера через обычный модуль copy.'
    ],
    tags: ['Ansible', 'Modules', 'Copy', 'Template', 'Rsync']
  },
  {
    id: 'ansible-14',
    title: 'Как устроена декларативная сборка Kubernetes кластеров через Kubepray (Ansible)?',
    category: 'ansible',
    difficulty: 'Middle',
    summaryAnswer: 'Kubespray — набор Ansible ролей для разворачивания промышленного production-ready Kubernetes кластера (Kubeadm, CNI, Containerd, HA Control Plane).',
    fullAnswer: `Что делает Kubespray под капотом:
1. Настраивает OS Linux (sysctl, swapoff, загрузка модулей ядра br_netfilter).
2. Устанавливает Container Runtime (containerd / crio).
3. Генерирует PKI сертификаты через kubeadm.
4. Разворачивает HA etcd кластер.
5. Настраивает Control Plane (kube-apiserver, controller-manager, scheduler).
6. Устанавливает CNI (Calico/Cilium) и CoreDNS.

*Плюс Kubespray*: Абсолютная гибкость, декларативное описание инфраструктуры кластера в Git (GitOps for K8s cluster).`,
    codeSnippet: {
      language: 'bash',
      code: `ansible-playbook -i inventory/mycluster/hosts.yaml cluster.yml # Запуск установки Kubernetes`
    },
    interviewTips: [
      'Упомяните отключение SWAP (swapoff -a) как обязательный шаг установки K8s.'
    ],
    commonPitfalls: [
      'Запускать обновление версии Kubespray без предварительного чтения RELEASE NOTES.'
    ],
    tags: ['Ansible', 'Kubernetes', 'Kubespray', 'Cluster', 'Deployment']
  }
];
