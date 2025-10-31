import React, { useState } from 'react';
import { useTranslations } from '../../hooks/useTranslations';

interface LoginPageProps {
    onLogin: () => void;
    navigate: (path: string) => void;
}

const SignInIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m-3-3-3 3m0 0 3 3m-3-3h12.75" />
    </svg>
);


const LoginPage: React.FC<LoginPageProps> = ({ onLogin, navigate }) => {
    const t = useTranslations();
    const [email, setEmail] = useState('admin@edeal.com');
    const [password, setPassword] = useState('password');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email && password) {
            setError('');
            onLogin();
            navigate('#/admin');
        } else {
            setError(t.loginError);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-uc-secondary dark:text-white">{t.loginTitle}</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">{t.loginSubtitle}</p>
                </div>
                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 space-y-6">
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.emailAddress}</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full input-style"
                            placeholder="admin@edeal.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.password}</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full input-style"
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-uc-secondary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-uc-primary transition"
                        >
                            <SignInIcon className="w-5 h-5 mr-2 transform rotate-180" />
                            {t.signIn}
                        </button>
                    </div>
                </form>
                <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
                    <a href="#/" className="hover:underline">← {t.backToShop}</a>
                </p>
            </div>
             <style>{`
                .input-style {
                    padding: 0.5rem 0.75rem; border-width: 1px; border-color: #D1D5DB; border-radius: 0.5rem; outline: none; transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1); background-color: white; width: 100%;
                }
                .dark .input-style { border-color: #4B5563; background-color: #374151; color: #F3F4F6; }
                .input-style:focus { --tw-ring-color: #FF7A00; border-color: #FF7A00; box-shadow: 0 0 0 2px var(--tw-ring-color); }
            `}</style>
        </div>
    );
};

export default LoginPage;