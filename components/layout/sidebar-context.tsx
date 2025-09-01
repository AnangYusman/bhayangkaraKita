'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';

interface SidebarContextType {
    isOpen: boolean;
    toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(() => {
        if (typeof window !== 'undefined') {
            const storedValue = localStorage.getItem('sidebarOpen');
            return storedValue ? JSON.parse(storedValue) : false;
        }
    });

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        localStorage.setItem('sidebarOpen', JSON.stringify(isOpen));
    }, [isOpen]);

    useEffect(() => {
        const handleResize = () => {
            setIsOpen(window.innerWidth > 768); // Ganti 768 dengan lebar yang sesuai dengan breakpoint Anda
        };

        handleResize(); // Pastikan untuk memanggil fungsi handleResize saat komponen dimuat

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <SidebarContext.Provider value={{ isOpen, toggleSidebar }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
};

export const useSidebarContext = () => {
    return useContext(SidebarContext);
};