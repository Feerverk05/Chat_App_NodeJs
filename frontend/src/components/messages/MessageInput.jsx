import { useState } from "react";
import { BsSend } from "react-icons/bs";
import toast from "react-hot-toast";

const MessageInput = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]); // Локальний список повідомлень
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        // Додаємо повідомлення від користувача
        const userMessage = { sender: "user", text: message };
        setMessages((prev) => [...prev, userMessage]);
        setMessage("");

        // Завантаження цитати з сервера
        setLoading(true);
        setTimeout(async () => {
            try {
                const response = await fetch("/api/quotes/random");
                if (!response.ok) throw new Error("Не вдалося отримати цитату");
                const data = await response.json();
                if (data.quote) {
                    const botMessage = { sender: "bot", text: data.quote };
                    setMessages((prev) => [...prev, botMessage]); // Додаємо повідомлення від бота
                } else {
                    throw new Error("Сервер повернув некоректну відповідь");
                }
            } catch (error) {
                toast.error("Помилка отримання цитати: " + error.message);
            } finally {
                setLoading(false);
            }
        }, 3000); // Затримка в 3 секунди
    };

    return (
        <div>
            {/* Відображення списку повідомлень */}
            <div className="message-list">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`message ${msg.sender === "user" ? "user-message" : "bot-message"}`}
                    >
                        <strong>{msg.sender === "user" ? "Ви:" : "Бот:"}</strong> {msg.text}
                    </div>
                ))}
            </div>

            {/* Поле вводу повідомлень */}
            <form className="px-4 my-3" onSubmit={handleSubmit}>
                <div className="w-full relative">
                    <input
                        type="text"
                        className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 text-white"
                        placeholder="Send a message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="absolute inset-y-0 end-0 flex items-center pe-3"
                        disabled={loading}
                    >
                        {loading ? <div className="loading loading-spinner"></div> : <BsSend />}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MessageInput;
