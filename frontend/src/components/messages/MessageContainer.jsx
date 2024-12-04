import { useEffect, useState } from "react";
import { TiMessages } from "react-icons/ti";
import { AiOutlineCheck, AiOutlineDelete, AiOutlineEdit, AiOutlineSearch } from "react-icons/ai"; 
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { useAuthContext } from "../context/AuthContext";
import useConversation from "../zustand/useConversation";

const MessageContainer = () => {
  const { selectedConversation, setSelectedConversation, deleteConversation, editConversation } = useConversation();
  const [isEditing, setIsEditing] = useState(false);
  const [newFullName, setNewFullName] = useState("");
  const [newSurname, setNewSurname] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); 
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (selectedConversation) {
      const [firstName, lastName] = selectedConversation.fullName.split(" ");
      setNewFullName(firstName || "");
      setNewSurname(lastName || "");
    }
  }, [selectedConversation]);

  useEffect(() => {
    return () => setSelectedConversation(null);
  }, [setSelectedConversation]);

  const handleDeleteConversation = () => {
    if (selectedConversation) {
      const confirmed = window.confirm("Ви впевнені що хочете видалити цей чат?");
      if (confirmed) {
        deleteConversation(selectedConversation.id); 
        setSelectedConversation(null); 
      }
    }
  };

  const handleEditConversation = () => {
    if (selectedConversation) {
      setIsEditing(true);
    }
  };

  const handleSaveEdit = async () => {
    if (!newFullName.trim() || !newSurname.trim()) {
      return alert("Both name and surname are required!");
    }

    const updatedConversation = {
      ...selectedConversation,
      fullName: `${newFullName} ${newSurname}`,
    };

    try {
      const response = await fetch(`/api/updateConversation/${selectedConversation._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: updatedConversation.fullName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update conversation");
      }

      editConversation(updatedConversation); 
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating conversation:", error);
      alert("Не вдалося оновити дані!");
    }
  };

  return (
    <div className="md:min-w-[450px] flex flex-col">
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          <div className="bg-slate-500 px-4 py-2 mb-2 flex justify-between items-center">
            <div>
              <span className="label-text">To:</span>{" "}
              <span className="text-white-900 font-bold">
                {isEditing ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFullName}
                      onChange={(e) => setNewFullName(e.target.value)}
                      className="input input-bordered w-20"
                    />
                    <input
                      type="text"
                      value={newSurname}
                      onChange={(e) => setNewSurname(e.target.value)}
                      className="input input-bordered w-20"
                    />
                  </div>
                ) : (
                  selectedConversation.fullName
                )}
              </span>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <AiOutlineCheck
                  onClick={handleSaveEdit}
                  className="text-green-800 hover:text-green-600 cursor-pointer text-xl"
                  title="Save Changes"
                />
              ) : (
                <AiOutlineEdit
                  className="text-white-800 hover:text-gray-600 cursor-pointer"
                  title="Edit Conversation"
                  onClick={handleEditConversation}
                />
              )}
              <AiOutlineDelete
                className="text-red-800 hover:text-red-600 cursor-pointer"
                title="Delete Conversation"
                onClick={handleDeleteConversation}
              />
              <AiOutlineSearch
                className="text-blue-800 hover:text-yellow-600 cursor-pointer"
                title="Search Messages"
                onClick={() => setIsSearching(!isSearching)} 
              />
            </div>
          </div>
          {isSearching && (
            <div className="mb-2 px-4">
              <input
                type="text"
                placeholder="Пошук повідомлень..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>
          )}
          <Messages searchQuery={searchQuery} /> 
          <MessageInput />
        </>
      )}
    </div>
  );
};

const NoChatSelected = () => {
  const { authUser } = useAuthContext();
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2">
        <p>Вітаю👋 {authUser.fullName}</p>
        <p>Оберіть чат</p>
        <TiMessages className="text-3xl md:text-6xl text-center" />
      </div>
    </div>
  );
};

export default MessageContainer;
