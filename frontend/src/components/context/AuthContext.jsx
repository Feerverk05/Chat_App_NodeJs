import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
  // ініціалізація authUser зі значенням із localStorage або null
  const [authUser, setAuthUser] = useState(() => {
    const savedUser = localStorage.getItem("chat-user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Функція для логування користувача
  const login = (userData) => {
    setAuthUser(userData);
    localStorage.setItem("chat-user", JSON.stringify(userData)); // Зберігаємо в localStorage
  };

  // Функція для лог-ауту
  const logout = () => {
    setAuthUser(null);
    localStorage.removeItem("chat-user"); // Видаляємо з localStorage
  };

  // Можна додати useEffect, щоб відслідковувати зміни authUser, але це не обов'язково
  useEffect(() => {
    if (authUser) {
      console.log("Logged in as", authUser.fullName);
    }
  }, [authUser]);

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
