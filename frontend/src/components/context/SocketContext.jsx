import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuthContext } from "./AuthContext";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (authUser) {
      // Перевірка: якщо підключення вже існує, повторно не створюємо
      if (!socket) {
        const socketInstance = io("http://localhost:3001", {
          query: {
            userId: authUser._id,
            fullName: authUser.fullName, // додаємо ім'я
            avatar: authUser.avatar,     // додаємо аватарку
          },
        });

        setSocket(socketInstance);

        socketInstance.on("getOnlineUsers", (users) => {
          const updatedUsers = users.map(user => ({
            ...user,
            fullName: user.fullName || "Unknown",  // Якщо немає імені, встановлюємо за замовчуванням
            avatar: user.avatar || "default-avatar.png", // Встановлюємо аватарку за замовчуванням
          }));
          setOnlineUsers(updatedUsers);
        });

        // Очищення ресурсу при розмонтуванні
        return () => {
          socketInstance.close();
          setSocket(null); // Скидаємо стан
        };
      }
    } else {
      // Закриття підключення, якщо користувач не авторизований
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]); // Видалено `socket` зі списку залежностей

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
