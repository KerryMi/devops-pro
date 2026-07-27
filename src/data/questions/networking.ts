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
  },
  {
    id: 'networking-15',
    title: 'Что такое сетевые порты (Network Ports) и какие стандартные порты наиболее важны в DevOps?',
    category: 'networking',
    difficulty: 'Junior',
    summaryAnswer: 'Сетевой порт — это числовой идентификатор (0-65535) на транспортном уровне (L4), позволяющий операционной системе направлять пакеты конкретному приложению. Ключевые порты: 22 (SSH), 53 (DNS), 80 (HTTP), 443 (HTTPS).',
    fullAnswer: `Порты разделяют трафик на одном физическом сервере между разными процессами. Всего существует 65536 портов (от 0 до 65535). Они делятся на три диапазона:
1. **Системные / Well-known ports** (0 - 1023): зарезервированы под стандартные службы. В UNIX-системах для биндинга портов <1024 требуются права root.
2. **Зарегистрированные / Registered ports** (1024 - 49151): используются для конкретных приложений (например, СУБД).
3. **Динамические / Ephemeral ports** (49152 - 65535): открываются временно операционной системой для исходящих соединений клиентов.

**Список критически важных для DevOps инженера портов**:
- **22**: SSH (безопасное удаленное управление)
- **53**: DNS (разрешение имен доменов)
- **80 / 443**: HTTP / HTTPS (веб-трафик)
- **5432**: PostgreSQL
- **3306**: MySQL
- **6379**: Redis
- **9090**: Prometheus
- **3000**: Grafana / Node.js Dev Server
- **6443**: Kubernetes API Server`,
    codeSnippet: {
      language: 'bash',
      code: `ss -tulpn # Показать все процессы, слушающие TCP/UDP порты в Linux
netstat -an | grep LISTEN # Альтернативный классический вариант`
    },
    interviewTips: [
      'Упомяните, что для запуска веб-сервера на порту 80/443 от имени не-root пользователя в Linux, процессу нужно выдать capability CAP_NET_BIND_SERVICE.'
    ],
    commonPitfalls: [
      'Забывать, что один и тот же номер порта может быть занят отдельно под TCP и отдельно под UDP протоколы.'
    ],
    tags: ['Networking', 'Ports', 'DevOps', 'Basics', 'OS']
  },
  {
    id: 'networking-16',
    title: 'Что такое NAT (Network Address Translation)? В чем разница между SNAT, DNAT и PAT?',
    category: 'networking',
    difficulty: 'Middle',
    summaryAnswer: 'NAT — технология трансляции IP-адресов. SNAT подменяет адрес источника для выхода из локальной сети вовне. DNAT подменяет адрес назначения для проброса портов внутрь сети. PAT (Masquerading) использует порты для экономии публичных IP.',
    fullAnswer: `Из-за дефицита IPv4-адресов была разработана технология NAT, позволяющая использовать серые локальные диапазоны IP-адресов (RFC 1918) внутри офисов/ЦОД и транслировать их в публичные интернет-адреса.

**Основные типы трансляции**:
1. **SNAT (Source NAT)**:
   - Применяется при исходящих запросах из приватной сети в Интернет.
   - Маршрутизатор заменяет локальный серый IP-адрес источника (например, 192.168.1.50) на свой внешний белый IP (например, 8.8.8.8) в заголовке пакета.
2. **DNAT (Destination NAT)**:
   - Применяется для перенаправления входящего трафика извне к серверу внутри приватной сети (Port Forwarding).
   - Подменяется IP-адрес назначения. Запрос на публичный IP роутера пересылается на серый IP сервера в локальной сети.
3. **PAT (Port Address Translation / Masquerading)**:
   - Динамический NAT, при котором множество локальных хостов используют ОДИН внешний IP-адрес.
   - Различение сессий происходит за счет динамической подмены портов источника на роутере.`,
    codeSnippet: {
      language: 'bash',
      code: `# Пример настройки маскарадинга (PAT) на Linux с iptables:
iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE

# Пример DNAT (проброс порта 80 на внутренний сервер):
iptables -t nat -A PREROUTING -p tcp --dport 80 -j DNAT --to-destination 192.168.1.100:80`
    },
    interviewTips: [
      'Объясните, что NAT работает со сквозным отслеживанием состояний соединений (Stateful Connection Tracking / conntrack в ядре Linux).'
    ],
    commonPitfalls: [
      'Путать SNAT и DNAT: помните, что SNAT управляет тем, как клиенты выходят наружу, а DNAT — тем, как внешние клиенты заходят внутрь.'
    ],
    tags: ['Networking', 'NAT', 'SNAT', 'DNAT', 'iptables', 'Security']
  },
  {
    id: 'networking-17',
    title: 'Что такое MTU и MSS? С какими проблемами фрагментации можно столкнуться в VPN туннелях и как их решать?',
    category: 'networking',
    difficulty: 'Senior',
    summaryAnswer: 'MTU — максимальный размер кадра (обычно 1500 байт на L2). MSS — максимальный размер полезных данных в TCP (1460 байт). Дополнительные заголовки VPN-туннелей (например, WireGuard/IPsec) уменьшают эффективный MTU, вызывая потери пакетов.',
    fullAnswer: `1. **MTU (Maximum Transmission Unit)**:
   Максимальный объем данных в байтах, который может быть передан за одну физическую транзакцию на канальном уровне (Ethernet по умолчанию — 1500 байт).
2. **MSS (Maximum Segment Size)**:
   Размер чистых данных TCP без учета заголовков IP (20 байт) и TCP (20 байт). При MTU=1500, MSS равен 1500 - 20 - 20 = 1460 байт.

**Проблема с VPN и инкапсуляцией**:
При использовании туннелей (WireGuard, GRE, IPsec, VXLAN) оригинальный IP-пакет оборачивается в еще один набор заголовков. Это забирает от 20 до 80 байт от доступного размера.
- Если отправить оригинальный пакет размером 1500 байт через туннель с MTU 1420, пакет придется фрагментировать на уровне IP или отбросить.
- Если на пакете установлен флаг **DF (Don't Fragment)**, а промежуточный роутер не может его передать, он отбрасывает пакет и посылает обратно ICMP-сообщение "Fragmentation Needed".
- Если ICMP-сообщения заблокированы фаерволом (так называемая проблема **Black Hole Router**), то мелкие пакеты (ping, SSH handshake) проходят, а крупные (передача файлов, загрузка больших сайтов) намертво зависают.

**Методы решения**:
- **MSS Clamping (зажим MSS)**: Маршрутизатор перехватывает TCP-пакеты с флагом SYN и принудительно уменьшает объявленный MSS (например, до 1360), заставляя клиентов слать пакеты меньшего размера.
- **Path MTU Discovery (PMTUD)**: автоопределение минимального MTU по всему маршруту следования трафика (требует разрешения ICMP Type 3 Code 4).`,
    codeSnippet: {
      language: 'bash',
      code: `# Настройка MSS Clamping в iptables для входящих соединений на интерфейсе туннеля wg0:
iptables -t mangle -A POSTROUTING -p tcp --tcp-flags SYN,RST SYN -o wg0 -j TCPMSS --clamp-mss-to-pmtu

# Проверка MTU до сервера без фрагментации:
ping -M do -s 1472 8.8.8.8`
    },
    interviewTips: [
      'Расскажите классическую историю: "Симптом зависания загрузки страницы при успешном прохождении пингов — это почти всегда проблема заниженного MTU и заблокированного ICMP в туннеле". Это выдает огромный практический опыт.'
    ],
    commonPitfalls: [
      'Полностью блокировать все ICMP-сообщения на фаерволе. Это ломает Path MTU Discovery и приводит к "зависанию" TCP-сессий.'
    ],
    tags: ['Networking', 'MTU', 'MSS', 'VPN', 'iptables', 'Troubleshooting']
  },
  {
    id: 'networking-18',
    title: 'Что такое gRPC? Чем он отличается от REST API и почему критически завязан на HTTP/2?',
    category: 'networking',
    difficulty: 'Senior',
    summaryAnswer: 'gRPC — высокопроизводительный RPC-фреймворк от Google. Отличается от REST бинарным сериализатором Protocol Buffers (вместо JSON), строгим контрактом (.proto) и обязательным использованием HTTP/2 для мультиплексирования и стриминга.',
    fullAnswer: `gRPC (Google Remote Procedure Call) спроектирован для межсервисного взаимодействия (microservices) с фокусом на минимальный латентность и низкое потребление трафика.

**Фундаментальные отличия от REST API**:
1. **Транспорт**:
   - REST обычно использует HTTP/1.1 (текстовые заголовки, одно соединение на один запрос-ответ, блокировка Head-of-Line).
   - gRPC требует исключительно **HTTP/2** (бинарные фреймы, мультиплексирование множества запросов в одном TCP-соединении, сжатие заголовков HPACK, Server Push).
2. **Формат данных**:
   - REST передает текстовый JSON (избыточен, медленный парсинг).
   - gRPC компилирует данные в бинарный **Protocol Buffers (Protobuf)**, который сериализуется и парсится на порядки быстрее и занимает минимум байт в сети.
3. **Режимы связи**:
   - REST: строго запрос-ответ.
   - gRPC: поддерживает 4 режима взаимодействия: Unary (одиночный), Server Streaming (один запрос - поток ответов), Client Streaming (поток запросов - один ответ), Bidirectional Streaming (двунаправленный поток).
4. **Контрактность**:
   - gRPC требует строгого описания API в \`.proto\` файле, на основе которого генерируется строго типизированный код для любых языков программирования.

**Почему HTTP/2 критичен**:
gRPC полагается на HTTP/2 фреймы для разделения потоков (Streams) и передачи метаданных (HTTP/2 Headers/Trailers), что позволяет передавать статус выполнения RPC в конце ответа без разрыва сессии.`,
    codeSnippet: {
      language: 'protobuf',
      code: `// Пример описания сервиса в .proto
syntax = "proto3";

package user;

service UserService {
  rpc GetUser (UserRequest) returns (UserResponse);
}

message UserRequest {
  int64 id = 1;
}

message UserResponse {
  int64 id = 1;
  string name = 2;
  string email = 3;
}`
    },
    interviewTips: [
      'Укажите, что gRPC плохо подходит для публичных Web-клиентов (браузеров) напрямую из-за ограничений поддержки HTTP/2 фич в браузерах (требуется gRPC-Web proxy).'
    ],
    commonPitfalls: [
      'Балансировать gRPC трафик через L4 балансировщик без настройки keepalive. L4 балансировщик направит одно TCP соединение на один под, и из-за мультиплексирования HTTP/2 ВСЕ запросы пойдут на этот единственный под, создавая дисбаланс.'
    ],
    tags: ['Networking', 'gRPC', 'HTTP2', 'REST', 'Protobuf', 'Microservices']
  },
  {
    id: 'networking-19',
    title: 'Что такое BGP (Border Gateway Protocol)? Как работает глобальная маршрутизация и BGP Anycast?',
    category: 'networking',
    difficulty: 'Senior',
    summaryAnswer: 'BGP — это протокол динамической маршрутизации внешнего шлюза, связывающий автономные системы (AS) интернета. BGP Anycast — метод, позволяющий нескольким серверам в разных частях мира использовать один IP-адрес для снижения задержек и балансировки.',
    fullAnswer: `Интернет состоит из тысяч независимых сетей — **Автономных систем (AS)**. Каждой AS управляет крупный провайдер, хостинг, техногигант (Google, Cloudflare) или университет.
BGP (Border Gateway Protocol) отвечает за обмен информацией о доступности диапазонов IP-адресов (префиксов) между этими AS.

**Как работает BGP Anycast**:
1. Обычно каждому IP-адресу в интернете соответствует одно физическое устройство (Unicast).
2. При Anycast разные серверы в географически удаленных локациях (например, во Франкфурте, Сингапуре и Нью-Йорке) анонсируют один и тот же префикс IP-адресов своим вышестоящим провайдерам через BGP.
3. Сеть BGP распространяет эти анонсы по всему миру.
4. Когда пользователь шлет запрос на этот IP, маршрутизаторы интернета выбирают кратчайший BGP-путь (обычно наименьшее количество хопов автономных систем, AS-Path).
5. В результате пользователь из Токио попадет на токийский сервер, а пользователь из Парижа — на парижский.

**Применение Anycast**:
- **DNS-серверы** (например, корневые DNS или публичные 1.1.1.1 / 8.8.8.8) — для мгновенного резолва и защиты от DDoS-атак (трафик атаки размазывается по сотням дата-центров мира вместо падения одного сервера).
- **CDN-сети** (Cloudflare, Fastly) — для проксирования запросов на ближайшую к клиенту точку присутствия (PoP).`,
    codeSnippet: {
      language: 'bash',
      code: `# Просмотр маршрута прохождения пакетов (трассировка) с автономными системами (AS)
mtr --aslookup 1.1.1.1`
    },
    interviewTips: [
      'Расскажите, что Anycast работает в основном на UDP (DNS), а для TCP имеет риск "BGP Flapping" (когда из-за изменения BGP-маршрутов посреди сессии пакеты начинают лететь на другой сервер, что ломает текущее TCP-соединение). Объясните, что современные провайдеры решают это умной балансировкой в рамках одной AS.'
    ],
    commonPitfalls: [
      'Полагать, что Anycast физически делит трафик по географии. На самом деле он ориентируется исключительно на топологию сети BGP и политики пиринга (AS-Path), которые иногда могут направить трафик из Москвы в Хабаровск через Франкфурт.'
    ],
    tags: ['Networking', 'BGP', 'Anycast', 'DNS', 'CDN', 'Routing']
  },
  {
    id: 'networking-20',
    title: 'Как работает TLS Handshake? В чем разница между TLS 1.2 и TLS 1.3?',
    category: 'networking',
    difficulty: 'Senior',
    summaryAnswer: 'TLS Handshake устанавливает защищенное соединение. TLS 1.3 сокращает время рукопожатия с двух круговых задержек (2 RTT) до одной (1 RTT) за счет отправки ключей на первом шаге, а также поддерживает режим 0-RTT для повторных запросов.',
    fullAnswer: `Рукопожатие TLS (Handshake) шифрует TCP-соединение перед отправкой HTTP-запросов.

**TLS 1.2 Handshake (2 RTT)**:
1. **RTT 1**: Клиент шлет \`ClientHello\` (список поддерживаемых шифров). Сервер отвечает \`ServerHello\` (выбранный шифр, сертификат и открытый ключ DH).
2. **RTT 2**: Клиент проверяет сертификат, генерирует общие параметры, шлет \`Key Exchange\` и \`Finished\`. Сервер отвечает своим \`Finished\`. Только после этого летят полезные HTTP-данные.

**TLS 1.3 Handshake (1 RTT)**:
1. Сокращает задержку на целый круг (1 RTT)!
2. Клиент сразу предполагает, какие алгоритмы обмена ключами (ECDHE) поддерживает сервер, и в первом же сообщении \`ClientHello\` отправляет свои публичные параметры обмена ключами (Key Share).
3. Сервер в \`ServerHello\` сразу присылает свои параметры ключа. Общий сессионный ключ рассчитывается мгновенно. Сервер сразу прикладывает зашифрованные данные.
4. **Режим 0-RTT (Zero Round Trip Time)**: если клиент уже подключался ранее, он может отправить полезные HTTP-данные сразу же в первом сообщении \`ClientHello\`.

**Безопасность TLS 1.3**:
- Удалены старые небезопасные шифры (RC4, 3DES, MD5, SHA-1).
- Удален обычный RSA для обмена ключами (теперь обязателен Perfect Forward Secrecy через Diffie-Hellman, защищающий прошлые сессии при компрометации приватного ключа сервера).
- Все сообщения после Hello шифруются (включая сертификаты сервера, скрывая имя домена от пассивного прослушивания).`,
    codeSnippet: {
      language: 'bash',
      code: `# Проверка поддерживаемой версии TLS на сервере с помощью openssl:
openssl s_client -connect google.com:443 -tls1_3
openssl s_client -connect google.com:443 -tls1_2`
    },
    interviewTips: [
      'Упомяните Perfect Forward Secrecy (PFS). Это ключевое свойство безопасности, гарантирующее, что если приватный ключ сервера будет украден в будущем, злоумышленник не сможет расшифровать ранее перехваченный и записанный трафик.'
    ],
    commonPitfalls: [
      'Использовать режим TLS 1.3 0-RTT без защиты от атак повторного воспроизведения (Replay Attacks). Злоумышленник может перехватить первый пакет и отправить его повторно (например, запрос на списание денег), поэтому 0-RTT стоит использовать только для безопасных GET-запросов.'
    ],
    tags: ['Networking', 'TLS', 'Security', 'Cryptography', 'Performance']
  },
  {
    id: 'networking-21',
    title: 'Что такое DNS и как пошагово проходит процесс разрешения доменного имени (DNS resolution)?',
    category: 'networking',
    difficulty: 'Junior',
    summaryAnswer: 'DNS преобразует доменное имя (example.com) в IP-адрес. Процесс идет по цепочке: Кэш браузера/ОС -> Локальный Resolver -> Root DNS (корневой) -> TLD DNS (.com) -> Authoritative DNS (авторитетный).',
    fullAnswer: `**DNS (Domain Name System)** — «телефонная книга» интернета. Компьютеры общаются по IP-адресам (192.0.2.1), а людям удобнее использовать символьные имена.

**Пошаговый резолв имени (на примере \`app.example.com\`):**

1. **Локальный кэш**: Браузер проверяет свой кэш, затем кэш операционной системы (\`/etc/hosts\` или DNS-клиент ОС).
2. **Recursive Resolver (Рекурсивный резолвер)**: Если IP не найден, запрос отправляется к DNS провайдера или публичному резолверу (например, 1.1.1.1 или 8.8.8.8).
3. **Root DNS Server (Корневой сервер)**: Резолвер спрашивает корневой сервер (всего 13 буквенных групп корневых серверов в мире). Корневой сервер отвечает адресом TLD-сервера для зоны \`.com\`.
4. **TLD DNS Server (Сервер верхней зоны)**: Ответственный за зону \`.com\` возвращает IP-адрес авторитетного DNS-сервера, обслуживающего домен \`example.com\`.
5. **Authoritative DNS Server (Авторитетный сервер)**: Хранит финальные DNS-записи домена. Он возвращает конкретную A-запись с IP-адресом для \`app.example.com\`.
6. **Кэширование**: Резолвер запоминает ответ на время, указанное в параметре **TTL (Time to Live)**, и передает IP-адрес браузеру.

**Основные типы DNS-записей:**
- **A**: Сопоставляет домен с IPv4 адресом.
- **AAAA**: Сопоставляет домен с IPv6 адресом.
- **CNAME**: Псевдоним (каноническое имя), ссылающийся на другой домен.
- **MX**: Указывает на почтовые серверы домена.
- **TXT**: Текстовые данные (SPF, DKIM, прохождение верификаций владения).`,
    codeSnippet: {
      language: 'bash',
      code: `# Пошаговый просмотр процесса рекурсивного резолва с помощью dig
dig +trace app.example.com

# Просмотр конкретной A-записи с ответом от сервера
dig A app.example.com +short`
    },
    interviewTips: [
      'Упомяните TTL (Time To Live). Если планируется миграция сервера на новый IP, рекомендуется заранее (за 24-48 часов) уменьшить TTL записи до 60 секунд, чтобы DNS-кэши по всему миру быстро обновились.'
    ],
    commonPitfalls: [
      'Путать CNAME и A-записи на apex-домене (@ или корень example.com). Записи CNAME по стандарту RFC нельзя ставить в корень домена, так как они конфликтуют с MX и NS записями.'
    ],
    tags: ['Networking', 'DNS', 'Protocols', 'Basics', 'Troubleshooting']
  },
  {
    id: 'networking-22',
    title: 'Что такое NAT (Network Address Translation) и чем отличается SNAT (Source NAT) от DNAT (Destination NAT)?',
    category: 'networking',
    difficulty: 'Junior',
    summaryAnswer: 'NAT преобразует IP-адреса в заголовках пакетов. SNAT подменяет IP источника (позволяет приватным серверам ходить в интернет). DNAT подменяет IP назначения (проброс портов для публикации внутреннего сервиса наружу).',
    fullAnswer: `**NAT (Network Address Translation)** применяется для экономии публичных IPv4 адресов и обеспечения безопасности внутренних сетей.

1. **SNAT (Source NAT / Masquerade)**:
   - **Что делает**: Меняет IP-адрес *источника* (Source IP) в отправляемом пакете.
   - **Применение**: Позволяет серверам из серых приватных подсетей (например, \`10.0.0.0/8\` или \`192.168.1.0/24\`) выходить в публичный интернет через один общий публичный IP роутера/NAT Gateway.
   - **PAT (Port Address Translation)**: Разновидность SNAT, когда роутер использует разные исходные порты для отслеживания сессий нескольких внутренних хостов.

2. **DNAT (Destination NAT / Port Forwarding)**:
   - **Что делает**: Меняет IP-адрес *назначения* (Destination IP) в входящем пакете.
   - **Применение**: Проброс входящего трафика из интернета на конкретную внутреннюю машину. Например, запрос на публичный IP роутера порт 80 перенаправляется на приватный IP веб-сервера \`192.168.1.50:8080\`.
   - Активно применяется в Kubernetes (Ingress / Service NodePort) и iptables/nftables.`,
    codeSnippet: {
      language: 'bash',
      code: `# Пример настройки SNAT (Маскарадинг) в iptables:
iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE

# Пример настройки DNAT (Проброс порта 80 на внутренний сервер):
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j DNAT --to-destination 10.0.0.5:8080`
    },
    interviewTips: [
      'Запомните мнемонику: SNAT применяется при *исходящем* трафике наружу (Postrouting), DNAT — при *входящем* трафике извне (Prerouting).'
    ],
    commonPitfalls: [
      'Забывать включать форвардинг пакетов в ядре Linux (\`sysctl -w net.ipv4.ip_forward=1\`), без которого маршрутизатор не будет пересылать трафик между интерфейсами.'
    ],
    tags: ['Networking', 'NAT', 'IPtables', 'Security', 'Linux']
  },
  {
    id: 'networking-23',
    title: 'Что происходит при вводе "curl -v https://example.com" с точки зрения сетевого стека?',
    category: 'networking',
    difficulty: 'Middle',
    summaryAnswer: '1) DNS резолв IP-адреса -> 2) Поиск MAC через ARP -> 3) Установка TCP 3-Way Handshake -> 4) TLS Handshake шифрование -> 5) Передача HTTP GET запроса -> 6) Чтение HTTP 200 OK ответа.',
    fullAnswer: `Классический фундаментальный вопрос на собеседовании. Пошаговый разбор:

1. **Парсинг URL и DNS Резолвинг (L7/L3)**:
   - Утилита \`curl\` извлекает домен \`example.com\` и порт (443 для HTTPS).
   - Выполняется системный вызов \`getaddrinfo()\`. Проверяется \`/etc/hosts\` и резолвится IP-адрес (например, \`93.184.216.34\`).

2. **Определение маршрута и ARP (L3/L2)**:
   - ОС смотрит в таблицу маршрутизации (\`ip route\`) и определяет через какой сетевой интерфейс и шлюз по умолчанию (Default Gateway) отправлять пакеты.
   - Если MAC-адрес шлюза неизвестен, отправляется **ARP-запрос** (Address Resolution Protocol) для получения MAC-адреса сетевой карты шлюза.

3. **TCP 3-Way Handshake (L4)**:
   - Устанавливается TCP-соединение на порт 443.
   - Выполняется рукопожатие: \`SYN\` -> \`SYN-ACK\` -> \`ACK\`.

4. **TLS Handshake (L6/L4)**:
   - Отправляется \`ClientHello\` (поддерживаемые шифры, имя домена SNI).
   - Сервер присылает сертификат, проверяется цепочка доверия CA.
   - Согласовывается симметричный сессионный ключ.

5. **HTTP GET запрос и ответ (L7)**:
   - Запрос \`GET / HTTP/1.1\` шифруется сессионным ключом и передается в TCP-поток.
   - Сервер отвечает зашифрованным пакетом \`HTTP/1.1 200 OK\` с HTML-содержимым.
   - Соединение закрывается (\`FIN-ACK\` или поддерживается через \`Keep-Alive\`).`,
    codeSnippet: {
      language: 'bash',
      code: `# Подробный вывод всех шагов соединения curl:
curl -v https://example.com

# Дамп сетевых пакетов для анализа процесса с помощью tcpdump:
tcpdump -i any port 443 -nn -X`
    },
    interviewTips: [
      'Упомяните SNI (Server Name Indication) во время TLS Handshake. Без SNI сервер с несколькими доменными именами на одном IP не знал бы, какой именно TLS-сертификат вернуть клиенту.'
    ],
    commonPitfalls: [
      'Забывать про уровень ARP (L2) при описании того, как пакет находит локальный шлюз (gateway).'
    ],
    tags: ['Networking', 'HTTP', 'TCP', 'TLS', 'DNS', 'ARP', 'Troubleshooting']
  },
  {
    id: 'networking-24',
    title: 'В чем ключевые отличия HTTP/1.1, HTTP/2 и HTTP/3 (QUIC)?',
    category: 'networking',
    difficulty: 'Middle',
    summaryAnswer: 'HTTP/1.1 передает текст и страдает от Head-of-line blocking. HTTP/2 вводит бинарные фреймы и мультиплексирование в 1 TCP соединении. HTTP/3 переходит с TCP на UDP (протокол QUIC), решая проблему Head-of-line blocking на уровне транспортного слоя.',
    fullAnswer: `Эволюция главного протокола веба:

1. **HTTP/1.1**:
   - **Текстовый протокол**.
   - На каждый ресурс (картинка, js-файл) требуется отдельный TCP-запрос или очереди запросов (pipelining).
   - **Head-of-Line (HOL) Blocking**: если первый запрос зависает, все последующие блокируются.

2. **HTTP/2**:
   - **Бинарный протокол** (заголовки сжимаются через HPACK).
   - **Мультиплексирование**: множество параллельных запросов и ответов передаются внутри **ОДНОГО TCP-соединения** одновременно в виде отдельных фреймов/потоков (streams).
   - **Server Push**: Сервер может прислать критичные ресурсы до того, как браузер их запросит.
   - *Проблема*: Если на сетевом уровне потерян хотя бы 1 TCP-пакет, тормозят ВСЕ мультиплексированные запросы из-за пересборки TCP-очереди.

3. **HTTP/3 (QUIC)**:
   - **Работает поверх UDP** вместо TCP!
   - Разработан Google (QUIC). Устраняет TCP HOL Blocking полностью: потеря пакета в одном HTTP-потоке не задерживает данные в соседних потоках.
   - **Встроенное шифрование**: TLS 1.3 вшит непосредственно в протокол QUIC (быстрый запуск 0-RTT/1-RTT).
   - **Connection Migration**: Соединение идентифицируется Connection ID, а не комбинацией (IP:Port). Если пользователь переключается с Wi-Fi на LTE 4G/5G, загрузка сайта НЕ прерывается!`,
    codeSnippet: {
      language: 'bash',
      code: `# Проверка поддержки HTTP/2 и HTTP/3 с помощью curl:
curl --http2 -I https://nghttp2.org
curl --http3 -I https://cloudflare.com`
    },
    interviewTips: [
      'Подчеркните, что HTTP/3 не заменяет TLS, а интегрирует TLS 1.3 непосредственно внутрь QUIC поверх UDP.'
    ],
    commonPitfalls: [
      'Думать, что UDP в HTTP/3 делает его ненадежным. QUIC на программном уровне сам реализует подтверждение доставки пакетов, контроль заторов и повторную отправку, сохраняя надежность TCP.'
    ],
    tags: ['Networking', 'HTTP', 'QUIC', 'UDP', 'TCP', 'Performance']
  },
  {
    id: 'networking-25',
    title: 'Как устроены подсети и маски CIDR? Как рассчитать количество свободных IP-адресов в нотации /24, /27, /32?',
    category: 'networking',
    difficulty: 'Senior',
    summaryAnswer: 'CIDR (Classless Inter-Domain Routing) задает длину маски сети в битах (от 0 до 32). Количество адресов рассчитывается как 2^(32 - N). В подсеть входят служебный сетевой адрес (первый) и широковещательный broadcast (последний).',
    fullAnswer: `**Бесклассовая адресация (CIDR)** заменяет устаревшие классы сетей (Class A, B, C) гибким выделением бит под адрес сети и адрес хоста.

**Формула расчета IP-адресов**:
Общее количество IP = $2^{(32 - N)}$, где $N$ — значение CIDR маски.
Доступно для назначения устройствам = $2^{(32 - N)} - 2$ (вычитается Network Address и Broadcast Address).

**Примеры популярных нотаций**:
- **\`192.168.1.0/24\`**:
  - Маска: \`255.255.255.0\` (24 единицы в бинарном виде).
  - Под хосты остается 8 бит: $2^8 = 256$ IP-адресов (доступно 254).
  - Сетевой адрес: \`192.168.1.0\`, Broadcast: \`192.168.1.255\`.
- **\`10.0.0.0/27\`**:
  - Под хосты остается $32 - 27 = 5$ бит: $2^5 = 32$ IP-адреса (доступно 30).
- **\`10.0.0.1/32\`**:
  - Маска подсети \`255.255.255.255\`. Означает ровно **1 единственный конкретный IP-адрес** (host route).
- **\`0.0.0.0/0\`**:
  - Любой IP-адрес в интернете (Default Route / маршрут по умолчанию).

**Особенности в AWS / Cloud / Kubernetes**:
В облаках (например, AWS VPC) из каждой подсети резервируется не 2, а **5 IP-адресов** (Network, VPC Router, DNS, Future use, Broadcast).`,
    codeSnippet: {
      language: 'bash',
      code: `# Расчет диапазона CIDR подсети в Linux с помощью ipcalc
ipcalc 192.168.1.0/27`
    },
    interviewTips: [
      'Будьте готовы быстро посчитать на собеседовании: /24 = 256 IP, /25 = 128 IP, /26 = 64 IP, /27 = 32 IP, /28 = 16 IP, /30 = 4 IP (часто для point-to-point линков).'
    ],
    commonPitfalls: [
      'Забывать вычитать 2 адреса (сетевой и бродкаст) при проектировании CIDR блоков для подов в Kubernetes, из-за чего подсеть неожиданно переполняется.'
    ],
    tags: ['Networking', 'CIDR', 'IP', 'Subnet', 'Cloud', 'Kubernetes']
  }
];

