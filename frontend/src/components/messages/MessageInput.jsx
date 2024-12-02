import { useState } from "react";
import { BsSend, BsPencil } from "react-icons/bs";
import toast from "react-hot-toast";

const MessageInput = ({ selectedChatId }) => {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState({
    });
    const [editingMessageId, setEditingMessageId] = useState(null); 
    const [editedMessageText, setEditedMessageText] = useState(""); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim() && !editedMessageText.trim()) return;

        if (editingMessageId !== null) {
            setMessages((prevMessages) => ({
                ...prevMessages,
                [selectedChatId]: prevMessages[selectedChatId].map((msg) =>
                    msg.id === editingMessageId ? { ...msg, text: editedMessageText } : msg
                ),
            }));
            setEditingMessageId(null); 
            setEditedMessageText("");
        } else {
            const userMessage = {
                sender: "user",
                text: message,
                time: new Date().toLocaleTimeString(),
                id: Date.now(), 
            };
            setMessages((prevMessages) => ({
                ...prevMessages,
                [selectedChatId]: [
                    ...(prevMessages[selectedChatId] || []),
                    userMessage,
                ],
            }));

            setMessage("");
        }

        if (editingMessageId === null) { 
            setLoading(true);
            setTimeout(async () => {
                try {
                    const response = await fetch("/api/quotes/random");
                    if (!response.ok) throw new Error("Не вдалося отримати цитату");
                    const data = await response.json();
                    if (data.randomQuote) {
                        const botMessage = {
                            sender: "bot",
                            text: data.randomQuote,
                            time: new Date().toLocaleTimeString(),
                        };
                        setMessages((prevMessages) => ({
                            ...prevMessages,
                            [selectedChatId]: [
                                ...(prevMessages[selectedChatId] || []),
                                botMessage,
                            ],
                        }));
                    } else {
                        throw new Error("Сервер повернув некоректну відповідь");
                    }
                } catch (error) {
                    toast.error("Помилка отримання цитати: " + error.message);
                } finally {
                    setLoading(false);
                }
            }, 3000); 
        }
    };

    const handleEdit = (messageId, text) => {
        setEditingMessageId(messageId);
        setEditedMessageText(text); 
    };

    return (
        <div>
            <div className="message-list" style={{ maxHeight: "400px", overflowY: "auto" }}>
                {(messages[selectedChatId] || []).map((msg, index) => (
                    <div
                        key={index}
                        className={`message ${msg.sender === "user" ? "user-message" : "bot-message"}`}
                        style={{
                            display: "flex",
                            justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                            marginBottom: "10px",
                        }}
                    >
                        <div
                            className="message-content"
                            style={{
                                padding: "12px",
                                borderRadius: "20px",
                                backgroundColor: "#fff",
                                color: "#333",
                                maxWidth: "70%",
                                wordBreak: "break-word",
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                fontSize: "14px",
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span>{msg.text}</span>

                                {msg.sender === "user" && !editingMessageId && (
                                    <button
                                        onClick={() => handleEdit(msg.id, msg.text)}
                                        style={{
                                            fontSize: "16px",
                                            color: "#888",
                                            marginLeft: "8px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <BsPencil />
                                    </button>
                                )}
                            </div>
                            <div
                                className="message-time"
                                style={{
                                    fontSize: "12px",
                                    color: "#888",
                                    marginTop: "5px",
                                    textAlign: "right",
                                }}
                            >
                                {msg.time}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <form className="px-4 my-3" onSubmit={handleSubmit}>
                <div className="w-full relative">
                    <input
                        type="text"
                        className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 text-white"
                        placeholder="Відправ повідомлення"
                        value={editingMessageId !== null ? editedMessageText : message}
                        onChange={(e) =>
                            editingMessageId !== null
                                ? setEditedMessageText(e.target.value)
                                : setMessage(e.target.value)
                        }
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
