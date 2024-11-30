import useGetConversations from "../hooks/useGetConversations.js";
import { getRandomEmoji } from "../utils/emojis.js";
import Conversation from "./Conversation.jsx";

const Conversations = () => {
	const { loading, conversations } = useGetConversations();

	// Резервні значення для безпечного рендерингу
	const safeConversations = conversations?.map((conv) => ({
		...conv,
		fullName: conv.fullName || "Unnamed User",
		profilePic: conv.profilePic || "/default-avatar.png",
	})) || [];

	return (
		<div className='py-2 flex flex-col overflow-auto'>
			{/* Відображення кожної розмови */}
			{safeConversations.map((conversation, idx) => (
				<Conversation
					key={conversation._id}
					conversation={conversation}
					emoji={getRandomEmoji()}
					lastIdx={idx === safeConversations.length - 1}
				/>
			))}

			{/* Спінер завантаження */}
			{loading && <span className='loading loading-spinner mx-auto'></span>}

			{/* Повідомлення, якщо список порожній */}
			{!loading && safeConversations.length === 0 && (
				<p className='text-center text-gray-500'>No conversations found</p>
			)}
		</div>
	);
};

export default Conversations;
