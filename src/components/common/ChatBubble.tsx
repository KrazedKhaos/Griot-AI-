import React from 'react';

interface ChatBubbleProps {
    message: {
        role: 'user' | 'model';
        text: string;
    };
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
    const isUser = message.role === 'user';

    return (
        <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : ''}`}>
            {!isUser && (
                <div className="w-8 h-8 rounded-full bg-uc-primary flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                    AI
                </div>
            )}
            <div
                className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl ${
                    isUser
                        ? 'bg-uc-primary text-white rounded-br-none'
                        : 'bg-gray-100 dark:bg-gray-700 text-uc-text dark:text-gray-200 rounded-bl-none'
                }`}
            >
                <p className="text-sm leading-relaxed">{message.text}</p>
            </div>
        </div>
    );
};

export default ChatBubble;