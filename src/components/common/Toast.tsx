import React, { useState, useEffect } from 'react';
import { ToastMessage } from '../../types';

interface ToastProps {
    toast: ToastMessage | null;
}

const Toast: React.FC<ToastProps> = ({ toast }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (toast) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 2700); // Start fade-out animation slightly before removal
            return () => clearTimeout(timer);
        }
    }, [toast]);

    if (!toast) return null;

    const animationClass = isVisible ? 'animate-slide-in-up' : 'animate-slide-out-down';
    const bgColor = toast.type === 'success' ? 'bg-uc-success' : 'bg-uc-secondary';

    const Icon = () => {
        if (toast.type === 'success') {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
            );
        }
        return (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
        );
    };

    return (
        <div className={`fixed bottom-20 left-1/2 -translate-x-1/2 w-11/12 max-w-sm p-4 rounded-lg shadow-xl text-white flex items-center space-x-3 z-50 ${animationClass} ${bgColor}`}>
            <Icon />
            <span className="font-semibold text-sm">{toast.message}</span>
        </div>
    );
};

export default Toast;