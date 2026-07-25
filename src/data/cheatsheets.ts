export interface CheatsheetCommand {
  command: string;
  description: string;
  category: 'kubectl' | 'docker' | 'linux' | 'terraform' | 'git';
  tags: string[];
}

export const CHEATSHEET_COMMANDS: CheatsheetCommand[] = [
  // Kubectl
  {
    command: 'kubectl get pods -A -o wide --sort-by=.metadata.creationTimestamp',
    description: 'Получить все поды во всех namespace с отсортированной датой создания',
    category: 'kubectl',
    tags: ['pods', 'all-namespaces', 'sort']
  },
  {
    command: 'kubectl logs -f deployment/my-app -n prod --all-containers --since=10m',
    description: 'Смотреть логи всех контейнеров деплоймента за последние 10 минут в реальном времени',
    category: 'kubectl',
    tags: ['logs', 'debug', 'tail']
  },
  {
    command: 'kubectl run tmp-shell --rm -i --tty --image=nicolaka/netshoot -- bash',
    description: 'Запустить временный под с набором сетевых утилит (netshoot) для отладки сети внутри кластера',
    category: 'kubectl',
    tags: ['debug', 'network', 'netshoot', 'troubleshoot']
  },
  {
    command: 'kubectl top pods -n prod --sort-by=memory',
    description: 'Показать потребление CPU и памяти подами с сортировкой по памяти',
    category: 'kubectl',
    tags: ['metrics', 'top', 'memory', 'cpu']
  },
  {
    command: 'kubectl get events -n prod --sort-by=.metadata.creationTimestamp',
    description: 'Просмотр системных событий кластера в namespace (помогает понять почему падают поды)',
    category: 'kubectl',
    tags: ['events', 'debug', 'errors']
  },

  // Docker
  {
    command: 'docker system prune -a --volumes --force',
    description: 'Полная очистка неиспользуемых контейнеров, сетей, образов и волюмов',
    category: 'docker',
    tags: ['clean', 'prune', 'disk']
  },
  {
    command: 'docker stats --format "table {{.Name}}\\t{{.CPUPerc}}\\t{{.MemUsage}}"',
    description: 'Удобная таблица потребления ресурсов запущенными контейнерами',
    category: 'docker',
    tags: ['stats', 'monitoring', 'cpu', 'memory']
  },
  {
    command: 'docker inspect --format="{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}" my-container',
    description: 'Быстро узнать внутренний IP адрес контейнера',
    category: 'docker',
    tags: ['inspect', 'ip', 'network']
  },

  // Linux
  {
    command: 'journalctl -u nginx.service -n 100 --no-pager -f',
    description: 'Просмотр и отслеживание логов конкретного systemd юнита',
    category: 'linux',
    tags: ['logs', 'systemd', 'journalctl']
  },
  {
    command: 'lsof -i :8080 -P -n',
    description: 'Узнать, какой процесс занимает порт 8080',
    category: 'linux',
    tags: ['port', 'process', 'network']
  },
  {
    command: 'find /var/log -type f -size +100M -exec ls -lh {} \\;',
    description: 'Найти файлы логов размером более 100 МБ',
    category: 'linux',
    tags: ['disk', 'find', 'filesize']
  },
  {
    command: 'ss -s',
    description: 'Сводка по всем сетевым сокетам (TCP, UDP, RAW)',
    category: 'linux',
    tags: ['sockets', 'network', 'ss']
  },

  // Terraform
  {
    command: 'terraform state list',
    description: 'Список всех ресурсов, отслеживаемых в текущем state файле',
    category: 'terraform',
    tags: ['state', 'resources']
  },
  {
    command: 'terraform state show aws_instance.web_server',
    description: 'Просмотр всех атрибутов конкретного ресурса в state',
    category: 'terraform',
    tags: ['state', 'inspect']
  },
  {
    command: 'terraform plan -out=tfplan.binary && terraform apply tfplan.binary',
    description: 'Безопасное выполнение: сначала сохранить план изменений, затем применить ровно его',
    category: 'terraform',
    tags: ['plan', 'apply', 'safe']
  }
];
