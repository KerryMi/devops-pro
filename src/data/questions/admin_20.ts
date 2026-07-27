import { Question } from '../../types';

export const ADMIN_20_QUESTIONS: Question[] = [
  // =========================================================================
  // ============================ HARDWARE & IPMI ============================
  // =========================================================================
  {
    id: 'hw-1',
    title: 'Сервер не отвечает по сети, как получить доступ без физического присутствия в ЦОД?',
    category: 'linux',
    difficulty: 'Junior',
    summaryAnswer: 'С помощью встроенного модуля внеполосного управления IPMI (iDRAC, ILO, IPMI/BMC) или внешнего IP-KVM. Если доступа нет — обращение к дежурному инженеру дата-центра.',
    fullAnswer: `При сетевой недоступности сервера стандартный SSH-доступ перестает работать. Варианты решения:
1. **IPMI / BMC (Out-of-band management)**: Встроенный чип на материнской плате (Dell iDRAC, HP iLO, Supermicro IPMI), работающий на отдельном сетевом порту независимо от ОС. Позволяет зайти в веб-интерфейс или через SOL (Serial-over-LAN) и увидеть графическую/текстовую консоль сервера, перезагрузить его по питанию или смонтировать ISO-образ.
2. **IP-KVM (Keyboard-Video-Mouse over IP)**: Внешнее устройство, подключаемое к видеовыходу (VGA/HDMI) и USB-портам сервера. Передает видеопоток консоли по сети.
3. **Smart PDU**: Управляемый блок распределения питания для удаленного выполнения розеткой цикла Power Cycle.
4. **Hands-on / Remote Hands**: Заявка дежурному инженеру дата-центра для физического подсоединения монитора с клавиатурой или проверки индикации дисков/питания.`,
    codeSnippet: {
      language: 'bash',
      code: `# Подключение к консоли сервера через ipmitool по сети (SOL):
ipmitool -I lanplus -H 192.168.100.50 -U admin -P secret sol activate

# Удаленная перезагрузка питания через IPMI:
ipmitool -I lanplus -H 192.168.100.50 -U admin -P secret power reset`
    },
    interviewTips: [
      'Подчеркните, что IPMI работает, даже если операционная система полностью зависла или выключена, но сервер подключен к электросети.'
    ],
    commonPitfalls: [
      'Путать IP-KVM (передача видео/ввода) и IPMI (полноценный микроконтроллер управления железом).'
    ],
    tags: ['Hardware', 'IPMI', 'iDRAC', 'iLO', 'Troubleshooting']
  },
  {
    id: 'hw-2',
    title: 'Что такое KVM (не гипервизор) и как его использовать?',
    category: 'linux',
    difficulty: 'Junior',
    summaryAnswer: 'IP-KVM — аппаратное устройство (Keyboard, Video, Mouse), транслирующее видеосигнал с сервера и команды клавиатуры/мыши через сетевой IP-протокол.',
    fullAnswer: `KVM (Keyboard, Video, Mouse) over IP — это физический модуль или устройство, подключаемое непосредственно к видеокарте (VGA/DisplayPort/HDMI) и USB-портам сервера.

**Ключевые особенности**:
- Обособлен от операционной системы и ядра Linux. Работает даже при поврежденном загрузчике GRUB или процессе падения Kernel Panic.
- Позволяет заходить в настройку BIOS/UEFI, меню выбора ядер в GRUB, восстанавливать поврежденные файловые системы в Single User Mode.
- Обычно подключается дежурными инженерами дата-центра по запросу, если на сервере отсутствует встроенный IPMI/BMC.`,
    tags: ['Hardware', 'KVM', 'Data Center', 'Troubleshooting']
  },
  {
    id: 'hw-3',
    title: 'Что такое IPMI и BMC? Какие подсистемы в них входят?',
    category: 'linux',
    difficulty: 'Middle',
    summaryAnswer: 'IPMI — стандарт интерфейса управления сервером. BMC (Baseboard Management Controller) — автономный микроконтроллер на материнской плате, реализующий IPMI.',
    fullAnswer: `**IPMI (Intelligent Platform Management Interface)** — стандартизированный протокол мониторинга и управления физическим состоянием сервера.

**BMC (Baseboard Management Controller)** — специализированный SoC микроконтроллер со своей собственной операционной системой (обычно Linux), встроенной Flash-памятью и выделенным сетевым MAC/IP-адресом.

**Подсистемы и возможности**:
1. **Sensors (Датчики)**: Считывание температуры CPU/чипсета, напряжения линий БП, оборотов кулеров (RPM).
2. **Power Control**: Включение, выключение, перезагрузка (Hard Reset / Power Cycle), Graceful Shutdown.
3. **Non-Volatile Storage (SEL - System Event Log)**: Журнал аппаратных ошибок (падение памяти ECC, отказы блоков питания).
4. **KVM-over-IP & Virtual Media**: Передача видеоконсоли и монтирование .iso образов с ПК администратора по протоколам HTML5/Java.
5. **IPMB (Intelligent Platform Management Bus)**: Внутренняя шина на базе I2C для связи BMC с дополнительными контроллерами (например, RAID-контроллерами).`,
    codeSnippet: {
      language: 'bash',
      code: `# Чтение журнала аппаратных событий (System Event Log):
ipmitool sel list

# Просмотр всех датчиков (температура, обороты кулеров, напряжение):
ipmitool sensor list`
    },
    interviewTips: [
      'Упомяните, что BMC необходимо помещать в изолированный Out-of-band Management VLAN без доступа из интернета в целях безопасности.'
    ],
    tags: ['Hardware', 'IPMI', 'BMC', 'Sysadmin']
  },
  {
    id: 'hw-4',
    title: 'Какие преимущества предоставляет IPMI в сравнении с традиционным IP-KVM?',
    category: 'linux',
    difficulty: 'Junior',
    summaryAnswer: 'IPMI встроен постоянно, дает полный доступ к датчикам (температура/питание), логам железа SEL, управлению электропитанием и автоматизации CLI (ipmitool).',
    fullAnswer: `Сравнение IPMI и внешнего IP-KVM:
1. **Постоянная доступность**: IPMI разведен на плате сервера и доступен всегда. Традиционный внешний IP-KVM нужно заказывать у техподдержки ЦОД для физического подключения какабелями.
2. **Управление питанием**: Внешний KVM видит только картинку с экрана и передает нажатия клавиш. IPMI умеет выполнять холодную перезагрузку и выключение.
3. **Мониторинг железа**: IPMI предоставляет данные о перегреве, отвале планок памяти ECC, выходе из строя одного из дублированных блоков питания (PWS).
4. **Автоматизация**: IPMI поддерживает работу через консольную утилиту \`ipmitool\` и протоколы SNMP/Redfish API, позволяя скриптовать перезагрузки и сбор метрик.`,
    tags: ['Hardware', 'IPMI', 'KVM', 'Sysadmin']
  },
  {
    id: 'hw-5',
    title: 'Как посмотреть модели CPU, количество ядер, поддерживаемые инструкции и режим работы процессора?',
    category: 'linux',
    difficulty: 'Junior',
    summaryAnswer: 'Модель и флаги — cat /proc/cpuinfo или lscpu. Ядра и потоки — dmidecode -t processor. Режим частоты — scaling_governor в /sys/devices/system/cpu/',
    fullAnswer: `Инструменты диагностики процессора:
1. **Информация о процессоре**:
   - \`lscpu\`: Краткая структурированная сводка (модель, L1/L2/L3 кеши, виртуализация, архитетура).
   - \`cat /proc/cpuinfo\`: Полный список логических процессоров и флагов (sse4_2, avx2, vmx).
2. **Физические vs Логические ядра**:
   - \`dmidecode -t processor | grep "Core Enabled"\`: Количество физических ядер.
   - \`dmidecode -t processor | grep "Thread Count"\`: Количество потоков (учитывая Hyper-Threading).
3. **Режимы энергосбережения и частоты (CPU Governors)**:
   - Файлы \`/sys/devices/system/cpu/cpu*/cpufreq/scaling_governor\` содержат текущие политики:
     - **performance**: Максимальная частота CPU без сброса (для high-load серверов и БД).
     - **powersave**: Минимальная частота для экономии энергии.
     - **ondemand / schedutil**: Динамическое изменение частоты в зависимости от нагрузки.`,
    codeSnippet: {
      language: 'bash',
      code: `# Просмотр сводки CPU:
lscpu

# Проверка текущего CPU Governor для всех ядер:
cat /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor

# Установка режима максимальной производительности:
echo "performance" | sudo tee /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor`
    },
    tags: ['Linux', 'Hardware', 'CPU', 'lscpu', 'Troubleshooting']
  },
  {
    id: 'hw-6',
    title: 'Как узнать тип оперативной памяти, модель материнской платы и версию BIOS в Linux?',
    category: 'linux',
    difficulty: 'Junior',
    summaryAnswer: 'Через утилиту dmidecode (DMI/SMBIOS): --type memory (DDR3/DDR4/DDR5, частота), --type baseboard (плата), --type BIOS (версия и вендор).',
    fullAnswer: `Утилита \`dmidecode\` считывает данные из таблиц SMBIOS сервера без необходимости перезагрузки в BIOS.

**Команды**:
1. **Оперативная память (RAM)**:
   \`sudo dmidecode --type memory\` (или \`dmidecode -t 17\`). Покажет тип (DDR4/DDR5), объём каждой планки, частоту (Speed / Configured Clock Speed), серийный номер и слот на плате.
2. **Материнская плата**:
   \`sudo dmidecode --type baseboard\` (или \`dmidecode -t 2\`). Выводит производителя (Supermicro, ASUS, HP), модель планки и серийный номер.
3. **Версия BIOS / UEFI**:
   \`sudo dmidecode --type BIOS\` (или \`dmidecode -t 0\`). Показывает версию прошивки, дату релиза и производителя (AMI, Phoenix, Award).`,
    codeSnippet: {
      language: 'bash',
      code: `# Узнать слоты памяти, их объём и частоту:
sudo dmidecode -t memory | grep -E "Size|Type:|Speed|Locator" | grep -v "No Module Installed"

# Узнать версию BIOS:
sudo dmidecode -t bios | grep -E "Vendor|Version|Release Date"`
    },
    tags: ['Linux', 'Hardware', 'RAM', 'BIOS', 'dmidecode']
  },
  {
    id: 'hw-7',
    title: 'Как посмотреть значения датчиков температуры, напряжения и оборотов вентиляторов?',
    category: 'linux',
    difficulty: 'Junior',
    summaryAnswer: 'В ОС — с помощью утилиты sensors (пакет lm-sensors). На аппаратном уровне — через ipmitool / ipmicfg -pminfo.',
    fullAnswer: `1. **Утилита \`sensors\` (lm-sensors)**:
   Считывает показания с драйверов ядра (coretemp, k10temp). Выводит температуру ядер процессора, чипсета и критические пороги (high/crit).

2. **Аппаратные датчики через IPMI**:
   \`ipmitool sensor list\` или утилиты от вендора (\`ipmicfg -pminfo\` для Supermicro).
   Показывает:
   - Входное и выходное напряжение БП (220V AC, 12V DC).
   - Скорость вращения вентиляторов в RPM.
   - Потребляемую мощность сервера в Ваттах (Watt).`,
    codeSnippet: {
      language: 'bash',
      code: `# Установка и считывание температур CPU:
sudo apt install lm-sensors
sudo sensors

# Просмотр статуса БП и кулеров через IPMI:
sudo ipmitool sdr type Temperature
sudo ipmitool sdr type Fan`
    },
    tags: ['Linux', 'Hardware', 'Sensors', 'IPMI', 'Monitoring']
  },
  {
    id: 'hw-8',
    title: 'Как посмотреть модель сетевого адаптера и состояния его интерфейсов (UP, DOWN, NO-CARRIER)?',
    category: 'linux',
    difficulty: 'Junior',
    summaryAnswer: 'Модель — lspci | grep net или lshw -c network. Состояние — ip link show / ip a s и ethtool <iface>. Флаги UP/NO-CARRIER показывают линк.',
    fullAnswer: `1. **Определение аппаратной модели**:
   - \`lspci | grep -i net\`: Покажет чипсет (Intel 82576, Broadcom BCM5720, Mellanox ConnectX).
   - \`lshw -class network -short\`: Модель, путь шины и логические имена интерфейсов.

2. **Проверка состояния интерфейса**:
   - \`ip link show eth0\` или \`ip a s eth0\`:
     - **UP**: Интерфейс программно поднят.
     - **LOWER_UP**: Физический линк установлен (кабель вставлен и есть сигнал).
     - **NO-CARRIER**: Кабель не подключен или нет физического линка на коммутаторе.
     - **PROMISC**: Режим прослушивания всех пакетов (для tcpdump или мостов).
3. **Детальная диагностика физического уровня**:
   - \`ethtool eth0\`: Скорость (1000Mb/s, 10Gb/s), дуплекс (Full), статус Link detected.`,
    codeSnippet: {
      language: 'bash',
      code: `# Проверка физического линка и скорости порта:
sudo ethtool eth0 | grep -E "Speed|Duplex|Link detected"

# Список всех сетевых карт с их статусами:
ip -br link show`
    },
    tags: ['Linux', 'Networking', 'Hardware', 'ethtool', 'iproute2']
  },

  // =========================================================================
  // ============================ LINUX INTERNALS ============================
  // =========================================================================
  {
    id: 'linux-boot-flow',
    title: 'Расскажите подробно про процесс загрузки Linux с момента нажатия кнопки питания.',
    category: 'linux',
    difficulty: 'Middle',
    summaryAnswer: 'POST -> BIOS/UEFI -> MBR/GPT (Bootloader GRUB) -> Загрузка ядра (vmlinuz) -> Монтирование initramfs -> Запуск PID 1 (systemd) -> Инициализация targets/services.',
    fullAnswer: `Этапы загрузки операционной системы Linux:
1. **Power-On & POST (Power-On Self Test)**: Подача питания на материнскую плату, проверка процессора, оперативной памяти и основных контроллеров.
2. **BIOS / UEFI**:
   - **BIOS**: Ищет MBR (Master Boot Record, первые 512 байт диска) и передает управление коду загрузчика Stage 1.
   - **UEFI**: Ищет специальный раздел EFI System Partition (ESP, FAT32) и напрямую запускает файл загрузчика \`.efi\` (например \`grubx64.efi\`).
3. **Загрузчик (GRUB2)**:
   - Загружает с диска ядро Linux (\`vmlinuz\`) и образ виртуального диска в памяти (\`initramfs\` / \`initrd\`).
   - Передает параметры ядра (kernel cmdline, например \`root=UUID=... quiet rw\`).
4. **Инициализация Ядра (Kernel Initialization)**:
   - Ядро распаковывается в RAM, инициализирует CPU, MMU управление памятью и шины PCI.
   - Монтирует временную файловую систему \`initramfs\`, где лежат минимальные модули ядра (драйверы RAID, NVMe, Ext4/XFS).
5. **Монтирование корня (Root FS)**:
   - После загрузки драйверов ядро перемонтирует реальную корневую файловую систему \`/\` и передает управление первому процессу.
6. **Процесс инициализации (PID 1 - systemd / init)**:
   - Запускается \`/sbin/init\` (обычно симлинк на \`/lib/systemd/systemd\`).
   - Systemd параллельно запускает юниты и сервисы согласно дефолтному target (например \`multi-user.target\` или \`graphical.target\`).`,
    interviewTips: [
      'Уделите особое внимание роли initramfs: объясните, что без него ядро не сможет смонтировать корень, если драйвер диска или ФС собран модулем.'
    ],
    tags: ['Linux', 'Kernel', 'GRUB', 'Boot', 'Systemd']
  },
  {
    id: 'linux-pid0-pid1',
    title: 'Что за процессы в Linux с PID 0 и PID 1?',
    category: 'linux',
    difficulty: 'Middle',
    summaryAnswer: 'PID 0 — swapper/idle процесс ядра (выполняется, когда CPU свободен). PID 1 — процесс инициализации (systemd/init), родитель всех процессов.',
    fullAnswer: `1. **PID 0 (Swapper / Idle process)**:
   - Это не обычный пользовательский процесс, а часть ядра Linux.
   - Создается при старте ядра. Его задача — переводить CPU в состояние ожидания (энергосберегающий режим NOP/HLT), когда в очереди планировщика (scheduler) нет готовых к выполнению процессов (runnable tasks).

2. **PID 1 (Init / systemd)**:
   - Первый процесс в пользовательском пространстве (Userspace).
   - Родитель всех процессов в системе. Если процесс-родитель умирает до завершения дочернего, процесс-сирота "усыновляется" PID 1.
   - Отвечает за сбор кодов завершения (reaping zombie processes) и управление службами. Падение PID 1 вызывает Kernel Panic всей системы.`,
    tags: ['Linux', 'Kernel', 'Processes', 'Systemd']
  },
  {
    id: 'linux-posix',
    title: 'Что такое POSIX и зачем он нужен?',
    category: 'linux',
    difficulty: 'Junior',
    summaryAnswer: 'POSIX (Portable Operating System Interface) — набор стандартов IEEE для обеспечения совместимости исходного кода между Unix-подобными ОС.',
    fullAnswer: `**POSIX (Portable Operating System Interface)** определяет стандартные API на уровне исходного кода C/C++ для операционных систем (Linux, macOS, BSD, AIX).

**Что входит в POSIX**:
- Стандарты системных вызовов (open, read, write, fork, exec, kill).
- Работа с потоками (POSIX Threads — pthreads).
- Механизмы IPC (семафоры POSIX, shared memory, очереди сообщений).
- Оболочка Shell и базовые утилиты (ls, cd, grep, find).

**Зачем нужен**:
Программа, написанная строго с соблюдением POSIX, может быть скомпилирована и запущена на любой POSIX-совместимой ОС без переписывания исходного кода.`,
    tags: ['Linux', 'POSIX', 'Standards', 'OS']
  },
  {
    id: 'linux-runlevels',
    title: 'Что такое уровни выполнения (Runlevels) в Linux и чем они заменены в systemd?',
    category: 'linux',
    difficulty: 'Junior',
    summaryAnswer: 'Runlevels (0-6) — режимы работы системы в SysVinit. В modern Linux заменены на systemd targets.',
    fullAnswer: `Таблица соответствия Runlevels и Systemd Targets:

- **Runlevel 0** (\`poweroff.target\`): Выключение системы.
- **Runlevel 1** (\`rescue.target\` / Single User Mode): Режим восстановления, сеть выключена, работает только root.
- **Runlevel 2**: Многопользовательский текстовый режим без поддержки сетевых ФС (NFS).
- **Runlevel 3** (\`multi-user.target\`): Стандартный многопользовательский консольный режим с сетью и сервисами.
- **Runlevel 4**: Не используется / зарезервирован.
- **Runlevel 5** (\`graphical.target\`): Графический режим (X11/Wayland + GDM/GDM3).
- **Runlevel 6** (\`reboot.target\`): Перезагрузка системы.`,
    codeSnippet: {
      language: 'bash',
      code: `# Просмотр текущего default target:
systemctl get-default

# Изменение режимов загрузки на консольный:
sudo systemctl set-default multi-user.target`
    },
    tags: ['Linux', 'Systemd', 'Runlevels', 'Sysadmin']
  },
  {
    id: 'linux-exec-cmd-flow',
    title: 'Опишите, что происходит с точки зрения процессов при выполнении команды в консоли (например ls -l).',
    category: 'linux',
    difficulty: 'Middle',
    summaryAnswer: 'Shell вызывает fork() для создания дочернего процесса, затем execve() заменяет его код на /bin/ls. По завершению вызывается exit(), родитель получает SIGCHLD и собирает код возврата через wait().',
    fullAnswer: `Подробный жизненный цикл процесса при выполнении команды в Bash:

1. **fork()**:
   Оболочка (Bash) совершает системный вызов \`fork()\`. Ядро создает точную копию процесса Bash (дочерний процесс) с новым PID, дублируя файловые дескрипторы и виртуальную память (с использованием CoW - Copy-On-Write).
2. **execve()**:
   Дочерний процесс заменяет свое адресное пространство и исполняемый код программой \`/bin/ls\` с помощью системного вызова \`execve("/bin/ls", ["ls", "-l"], envp)\`.
3. **Выполнение**:
   Интерпретатор ядра загружает бинарник \`ls\`, связывает динамические библиотеки (\`ld-linux.so\`) и выполняет функцию \`main()\`. Вывод идет в \`stdout\` (FD 1).
4. **exit()**:
   Завершив работу, \`ls\` вызывает \`exit(code)\` (например \`exit(0)\`). Процесс переходит в состояние Zombie (\`Z\`), ожидая, пока родитель прочитает его код возврата.
5. **SIGCHLD & wait()**:
   Ядро отправляет родителю (Bash) сигнал \`SIGCHLD\`. Процесс Bash, находившийся в состоянии ожидания из-за системного вызова \`waitpid()\`, считывает код выхода и освобождает структуру дочернего процесса в таблице процессов ядра.`,
    interviewTips: [
      'Это классический фундаментальный вопрос на понимание системных вызовов fork, exec, exit, wait и сигналов.'
    ],
    tags: ['Linux', 'Syscalls', 'Fork', 'Exec', 'Processes']
  },
  {
    id: 'linux-load-average-deep',
    title: 'Load Average на сервере 900 900 900, но сервер не тормозит. Почему это происходить и как понять, проблема ли это?',
    category: 'linux',
    difficulty: 'Senior',
    summaryAnswer: 'Load Average — это среднее число процессов в состояниях R (Running) и D (Uninterruptible Sleep/IO). Огромный LA при нормальном CPU означает затор на медленном I/O (высокий wa).',
    fullAnswer: `**Что такое Load Average в Linux**:
В отличие от BSD/Unix (где учитываются только процессы в очереди CPU), в Linux Load Average включает:
- Процессы в состоянии **R (Running / Runnable)**: Нагружают CPU или ждут своей очереди в планировщике.
- Процессы в состоянии **D (Uninterruptible Sleep)**: Застряли в ожидании дискового I/O, сетевой ФС (NFS) или блокировок ядра.

**Почему LA = 900, но система отзывчива**:
Если CPU простаивает (параметр \`id\` высок, \`us\` и \`sy\` низкие), а параметр \`wa\` (I/O wait) высокий, значит, 900 процессов застряли в состоянии **D**, ожидая ответа от медленного дискового накопителя, зависшего NFS-шара или SAN-хранилища.
При этом процессор полностью свободен для обработки команд интерактивной SSH-сессии!

**Как диагностировать**:
1. Выполнить \`top\` или \`htop\` и проверить соотношение %us / %sy / %wa.
2. Проверить число процессов в статусе D: \`ps aux | awk '$8 ~ /D/ {print $0}'\`.
3. Посмотреть нагрузку на дисковые устройства с помощью \`iostat -xz 1\`. Если %util на дисках близок к 100% — у вас проблема в дисковой подсистеме.`,
    codeSnippet: {
      language: 'bash',
      code: `# Найти процессы, застрявшие в дисковом ожидании (статус D):
ps -eo pid,user,state,time,comm | awk '$3=="D"'

# Проверить задержки дисков (await, %util):
iostat -xz 1`
    },
    tags: ['Linux', 'LoadAverage', 'IOWait', 'Troubleshooting', 'Performance']
  },
  {
    id: 'linux-too-many-open-files',
    title: 'Приложение пишет в логи "Too many open files". Как диагностировать и исправить?',
    category: 'linux',
    difficulty: 'Middle',
    summaryAnswer: 'Причина — исчерпание лимитов открытых файловых дескрипторов (ulimit -n) процесса или системы. Лечится поднятием LimitNOFILE в systemd или limits.conf.',
    fullAnswer: `Шаги диагностики и решения:

1. **Проверка текущих лимитов процесса**:
   \`cat /proc/<PID>/limits | grep "Max open files"\`
2. **Подсчет реально открытых дескрипторов**:
   \`ls -1 /proc/<PID>/fd | wc -l\` или \`lsof -p <PID> | wc -l\`
3. **Проверка системного глобального лимита ядра**:
   \`sysctl fs.file-max\`
4. **Увеличение лимитов**:
   - **Для процессов под управлением Systemd**:
     Отредактировать файл юнита \`/etc/systemd/system/myservice.service\` и добавить в секцию \`[Service]\`:
     \`LimitNOFILE=65536\`
     Затем: \`systemctl daemon-reload && systemctl restart myservice\`
   - **Для обычных пользователей**:
     В \`/etc/security/limits.conf\`:
     \`* soft nofile 65536\`
     \`* hard nofile 65536\``,
    codeSnippet: {
      language: 'bash',
      code: `# Посмотреть лимиты конкретного процесса PID 1234:
grep "Max open files" /proc/1234/limits

# Посмотреть сколько файлов открыто процессами в системе сгруппировано:
lsof | awk '{print $1}' | sort | uniq -c | sort -rn | head -n 10`
    },
    tags: ['Linux', 'lsof', 'ulimit', 'Limits', 'Troubleshooting']
  },
  {
    id: 'linux-stop-writing-fd',
    title: 'Как заставить приложение перестать писать в файл лога, не перезапускать и не завершая процесс?',
    category: 'linux',
    difficulty: 'Senior',
    summaryAnswer: 'Найти файловый дескриптор через lsof, подключиться отладчиком gdb к PID и вызвать close(FD) или перенаправить в /dev/null.',
    fullAnswer: `Если приложение пишет гигабайты логов и забивает диск, а перезапускать его нельзя (Production DB / High-load):

**Способ 1: Использование GDB (GNU Debugger)**:
1. Находим номер файлового дескриптора лога:
   \`sudo lsof -p <PID> | grep access.log\` (допустим FD = 4).
2. Подключаемся к процессу через gdb:
   \`sudo gdb -p <PID>\`
3. Закрываем или перенаправляем дескриптор:
   \`(gdb) p close(4)\`
   \`(gdb) p open("/dev/null", 1)\` (O_WRONLY)
   \`(gdb) detach\`
   \`(gdb) quit\`

**Способ 2: Обнуление файла на лету**:
Вместо закрытия дескриптора просто очищать файл: \`> /var/log/huge_app.log\` или \`truncate -s 0 /var/log/huge_app.log\`.`,
    tags: ['Linux', 'gdb', 'lsof', 'Debugging', 'Production']
  },
  {
    id: 'linux-zombie-deep',
    title: 'Что такое зомби-процессы, как их отловить, создаются ли они при SIGKILL и как удалить?',
    category: 'linux',
    difficulty: 'Middle',
    summaryAnswer: 'Зомби (Z) — завершившийся процесс, чей код выхода не прочитан родителем. SIGKILL не поможет. Удаляются только завершением родительского процесса.',
    fullAnswer: `**Что такое Zombie Process (состояние Z)**:
Когда процесс завершается (\`exit()\`), его память и ресурсы высвобождаются, но запись в таблице процессов ядра сохраняется, пока родительский процесс не вызовет \`wait()\` или \`waitpid()\`.

**Опасность зомби-процессов**:
Они не потребляют CPU или RAM, но занимают уникальные идентификаторы PID. Если число зомби достигнет значения \`/proc/sys/kernel/pid_max\`, система не сможет создавать новые процессы.

**Можно ли убить зомби через \`kill -9 PID\`?**:
**НЕТ!** Зомби уже мертв (код не исполняется, сигналы не обрабатываются).

**Как избавиться от зомби**:
1. Отправить родительскому процессу сигнал \`SIGCHLD\` (\`kill -s SIGCHLD <PPID>\`), побуждая его вызывать \`wait()\`.
2. Если родитель не реагирует — завершить РОДИТЕЛЬСКИЙ процесс (\`kill <PPID>\`). Зомби будет усыновлен PID 1 (systemd), который мгновенно заберет код выхода и очистит таблицу.`,
    codeSnippet: {
      language: 'bash',
      code: `# Поиск всех зомби процессов в системе:
ps aux | awk '$8 ~ /Z/ {print $0}'

# Команда для создания тестового зомби-процесса:
(sleep 1 & exec /bin/sleep 10)`
    },
    tags: ['Linux', 'Processes', 'Zombie', 'Troubleshooting']
  },
  {
    id: 'linux-swap-swappiness-memory',
    title: 'Зачем нужен Swap в Linux? Что такое Anonymous Pages, Dirty Pages и Swappiness?',
    category: 'linux',
    difficulty: 'Senior',
    summaryAnswer: 'Swap нужен не как запасная память, а для выгрузки неиспользуемой анонимной памяти (Anonymous Pages), высвобождая RAM под Page Cache диска.',
    fullAnswer: `Разбор работы памяти и файла/раздела подкачки (Swap):

1. **Типы страниц памяти**:
   - **Page Cache (File-backed)**: Копии файлов с диска. Чистые страницы можно мгновенно выкинуть из RAM, если нужна память.
   - **Dirty Pages**: Измененные в RAM данные файлов, которые еще не сброшены на диск дисковым демоном \`flush\`.
   - **Anonymous Pages**: Память процессов (куча heap, стек, переменные), не связанная с файлами на диске. Не может быть просто удалена!

2. **Зачем нужен Swap**:
   Без Swap анонимные страницы намертво блокируются в RAM. Если памяти мало, ядро вынуждено выкидывать полезный Page Cache, что приводит к дисковому трэшингу (Thrashing). Swap позволяет выгрузить старые неактивные анонимные страницы на диск, сохраняя высокий Page Cache для быстродействия диска.

3. **Параметр \`vm.swappiness\` (0-100)**:
   Определяет баланс ядра между выгрузкой анонимных страниц в Swap и удалением Page Cache:
   - \`swappiness = 60\` (default): Сбалансированный режим.
   - \`swappiness = 10\`: Ядро до последнего избегает Swap, сохраняя анонимную память в RAM. Рекомендуется для баз данных (PostgreSQL/Redis).
   - \`swappiness = 0\`: Выгрузка анонимной памяти происходит только при угрозе OOM.`,
    tags: ['Linux', 'Memory', 'Swap', 'Swappiness', 'Kernel']
  },

  // =========================================================================
  // ============================ FILESYSTEM & STORAGE =======================
  // =========================================================================
  {
    id: 'fs-inodes-explained',
    title: 'Что такое Inode (индексный дескриптор), где хранится и что происходит при их исчерпании?',
    category: 'linux',
    difficulty: 'Middle',
    summaryAnswer: 'Inode — структура данных метаданных файла (размер, владельцы, права, блоки диска). При исчерпании инод нельзя создать файл даже при наличии гигабайт свободного места.',
    fullAnswer: `**Что такое Inode (Index Node)**:
Структура данных в файловой системе, хранящая метаданные объекта:
- Размер файла в байтах.
- Права доступа (UID, GID, mode rwx, SUID/SGID).
- Временные метки (atime, mtime, ctime).
- Указатели на физические блоки диска с содержимым.
*Имя файла в Inode НЕ хранится!* Имя файла хранится в структуре каталога.

**Где физически находятся**:
Выделяются при форматировании ФС (Ext4) в таблицах инод (Inode Tables) каждой группы блоков. В XFS и Btrfs иноды выделяются динамически.

**Что происходит, если иноды закончились**:
При попытке создать файл появится ошибка \`No space left on device\`.
Проверка: \`df -i\`.Часто происходит при накоплении миллионов мелких файлов сессий (PHP, Nginx cache, spool/postfix).`,
    codeSnippet: {
      language: 'bash',
      code: `# Проверка занятости Inodes:
df -i

# Поиск директории с наибольшим количеством мелких файлов:
find /var/spool/ -xdev -printf '%h\n' | sort | uniq -c | sort -rn | head -n 10`
    },
    tags: ['Linux', 'Filesystem', 'Inodes', 'Storage']
  },
  {
    id: 'fs-ext4-vs-xfs',
    title: 'Какую файловую систему выбрать: Ext4 или XFS?',
    category: 'linux',
    difficulty: 'Middle',
    summaryAnswer: 'Ext4 — уменьшение размеров, отлично для множества мелких файлов. XFS — параллельный I/O, динамические иноды, масштабируемость для больших файлов и томов >50TB.',
    fullAnswer: `Сравнение Ext4 и XFS:

**Ext4**:
- Поддерживает уменьшение тома (shrink).
- Фиксированное количество Inode (задается при \`mkfs.ext4\`).
- Отличная производительность при однопоточных операциях с многочисленными мелкими файлами.
- Лимит тома: до 50 ТБ.

**XFS**:
- Динамические Inodes (не могут закончится, создаются по мере надобности).
- Параллейный I/O благодаря Allocation Groups (отличная масштабируемость на многоядерных CPU и NVMe RAID).
- Лимит тома: до 8 Экзабайт (500 ТБ системный раздел).
- **Минус**: Нельзя уменьшать раздел (только расширять через \`xfs_growfs\`).`,
    tags: ['Linux', 'Filesystem', 'Ext4', 'XFS', 'Performance']
  },
  {
    id: 'fs-raid-levels',
    title: 'Какие типы RAID существуют (0, 1, 5, 6, 10) и в чем их ключевые отличия?',
    category: 'linux',
    difficulty: 'Middle',
    summaryAnswer: 'RAID 0 (Speed, 0 tolerance), RAID 1 (Mirror, 50% capacity), RAID 5 (Parity, 1 disk failure), RAID 6 (Dual parity, 2 failures), RAID 10 (Striped mirrors, high performance & tolerance).',
    fullAnswer: `Обзор уровней RAID:

1. **RAID 0 (Striping)**: Чередование без четности. Мин. 2 диска. Скорость хN, отказоустойчивость 0. Потеря 1 диска уничтожает все данные.
2. **RAID 1 (Mirroring)**: Зеркалирование. Мин. 2 диска. Полезный объем 50%. Переживет отказ N-1 дисков в зеркале.
3. **RAID 5 (Striping with Parity)**: Чередование с распределенной четностью. Мин. 3 диска. Полезный объем (N-1). Переживет отказ **1 диска**. Медленная запись из-за пересчета четности.
4. **RAID 6 (Dual Parity)**: Двойная четность. Мин. 4 диска. Полезный объем (N-2). Переживет отказ **2 дисков одновременно**.
5. **RAID 10 (1+0)**: Массив из зеркалированных пар с чередованием. Мин. 4 диска. Отличная скорость чтения/записи и высочайшая надежность.`,
    tags: ['Hardware', 'RAID', 'Storage', 'mdadm']
  },
  {
    id: 'fs-hardlink-vs-symlink',
    title: 'В чем разница между Hardlink (жесткая ссылка) и Symlink (символическая ссылка)?',
    category: 'linux',
    difficulty: 'Junior',
    summaryAnswer: 'Hardlink ссылается на тот же Inode (нельзя для папок и разных ФС). Symlink — отдельный файл с путем к целевому объекту.',
    fullAnswer: `Различия:

1. **Hardlink (Жесткая ссылка)**:
   - Указывает напрямую на тот же номер **Inode**.
   - Нельзя создать для папок (директорий) и через границы разных файловых систем/разделов.
   - Если удалить исходный файл, данные НЕ пропадут, пока существует хотя бы один Hardlink (счетчик ссылок Inode > 0).

2. **Symlink (Символическая ссылка / Softlink)**:
   - Отдельный файл со своим новым Inode и типом \`l\` (\`lrwxrwxrwx\`), хранящий текстовый путь к файлу.
   - Может указывать на директории и файлы на любых других ФС и сетевых ресурсах.
   - Если исходный файл удален, ссылка становится "битой" (Dangling symlink).`,
    codeSnippet: {
      language: 'bash',
      code: `# Создание Hardlink и Symlink:
ln target.txt hardlink.txt
ln -s target.txt symlink.txt

# Просмотр номеров Inode (у target и hardlink номер будет одинаковым!):
ls -i target.txt hardlink.txt symlink.txt`
    },
    tags: ['Linux', 'Filesystem', 'Hardlink', 'Symlink']
  },

  // =========================================================================
  // ============================ DOCKER & CONTAINERS ========================
  // =========================================================================
  {
    id: 'docker-internals-primitives',
    title: 'Какие механизмы ядра Linux лежат в основе работы Docker-контейнеров?',
    category: 'docker',
    difficulty: 'Middle',
    summaryAnswer: 'Namespaces (изоляция видов), Cgroups (ограничение ресурсов), Capabilities (права root), OverlayFS (слоистая ФС) и Seccomp/AppArmor.',
    fullAnswer: `Docker — это не виртуализация, а изолированный процесс Linux, созданный за счет следующего стэка ядра:

1. **Namespaces (Пространства имен)** — обеспечивают ИЗОЛЯЦИЮ:
   - **pid**: Изоляция дерева процессов.
   - **net**: Изоляция сетевых интерфейсов, портов и таблиц маршрутизации.
   - **mnt**: Изоляция точек монтирования файловой системы.
   - **ipc**: Изоляция межпроцессного взаимодействия (Shared memory, очереди).
   - **uts**: Изоляция имени хоста (hostname).
   - **user**: Маппинг UID/GID пользователей.
2. **Cgroups (Control Groups)** — ОГРАНИЧЕНИЕ И ЛИМИТИРОВАНИЕ ресурсов:
   Ограничение CPU, RAM, I/O и количества процессов (pids limit).
3. **Linux Capabilities**: Дробление прав суперпользователя Root на 40+ отдельных разрешений (например \`CAP_NET_ADMIN\`, \`CAP_SYS_ADMIN\`).
4. **OverlayFS (Overlay2)**: Слоистая каскадная файловая система (UnionFS) для объединения Read-Only слоев образа и Read-Write слоя контейнера.`,
    tags: ['Docker', 'Linux', 'Namespaces', 'Cgroups', 'OverlayFS']
  },
  {
    id: 'docker-cmd-vs-entrypoint',
    title: 'В чем ключевое отличие между CMD и ENTRYPOINT в Dockerfile?',
    category: 'docker',
    difficulty: 'Junior',
    summaryAnswer: 'ENTRYPOINT задает бинарник/команду по умолчанию. CMD передает дефолтные аргументы для ENTRYPOINT, которые можно легко переопределить при docker run.',
    fullAnswer: `Правила взаимодействия \`ENTRYPOINT\` и \`CMD\`:

1. **ENTRYPOINT**: Задает фиксируемый исполняемый файл или скрипт-инициализатор. Вызывается ВСЕГДА при старте контейнера.
2. **CMD**: Задает аргументы по умолчанию. Если при вызове \`docker run myimage arg1 arg2\` переданы аргументы, они ПОЛНОСТЬЮ переопределяют значения из инструкции \`CMD\`.

**Паттерн использования (Exec Form)**:
\`\`\`dockerfile
ENTRYPOINT ["/entrypoint.sh"]
CMD ["--config", "/etc/app.conf"]
\`\`\`
При вызове \`docker run myimage --debug\` итоговая команда будет: \`/entrypoint.sh --debug\`.`,
    tags: ['Docker', 'Dockerfile', 'ENTRYPOINT', 'CMD']
  },
  {
    id: 'docker-reduce-image-size',
    title: 'Как уменьшить размер Docker-образа? (Best Practices)',
    category: 'docker',
    difficulty: 'Middle',
    summaryAnswer: 'Использовать Multi-stage builds, минималистичные базовые образы (Alpine/Distroless), объединять RUN команды и чистить кэши пакетных менеджеров.',
    fullAnswer: `Методы оптимизации размера Docker-образов:

1. **Multi-Stage Сборка (Многоэтапные сборки)**:
   Разделение этапа компиляции/сборки и этапа рантайма.
2. **Легковесные базовые образы**:
   Вместо \`ubuntu:22.04\` (70MB+) или \`node:20\` (1GB) использовать \`alpine\` (5MB) или \`distroless\` (минимальный образ без shell).
3. **Объединение команд RUN**:
   Каждая инструкция RUN создает новый Read-Only слой. Объединяйте команды через \`&&\` и чистите кэш в том же слое:
   \`RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*\`
4. **Файл \`.dockerignore\`**:
   Исключать папки \`.git\`, \`node_modules\`, \`dist\`, \`tmp\` из контекста сборки.`,
    codeSnippet: {
      language: 'dockerfile',
      code: `# Пример Multi-Stage сборки Go приложения:
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o myapp .

# Финальный дистрибутив размером всего 15 МБ:
FROM alpine:3.19
WORKDIR /app
COPY --from=builder /app/myapp .
ENTRYPOINT ["/app/myapp"]`
    },
    tags: ['Docker', 'Dockerfile', 'Optimization', 'MultiStage']
  },

  // =========================================================================
  // ============================ NETWORKING & SECURITY ======================
  // =========================================================================
  {
    id: 'net-browser-yandex-flow',
    title: 'Что происходит на всех уровнях сетевого стека, когда вы вводите yandex.ru в браузере?',
    category: 'networking',
    difficulty: 'Senior',
    summaryAnswer: 'HSTS/Кэш -> DNS резолв (A/AAAA) -> TCP 3-way Handshake (SYN, SYN-ACK, ACK) -> TLS Handshake (Server Hello, Certificate, Key Exchange) -> HTTP GET -> HTML/CSS/JS Rendering.',
    fullAnswer: `Полный путь HTTP/HTTPS запроса:

1. **Анализ URL & HSTS**: Браузер проверяет локальный кэш HSTS (HTTP Strict Transport Security). Если сайт в списке, протокол сразу переключается на HTTPS.
2. **DNS Resolution (Резолвинг домена)**:
   - Проверка кэша браузера -> ОС (\`/etc/hosts\`) -> Кэш роутера -> DNS Провайдера.
   - При промахе: Рекурсивный запрос к Корневому DNS серверу (\`.\`) -> TLD (\`.ru\`) -> Авторитативному NS серверу Яндекса. Возвращается IP-адрес (например \`5.255.255.60\`).
3. **TCP Three-Way Handshake (L4)**:
   - Клиент отправляет \`SYN\` пакети с порядковым номером (Sequence Number).
   - Сервер отвечает \`SYN-ACK\`.
   - Клиент подтверждает \`ACK\`. Установлено TCP соединение на порт 443.
4. **TLS Handshake (Cryptographic Layer)**:
   - **Client Hello**: Клиент передает поддерживаемые версии TLS, Cipher Suites и расширение **SNI** (Server Name Indication).
   - **Server Hello**: Сервер выбирает шифр и отправляет свой **SSL/TLS Сертификат** (содержащий публичный ключ).
   - **Валидация**: Клиент проверяет цепочку подписей сертификата через доверенные CA.
   - **Обмен ключами (ECDHE)**: Генерируется общий симметричный сеансовый ключ (Session Key).
5. **HTTP Request & Response (L7)**:
   - Клиент отправляет зашифрованный запрос \`GET / HTTP/1.1\` с заголовком \`Host: yandex.ru\`.
   - Сервер возвращает ответ \`HTTP/1.1 200 OK\` и HTML код страницы.
6. **Рендеринг**: Браузер строит DOM-дерево, запрашивает CSS/JS/картинки и отображает страницу.`,
    tags: ['Networking', 'DNS', 'TCP', 'TLS', 'HTTP', 'Architecture']
  },
  {
    id: 'net-ping-port-trick',
    title: 'На каком порту работает утилита ping?',
    category: 'networking',
    difficulty: 'Junior',
    summaryAnswer: 'У ping НЕТ порта! Ping работает по протоколу ICMP на сетевом (L3) уровне модели OSI. Порты существуют только на транспортном уровне (L4 TCP/UDP).',
    fullAnswer: `Это классический вопрос с подвохом на собеседованиях.

- Понятие **портов** (Port 80, 443, 22) существует исключительно на **Транспортном уровне (L4)** в протоколах TCP и UDP.
- Утилита \`ping\` использует протокол **ICMP (Internet Control Message Protocol)**, который располагается на **Сетевом уровне (L3)** непосредственно над протоколом IP.
- Сообщения ICMP не используют TCP/UDP порты, а определяются по полям **Type** (Тип) и **Code** (Код).
  - \`Type 8\` = Echo Request (Запрос).
  - \`Type 0\` = Echo Reply (Ответ).`,
    interviewTips: [
      'Четко и уверенно ответьте: "Ping работает по протоколу ICMP на 3-м уровне OSI, у него нет понятия портов".'
    ],
    tags: ['Networking', 'ICMP', 'Ping', 'OSI']
  },
  {
    id: 'net-dns-udp-vs-tcp',
    title: 'Почему DNS использует UDP? В каких случаях DNS переключается на TCP?',
    category: 'networking',
    difficulty: 'Middle',
    summaryAnswer: 'UDP быстро работает без оверхеда установления TCP соединения. DNS переключается на TCP при ответе > 512 байт (флаг Truncated TC), AXFR трансфере зон и DoT.',
    fullAnswer: `1. **Почему UDP по умолчанию (Port 53)**:
   DNS-запросы короткие. Для отправки одного UDP пакета и получения ответа требуется всего 1 RTT (Round Trip Time) без рукопожатий. TCP handshake потребовал бы минимум 3 пакета предварительно.

2. **Когда DNS использует TCP**:
   - **Превышение размера пакета (512 байт)**: Если ответ не влезает в стандартный UDP пакет (например при вычеслении DNSSEC записей), сервер возвращает ответ с флагом **TC (Truncated)**. Клиент повторно делает этот же запрос по **TCP**.
   - **AXFR (Zone Transfer)**: Синхронизация мастер-зоны между DNS-серверами передает большие объемы данных и требует надежности TCP.
   - **DNS over TLS (DoT / Port 853)**: Шифрованные DNS запросы поверх TLS/TCP.`,
    tags: ['Networking', 'DNS', 'UDP', 'TCP']
  },
  {
    id: 'net-nat-sni-explained',
    title: 'Что такое NAT и SNI? Зачем они нужны?',
    category: 'networking',
    difficulty: 'Middle',
    summaryAnswer: 'NAT транслирует приватные IP в публичные. SNI передает имя запрашиваемого доменного имени в открытом виде при TLS Handshake для виртуального хостинга.',
    fullAnswer: `1. **NAT (Network Address Translation)**:
   Технология замены IP-адресов в заголовках пакетов.
   - **SNAT (Source NAT / Masquerade)**: Заменяет приватные адреса хостов внутренней сети (RFC1918) на один публичный IP роутера для выхода в интернет.
   - **DNAT (Destination NAT / Port Forwarding)**: Пробрасывает входящие запросы с публичного IP на внутренний сервер.

2. **SNI (Server Name Indication)**:
   Расширение протокола TLS. Передает имя запрашиваемого хоста (например \`example.com\`) в открытом тексте в пакете \`Client Hello\` ДО начала шифрования.
   **Зачем нужен**: Позволяет веб-серверу (Nginx) с одним публичным IP-адресом понять, какой именно SSL-сертификат из множества виртуальных хостов нужно отдавать клиенту.`,
    tags: ['Networking', 'NAT', 'SNI', 'TLS', 'Nginx']
  },

  // =========================================================================
  // ============================ KUBERNETES =================================
  // =========================================================================
  {
    id: 'k8s-pod-creation-flow',
    title: 'Опишите пошаговый процесс создания Pod в Kubernetes и роли всех компонентов Control Plane.',
    category: 'k8s',
    difficulty: 'Senior',
    summaryAnswer: 'kubectl -> Kube-API -> etcd (сохранение) -> Scheduler (выбор ноды) -> Kubelet (на ноде) -> Container Runtime (CRI) -> CNI (сеть).',
    fullAnswer: `Шаги создания Пода при выполнении \`kubectl apply -f pod.yaml\`:

1. **kubectl & API Server**: \`kubectl\` отправляет POST-запрос с манифестом Пода в **kube-apiserver**.
2. **Authentication & Authorization**: API Server проверяет токены, RBAC права (Role/ClusterRole) и запускает **Admission Controllers** (Mutating & Validating Webhooks).
3. **etcd**: После валидации API Server записывает желаемое состояние Пода в хранилище **etcd**.
4. **Kube-Scheduler**: Планировщик (Scheduler) непрерывно отслеживает необработанные поды (\`nodeName: ""\`). Он оценивает доступные ноды по ресурсам, Taints/Tolerations, NodeAffinity и назначает оптимальную воркер-ноду, обновляя объект Пода в API Server.
5. **Kubelet**: Агент **Kubelet** на выбранной ноде получает уведомление от API Server о назначении Пода на его узел.
6. **CRI (Container Runtime Interface)**: Kubelet вызывает рантайм (containerd/CRI-O) для скачивания образа и запуска контейнеров Пода.
7. **CNI (Container Network Interface)**: CNI-плагин (Calico/Flannel/Cilium) выделяет Поду IP-адрес и настраивает сетевые интерфейсы \`veth\`.
8. **Status Update**: Kubelet отправляет актуальный статус Пода (\`Running\`) обратно в API Server.`,
    interviewTips: [
      'Подчеркните, что все компоненты общаются ИСКЛЮЧИТЕЛЬНО с kube-apiserver, они никогда не взаимодействуют друг с другом напрямую!'
    ],
    tags: ['Kubernetes', 'ControlPlane', 'Architecture', 'PodFlow']
  },
  {
    id: 'k8s-statefulset-vs-deployment',
    title: 'В чем ключевые отличия StatefulSet от Deployment?',
    category: 'k8s',
    difficulty: 'Middle',
    summaryAnswer: 'Deployment идеален для Stateless приложений без состояния. StatefulSet сохраняет уникальную идентичность подов (pod-0), порядковый запуск и персональный PVC для каждого пода.',
    fullAnswer: `Сравнение StatefulSet и Deployment:

1. **Идентификация подов**:
   - **Deployment**: Поды взаимозаменяемы, имеют случайные хеш-имена (\`web-7d4b96797-x8z9l\`).
   - **StatefulSet**: Поды имеют строго фиксированные порядковые имена (\`db-0\`, \`db-1\`, \`db-2\`) и предсказуемые DNS-записи.
2. **Управление томами (Storage)**:
   - **Deployment**: Все реплики Подов монтируют один и тот же общий PV (обычно ReadWriteMany).
   - **StatefulSet**: Содержит секцию \`volumeClaimTemplates\`, автоматически создающую **персональный PVC** для каждой реплики Пода (\`data-db-0\`, \`data-db-1\`).
3. **Порядок запуска и масштабирования**:
   - **Deployment**: Поды создаются и удаляются параллельно в случайном порядке.
   - **StatefulSet**: Поды запускаются и обновляются strictly по очереди (сначала \`db-0\`, после его Readiness в строй вступает \`db-1\`). Удаление происходит в обратном порядке.`,
    tags: ['Kubernetes', 'StatefulSet', 'Deployment', 'PVC']
  },
  {
    id: 'k8s-probes-liveness-readiness-startup',
    title: 'В чем разница между Liveness, Readiness и Startup пробами в Kubernetes?',
    category: 'k8s',
    difficulty: 'Middle',
    summaryAnswer: 'Liveness перезапускает павшую капсулу; Readiness отключает под от сервис-трафика при неготовности; Startup блокирует другие пробы на время долгого старта.',
    fullAnswer: `Виды Healthcheck проб в K8s:

1. **Readiness Probe (Проверка готовности)**:
   - *Задача*: Проверяет, готово ли приложение принимать входящий сетевой трафик.
   - *Действие при сбое*: Под удаляется из списка Endpoints соответствующего **Service**. Трафик на него перестает идти, но под НЕ перезапускается.

2. **Liveness Probe (Проверка жизнеспособности)**:
   - *Задача*: Проверяет, не зависло ли приложение (Deadlock/Out of Memory).
   - *Действие при сбое*: Kubelet **убивает и перезапускает** контейнер в Поде согласно \`restartPolicy\`.

3. **Startup Probe (Проверка старта)**:
   - *Задача*: Отключает Liveness и Readiness проверки на время первоначального старта "тяжелых" приложений (Java/Monolith), стартующих несколько минут.
   - *Действие при сбое*: Если приложение не уложилось в \`failureThreshold * periodSeconds\`, под перезапускается.`,
    codeSnippet: {
      language: 'yaml',
      code: `readinessProbe:
  httpGet:
    path: /healthz
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 10
livenessProbe:
  httpGet:
    path: /live
    port: 8080
  initialDelaySeconds: 15
  periodSeconds: 20`
    },
    tags: ['Kubernetes', 'Probes', 'Readiness', 'Liveness']
  },
  {
    id: 'k8s-cri-csi-cni',
    title: 'Что такое CRI, CSI и CNI в Kubernetes?',
    category: 'k8s',
    difficulty: 'Middle',
    summaryAnswer: 'Стандартизированные gRPC интерфейсы плагинов K8s: CRI (контейнеры containerd), CSI (дисковые хранилища Ceph/EBS), CNI (сетевые плагины Calico/Cilium).',
    fullAnswer: `Интерфейсы абстракции Kubernetes:

1. **CRI (Container Runtime Interface)**:
   Интерфейс связи Kubelet со средой исполнения контейнеров. Позволяет использовать любой рантайм: **containerd**, **CRI-O**.
2. **CSI (Container Storage Interface)**:
   Стандарт для подключения внешних систем хранения данных. Позволяет вендорам дисков создавать плагины для динамического провижининга томов: **AWS EBS CSI**, **Ceph RBD CSI**, **Rook-Ceph**.
3. **CNI (Container Network Interface)**:
   Спецификация настройки сети для подов. Отвечает за выделение IP, маршрутизацию и NetworkPolicies: **Calico**, **Flannel**, **Cilium** (на базе eBPF).`,
    tags: ['Kubernetes', 'CRI', 'CSI', 'CNI', 'Plugins']
  },

  // =========================================================================
  // ============================ ANSIBLE ====================================
  // =========================================================================
  {
    id: 'ansible-idempotency-and-roles',
    title: 'Что такое идемпотентность в Ansible и какова структура Ansible-ролей?',
    category: 'ansible',
    difficulty: 'Junior',
    summaryAnswer: 'Идемпотентность — результат многократного запуска плейбука совпадает с первым запуском (changed: false). Роли структурируют задачи, переменные и шаблоны.',
    fullAnswer: `1. **Идемпотентность (Idempotency)**:
   Свойство операции давать одинаковый результат при повторных вызовах.
   - В отличие от Bash-скриптов (\`mkdir /dir\` упадет с ошибкой при повторном вызове), модули Ansible проверяют текущее состояние сервера. Если директория уже существует, модуль \`file: state=directory\` вернет статус \`ok\` без ошибок и без лишних изменений.

2. **Структура Роли (Ansible Role)**:
   Стандартизированная директория для переиспользования кода:
   \`\`\`
   my_role/
   ├── tasks/
   │   └── main.yml      # Главный список задач
   ├── handlers/
   │   └── main.yml      # Обработчики (перезапуск Nginx при смене конфига)
   ├── templates/
   │   └── nginx.conf.j2 # Jinja2 шаблоны
   ├── files/            # Статические файлы для копирования
   ├── vars/             # Переменные с высоким приоритетом
   ├── defaults/         # Дефолтные переменные (низкий приоритет)
   └── meta/             # Зависимости роли и автор
   \`\`\``,
    tags: ['Ansible', 'Idempotency', 'Roles', 'IaC']
  },

  // =========================================================================
  // ============================ CI/CD & GIT ================================
  // =========================================================================
  {
    id: 'cicd-git-merge-vs-rebase',
    title: 'В чем разница между Git Merge и Git Rebase? Когда что использовать?',
    category: 'cicd',
    difficulty: 'Junior',
    summaryAnswer: 'Merge сохраняет хронологическую историю с созданием merge-коммита. Rebase переносит ветку поверх другой, делая историю линейной.',
    fullAnswer: `Сравнение Merge и Rebase:

1. **Git Merge**:
   - Создает новый специальный "Merge commit", объединяющий ветки.
   - Сохраняет полную историческую правду и структуру веток.
   - **Плюс**: Не переписывает историю Git.
   - **Минус**: История может стать загроможденной ("паутина" коммитов).

2. **Git Rebase**:
   - Берет коммиты текущей фиче-ветки и последовательно переприменяет их поверх указанной целевой ветки (\`main\`).
   - Создает чистую, абсолютно **линейную историю**.
   - **Главное золотое правило Rebase**: *Никогда не делайте rebase публичных публичных веток (main/master), с которыми работают другие разработчики!*`,
    tags: ['Git', 'CI/CD', 'Merge', 'Rebase']
  },
  {
    id: 'cicd-gitlab-cache-vs-artifacts',
    title: 'В чем разница между Cache и Artifacts в GitLab CI/CD?',
    category: 'cicd',
    difficulty: 'Middle',
    summaryAnswer: 'Cache используется для ускорения сборок (node_modules, кэш pip) между запусками pipelines. Artifacts — результаты сборки (бинарники/dist), передаваемые строго между Stages.',
    fullAnswer: `Сравнение Cache и Artifacts в GitLab CI:

1. **Cache (Кэш)**:
   - *Назначение*: Ускорение повторных сборок. Сохраняет скачать зависимостей (\`node_modules/\`, \`.npm/\`, \`vendor/\`).
   - *Гарантия*: **Не гарантирован!** Кэш может быть очищен раннером в любой момент. Проект должен уметь собираться и без кэша.
   - *Область*: Доступен между разными пайплайнами и ветками.

2. **Artifacts (Артефакты)**:
   - *Назначение*: Передача результатов работы одних Jobs в другие (например скомпилированный бинарник из \`build\` передается в stage \`deploy\`).
   - *Гарантия*: **Гарантированы!** Загружаются в хранилище GitLab и надежно передаются в последующие стадии.`,
    tags: ['GitLab', 'CICD', 'Cache', 'Artifacts']
  },

  // =========================================================================
  // ============================ TERRAFORM & IAC ============================
  // =========================================================================
  {
    id: 'tf-drift-and-state-lock',
    title: 'Что такое Configuration Drift в Terraform и как правильно блокировать tfstate?',
    category: 'terraform',
    difficulty: 'Middle',
    summaryAnswer: 'Drift — расхождение кода .tf с реальными ресурсами облака. Блокировка statefile предотвращает параллельные перезаписи (S3 native use_lockfile / DynamoDB).',
    fullAnswer: `1. **Configuration Drift (Дрейф конфигурации)**:
   Ситуация, когда реальное состояние ресурсов в облаке разносится с описанием в \`.tf\` файлах (например администратор вручную изменил размер ВМ через GUI консоль AWS/Yandex Cloud).
   - \`terraform plan\` за детектирует drift и предложит привести облако обратно к коду.

2. **Блокировка состояния (State Locking)**:
   Предотвращает одновременный запуск \`terraform apply\` несколькими инженерами или CI/CD пайплайнами, что может испортить файл \`terraform.tfstate\`.
   - Начиная с OpenTofu / Terraform 1.10 доступна нативная блокировка S3: \`use_lockfile = true\`.
   - Ранее использовалась связка S3 бэкенда с таблицей **DynamoDB** (\`dynamodb_table = "tf-locks"\`).`,
    codeSnippet: {
      language: 'hcl',
      code: `terraform {
  backend "s3" {
    bucket       = "my-company-tfstate"
    key          = "prod/network/terraform.tfstate"
    region       = "us-east-1"
    encrypt      = true
    use_lockfile = true # Нативная блокировка S3 файла состояния
  }
}`
    },
    tags: ['Terraform', 'IaC', 'State', 'Drift']
  },

  // =========================================================================
  // ============================ CLOUD & AWS ================================
  // =========================================================================
  {
    id: 'cloud-aws-vpc-components',
    title: 'Из каких основных компонентов состоит AWS VPC (Virtual Private Cloud)?',
    category: 'cloud',
    difficulty: 'Middle',
    summaryAnswer: 'Subnets (Public/Private), Internet Gateway (IGW для паблик сети), NAT Gateway (исходящий инет для приватной сети) и Route Tables.',
    fullAnswer: `Архитектурные компоненты AWS VPC:

1. **Subnets (Подсети)**:
   - **Public Subnet**: Имеет маршрут к **Internet Gateway (IGW)**. Инстансы получают публичные IP и доступны из интернета.
   - **Private Subnet**: Не имеет прямого пути к IGW. Инстансы имеют только приватные IP (10.0.x.x).
2. **Internet Gateway (IGW)**: Виртуальный шлюз, обеспечивающий двусторонний трафик между публичной подсетью и интернетом.
3. **NAT Gateway**: Размещается в *публичной* подсети. Позволяет инстансам из *приватных* подсетей скачивать обновления из интернета, блокируя входящие инициализированные снаружи соединения.
4. **Route Tables (Таблицы маршрутизации)**: Наборы правил (routes), куда направлять сетевой трафик из каждой подсети (\`0.0.0.0/0 -> igw-id\` или \`nat-id\`).
5. **Security Groups**: Stateful виртуальный фаервол на уровне сетевого интерфейса каждого инстанса.`,
    tags: ['Cloud', 'AWS', 'VPC', 'Networking']
  },

  // =========================================================================
  // ============================ DATABASES & PYTHON & PROCESS ===============
  // =========================================================================
  {
    id: 'db-acid-and-wal',
    title: 'Расшифруйте принципы ACID и объясните назначение WAL-файла (Write-Ahead Logging) в PostgreSQL.',
    category: 'sysdesign',
    difficulty: 'Middle',
    summaryAnswer: 'ACID guarantees Atomicity, Consistency, Isolation, Durability. WAL (Write-Ahead Log) сначала записывает изменения в журнал на диск для сбойной надежности и PITR.',
    fullAnswer: `1. **ACID**:
   - **Atomicity (Атомарность)**: Транзакция выполняется полностью или не выполняется вовсе.
   - **Consistency (Согласованность)**: БД переходит из одного корректного состояния в другое, не нарушая ограничений.
   - **Isolation (Изолированность)**: Параллельные транзакции не влияют на результат друг друга.
   - **Durability (Надежность/Долговечность)**: Подтвержденные данные не потеряются при аварии питания.

2. **WAL (Write-Ahead Logging)**:
   Механизм, при котором любые изменения таблиц сначала записываются в последовательный файл журнала (WAL) на диске, и только потом обновляются страницы данных в оперативной памяти и на диске.
   **Зачем нужен**:
   - Мгновенное восстановление при сбоях и выключении питания.
   - Основа для потоковой репликации (Streaming Replication).
   - Точечное восстановление данных на любой момент времени (Point-In-Time Recovery — PITR).`,
    tags: ['Database', 'PostgreSQL', 'ACID', 'WAL', 'Sysdesign']
  },
  {
    id: 'py-iter-gen-decorator',
    title: 'В чем разница между Tuple и List, Iterator и Generator в Python?',
    category: 'sysdesign',
    difficulty: 'Junior',
    summaryAnswer: 'List mutable [], Tuple immutable () и быстро работает. Generator использует yield для ленивых вычислений без загрузки памяти.',
    fullAnswer: `1. **List vs Tuple**:
   - **List (Список)**: Изменяемый тип (\`[1, 2, 3]\`). Требует больше памяти для динамического резервирования.
   - **Tuple (Кортеж)**: Неизменяемый тип (\`(1, 2, 3)\`). Занимает меньше памяти, быстро итерируется, может быть ключом словаря \`dict\`.

2. **Iterator vs Generator**:
   - **Iterator (Итератор)**: Объект с методами \`__iter__()\` и \`__next__()\`.
   - **Generator (Генератор)**: Функция с ключевым словом \`yield\`. Генерирует значения **лениво (Lazy Evaluation)** по одному при каждом вызове \`next()\`, позволяя обрабатывать файлы в гигабайты без утечек RAM.`,
    codeSnippet: {
      language: 'python',
      code: `# Генератор чтения огромного лог-файла построчно:
def read_huge_file(file_path):
    with open(file_path, 'r') as f:
        for line in f:
            if "ERROR" in line:
                yield line.strip()

# Использование:
for log_error in read_huge_file('/var/log/syslog'):
    print(log_error)`
    },
    tags: ['Python', 'Generators', 'Iterators', 'Scripting']
  },
  {
    id: 'process-sli-slo-sla',
    title: 'В чем разница между SLI, SLO и SLA?',
    category: 'monitoring',
    difficulty: 'Junior',
    summaryAnswer: 'SLI — метрика по факту (Latency/Uptime). SLO — внутренний целевой ориентир команды. SLA — юр-соглашение с клиентом и штрафами.',
    fullAnswer: `Три ключевых понятия SRE (Site Reliability Engineering):

1. **SLI (Service Level Indicator)**:
   Конкретная замеряемая метрика производительности или доступности сервиса.
   *Пример*: Процент успешных ответов HTTP 2xx/3xx за последние 30 дней составляет **99.93%**.
2. **SLO (Service Level Objective)**:
   Внутренняя целевая планка, установленная командой разработки и DevOps.
   *Пример*: Целевая доступность API должна быть **>= 99.9%**.
3. **SLA (Service Level Agreement)**:
   Официальный юридический договор с клиентами, определяющий финансовую ответственность за простой.
   *Пример*: Если доступность упадет ниже **99.5%**, компания возвращает клиентам 20% месячной стоимости.`,
    tags: ['Monitoring', 'SRE', 'SLI', 'SLO', 'SLA', 'DevOps']
  }
];
