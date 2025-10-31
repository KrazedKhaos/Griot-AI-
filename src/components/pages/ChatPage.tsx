import React, { useState } from 'react';
import { DatingProfile } from '../../types';
import { useTranslations } from '../../hooks/useTranslations';
import AIIcebreakerModal from '../connect/AIIcebreakerModal';

interface ChatPageProps {
    profile: DatingProfile;
    navigate: (path: string) => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ profile, navigate }) => {
    const t = useTranslations();
    const [messages, setMessages] = useState([
        { text: `You matched with ${profile.name}!`, type: 'system' }
    ]);
    const [input, setInput] = useState('');
    const [isIcebreakerOpen, setIsIcebreakerOpen] = useState(false);

    const handleSend = () => {
        if (input.trim()) {
            setMessages([...messages, { text: input, type: 'user' }]);
            setInput('');
        }
    };

    return (
        <>
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="flex-shrink-0 bg-white dark:bg-uc-secondary shadow-sm p-3 flex items-center space-x-3 border-b border-gray-200 dark:border-gray-700">
                <button onClick={() => navigate('#/connect')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-uc-secondary dark:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <img src={profile.photos[0]} alt={profile.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                    <p className="font-bold text-uc-secondary dark:text-white">{profile.name}</p>
                    <p className="text-xs text-green-500">{t.online}</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-center'}`}>
                        {msg.type === 'system' ? (
                            <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-full">{msg.text}</span>
                        ) : (
                             <div className="px-4 py-2 rounded-2xl max-w-xs bg-uc-primary text-white rounded-br-none">
                                <p className="text-sm">{msg.text}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Input */}
            <div className="flex-shrink-0 p-3 bg-white dark:bg-uc-secondary border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                    <button onClick={() => setIsIcebreakerOpen(true)} className="p-3 bg-gray-100 dark:bg-gray-700 text-uc-primary rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" title={t.aiIcebreaker}>
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2l4.45.647a1 1 0 01.554 1.705l-3.22 3.138 1.17 4.628a1 1 0 01-1.451 1.054L12 15.58l-3.996 2.099a1 1 0 01-1.451-1.054l1.17-4.628L4.49 9.553a1 1 0 01.554-1.705l4.45-.647L11.033 2.744A1 1 0 0112 2z" clipRule="evenodd" /></svg>
                    </button>
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleSend()}
                        placeholder={t.typeMessage}
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-transparent rounded-full focus:ring-2 focus:ring-uc-primary focus:border-transparent outline-none transition text-uc-text dark:text-gray-200"
                    />
                    <button onClick={handleSend} className="p-3 bg-uc-primary text-white rounded-full hover:bg-opacity-90 transition-colors disabled:bg-opacity-50" disabled={!input.trim()}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" /></svg>
                    </button>
                </div>
            </div>
        </div>
        {isIcebreakerOpen && (
            <AIIcebreakerModal
                isOpen={isIcebreakerOpen}
                onClose={() => setIsIcebreakerOpen(false)}
                profile={profile}
                onSelectIcebreaker={setInput}
            />
        )}
        </>
    );
};

export default ChatPage;