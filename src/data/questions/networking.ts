import { Question } from '../../types';

export const NETWORKING_QUESTIONS: Question[] = [
  {
    id: 'networking-1',
    title: 'Модель OSI vs TCP/IP: описание всех 7 уровней с примерами протоколов',
    category: 'networking',
    difficulty: 'Junior',
    summaryAnswer: 'OSI 7 уровней: Physical, Data Link (Ethernet, MAC), Network (IP), Transport (TCP/UDP), Session, Presentation, Application (HTTP, DNS). TCP/IP упрощает до 4 уровней.',
    fullAnswer: `1. **L1 Physical (Физический)**: Электрические сигналы, оптический кабель, радиоволны (Bits).
2. **L2 Data Link (Канальный)**: Адресация по MAC-адресам, Ethernet, VLAN, ARP (Frames).
3. **L3 Network (Сетевой)**: Маршрутизация по IP-адресам (IPv4/IPv6), ICMP, BGP (Packets).
4. **L4 Transport (Транспортный)**: Порты, обеспечение доставки (TCP) или быстрая безгарантийная передача (UDP) (Segments / Datagrams).
5. **L5 Session (Сеансовый)**: Управление сессиями (NetBIOS, RPC).
6. **L6 Presentation (Представительский)**: Кодирование, сжатие, TLS/SSL шифрование.
7. **L7 Application (Прикладной)**: Протоколы взаимодействия программ (HTTP, HTTPS, DNS, SSH, gRPC).`,
    codeSnippet: {
      language: 'text',
      code: `L7 Application  : HTTP, DNS, SSH
L4 Transport    : TCP, UDP
L3 Network      : IP, ICMP
L2 Data Link    : Ethernet, MAC, VLAN`
    },
    interviewTips: [
      'Упомяните мнемоническое правило для запоминания 7 уровней снизу вверх: "Please Do Not Throw Sausage Pizza Away".'
    ],
    commonPitfalls: [
      'Путать L4 (TCP/UDP) и L7 (HTTP/gRPC) балансировщики.'
    ],
    tags: ['Networking', 'OSI', 'TCPIP', 'Protocols', 'Basics']
  },
  {
    id: 'networking-2',
    title: 'В чем разница между TCP и UDP? Трехстороннее рукопожатие (TCP 3-Way Handshake)',
    category: 'networking',
    difficulty: 'Junior',
    summaryAnswer: 'TCP — надежный протокол с контролем доставки и установкой соединения (3-Way Handshake). UDP — легкий быстрый протокол без гарантированной доставки.',
    fullAnswer: `1. **TCP (Transmission Control Protocol)**:
   - Гарантирует доставку и порядок пакетов.
   - Управляет потоком (Flow Control) и заторами (Congestion Control).
   - Применяется в HTTP, SSH, Базах данных.

2. **TCP 3-Way Handshake (Трехстороннее рукопожатие)**:
   - Клиент -> Сервер: **SYN** (Synchronize)
   - Сервер -> Клиент: **SYN-ACK** (Synchronize-Acknowledge)
   - Клиент -> Сервер: **ACK** (Acknowledge)
   - После этого соединение считается Еstablished.

3. **UDP (User Datagram Protocol)**:
   - Передает датаграммы без установки соединения.
   - Минимальный накладной расход заголовков (8 байт против 20 байт TCP).
   - Применяется в DNS, VoIP, видеостриминге, играх, QUIC / HTTP/3.`,
    codeSnippet: {
      language: 'text',
      code: `Client --- SYN ---> Server
Client <-- SYN-ACK -- Server
Client --- ACK ---> Server`
    },
    interviewTips: [
      'Подчеркните, что HTTP/3 перешел с TCP на UDP (протокол QUIC) ради устранения проблемы Head-of-Line Blocking!'
    ],
    commonPitfalls: [
      'Считать, что UDP "плохой", а TCP "хороший". У каждого своя ниша (UDP идеален для онлайн-видео и игр).'
    ],
    tags: ['Networking', 'TCP', 'UDP', 'Handshake', 'QUIC']
  },
  {
    id: 'networking-3',
    title: 'Как устроена доменная система имен DNS (Рекурсивные и Авторитетные резолверы, записи A, AAAA, CNAME, TXT)?',
    category: 'networking',
    difficulty: 'Middle',
    summaryAnswer: 'DNS переводит доменные имена в IP. Иерархия: Root (.) -> TLD (.com) -> Authoritative (example.com). Записи: A (IPv4), AAAA (IPv6), CNAME (псевдоним), TXT (верификация).',
    fullAnswer: `**Иерархический поиск DNS**:
1. Браузер смотрит свой кэш и /etc/hosts.
2. Отправляет запрос **Recursive DNS** (1.1.1.1 или DNS провайдера).
3. Рекурсор опрашивает **Root DNS (корневые серверы .)**.
4. Корневой сервер отправляет к **TLD серверу (.ru / .com)**.
5. TLD отправляет к **Authoritative DNS** (например Cloudflare/NS1), который хранит исходные записи домена.

**Типы записей**:
- **A**: Отображает домен в IPv4 адрес (app.com -> 1.2.3.4).
- **AAAA**: Отображает домен в IPv6 адрес.
- **CNAME**: Указывает домен как канонический псевдоним другого домена (www.app.com -> app.com).
- **MX**: Почтовый сервер.
- **TXT**: Текстовые данные (SPF, DKIM ключи, подтверждение владения).`,
    codeSnippet: {
      language: 'bash',
      code: `dig +trace example.com # Проследить весь иерархический путь резолва DNS`
    },
    interviewTips: [
      'Утилита \`dig +trace\` — лучший способ продемонстрировать глубокие знания DNS.'
    ],
    commonPitfalls: [
      'Пытаться повесить CNAME на корневой Apex домен (example.com) — стандарт RFC запрещает CNAME на роут домене.'
    ],
    tags: ['Networking', 'DNS', 'Dig', 'Protocols', 'Web']
  },
  {
    id: 'networking-4',
    title: 'Как работает TLS/SSL рукопожатие (TLS 1.2 vs TLS 1.3) и протокол HTTPS?',
    category: 'networking',
    difficulty: 'Middle',
    summaryAnswer: 'TLS шифрует HTTP трафик. Включает асимметричный обмен ключами (RSA/Diffie-Hellman) и симметричное шифрование данных (AES). TLS 1.3 сократил handshake с 2 RTT до 1 RTT.',
    fullAnswer: `HTTPS = HTTP + TLS шифрование.

**Схема TLS Handshake**:
1. **ClientHello**: Клиент отправляет поддерживаемые версии TLS и список шифров (Cipher Suites).
2. **ServerHello + Certificate**: Сервер отправляет выбранный шифр и свой **SSL Сертификат** с публичным ключом.
3. **Verification**: Клиент проверяет подпись сертификата через цепочку доверия CA (Certificate Authority).
4. **Key Exchange (Diffie-Hellman)**: Стороны безопасно вырабатывают общие симметричные сессионные ключи шифрования.
5. **Encrypted Session**: Дальнейший трафик шифруется быстрым симметричным алгоритмом (AES-GCM / ChaCha20).

**Улучшение TLS 1.3**:
TLS 1.2 требовал 2 RTT (круговых задержки). TLS 1.3 снизил рукопожатие до **1 RTT** (и 0 RTT при повторных подключениях через Session Resumption), выкинув старые ненадёжные шифры.`,
    codeSnippet: {
      language: 'bash',
      code: `openssl s_client -connect example.com:443 -servername example.com # Проверка сертификата и рукопожатия`
    },
    interviewTips: [
      'Упомяните SNI (Server Name Indication) — расширение TLS, позволяющее запустить 100 разных SSL сертификатов на одном IP адресе.'
    ],
    commonPitfalls: [
      'Забывать включить Intermediate CA сертификаты в цепочку (Fullchain.pem), вызывая ошибки у мобильных клиентов.'
    ],
    tags: ['Networking', 'TLS', 'HTTPS', 'Security', 'Cryptography']
  },
  {
    id: 'networking-5',
    title: 'Что такое BGP (Border Gateway Protocol) и как устроена глобальная маршрутизация Интернета?',
    category: 'networking',
    difficulty: 'Senior',
    summaryAnswer: 'BGP — протокол динамической маршрутизации между Автономными Системами (AS) глобального Интернета. Маршрутизация строится по графу цепочек AS-Path.',
    fullAnswer: `Глобальный Интернет состоит из десятков тысяч независимых сетей — **Автономных Систем (Autonomous System - AS)**, обладающих своими номерами (ASN) и блоками IP-адресов.

**Как работает BGP**:
1. BGP — это векторно-расстанционный протокол (Path Vector Protocol).
2. Маршрутизаторы (Edge Routers) обмениваются объявлениями анонсов сетей (BGP Route Advertisements).
3. Основная метрика — **AS-Path** (список автономных систем, через которые нужно пройти пакету).
4. BGP выбирает кратчайший или экономически выгодный путь.

**BGP Hijacking (Перехват трафика)**:
Если злоумышленник анонсирует чужой IP-префикс через BGP с более коротким AS-Path, мировой трафик начнет утекать к нему. Для защиты внедряют фильтрацию RPKI.`,
    codeSnippet: {
      language: 'bash',
      code: `traceroute -N example.com # посмотреть хопы трафика через магистральных провайдеров`
    },
    interviewTips: [
      'Упомяните инцидент падения сервисов Meta/Facebook из-за сбоя анонсов BGP.'
    ],
    commonPitfalls: [
      'Путать внутрений протокол (OSPF/ISIS) и внешний межавтономный протокол (BGP).'
    ],
    tags: ['Networking', 'BGP', 'Routing', 'Internet', 'AS']
  },
  {
    id: 'networking-6',
    title: 'В чем отличие L4 (TCP/UDP) от L7 (HTTP/gRPC) балансировщиков нагрузки?',
    category: 'networking',
    difficulty: 'Middle',
    summaryAnswer: 'L4 балансировщик (IPVS, HAProxy L4, AWS NLB) работает на уровне IP и портов без чтения HTTP тела. L7 (Nginx, Envoy, AWS ALB) читает заголовки, куки и URL.',
    fullAnswer: `1. **L4 Load Balancer (Транспортный уровень)**:
   - Балансирует пакеты по комбинации Source IP:Port -> Dest IP:Port.
   - НЕ заглядывает внутрь расшифрованного HTTP/TLS содержимого.
   - *Плюсы*: Невероятная скорость (миллионы RPS), минимальный CPU, высокая безопасность.
   - *Минусы*: Не умеет роутить по URL путям (/api vs /static), не может читать HTTP заголовки и Cookies.

2. **L7 Load Balancer (Прикладной уровень)**:
   - Терминирует TLS соединение, парсит HTTP/2 / gRPC заголовки и куки.
   - *Плюсы*: Умный роутинг по путям, редиректы, Sticky Sessions, лимиты запросов (Rate Limiting), интеграция с WAF.
   - *Минусы*: Выше накладные расходы на CPU/RAM из-за декодирования TLS и парсинга трафика.`,
    codeSnippet: {
      language: 'nginx',
      code: `# L7 Routing в Nginx
location /api/ {
    proxy_pass http://backend_cluster;
}
location /static/ {
    proxy_pass http://cdn_cluster;
}`
    },
    interviewTips: [
      'Частая схема архитектуры: L4 балансировщик (AWS NLB) принимает весь входящий сетевой шторм и распределяет на группу L7 балансировщиков (Ingress Nginx).'
    ],
    commonPitfalls: [
      'Пытаться настроить L4 балансировщик на маршрутизацию по вызову /api/v1/users.'
    ],
    tags: ['Networking', 'LoadBalancing', 'L4', 'L7', 'Nginx', 'Envoy']
  },
  {
    id: 'networking-7',
    title: 'Что такое CIDR бесклассовая адресация и маски подсетей (/24, /16)?',
    category: 'networking',
    difficulty: 'Junior',
    summaryAnswer: 'CIDR определят количество фиксированных бит сети и число свободных бит для IP-адресов хостов. /24 дает 256 адресов (254 доступных), /16 дает 65536 адресов.',
    fullAnswer: `Формат IPv4: 32 бита (4 октета по 8 бит).
Запись **192.168.1.0/24**:
- **/24** означает, что первые 24 бита зафиксированы под адрес сети.
- Оставшиеся 32 - 24 = 8 бит выделены под хосты.
- Число хостов: 2^8 = 256.
- Минус 2 служебных адреса: **192.168.1.0** (Сеть) и **192.168.1.255** (Бродкаст Broadcast). Итого **254** рабочих IP.

Шпаргалка масок:
- **/32**: 1 IP адрес (конкретная машина).
- **/30**: 4 IP (2 рабочих) — используется для связи "точка-точка" (P2P роутеры).
- **/24**: 256 IP (254 рабочих) — стандартная подсеть офиса/VPC.
- **/16**: 65,536 IP — стандартная большая сеть VPC в облаке.`,
    codeSnippet: {
      language: 'text',
      code: `10.0.0.0/16 -> от 10.0.0.0 до 10.0.255.255
10.0.1.0/24 -> от 10.0.1.0 до 10.0.1.255`
    },
    interviewTips: [
      'Запомните: в Kubernetes и облаках Cloud Providers часто резервируют 4-5 адресов из каждой подсети на системные нужды!'
    ],
    commonPitfalls: [
      'Создавать слишком мелкую подсеть /28 (16 IP) для Kubernetes кластера, где поды моментально исчерпают весь пул.'
    ],
    tags: ['Networking', 'CIDR', 'Subnets', 'IPv4', 'IP']
  },
  {
    id: 'networking-8',
    title: 'Как работает NAT (Network Address Translation) и SNAT / DNAT?',
    category: 'networking',
    difficulty: 'Junior',
    summaryAnswer: 'NAT подменяет IP адреса в заголовках пакетов. SNAT (Source NAT) меняет IP отправителя для выхода в Интернет. DNAT (Destination NAT) меняет IP получателя для проброса портов.',
    fullAnswer: `Из-за дефицита IPv4 частные сети используют серые IP диапазоны (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16).

1. **SNAT (Source NAT)**:
   - Подменяет ИСХОДЯЩИЙ адрес источника (Source IP) на публичный IP роутера.
   - Применяется, когда приватные сервера в VPC выходят в Интернет за обновлениями через NAT Gateway.

2. **DNAT (Destination NAT)**:
   - Подменяет ВХОДЯЩИЙ адрес назначения (Destination IP/Port).
   - Применяется при пробросе портов (Port Forwarding): пакет на публичный IP 1.2.3.4:80 перенаправляется на серый IP 10.0.0.5:8080.`,
    codeSnippet: {
      language: 'bash',
      code: `# Настройка SNAT в iptables:
iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE`
    },
    interviewTips: [
      'Упомяните утилиту conntrack для просмотра таблицы установленных NAT соединений.'
    ],
    commonPitfalls: [
      'Упираться в лимиты портов (SNAT port exhaustion) при огромном количестве сходящих соединений.'
    ],
    tags: ['Networking', 'NAT', 'Iptables', 'SNAT', 'DNAT']
  },
  {
    id: 'networking-9',
    title: 'Что такое VXLAN (Virtual Extensible LAN) и как организуются Overlay сети в CNI?',
    category: 'networking',
    difficulty: 'Senior',
    summaryAnswer: 'VXLAN туннелирует L2 фреймы внутри L4 UDP пакетов (порт 4789). Используется CNI плагинами (Flannel, Calico) для создания единой плоской сети подов поверх физической сети.',
    fullAnswer: `Проблема в Kubernetes:
Подам на разных физических серверах нужно общаться напрямую по серым IP без сложности перенастройки физических коммутаторов дата-центра.

**Принцип работы VXLAN (Overlay)**:
1. Под на Ноде A отправляет обычный L2 пакет поду на Ноду B.
2. CNI утилита инкапсулирует оригинальный Ethernet фрейм внутрь обычного **UDP пакета (порт 4789)** с заголовком VNI (VXLAN Network Identifier).
3. Физическая сеть провайдера просто передает стандартный UDP пакет между IP Ноды A и Ноды B.
4. Нода B деинкапсулирует UDP пакет и достает оригинальный фрейм для пода.`,
    codeSnippet: {
      language: 'text',
      code: `[Outer IP Header][Outer UDP Header][VXLAN Header][Inner Original Ethernet Frame]`
    },
    interviewTips: [
      'Отметьте накладные расходы Overlay сетей (около 50 байт на заголовок) и необходимость уменьшать MTU (например до 1450).'
    ],
    commonPitfalls: [
      'Забывать разрешить UDP порт 4789 на фаерволах облака при сборке Kubernetes кластера.'
    ],
    tags: ['Networking', 'VXLAN', 'CNI', 'Overlay', 'Kubernetes']
  },
  {
    id: 'networking-10',
    title: 'Что такое MTU (Maximum Transmission Unit) и проблемы с фрагментацией пакетов (Path MTU Discovery)?',
    category: 'networking',
    difficulty: 'Middle',
    summaryAnswer: 'MTU — максимальный размер полезного пакета без фрагментации (стандарт 1500 байт). Фрагментация пагубно влияет на производительность и задержки.',
    fullAnswer: `Стандартный MTU для Ethernet равен **1500 байт**.
Если отправляемый пакет превышает MTU промежуточного роутера и на нем стоит флаг DF (Don't Fragment), роутер отбросит пакет и вернет ошибку ICMP Type 3 Code 4 (Fragmentation Needed).

**Path MTU Discovery (PMTUD)**:
Механизм автоматического определения минимального MTU на всем пути следования пакетов.

*Критично для VPN и Kubernetes (VXLAN)*:
Поскольку Overlay туннели добавляют свои 50+ байт заголовков к каждому пакету, MTU внутри контейнера нужно уменьшать (например до 1450 или 1420 байт). Если оставить 1500, пакеты будут дропаться или силой фрагментироваться!`,
    codeSnippet: {
      language: 'bash',
      code: `ping -M do -s 1472 example.com # Проверить проходит ли MTU 1500 без фрагментации (1472 + 28 байт ICMP/IP)`
    },
    interviewTips: [
      'Если веб-сайт открывается частично и "висит" при передаче больших TLS ключей — в 90% случаев виноват кривой MTU!'
    ],
    commonPitfalls: [
      'Блокировать ВСЕ ICMP пакеты на файрволе, что ломает Path MTU Discovery (Blackhole router).'
    ],
    tags: ['Networking', 'MTU', 'ICMP', 'Troubleshooting', 'Performance']
  },
  {
    id: 'networking-11',
    title: 'В чем разница между HTTP/1.1, HTTP/2 и HTTP/3 (QUIC)?',
    category: 'networking',
    difficulty: 'Middle',
    summaryAnswer: 'HTTP/1.1 требовал отдельных TCP соединений. HTTP/2 ввел мультиплексирование потоков в одном TCP соединении. HTTP/3 перешел на UDP (QUIC) для решения Head-of-Line Blocking.',
    fullAnswer: `1. **HTTP/1.1**:
   - Текстовый протокол.
   - Страдает проблемой Head-of-Line Blocking на уровне HTTP: следующий запрос ждет ответа на предыдущий.

2. **HTTP/2**:
   - Бинарный протокол с сжатием заголовков (HPACK).
   - **Мультиплексирование**: Все запросы передаются параллельно в рамках ЕДИНОГО TCP соединения.
   - *Проблема*: Если на плохом Wi-Fi теряется 1 TCP пакет, замирают ВСЕ мультиплексированные потоки (TCP Head-of-Line Blocking).

3. **HTTP/3**:
   - Отказался от TCP в пользу протокола **QUIC поверх UDP**!
   - Потеря пакета в одном потоке НЕ влияет на остальные потоки.
   - Мгновенный 0-RTT reconnect при смене сети (например при переходе с Wi-Fi на 4G/5G).`,
    codeSnippet: {
      language: 'text',
      code: `HTTP/1.1 : TCP + Text
HTTP/2   : TCP + Binary Multiplexing
HTTP/3   : UDP (QUIC) + Independent Streams`
    },
    interviewTips: [
      'Подчеркните причину перехода на UDP в HTTP/3: устранение TCP Head-of-Line Blocking.'
    ],
    commonPitfalls: [
      'Думать, что HTTP/3 работает по TCP.'
    ],
    tags: ['Networking', 'HTTP', 'HTTP2', 'HTTP3', 'QUIC', 'Web']
  },
  {
    id: 'networking-12',
    title: 'Что такое VPN (OpenVPN, WireGuard, IPsec) и их фундаментальные отличия?',
    category: 'networking',
    difficulty: 'Middle',
    summaryAnswer: 'VPN шифрует и туннелирует трафик между сетями. WireGuard — современный быстрый протокол в ядре Linux. OpenVPN — гибкий традиционный SSL-based VPN.',
    fullAnswer: `1. **WireGuard**:
   - Современный виртуальный туннель, встроенный прямо в ядро Linux (начиная с ядра 5.6).
   - Содержит всего ~4000 строк кода (против 100,000+ в OpenVPN).
   - Супер-быстрый, передовые крипто-шифры (ChaCha20-Poly1305), мгновенное переподключение.

2. **OpenVPN**:
   - Работает в пользовательском пространстве (Userspace), использует SSL/TLS.
   - Медленнее из-за переключения контекстов процессов (Context Switches).
   - Идеален для обхода блокировок и сложных настроек авторизации (LDAP/MFA).

3. **IPsec**:
   - Межсетевой стандарт для соединения филиалов (Site-to-Site VPN).`,
    codeSnippet: {
      language: 'ini',
      code: `# Минималистичный конфиг Wireguard (wg0.conf)
[Interface]
PrivateKey = <Client_Private_Key>
Address = 10.0.0.2/32

[Peer]
PublicKey = <Server_Public_Key>
Endpoint = 1.2.3.4:51820
AllowedIPs = 0.0.0.0/0`
    },
    interviewTips: [
      'Назовите интеграцию WireGuard в ядро Linux как главную причину его колоссальной скорости.'
    ],
    commonPitfalls: [
      'Использовать OpenVPN там, где требуется максимальная пропускная способность гигабитных каналов.'
    ],
    tags: ['Networking', 'VPN', 'WireGuard', 'OpenVPN', 'Security']
  },
  {
    id: 'networking-13',
    title: 'Как работает протокол ARP (Address Resolution Protocol) и ARP Spoofing?',
    category: 'networking',
    difficulty: 'Junior',
    summaryAnswer: 'ARP связывает L3 IP-адрес с L2 MAC-адресом физической сетевой карты в локальной сети. ARP Spoofing — атака подмены MAC-адреса.',
    fullAnswer: `При отправке пакета в локальной сети маршутизатор знает целевой IP 192.168.1.5, но L2 коммутатор умеет передавать кадры только по MAC-адресам!

**Процесс ARP**:
1. Хост рассылает широковещательный бродкаст запрос **ARP Request**: "У кого IP 192.168.1.5? Сообщите мой MAC aa:bb:cc...".
2. Владелец IP отвечает **ARP Reply** (Unicast): "IP 192.168.1.5 у меня, мой MAC 11:22:33...".
3. Хост сохраняет пару в ARP-кэше (\`arp -an\` / \`ip neigh\`).

**ARP Spoofing (Man-in-the-Middle)**:
Злоумышленник посылает ложные ARP ответы, заставляя жертву думать, что MAC-адрес роутера принадлежит хакеру, и перехватывает весь локальный трафик.`,
    codeSnippet: {
      language: 'bash',
      code: `ip neigh show # просмотр текущей таблицы ARP-кэша Linux`
    },
    interviewTips: [
      'Упомяните утилиту arping для диагностики локальной связности L2.'
    ],
    commonPitfalls: [
      'Думать, что ARP работает через маршрутизаторы в Интернете (ARP работает ТОЛЬКО в пределах одного L2 бродкаст домена/VLAN!).'
    ],
    tags: ['Networking', 'ARP', 'MAC', 'L2', 'Security']
  },
  {
    id: 'networking-14',
    title: 'Что такое CDN (Content Delivery Network) и концепция Anycast IP?',
    category: 'networking',
    difficulty: 'Middle',
    summaryAnswer: 'CDN кэширует статический контент на Edge серверах по всему миру. Anycast IP анонсирует один и тот же IP-адрес из десятков ЦОД, направляя юзера к ближайшему.',
    fullAnswer: `Если сервер находится в Франкфурте, пользователь из Сиднея получит задержку (Ping) 250мс из-за ограничений скорости света в оптике.

**Как помогает CDN**:
1. Статика (картинки, JS, видео) кэшируется на сотнях Edge-серверов по всему миру.
2. **Anycast Routing**:
   - Один и тот же IP адрес (например 1.1.1.1) анонсируется через BGP из десятков дата-центров по всему миру!
   - Сетевые провайдеры автоматически направляют пользователя в БЛИЖАЙШИЙ ЦОД с минимальным пингом.
3. В результате статика отдается за 5-10мс из Сиднея, снижая нагрузку на основной сервер (Origin) на 90%.`,
    codeSnippet: {
      language: 'text',
      code: `User (Sydney) -> CDN Edge (Sydney) -> 5ms response
Origin Server (Frankfurt) -> не напрягается`
    },
    interviewTips: [
      'Назовите компании Cloudflare, Fastly, Akamai как лидеров CDN.'
    ],
    commonPitfalls: [
      'Забывать настраивать инвалидацию кэша (Cache Purge / Cache-Control headers) при релизах нового кода.'
    ],
    tags: ['Networking', 'CDN', 'Anycast', 'Cloudflare', 'Performance']
  }
];
