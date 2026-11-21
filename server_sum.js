const http = require('http'); // Импорт модуля http для создания веб-сервера
const url = require('url'); // Импорт модуля url для парсинга URL и query-параметров
// Порт берётся из переменной окружения (на Render её задаёт платформа), локально — 3000
const port = process.env.PORT || 3000;

// Создание HTTP-сервера с обработчиком запросов
const server = http.createServer((req, res) => {

    // Добавление заголовков CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    // Разбор URL запроса с учетом query-параметров
    const parsedUrl = url.parse(req.url, true);
    // Получение query-параметров из URL
    const query = parsedUrl.query;

    // Проверка, что запрос направлен на маршрут /sum и использует метод GET
    if (parsedUrl.pathname === '/sum' && req.method === 'GET') {
        const a = parseFloat(query.a);
        const b = parseFloat(query.b);

        // Проверка, являются ли a и b валидными числами
        if (isNaN(a) || isNaN(b)) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                error: 'Parameters "a" and "b" must be valid numbers'
            }));
            return;
        }

        // Вычисление суммы чисел a и b
        const sum = a + b;

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ a: a, b: b, sum: sum }));
    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            error: 'Route not found. Use /sum?a=<number>&b=<number>'
        }));
    }
});

// Запуск сервера на указанном порту (0.0.0.0 — чтобы был доступен снаружи контейнера)
server.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});
