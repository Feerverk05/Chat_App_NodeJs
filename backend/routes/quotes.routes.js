const express = require('express');
const router = express.Router();

// Список цитат (можна зберігати в окремому файлі або базі даних)
const quotes = [
    "Життя – це те, що відбувається, поки ви будуєте інші плани.",
    "Успіх – це йти від невдачі до невдачі без втрати ентузіазму.",
    "Краще зробити і шкодувати, ніж не зробити і шкодувати.",
    // Додати більше цитат за потребою
];

// Маршрут для отримання випадкової цитати та списку всіх цитат
router.get('/random', (req, res) => {
    try {
        const randomNumber = Math.floor(Math.random() * quotes.length); // Генерація випадкового індексу
        const randomQuote = quotes[randomNumber]; // Вибираємо випадкову цитату з масиву
        
        // Відправляємо в JSON: список цитат та випадкову цитату
        res.json({
            allQuotes: quotes, // Список всіх цитат
            randomQuote: randomQuote // Випадкова цитата
        });
    } catch (error) {
        console.error("Error fetching quotes:", error);
        res.status(500).send("Error fetching quotes");
    }
});

module.exports = router;
