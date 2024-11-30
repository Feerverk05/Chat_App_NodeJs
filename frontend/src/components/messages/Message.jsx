import { useAuthContext } from "../context/AuthContext";
import { extractTime } from "../utils/extractTime";
import useConversation from "../zustand/useConversation.js";

const Message = ({ message }) => {
	const { authUser } = useAuthContext();
	const { selectedConversation } = useConversation();

	if (!message) return null; // Перевірка на існування message

	const fromMe = message.senderId === authUser._id;
	const formattedTime = extractTime(message.createdAt);
	const profilePic = fromMe
		? authUser.profilePic || "/images/default-avatar.png"
		: selectedConversation?.profilePic || "/images/default-avatar.png";

	const chatClassName = fromMe ? "chat-end" : "chat-start";
	const bubbleClasses = `chat-bubble text-white pb-2 ${fromMe ? "bg-blue-500" : ""} ${
		message.shouldShake ? "shake" : ""
	}`;

	return (
		<div className={`chat ${chatClassName}`}>
			<div className='chat-image avatar'>
				<div className='w-10 rounded-full'>
					<img alt='User avatar' src={profilePic} />
				</div>
			</div>
			<div className={bubbleClasses}>{message.message}</div>
			<div className='chat-footer opacity-50 text-xs flex gap-1 items-center'>
				{formattedTime}
			</div>
		</div>
	);
};

export default Message;
