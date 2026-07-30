sed -i '7,20c\
  {\
    id: "docker-1",\
    title: "Чем отличаются Docker image и Docker container? Из чего они состоят?",\
    category: "docker",\
    summaryAnswer: "Docker Image — это неизменяемый (read only, только чтение) шаблон со слоями файловой системы. Container — это запущенный экземпляр образа с добавленным поверх тонким слоем read/write (чтение/запись).",\
    fullAnswer: `Docker Образ состоит из последовательности read only (только чтение) слоев (UnionFS / OverlayFS). Каждый слой представляет собой изменения (diff) по сравнению с предыдущим.\\n\\nПри запуске контейнера движок Docker создаёт поверх всех слоев образа один тонкий слой read/write (чтение/запись).\\n\\nЕсли приложение внутри контейнера изменяет существующий файл из образа, срабатывает механизм Copy-on-Write (CoW): файл копируется из нижнего read only слоя в верхний R/W слой, где и модифицируется.`,\
    codeSnippet: {\
      language: "bash",\
      code: `docker history my-app:latest # просмотр слоев образа\\ndocker inspect my-container # данные о слоях и монтировании (GraphDriver/Overlay2)`\
    },
' src/data/questions/docker.ts
