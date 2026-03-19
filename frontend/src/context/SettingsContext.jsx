import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
    const [fontSize, setFontSize] = useState(localStorage.getItem('fontSize') || 'Medium');
    const [appearance, setAppearance] = useState(localStorage.getItem('appearance') || 'Dark');

    useEffect(() => {
        localStorage.setItem('fontSize', fontSize);
        localStorage.setItem('appearance', appearance);
        
        // Apply font size class or style to body/html
        applyFontSize(fontSize);
        applyAppearance(appearance);
    }, [fontSize, appearance]);

    const applyFontSize = (size) => {
        const root = document.documentElement;
        switch(size) {
            case 'Small':
                root.style.fontSize = '14px';
                break;
            case 'Medium':
                root.style.fontSize = '16px';
                break;
            case 'Large':
                root.style.fontSize = '18px';
                break;
            default:
                root.style.fontSize = '16px';
        }
    };

    const applyAppearance = (mode) => {
        const root = document.documentElement;
        if (mode === 'Dark') {
            root.classList.add('dark');
            root.classList.remove('light');
            document.body.style.backgroundColor = '#0B0F19';
        } else if (mode === 'Light') {
            root.classList.add('light');
            root.classList.remove('dark');
            document.body.style.backgroundColor = '#F9FAFB';
        } else {
            // System preference
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (isDark) {
                root.classList.add('dark');
                root.classList.remove('light');
                document.body.style.backgroundColor = '#0B0F19';
            } else {
                root.classList.add('light');
                root.classList.remove('dark');
                document.body.style.backgroundColor = '#F9FAFB';
            }
        }
    };

    const value = {
        fontSize,
        setFontSize,
        appearance,
        setAppearance
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};
