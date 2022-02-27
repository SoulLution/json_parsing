1. Скачать и установить nodejs https://nodejs.org/en/download/
2. Открыть терминал, зайти в папку с проектом и выполнить команды
npm i
npm run start
3. Создать папки json и json_final в основной папке
4. Выполнить GET запрос через Postman либо открыть в браузере
127.0.0.1:3000/parser/parse_json_special - парсинг всех файлов из json в json_final
127.0.0.1:3000/parser/parse_json_special_all - создание в json_final файла all.json со всеми данными из json_final