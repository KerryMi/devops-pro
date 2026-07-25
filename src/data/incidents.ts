import { IncidentScenario } from '../types';

export const INCIDENT_SCENARIOS: IncidentScenario[] = [
  {
    id: 'inc-1',
    title: 'Авария #101: Pod в статусе CrashLoopBackOff после деплоя приложения',
    category: 'k8s',
    difficulty: 'Middle',
    symptoms: [
      'Пользователи жалуются на ошибки 502 Bad Gateway при входе на сервис payments-api.',
      'Kubernetes под payments-api-6d8b9f484-x9kz2 непрерывно перезапускается (CrashLoopBackOff).'
    ],
    initialLogs: `2026-07-25T07:12:01.102Z [INFO] Starting Payments Microservice v2.4.1...
2026-07-25T07:12:01.405Z [FATAL] Failed to connect to database at postgres.prod-db.svc:5432
2026-07-25T07:12:01.406Z [FATAL] panic: dial tcp 10.96.120.45:5432: i/o timeout
goroutine 1 [running]:
main.main()
        /app/main.go:42 +0x125`,
    diagnosticSteps: [
      {
        command: 'kubectl describe pod payments-api-6d8b9f484-x9kz2 -n prod',
        output: `Events:
  Type     Reason     Age                  From               Message
  ----     ------     ----                 ----               -------
  Normal   Scheduled  3m                   default-scheduler  Successfully assigned prod/payments-api to node-02
  Normal   Pulled     2m (x3 over 3m)      kubelet            Container image "registry.company.com/payments:v2.4.1" already present
  Warning  BackOff    12s (x12 over 2m)    kubelet            Back-off restarting failed container`,
        hint: 'Обратите внимание на события и сетевые политики безопасности namespace.'
      },
      {
        command: 'kubectl get NetworkPolicy -n prod',
        output: `NAME                     POD-SELECTOR        AGE
deny-all-ingress         <none>              14d
allow-db-from-backend    app=backend-api     2d`,
        hint: 'Проверьте сетевую политику! Название приложения изменилось с backend-api на payments-api!'
      }
    ],
    fixOptions: [
      {
        id: 'fix-1',
        text: 'Увеличить лимиты памяти (Memory Limit) в спецификации Deployment',
        isCorrect: false,
        feedback: 'Неверно. Приложение падает не из-за нехватки памяти (OOMKilled), а из-за таймаута сетевого подключения к БД.'
      },
      {
        id: 'fix-2',
        text: 'Обновить NetworkPolicy allow-db-from-backend, добавив селектор подов app=payments-api',
        isCorrect: true,
        feedback: 'Совершенно верно! После переименования сервиса NetworkPolicy заблокировала трафик от payments-api к PostgreSQL.'
      },
      {
        id: 'fix-3',
        text: 'Удалить под и перезапустить kubelet на ноде node-02',
        isCorrect: false,
        feedback: 'Неверно. Проблема в логике сетевых правил (NetworkPolicy), а не в агенте ноды.'
      }
    ],
    rootCause: 'При релизе v2.4.1 сервиса был изменен label пода на app=payments-api, но существовавшая NetworkPolicy допускала подключения к PostgreSQL только от подов с app=backend-api.',
    preventionTips: [
      'Внедрить automated валидацию сетевых политик в CI/CD.',
      'Использовать Helm шаблоны с единообразным распределением меток (standard labels).'
    ]
  },
  {
    id: 'inc-2',
    title: 'Авария #102: Диск на сервере забит на 100%, журналы Docker забили систему',
    category: 'linux',
    difficulty: 'Junior',
    symptoms: [
      'Алерты в Grafana: Free disk space on /var/lib/docker < 1%.',
      'Ни один новый контейнер не может быть запущен на ноде prod-node-01.'
    ],
    initialLogs: `df -h /var/lib/docker
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        100G  100G    0G 100% /var/lib/docker`,
    diagnosticSteps: [
      {
        command: 'du -sh /var/lib/docker/* | sort -hr | head -n 5',
        output: `88G     /var/lib/docker/containers
8G      /var/lib/docker/overlay2
4G      /var/lib/docker/volumes`,
        hint: 'Большую часть диска занимают файлы json-log контейнеров.'
      },
      {
        command: 'find /var/lib/docker/containers -name "*-json.log" -size +10G',
        output: `/var/lib/docker/containers/a1b2c3d4.../a1b2c3d4...-json.log: 82GB`,
        hint: 'Один из микросервисов писал отладочные логи с варнингами в stdout без ротации.'
      }
    ],
    fixOptions: [
      {
        id: 'fix-a',
        text: 'Безопасно обнулить файл лога: > /var/lib/docker/containers/...-json.log и настроить max-size/max-file в /etc/docker/daemon.json',
        isCorrect: true,
        feedback: 'Отлично! Перенаправление > освобождает место без удаления дескриптора файла, а daemon.json предотвратит проблему в будущем.'
      },
      {
        id: 'fix-b',
        text: 'Выполнить rm -rf /var/lib/docker/containers',
        isCorrect: false,
        feedback: 'Опасно! Удаление директории контейнеров сломает внутреннюю структуру метаданных Docker движка.'
      }
    ],
    rootCause: 'В /etc/docker/daemon.json отсутствовали лимиты логгирования (max-size и max-file), а приложение переключилось в DEBUG режим.',
    preventionTips: [
      'Настроить в daemon.json: "log-driver": "json-file", "log-opts": {"max-size": "50m", "max-file": "3"}.',
      'Использовать централизованное логирование (Loki / Fluentbit / Vector).'
    ]
  },
  {
    id: 'inc-3',
    title: 'Авария #103: HTTP 504 Gateway Timeout в Nginx из-за исчерпания пула PostgreSQL',
    category: 'sysdesign',
    difficulty: 'Senior',
    symptoms: [
      'Nginx шлет сотни ошибок HTTP 504 Gateway Timeout в минуту при пиковом трафике.',
      'Нагрузка на CPU базы данных в норме (15%), но все новые бэкенд запросы зависают на 30 секунд.'
    ],
    initialLogs: `2026-07-25 11:02:14 [error] 1402#0: *88201 upstream timed out (110: Connection timed out) while reading response header from upstream, client: 198.51.100.4, server: api.company.com, request: "GET /v1/user/profile HTTP/1.1", upstream: "http://10.244.1.12:8080/v1/user/profile"`,
    diagnosticSteps: [
      {
        command: 'kubectl logs -n prod -l app=api-backend --tail=20',
        output: `2026-07-25T11:02:10.012Z [WARN] DB Connection acquisition timeout (exceeded 10s pool limit). Active connections in pool: 100/100. Waiting callers: 450`,
        hint: 'Бэкенд исчерпал пул соединений с PostgreSQL и ждет освобождения сокета.'
      },
      {
        command: 'psql -h postgres.prod -U postgres -c "SELECT count(*), state FROM pg_stat_activity GROUP BY state;"',
        output: ` count |        state        
-------+---------------------
   100 | idle in transaction
     3 | active`,
        hint: '100 соединений висят в состоянии "idle in transaction"! Приложение забывает закрывать транзакции или не вызывает Commit/Rollback.'
      }
    ],
    fixOptions: [
      {
        id: 'fix-inc3-1',
        text: 'Увеличить max_connections в postgresql.conf до 5000 без изменений бэкенда',
        isCorrect: false,
        feedback: 'Неверно! Увеличение max_connections сожрет оперативный память PostgreSQL на стек каждого процесса и уронит саму БД (OOM).'
      },
      {
        id: 'fix-inc3-2',
        text: 'Внедрить PgBouncer в режиме transaction pooling и настроить idle_in_transaction_session_timeout в PostgreSQL',
        isCorrect: true,
        feedback: 'Превосходно! PgBouncer повторно использует TCP-соединения между клиентами, а timeout автопринудительно сбрасывает зависшие транзакции.'
      },
      {
        id: 'fix-inc3-3',
        text: 'Перезапустить Nginx сервис с помощью systemctl restart nginx',
        isCorrect: false,
        feedback: 'Неверно. Nginx функционирует исправно, проблема кроется в утечке соединений PostgreSQL на уровне Go/Node приложения.'
      }
    ],
    rootCause: 'В коде бэкенда был пропущен `defer tx.Rollback()` в обработчике ошибок, из-за чего соединения зависали в `idle in transaction`.',
    preventionTips: [
      'Установить idle_in_transaction_session_timeout = 10000ms в базе данных.',
      'Использовать linter (например, sqlclosecheck) в CI/CD pipeline.',
      'Всегда разворачивать PgBouncer перед production PostgreSQL.'
    ]
  },
  {
    id: 'inc-4',
    title: 'Авария #104: DNS Resolution Outage в Kubernetes кластере (CoreDNS Crash)',
    category: 'k8s',
    difficulty: 'Senior',
    symptoms: [
      'Все сервисы в кластере одновременно теряют связь с внешними API и соседними подами.',
      'Логи приложений забиты ошибкой `dial tcp: lookup api.stripe.com on 10.96.0.10:53: no such host`.'
    ],
    initialLogs: `kubectl get pods -n kube-system -l k8s-app=kube-dns
NAME                       READY   STATUS      RESTARTS   AGE
coredns-77c69d8f9d-8j4kz   0/1     OOMKilled   14         3d
coredns-77c69d8f9d-m9x2l   0/1     OOMKilled   12         3d`,
    diagnosticSteps: [
      {
        command: 'kubectl describe pod coredns-77c69d8f9d-8j4kz -n kube-system',
        output: `Limits:
  memory: 170Mi
Requests:
  memory: 70Mi
Last State: Terminated
  Reason: OOMKilled
  Exit Code: 137`,
        hint: 'CoreDNS уперся в лимит памяти 170Mi из-за высокой частоты шторма DNS запросов от приложений.'
      },
      {
        command: 'kubectl logs -n kube-system -l k8s-app=kube-dns --previous | tail -n 10',
        output: `[INFO] 10.244.2.15:52103 - 48102 "A IN app.prod.svc.cluster.local.prod.svc.cluster.local.svc.cluster.local." NXDOMAIN qr,rd,ra 240`,
        hint: 'Запросы штормят из-за стандартной ndots:5 настройки в /etc/resolv.conf подов, генерируя по 5 рекурсивных поиска на каждый резолв!'
      }
    ],
    fixOptions: [
      {
        id: 'fix-inc4-1',
        text: 'Включить NodeLocal DNSCache в кластере, поднять memory limits для CoreDNS и настроить Autoscale',
        isCorrect: true,
        feedback: 'Совершенно верно! NodeLocal DNSCache закеширует ответы прямо на уровнях нод и снизит нагрузку на центральные поды CoreDNS на 90%.'
      },
      {
        id: 'fix-inc4-2',
        text: 'Удалить секрет kube-dns-cert из пространства имен kube-system',
        isCorrect: false,
        feedback: 'Неверно. DNS в Kubernetes работает по протоколам UDP/TCP port 53 и не зависит от указанного сертификата.'
      }
    ],
    rootCause: 'Дефолтный лимит памяти CoreDNS (170Mi) был недостаточен при релизе 50 новых микросервисов с конфигурацией ndots:5 без локального кэша.',
    preventionTips: [
      'Включить NodeLocal DNSCache в Kubeespray / EKS / GKE.',
      'Внедрить coredns-autoscaler (cluster-proportional-autoscaler).',
      'В приложениях задавать dnsConfig с ndots:2 при частых внешних вызовах.'
    ]
  },
  {
    id: 'inc-5',
    title: 'Авария #105: Блокировка CI/CD пайплайнов из-за AWS API Rate Limit в Terraform',
    category: 'terraform',
    difficulty: 'Middle',
    symptoms: [
      'Все деплои инфраструктуры в GitLab CI / GitHub Actions завершаются со статусом Failed.',
      'Команда `terraform plan` падает с ошибкой 429 Too Many Requests при проверке состояния ресурсов.'
    ],
    initialLogs: `│ Error: error reading EC2 Subnet (subnet-0a1b2c3d): RequestLimitExceeded: Request limit exceeded.
│       status code: 400, request id: 89ab-12cd-34ef
│ 
│ Error: Provider produced inconsistent final plan when checking AWS CloudWatch Alarm`,
    diagnosticSteps: [
      {
        command: 'grep -rn "parallelism" .gitlab-ci.yml',
        output: `script:
  - terraform apply -auto-approve -parallelism=30`,
        hint: 'Параметр -parallelism=30 отправляет 30 параллельных запросов к AWS API одновременно!'
      },
      {
        command: 'terraform state list | wc -l',
        output: `1840`,
        hint: 'В монолитном tfstate находится свыше 1800 ресурсов, refreshing каждого занимает сотни API вызовов.'
      }
    ],
    fixOptions: [
      {
        id: 'fix-inc5-1',
        text: 'Уменьшить parallelism до 5, разбить монолитный state на независимые модули и использовать -refresh=false при быстрых деплоях',
        isCorrect: true,
        feedback: 'Верно! Разделение монолитного стейта снижает количество API вызовов, а контроллируемый parallelism спасает от Rate Limiting.'
      },
      {
        id: 'fix-inc5-2',
        text: 'Удалить файл terraform.tfstate из S3 бакета и выполнить terraform init -reconfigure',
        isCorrect: false,
        feedback: 'Катастрофически неверно! Удаление tfstate потеряет связи Terraform с реальными ресурсами в облаке.'
      }
    ],
    rootCause: 'Слишком высокий параметр параллелизма (`-parallelism=30`) в комбинации с гигантским единым стейт-файлом превысил квоту API вызовов AWS.',
    preventionTips: [
      'Следовать принципу разделения стейтов (Terragrunt или модули на каждую подсистему).',
      'Использовать экспоненциальный задержку (backoff) в конфигурациях провайдера.'
    ]
  },
  {
    id: 'inc-6',
    title: 'Авария #106: Ansible Playbook падает на Task "Gathering Facts" из-за ошибки Sudo',
    category: 'ansible',
    difficulty: 'Middle',
    symptoms: [
      'Ночной автоматический патчинг 80 серверов упал на самом первом шаге.',
      'Все хосты завершились с критическим статусом UNREACHABLE / FAILED.'
    ],
    initialLogs: `fatal: [app-node-14.prod.company.internal]: FAILED! => {
    "msg": "Missing sudo password or incorrect privilege escalation mode",
    "module_stderr": "sudo: a password is required\n",
    "rc": 1
}`,
    diagnosticSteps: [
      {
        command: 'ansible-vault view group_vars/prod/vault.yml',
        output: `ansible_password: "OldSecretPassword2025"
ansible_become_pass: "OldSecretPassword2025"`,
        hint: 'На прошлой неделе отдел безопасности сменил судо-пароль админа на серверах, но Vault в репозитории не был обновлен!'
      },
      {
        command: 'ssh -i ~/.ssh/id_rsa deploy@app-node-14.prod.company.internal "sudo -n true"',
        output: `sudo: a password is required`,
        hint: 'Конфигурация /etc/sudoers.d/deploy требует ввод пароля без флага NOPASSWD.'
      }
    ],
    fixOptions: [
      {
        id: 'fix-inc6-1',
        text: 'Обновить зашифрованные переменные ansible_become_pass в Vault и применить корректный NOPASSWD правило в sudoers',
        isCorrect: true,
        feedback: 'Отлично! Обновление ключей в Vault восстановит работу автоматизации.'
      },
      {
        id: 'fix-inc6-2',
        text: 'Удалить параметр become: yes из всех тасков в Ansible Playbook',
        isCorrect: false,
        feedback: 'Неверно. Таски системного патчинга и установки пакетов требуют прав root (become: yes).'
      }
    ],
    rootCause: 'Несинхронизированная смена паролей привилегированного пользователя без обновления зашифрованных Ansible Vault секретов.',
    preventionTips: [
      'Использовать SSH ключи с настроенным безпарольным sudo для сервисной учетной записи CI/CD (`deploy ALL=(ALL) NOPASSWD: ALL`).',
      'Использовать HashiCorp Vault / AWX для динамического управления секретарями.'
    ]
  },
  {
    id: 'inc-7',
    title: 'Авария #107: Истечение SSL/TLS сертификата Cert-Manager и блоггинг HTTPS трафика',
    category: 'monitoring',
    difficulty: 'Middle',
    symptoms: [
      'Все клиенты видят предупреждение системы безопасности: `NET::ERR_CERT_DATE_INVALID`.',
      'Внешний мониторинг Pingdom шлет критические алерты о недоступности доменного имени.'
    ],
    initialLogs: `kubectl get certificate -n prod
NAME                 READY   SECRET               AGE
company-tls-cert     False   company-tls-secret   90d

kubectl describe challenge -n prod
Status: Invalid
Reason: "Error accepting challenge: ACME server returned status 400: invalid response from http://company.com/.well-known/acme-challenge/xyz"`,
    diagnosticSteps: [
      {
        command: 'kubectl get ingress -n prod company-ingress -o yaml',
        output: `spec:
  rules:
  - host: company.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 80`,
        hint: 'Ingress перезаписывал пути `.well-known/acme-challenge` и отправлял их на фронтенд вместо cert-manager pod!'
      }
    ],
    fixOptions: [
      {
        id: 'fix-inc7-1',
        text: 'Исправить Ingress аннотации cert-manager.io/issue-temporary-certificate или переключиться на DNS-01 challenge и переиздать сертификат',
        isCorrect: true,
        feedback: 'Правильно! Использование DNS-01 challenge не зависит от HTTP путей Ingress и обновляет сертификаты безотказно.'
      },
      {
        id: 'fix-inc7-2',
        text: 'Отключить HTTPS на Nginx Ingress Controller и оставить только порт 80',
        isCorrect: false,
        feedback: 'Неверно! Это скомпрометирует безопасность и заблокирует авторизацию браузеров.'
      }
    ],
    rootCause: 'HTTP-01 challenge от Let’s Encrypt был заблокирован новым роутингом фронтенд приложения.',
    preventionTips: [
      'Использовать DNS-01 challenge с Cloudflare / AWS Route53 API.',
      'Настроить Prometheus метрики `certmanager_certificate_expiration_timestamp_seconds` в Alertmanager за 14 дней до истечения.'
    ]
  },
  {
    id: 'inc-8',
    title: 'Авария #108: Падение Redis из-за Out-Of-Memory (OOM-killer) и сброс сессий',
    category: 'cloud',
    difficulty: 'Senior',
    symptoms: [
      'Раз в 6 часов все авторизованные пользователи внезапно разлогиниваются из системы.',
      'Качели в Grafana: использование памяти Redis достигает 100% ноды, после чего процесс вылетает.'
    ],
    initialLogs: `dmesg -T | grep -i oom
[Sat Jul 25 14:20:01 2026] Out of memory: Kill process 18204 (redis-server) score 920 or sacrifice child
[Sat Jul 25 14:20:01 2026] Killed process 18204 (redis-server) total-vm:16421004kB, anon-rss:15890100kB`,
    diagnosticSteps: [
      {
        command: 'redis-cli -h 127.0.0.1 -p 6379 CONFIG GET maxmemory*',
        output: `1) "maxmemory"
2) "0"
3) "maxmemory-policy"
4) "noeviction"`,
        hint: 'Параметр maxmemory установлен в 0 (безлимит)! Redis расширял память до упора всей RAM виртуальной машины пока ядро не убило его через OOM-killer.'
      },
      {
        command: 'redis-cli --bigkeys',
        output: `# Sampled 150000 keys
Biggest string found 'analytics_raw_events' has 14205001 bytes`,
        hint: 'Кто-то сохранял сырые аналитические данные без установки времени жизни (TTL)!'
      }
    ],
    fixOptions: [
      {
        id: 'fix-inc8-1',
        text: 'Задать maxmemory (например 80% от RAM) и установить maxmemory-policy allkeys-lru в redis.conf, а также добавление TTL для аналитики',
        isCorrect: true,
        feedback: 'Совершенно верно! Политика LRU позволит Redis вытеснять самые старые ключи при достижении лимита памяти, избегая сбоев ОС.'
      },
      {
        id: 'fix-inc8-2',
        text: 'Перезапускать Redis службу каждые 2 часа через cron скрипт systemctl restart redis',
        isCorrect: false,
        feedback: 'Костыль! Периодический перезапуск будет принудительно удалять все активные сессии пользователей.'
      }
    ],
    rootCause: 'Отсутствие лимита maxmemory и политики вытеснения ключей (noeviction) в сочетании с ключами без TTL.',
    preventionTips: [
      'Всегда указывать maxmemory и maxmemory-policy allkeys-lru / volatile-lru.',
      'Аналитику хранить в специализированных БД (ClickHouse / TimescaleDB), а не в Redis.'
    ]
  }
];
