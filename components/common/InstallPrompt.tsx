
import React, { useState, useEffect } from 'react';

interface InstallPromptProps {
    event: any;
    onDismiss: () => void;
}

const InstallPrompt: React.FC<InstallPromptProps> = ({ event, onDismiss }) => {
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
        if(event) {
            setIsVisible(true);
        }
    }, [event]);

    const handleInstallClick = () => {
        if (!event) return;
        event.prompt();
        event.userChoice.then((choiceResult: { outcome: string }) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
            } else {
                console.log('User dismissed the A2HS prompt');
            }
            onDismiss();
            setIsVisible(false);
        });
    };

    const handleDismiss = () => {
        setIsVisible(false);
        onDismiss();
    }

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-11/12 max-w-sm p-4 rounded-lg shadow-xl bg-uc-secondary text-white flex items-center space-x-4 z-50 animate-slide-in-up">
            {/* Assumes an icon is available at this path */}
            <img src="/icons/icon-192x192.png" alt="UbuntuConnect Logo" className="w-12 h-12 rounded-lg" />
            <div className="flex-grow">
                <h4 className="font-bold">Get the App!</h4>
                <p className="text-sm text-gray-300">Add to home screen for a better experience.</p>
            </div>
            <div className="flex flex-col space-y-2 flex-shrink-0">
                 <button onClick={handleInstallClick} className="px-3 py-1 bg-uc-primary text-white text-sm font-bold rounded-md hover:bg-opacity-90 transition-colors">
                    Install
                </button>
                <button onClick={handleDismiss} className="px-3 py-1 text-gray-300 text-xs font-bold rounded-md hover:bg-gray-700 transition-colors">
                    Later
                </button>
            </div>
        </div>
    );
}

export default InstallPrompt;