import { useEffect, useRef, useState } from "react";
import Message from "./Message";
import useConversation from "../zustand/useConversation";

const Messages = ({ searchQuery }) => {
  const { selectedConversation } = useConversation();
  const lastMessageRef = useRef();
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [selectedConversation?.messages]);

  if (!selectedConversation) {
    return <p className="text-center text-gray-500">Виберіть розмову</p>;
  }

  const messages = selectedConversation.messages || [];

  const filteredMessages = messages.filter((message) =>
    message.text?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (filteredMessages.length === 0 && searchQuery.trim() !== "") {
      setNoResults(true);
    } else {
      setNoResults(false);
    }
  }, [searchQuery, filteredMessages.length]);

  const highlightText = (text) => {
    if (!searchQuery.trim()) return text;

    const regex = new RegExp(`(${searchQuery})`, "gi");
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <span key={index} className="bg-yellow-300">{part}</span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="px-4 flex-1 overflow-auto">
      {noResults ? (
        <p className="text-center text-red-500">Повідомлення не знайдено</p> 
      ) : (
        filteredMessages.map((message, index) => (
          <div
            key={message._id || index}
            ref={index === filteredMessages.length - 1 ? lastMessageRef : null}
            className="message"
          >
            {/* Виділення тексту повідомлення */}
            <Message message={{ ...message, text: highlightText(message.text) }} />
          </div>
        ))
      )}
    </div>
  );
};

export default Messages;
