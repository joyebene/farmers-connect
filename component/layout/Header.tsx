"use client";

import React from 'react';
import { usePathname } from 'next/navigation';

const Header = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
    const pathname = usePathname();
    const title = pathname.split('/').pop();

    return (
        <header className="bg-white shadow-md p-4 flex items-center">
            <button onClick={toggleSidebar} className="lg:hidden mr-4">
                {<svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                    />
                </svg>}
            </button>
            <h1 className="text-2xl font-bold capitalize">{title}</h1>
        </header>
    );
};

export default Header;