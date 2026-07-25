import { Question } from '../../types';

export const LINUX_QUESTIONS: Question[] = [
  {
    id: 'linux-1',
    title: 'Сервер ушел в High Load Average (LA). Как диагностировать причину по шагам?',
    category: 'linux',
    difficulty: 'Middle',
    summaryAnswer: 'Load Average показывают среднее число процессов в очередях R (Running) и D (Uninterruptible Sleep / I/O wait). Диагностика: htop, uptime, iostat, vmstat, dmesg.',
    fullAnswer: `1. Посмотреть значения LA за 1, 5 и 15 минут командой uptime или htop. Сравнить с количеством ядер CPU (nproc).
2. Разделить причину:
   - **CPU-bound** (процессы в состоянии R): видно в top / htop по %us, %sy. Показывает, какое приложение нагружает процессор.
   - **I/O-bound** (процессы в состоянии D - Uninterruptible Sleep): высокое значение %wa (iowait) в top. Причина: медленный/забитый диск, проблемы с RAID, NFS.
3. Инструменты утилиты:
   - iostat -xz 1 — нагрузка на дисковую подсистему (%util, await).
   - vmstat 1 — очереди r (run) и b (blocked), swap.
   - pidstat -d 1 / iotop — определение процесса, активно пишущего/читающего диск.
   - dmesg -T | tail -n 50 — проверка аппаратных ошибок дисков или паники ядра.`,
    codeSnippet: {
      language: 'bash',
      code: `uptime
top -b -n 1 | head -n 20
iostat -xz 1 5
vmstat 1 5
ps aux | awk '{if ($8 ~ /D/) print $0}' # поиск процессов в D-state`
    },
    interviewTips: [
      'Четко объясните разницу между процессом в состоянии R (выполняется) и D (ждет ввода-вывода). Это разделяет Джунов от опытных системных инженеров.'
    ],
    commonPitfalls: [
      'Думать, что LA > 1 на 16-ядерном сервере — это катастрофа. Важно соотносить LA с числом логических ядер.'
    ],
    tags: ['Linux', 'Performance', 'Troubleshooting', 'Systemd', 'I/O']
  },
  {
    id: 'linux-2',
    title: 'Что такое OOM Killer в Linux и как настроить oom_score_adj?',
    category: 'linux',
    difficulty: 'Senior',
    summaryAnswer: 'OOM Killer (Out Of Memory Killer) — механизм ядра Linux, который при критической нехватке оперативной памяти принудительно завершает самый подходящий процесс для спасения системы.',
    fullAnswer: `Ядро выбирает жертву на основе очков oom_score (диапазон от 0 до 1000). Формула зависит от процента занимаемой оперативной памяти процессом и его дочерними процессами.
Мы можем повлиять на приоритет уничтожения процессом с помощью параметра oom_score_adj (диапазон от -1000 до +1000):
- -1000 — запрещает OOM Killer трогать данный процесс (используется для sshd, kubelet, критичных СУБД).
- +1000 — делает процесс первейшим кандидатом на уничтожение.

Значения хранятся в виртуальной файловой системе: /proc/<PID>/oom_score и /proc/<PID>/oom_score_adj.`,
    codeSnippet: {
      language: 'bash',
      code: `# Посмотреть текущий балл OOM процесса nginx (PID 1234)
cat /proc/1234/oom_score

# Защитить важный сервис от OOM Killer
echo -900 > /proc/1234/oom_score_adj`
    },
    interviewTips: [
      'Свяжите с Kubernetes: K8s использует oom_score_adj для реализации Quality of Service (QoS) классов подов: Guaranteed (-997), Burstable (от 2 до 999) и BestEffort (1000).'
    ],
    commonPitfalls: [
      'Думать, что Swap полностью предотвратит OOM. На самом деле Swap лишь дает время, но при активном thrashing система сильно ляжет.'
    ],
    tags: ['Linux', 'Kernel', 'OOM', 'Memory', 'Kubernetes']
  },
  {
    id: 'linux-3',
    title: 'В чем разница между RSS, VSZ, PSS и Page Cache в оперативной памяти Linux?',
    category: 'linux',
    difficulty: 'Middle',
    summaryAnswer: 'VSZ — запрошенный объем виртуальной памяти. RSS — физическая RAM процесса (включая общие библиотеки). PSS — честная доля физической RAM (Shared деленное на участников). Page Cache — кэш файлов с диска.',
    fullAnswer: `1. **VSZ (Virtual Memory Size)**: Весь объем памяти, который процесс зарезервировал (включая код, библиотеки, невыделенные страницы).
2. **RSS (Resident Set Size)**: Реально выделенная физическая память RAM. Включает общие библиотеки (Shared Libraries). Если 5 процессов используют одну библиотеку в 10 МБ, RSS каждого покажет 10 МБ.
3. **PSS (Proportional Set Size)**: Самая честная метрика! Делит размер общих библиотек на количество процессов, использующих их.
4. **USS (Unique Set Size)**: Объем памяти, принадлежащий СТРОГО данному процессу (при убиении процесса освободится именно USS).
5. **Page Cache**: Свободная оперативная память, используемая ядром для кэширования дискового ввода-вывода (строки buff/cache в free -h). Память из Page Cache высвобождается мгновенно при необходимости приложениям!`,
    codeSnippet: {
      language: 'bash',
      code: `free -h # просмотр свободной памяти и available
smem -r -k # просмотр PSS/USS процессов
cat /proc/meminfo | grep -i dirty # "грязные" неотфлешенные страницы`
    },
    interviewTips: [
      'Объясните, почему free = 300MB при available = 5GB — это абсолютно нормальная работа Linux (Page Cache ускоряет диски).'
    ],
    commonPitfalls: [
      'Паниковать из-за маленького значения free в выводе free -h.'
    ],
    tags: ['Linux', 'Memory', 'RSS', 'PSS', 'PageCache']
  },
  {
    id: 'linux-4',
    title: 'Что происходит при удалении активного файла командой rm и как вернуть дисковое пространство?',
    category: 'linux',
    difficulty: 'Junior',
    summaryAnswer: 'Команда rm удаляет только имя файла из директории (Unlink). Дисковые блоки освобождаются только когда закрыты все файловые дескрипторы (FD) открывших файл процессов.',
    fullAnswer: `При выполнении rm app.log уменьшается счетчик жестких ссылок (Link Count) в Inode. Если процесс (например, Nginx) продолжает держать файл открытым, дескриптор остается активным, и ядро не высвобождает блоки данных на диске.
Симптом: du -sh показывает мало места, а df -h показывает, что диск забит на 100%.

**Как починить:**
1. Найти заблокированные удаленные файлы: lsof | grep deleted или lsof +L1.
2. Перезапустить процесс: systemctl restart nginx (процесс закроет дескриптор).
3. Если нельзя перезапускать сервис: обнулить дескриптор через /proc/<PID>/fd/<FD_NUM> командой > /proc/1234/fd/4.`,
    codeSnippet: {
      language: 'bash',
      code: `# Поиск "удаленных, но занятых" файлов:
sudo lsof / | grep deleted

# Правильное обнуление активного лога БЕЗ rm:
> /var/log/nginx/access.log`
    },
    interviewTips: [
      'Назовите правило: никогда не удалять живые логи через rm, а обнулять их через > file.log или настраивать logrotate.'
    ],
    commonPitfalls: [
      'Удалять открытый огромный лог файл через rm -rf и удивляться, почему свободное место в df -h не изменилось.'
    ],
    tags: ['Linux', 'Filesystem', 'lsof', 'Inodes', 'Troubleshooting']
  },
  {
    id: 'linux-5',
    title: 'Что такое Inode (индексный дескриптор) и что делать, если иноды закончились?',
    category: 'linux',
    difficulty: 'Middle',
    summaryAnswer: 'Inode — структура данных, хранящая метаданные файла (права, размер, владельца, блоки на диске), КРОМЕ его имени. Если иноды закончились, нельзя создать файл даже при наличии свободных гигабайт.',
    fullAnswer: `При форматировании файловой системы (Ext4) создается фиксированное количество Inode. Каждый созданный файл или папка занимает ровно 1 Inode.
Если в системе нагенерировался миллион мелких файлов (например, мелкие сессии PHP, сползшие логи, кэш почты), иноды исчерпываются (df -i показывает 100%).
Приложение выкинет ошибку "No space left on device", хотя df -h покажет терабайты свободной памяти.

**Решение:**
1. Проверить занятость инод: df -i.
2. Найти папку с наибольшим количеством файлов:
   find / -xdev -type d -exec sh -c 'echo "$(find "$1" -type f | wc -l) $1"' _ {} \\; | sort -nr | head -n 10
3. Удалить лишние мелкие файлы или настроить автоматическую ротацию.`,
    codeSnippet: {
      language: 'bash',
      code: `df -i # Проверка инод
find /var/spool/postfix/maildrop -type f -delete # быстрый способ удаления миллионов мелких файлов`
    },
    interviewTips: [
      'Упомяните, что ФС XFS умеет создавать иноды динамически по мере необходимости, в отличие от фиксированной Ext4.'
    ],
    commonPitfalls: [
      'Пытаться удалить миллион файлов обычным rm * (получите ошибку Argument list too long). Нужно использовать find -delete.'
    ],
    tags: ['Linux', 'Inodes', 'Ext4', 'XFS', 'Troubleshooting']
  },
  {
    id: 'linux-6',
    title: 'Как работают права доступа в Linux (chmod, chown, SUID, SGID, Sticky Bit)?',
    category: 'linux',
    difficulty: 'Junior',
    summaryAnswer: 'Стандартные права — Read (4), Write (2), Execute (1) для Owner, Group, Others. Спец-биты: SUID исполняет файл с правами владельца, SGID наследует группу, Sticky Bit запрещает удалять чужие файлы в /tmp.',
    fullAnswer: `1. **chmod 755 / 644**:
   - 7 (rwx) = 4 + 2 + 1
   - 6 (rw-) = 4 + 2
   - 5 (r-x) = 4 + 1

2. **Специальные биты прав (Special Bits)**:
   - **SUID** (chmod 4755 / u+s): При запуск бинарника процесс выполняется от имени владельца файла (например /usr/bin/passwd имеет SUID bit, чтобы обычный юзер мог менять файл /etc/shadow).
   - **SGID** (chmod 2755 / g+s): Для директорий: все новые файлы внутри автоматически наследуют группу родительской папки.
   - **Sticky Bit** (chmod 1777 / +t): Для папок (например /tmp): пользователь может удалять ТОЛЬКО те файлы, владельцем которых он является.`,
    codeSnippet: {
      language: 'bash',
      code: `chmod 1777 /tmp # установить sticky bit
chmod u+s /usr/local/bin/my-tool # установить SUID
ls -la /tmp # выведет drwxrwxrwt (буква t в конце)`
    },
    interviewTips: [
      'SUID на бинарниках — популярный вектор атак Privilege Escalation. Назовите команду find / -perm -4000 для их поиска.'
    ],
    commonPitfalls: [
      'Устанавливать chmod 777 в продакшене "чтобы всё заработало".'
    ],
    tags: ['Linux', 'Security', 'Permissions', 'Chmod', 'SUID']
  },
  {
    id: 'linux-7',
    title: 'Как устроена виртуальная файловая система /proc и /sys?',
    category: 'linux',
    difficulty: 'Middle',
    summaryAnswer: '/proc и /sys — это псевдо-файловые системы в памяти (procfs и sysfs), предоставляющие динамический интерфейс взаимодействия с ядром и процессами.',
    fullAnswer: `1. ** /proc (procfs)**:
   - Содержит информацию о процессах и параметрах ядра.
   - Папки с числами /proc/<PID> хранят информацию о конкретном процессе: /proc/123/cmdline, /proc/123/environ, /proc/123/fd/ (открытые файловые дескрипторы), /proc/123/status.
   - /proc/sys/ — изменяемые на лету параметры ядра (net.ipv4.ip_forward и т.д.).

2. ** /sys (sysfs)**:
   - Иерархическое представление структуры устройств, драйверов, cgroups и модулей ядра.
   - Используется утилитами udev, lscpu, cgroups v2.`,
    codeSnippet: {
      language: 'bash',
      code: `# Включить ip forwarding в ядре без перезагрузки:
echo 1 > /proc/sys/net/ipv4/ip_forward

# Посмотреть окружение процесса с PID 1024:
cat /proc/1024/environ | tr '\\0' '\\n'`
    },
    interviewTips: [
      'Покажите умение работать с /proc при отсутствии утилит типа ps/top (например в минимальном контейнере без bash).'
    ],
    commonPitfalls: [
      'Пытаться измерить объем /proc утилитой du (получите странные или нулевые размеры, так как это данные из RAM).'
    ],
    tags: ['Linux', 'Procfs', 'Kernel', 'Sysfs', 'Troubleshooting']
  },
  {
    id: 'linux-8',
    title: 'Что такое Systemd unit, какие типы юнитов существуют и как ими управлять?',
    category: 'linux',
    difficulty: 'Junior',
    summaryAnswer: 'Systemd — подсистема инициализации Linux (PID 1). Unit — конфигурационный файл службы. Типы: .service, .socket, .target, .timer, .mount.',
    fullAnswer: `Ключевые типы юнитов:
1. **.service**: описывает параметры запуска процесса (ExecStart, Restart=always, User, EnvironmentFile).
2. **.target**: группировка юнитов для создания уровней загрузки (analog runlevels): multi-user.target, graphical.target.
3. **.timer**: аналог cron, управляемый systemd с протоколированием в journalctl.
4. **.socket**: активирует сервис по приходу первого сетевого пакета (Socket Activation).

Команды управления:
- systemctl start/stop/restart/status <unit>
- systemctl enable/disable <unit> (создает/удаляет симлинки в /etc/systemd/system/multi-user.target.wants/)
- systemctl daemon-reload (обязательно после изменения файла юнита!).`,
    codeSnippet: {
      language: 'ini',
      code: `[Unit]
Description=My Go Application
After=network.target

[Service]
Type=simple
User=appuser
ExecStart=/usr/local/bin/myapp
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target`
    },
    interviewTips: [
      'Не забудьте упомянуть systemctl daemon-reload при правках файлов в /etc/systemd/system/.'
    ],
    commonPitfalls: [
      'Забывать секцию [Install] WantedBy=multi-user.target, без которой systemctl enable не сработает.'
    ],
    tags: ['Linux', 'Systemd', 'Services', 'Init', 'Journalctl']
  },
  {
    id: 'linux-9',
    title: 'В чем разница между жесткими (Hard links) и символическими (Soft/Symlinks) ссылками?',
    category: 'linux',
    difficulty: 'Junior',
    summaryAnswer: 'Hard link — дополнительный указатель на тот же Inode на диске. Symlink — отдельный файл, содержащий путь к целевому файлу.',
    fullAnswer: `1. **Hard Link (Жесткая ссылка)**:
   - Указывает напрямую на тот же индексный дескриптор (Inode).
   - Удаление оригинального файла НЕ приводит к потере данных, пока существует хотя бы одна жесткая ссылка.
   - НЕ МОЖЕТ создавать ссылки на директории и НЕ МОЖЕТ пересекать границы файловых систем (разные диски/разделы).

2. **Symlink (Символическая / Мягкая ссылка)**:
   - Отдельный специальный файл со своим собственным Inode, хранящий текстовую строку с путем к целевому файлу.
   - Если оригинальный файл удален, ссылка становится "битой" (Dangling symlink).
   - Может указывать на директории и на файлы на ДРУГИХ файловых системах.`,
    codeSnippet: {
      language: 'bash',
      code: `ln original.txt hardlink.txt # Жесткая ссылка
ln -s original.txt symlink.txt # Символическая ссылка
ls -i # Посмотреть Inode файлов`
    },
    interviewTips: [
      'Упомяните применение symlink при атомарном переключении версий релизов (например /app/current -> /app/releases/v1.2.3).'
    ],
    commonPitfalls: [
      'Пытаться создать hard link на каталог или между разными смонтированными дисками.'
    ],
    tags: ['Linux', 'Filesystem', 'Inodes', 'Links']
  },
  {
    id: 'linux-10',
    title: 'Как работает процесс загрузки Linux (Boot Process) от нажатия кнопки до Bash?',
    category: 'linux',
    difficulty: 'Middle',
    summaryAnswer: 'BIOS/UEFI -> POST -> Bootloader (GRUB) -> Загрузка Ядра (Kernel + initramfs) -> Запуск процесса инициализации PID 1 (Systemd) -> Targets/Userspace.',
    fullAnswer: `1. **BIOS/UEFI**: Инициализирует железо, проходит тест POST и читает MBR/EFI системный раздел.
2. **GRUB (Bootloader)**: Загрузчик передает управление ядру Linux, передавая параметры ядра (/vmlinuz) и RAM-диск первичной инициализации (initramfs).
3. **Kernel Init**: Ядро монтирует временную ФС initramfs, загружает критичные драйверы дисков, монтирует реальный корень (Root FS /) и запускает первый пользовательский процесс init (PID 1, например systemd).
4. **Systemd (PID 1)**: Монтирует остальные ФС (/etc/fstab), запускает сервисы согласно target (default.target -> multi-user.target) и поднимает сети и консоли входа.`,
    codeSnippet: {
      language: 'bash',
      code: `systemd-analyze # посмотреть время загрузки компонентов ядра и сервисов
systemd-analyze blame # топ медленных сервисов при старте`
    },
    interviewTips: [
      'Утилита systemd-analyze blame производит впечатление на интервьюеров при обсуждении загрузки.'
    ],
    commonPitfalls: [
      'Забывать роль initramfs (временный RAM-диск с драйверами для монтирования главного диска).'
    ],
    tags: ['Linux', 'BootProcess', 'GRUB', 'Kernel', 'Systemd']
  },
  {
    id: 'linux-11',
    title: 'Что такое Swap и параметр vm.swappiness? Нужно ли отключать Swap для K8s?',
    category: 'linux',
    difficulty: 'Middle',
    summaryAnswer: 'Swap — файл/раздел на диске для подкачки неиспользуемых страниц памяти. vm.swappiness (0-100) задает агрессивность сброса. Для K8s традиционно Swap отключали для предсказуемости ресурсов.',
    fullAnswer: `**vm.swappiness**:
Значение от 0 до 100.
- 100: Ядро активно сбрасывает неиспользуемые анонимные страницы в Swap, освобождая Page Cache.
- 10: Ядро избегает использования Swap, пока есть свободная память.
- 0: Отключает сброс страниц в swap до наступления полного исчерпания RAM.

**Swap и Kubernetes**:
Kubelet исторически требовал отключенного swap (swapoff -a), так как алгоритмы планера (Scheduler) рассчитывают лимиты подов строго из физической RAM, и сброс страниц в медленный SSD/HDD приводит к срыву латентности (Throttling/Thrashing).
Начиная с K8s 1.28 появилась альфа-поддержка Swap с ограниченными лимитами, но по умолчанию его выключают.`,
    codeSnippet: {
      language: 'bash',
      code: `sudo swapoff -a # выключить swap мгновенно
sysctl vm.swappiness=10 # установить значение swappiness`
    },
    interviewTips: [
      'Объясните термин Memory Thrashing — когда ядро постоянно читает и пишет swap, парализуя диск.'
    ],
    commonPitfalls: [
      'Забывать закомментировать строку swap в /etc/fstab, из-за чего после перезагрузки сервера swap снова включается.'
    ],
    tags: ['Linux', 'Memory', 'Swap', 'Swappiness', 'Kubernetes']
  },
  {
    id: 'linux-12',
    title: 'Как работают межпроцессное взаимодействие (IPC) и сигналы в Linux?',
    category: 'linux',
    difficulty: 'Middle',
    summaryAnswer: 'IPC — механизмы общения процессов: Signals, Pipes, Shared Memory, Message Queues, UNIX Sockets. Сигналы — асинхронные уведомления процесса ядра.',
    fullAnswer: `1. **Сигналы (Signals)**:
   - **SIGTERM (15)**: Просьба завершиться. Перехватывается процессом для Graceful Shutdown.
   - **SIGKILL (9)**: Принудительное уничтожение ядром. НЕЛЬЗЯ перехватить или проигнорировать!
   - **SIGHUP (1)**: Перечитка конфигурации приложения.
   - **SIGSEGV (11)**: Ошибка сегментации (обращение к чужой памяти).

2. **Способы IPC**:
   - **Pipes (Анонимные каналы)**: stdout | stdin.
   - **UNIX Domain Sockets**: Высокоскоростные сокеты файловой системы без затрат сетевого стека (например /var/run/docker.sock).
   - **Shared Memory (shm)**: Общий блок RAM для супер-быстрой передачи данных.`,
    codeSnippet: {
      language: 'bash',
      code: `kill -s SIGHUP 1234 # перечитать конфиг
ipcs -a # посмотреть общественные IPC ресурсы (Shared memory, semaphores)`
    },
    interviewTips: [
      'Укажите, что SIGKILL и SIGSTOP нельзя перехватить на уровне кода (Signal Handler).'
    ],
    commonPitfalls: [
      'Думать, что kill -9 всегда безопасен (может остановить процесс в середине транзакции БД).'
    ],
    tags: ['Linux', 'IPC', 'Signals', 'Kernel', 'Processes']
  },
  {
    id: 'linux-13',
    title: 'Что такое eBPF (Extended Berkeley Packet Filter) и почему это революция в Linux?',
    category: 'linux',
    difficulty: 'Senior',
    summaryAnswer: 'eBPF позволяет безопасным образом запускать пользовательский байт-код прямо ВНУТРИ ядра Linux без пересборки ядра и без написания опасных Kernel Modules.',
    fullAnswer: `Традиционно для добавления функционала в ядро создавались модули ядра (KMOD). Ошибка в модуле приводит к Kernel Panic.

**Как работает eBPF**:
1. Программа на C/Go компилируется в eBPF байт-код.
2. При загрузке в ядро **eBPF Verifier** строго проверяет байт-код на отсутствие зацикливаний, утечек и обращений к чужой памяти.
3. Программа выполняется в JIT-компиляторе с производительностью нативного ядра!

**Сферы применения**:
- Сети и Security: Cilium CNI обработка пакетов в миную iptables (10x быстрее).
- Observability: BPFtrace, Cilium Hubble — перехват любых системных вызовов с нулевым накладным расходом.`,
    codeSnippet: {
      language: 'bash',
      code: `bpftrace -e 'tracepoint:syscalls:sys_enter_open { printf("%s %s\\n", comm, str(args->filename)); }'`
    },
    interviewTips: [
      'Назовите Cilium CNI как главный успех eBPF в Kubernetes экосистеме.'
    ],
    commonPitfalls: [
      'Путать eBPF с классическим фаерволом iptables.'
    ],
    tags: ['Linux', 'eBPF', 'Kernel', 'Cilium', 'Observability']
  },
  {
    id: 'linux-14',
    title: 'Как работают утилиты strace и tcpdump для отладки падающих приложений?',
    category: 'linux',
    difficulty: 'Middle',
    summaryAnswer: 'strace перехватывает и записывает системные вызовы (syscalls) процесса к ядру. tcpdump захватывает сетевые пакеты на сетевом интерфейсе.',
    fullAnswer: `1. **strace**:
   - Показывает, какие файлы пытается открыть приложение (openat), куда пишет (write), сокеты (connect) и ошибки (ENOENT).
   - Идеально, когда приложение падает без логов на старте!
   - Пример: strace -f -e trace=file ./myapp — отследить попытки обращения к файловой системе.

2. **tcpdump**:
   - Использует libpcap для дампинга сетевого трафика на уровне L2-L4.
   - Пример: tcpdump -i eth0 port 53 -n — дампить только DNS запросы.
   - Записанный файл pcap можно открыть в Wireshark для визуального анализа.`,
    codeSnippet: {
      language: 'bash',
      code: `# Захват системных вызовов открытия файлов:
strace -f -e trace=open,openat ./app

# Захват HTTP трафика на порту 80:
sudo tcpdump -i any -n -X port 80`
    },
    interviewTips: [
      'Отметьте, что strace сильно замедляет работу процесса в продакшене из-за ptrace ptrace замедлений, использовать с осторожностью!'
    ],
    commonPitfalls: [
      'Запускать strace на нагруженном базе данных в продакшене без таймаутов.'
    ],
    tags: ['Linux', 'Debugging', 'Strace', 'Tcpdump', 'Troubleshooting']
  },
  {
    id: 'linux-15',
    title: 'Что такое ротация логов logrotate и как она предотвращает переполнение диска?',
    category: 'linux',
    difficulty: 'Junior',
    summaryAnswer: 'logrotate — системная утилита для автоматического сжатия, переименования, архивации и удаления устаревших файлов логов на основе размера или возраста.',
    fullAnswer: `Без logrotate логи приложений забивают всё дисковое пространство.
Конфигурация хранится в /etc/logrotate.conf и /etc/logrotate.d/*.

Основные директивы:
- **daily / weekly / monthly**: периодичность.
- **rotate 7**: хранить максимум 7 архивных копий.
- **compress**: сжимать старые логи через gzip.
- **missingok**: не выдавать ошибку, если файла лога нет.
- **copytruncate**: скопировать содержимое лога в архив и обнулить текущий файл на лету БЕЗ перезапуска приложения!`,
    codeSnippet: {
      language: 'ini',
      code: `/var/log/myapp/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    copytruncate
}`
    },
    interviewTips: [
      'Директива copytruncate — спасение для приложений, которые не умеют переоткрывать дескриптор файла по сигналу SIGHUP.'
    ],
    commonPitfalls: [
      'Забывать настроить logrotate для кастомных логов в /var/log/.'
    ],
    tags: ['Linux', 'Logrotate', 'Logging', 'Maintenance']
  }
];
