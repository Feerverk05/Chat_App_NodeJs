import express from 'express';
const router = express.Router();

const quotes = [
  "Привіт",
  "Все добре",
  "Як справи?",
  "Немає світла",
  "Стандартно тримаюсь",
  "Працюю над собою і всім",
  "Їла пюре",
  "Люблю свою роботу",
  "Хочу Нового року",
  "Коли будем відпочивати?",
];

router.get('/random', (req, res) => {
    try {
        const randomNumber = Math.floor(Math.random() * quotes.length); 
        const randomQuote = quotes[randomNumber]; 
        res.json({
            allQuotes: quotes, 
            randomQuote: randomQuote 
        });
    } catch (error) {
        console.error("Error fetching quotes:", error);
        res.status(500).send("Error fetching quotes");
    }
});

export default router;
