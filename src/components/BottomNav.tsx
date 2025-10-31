import React from 'react';
import { useTranslations } from '../hooks/useTranslations';

interface NavItemProps {
    path: string;
    label: string;
    icon: React.ReactElement<any>;
    currentPath: string;
}

const NavItem: React.FC<NavItemProps> = ({ path, label, icon, currentPath }) => {
    // Match base path for active state. e.g. '#/category/Health' should match '#/categories'
    const baseCurrentPath = `#/${currentPath.split('/')[1] || ''}`;
    const isActive = baseCurrentPath === path;
    const activeClass = isActive ? 'text-uc-primary' : 'text-gray-400 dark:text-gray-500';

    return (
        <a
            href={path}
            className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${activeClass}`}
            title={label}
        >
            {React.cloneElement(icon, { className: 'h-6 w-6' })}
            <span className="text-xs mt-1">{label}</span>
        </a>
    );
};

interface BottomNavProps {
    currentPath: string;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentPath }) => {
    const t = useTranslations();
    const navItems: { path: string; label: string; icon: React.ReactElement; }[] = [
        { path: '#/', label: t.navHome, icon: <HomeIcon /> },
        { path: '#/businesses', label: t.navBusinesses, icon: <BusinessNavIcon /> },
        { path: '#/connect', label: t.navConnect, icon: <ConnectIcon /> },
        { path: '#/chamas', label: t.navChamas, icon: <ChamaIcon /> },
        { path: '#/vault', label: t.navVault, icon: <GiftIcon /> },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 dark:bg-uc-secondary dark:border-gray-700 md:max-w-md md:mx-auto md:left-1/2 md:-translate-x-1/2 z-20">
            <div className="flex justify-around items-center h-16">
                {navItems.map(item => (
                    <NavItem
                        key={item.path}
                        path={item.path}
                        label={item.label}
                        icon={item.icon}
                        currentPath={currentPath}
                    />
                ))}
            </div>
        </nav>
    );
};


// SVG Icons
const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
    </svg>
);
const ConnectIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
);
const GiftIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0H9.375m3.375 0a2.625 2.625 0 0 1 2.625-2.625m0 0A2.625 2.625 0 1 0 12 4.875" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 7.5h16.5v1.5H3.75V7.5Z" />
    </svg>
);
const BusinessNavIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21v-4.5m0 4.5h16.5M3.75 16.5h16.5M3.75 12h16.5m-16.5 4.5v-4.5m16.5 4.5v-4.5m0-4.5v4.5m0-4.5h-4.5m-12 0h4.5m-4.5 0v-4.5m0 4.5h-1.5m1.5 0h4.5m10.5 0h-4.5m0 0v-4.5m4.5 4.5v-4.5m-12 9h1.5m-1.5 0v-4.5m1.5 4.5h4.5m0 0v-4.5m0 4.5h4.5m0 0v-4.5m-4.5 4.5H9m6-12v4.5m0-4.5h4.5m-4.5 0H9" />
    </svg>
);
const ChamaIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.5-2.226A3 3 0 0 0 6 15a3 3 0 0 0-1.258-2.501M15 11.25a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);


export default BottomNav;