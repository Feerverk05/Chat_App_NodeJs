import { create } from "zustand";

const useConversation = create((set, get) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) => set({ selectedConversation }),

  messages: [],
  setMessages: (messages) => set({ messages }),

  conversations: [],
  setConversations: (conversations) => set({ conversations }),

  deleteConversation: (id) => {
    const { conversations, selectedConversation, setSelectedConversation } = get();
    const updatedConversations = conversations.filter((conv) => conv.id !== id);

    set({ conversations: updatedConversations });

    if (selectedConversation?.id === id) {
      setSelectedConversation(null);
    }
  },

  editConversation: (id, updatedData) => {
    const { conversations } = get();
    const updatedConversations = conversations.map((conv) =>
      conv.id === id ? { ...conv, ...updatedData } : conv
    );

    set({ conversations: updatedConversations });
  },
}));

export default useConversation;
