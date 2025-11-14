# Базовый образ с Node.js
FROM node:20-alpine

# Рабочая директория внутри контейнера
WORKDIR /app

# Копируем файлы приложения
COPY server.js index.html ./

# Порт, который слушает сервер
EXPOSE 3000

# Команда запуска
CMD ["node", "server.js"]
