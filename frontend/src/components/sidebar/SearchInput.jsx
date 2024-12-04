import { FiEdit } from "react-icons/fi";
import { IoSearchSharp } from "react-icons/io5";
import toast from "react-hot-toast";
import useGetConversations from "../hooks/useGetConversations";
import useConversation from "../zustand/useConversation";
import { useState } from "react";
import Modal from "react-modal";

const SearchInput = () => {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newChatName, setNewChatName] = useState("");
  const [newChatGender, setNewChatGender] = useState(""); 

  const { setSelectedConversation } = useConversation();
  const { conversations, setConversations } = useGetConversations();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    if (search.length < 3) {
      return toast.error("Search term must be at least 3 characters long");
    }

    const conversation = conversations.find((c) =>
      c.fullName.toLowerCase().includes(search.toLowerCase())
    );

    if (conversation) {
      setSelectedConversation(conversation);
      setSearch("");
    } else {
      toast.error("No such user found!");
    }
  };

  const handleNewChatSubmit = async (e) => {
    e.preventDefault();

    if (!newChatName.trim() || !newChatGender.trim()) {
      return toast.error("Full name and gender cannot be empty!");
    }

    const newChat = {
      fullName: newChatName,
      gender: newChatGender,
    };

    try {
      const response = await fetch('/api/conversations/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newChat),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create chat");
      }

      const data = await response.json();
      setConversations([...conversations, data]);

      toast.success(`Chat with ${newChatName} created!`);
      setNewChatName("");
      setNewChatGender(""); 
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Error creating chat!");
      console.error(error);
    }
  };

  return (
    <div className="flex items-center gap-4 relative">
      <form
        onSubmit={handleSearchSubmit}
        className="relative flex items-center w-full max-w-md"
      >
        <IoSearchSharp className="absolute left-3 text-gray-500 w-5 h-5" />
        <input
          type="text"
          placeholder="Search…"
          className="input input-bordered rounded-full pl-10 w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>

      <button
        className="btn btn-circle bg-black text-white"
        onClick={() => setIsModalOpen(true)}
      >
        <FiEdit className="w-5 h-5" />
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        ariaHideApp={false}
        className="modal-content absolute top-0 left-1/2 transform -translate-x-1/2 p-6 bg-transparent border-none"
        overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white p-6 max-w-sm rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-center">Новий чат</h2>
          <form onSubmit={handleNewChatSubmit} className="space-y-4">
            <div>
              <label htmlFor="chatName" className="block text-sm font-medium text-gray-700">
                Ім'я:
              </label>
              <input
                id="chatName"
                type="text"
                placeholder="Введіть"
                className="input input-bordered w-full"
                value={newChatName}
                onChange={(e) => setNewChatName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="chatGender" className="block text-sm font-medium text-gray-700">
                Стать:
              </label>
              <input
                id="chatGender"
                type="text"
                placeholder="Введіть (наприклад, Male/Female)"
                className="input input-bordered w-full"
                value={newChatGender}
                onChange={(e) => setNewChatGender(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setIsModalOpen(false)}
              >
                Закрити
              </button>
              <button type="submit" className="btn btn-primary">
                Створити чат
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default SearchInput;
