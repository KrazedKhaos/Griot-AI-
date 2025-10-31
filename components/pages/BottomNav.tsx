
import React from 'react';
import { Page } from '../types';

interface NavItemProps {
    page: Page;
    label: string;
    // Fix: Changed React.ReactElement to React.ReactElement<any> to allow className prop injection.
    icon: React.ReactElement<any>;
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
}

const NavItem: React.FC<NavItemProps> = ({ page, label, icon, currentPage, setCurrentPage }) => {
    const isActive = currentPage === page;
    const activeClass = isActive ? 'text-uc-primary' : 'text-gray-400 dark:text-gray-500';

    return (
        <button
            onClick={() => setCurrentPage(page)}
            className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${activeClass}`}
        >
            {React.cloneElement(icon, { className: 'h-6 w-6' })}
            <span className="text-xs mt-1">{label}</span>
        </button>
    );
};

interface BottomNavProps {
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentPage, setCurrentPage }) => {
    const navItems: { page: Page; label: string; icon: React.ReactElement; }[] = [
        { page: Page.Home, label: 'Home', icon: <HomeIcon /> },
        { page: Page.Categories, label: 'Categories', icon: <CategoryIcon /> },
        { page: Page.Wishlist, label: 'Wishlist', icon: <BookmarkIcon /> },
        { page: Page.Search, label: 'Search', icon: <SearchIcon /> },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 dark:bg-uc-secondary dark:border-gray-700 md:max-w-md md:mx-auto md:left-1/2 md:-translate-x-1/2 z-20">
            <div className="flex justify-around items-center h-16">
                {navItems.map(item => (
                    <NavItem
                        key={item.page}
                        page={item.page}
                        label={item.label}
                        icon={item.icon}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
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
const CategoryIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25A2.25 2.25 0 0 1 13.5 8.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
    </svg>
);
const BookmarkIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
    </svg>
);
const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
);


export default BottomNav;