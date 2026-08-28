"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '@/lib/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('fr');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        const detectLanguage = () => {
            try {
                // 1. Check LocalStorage
                const savedLang = localStorage.getItem('app-language');
                if (savedLang && translations[savedLang]) {
                    setLanguage(savedLang);
                    updateDocument(savedLang);
                    return;
                }

                // 2. Use browser language (no external API needed)
                const browserLang = (navigator.language || 'fr').toLowerCase();
                const arabLangs = ['ar', 'ar-dz', 'ar-ma', 'ar-tn', 'ar-sa', 'ar-eg'];
                const englishLangs = ['en', 'en-us', 'en-gb', 'en-au', 'en-ca'];

                let detectedLang = 'fr'; // Default fallback

                if (arabLangs.some(l => browserLang.startsWith(l.split('-')[0]) && browserLang.includes('ar'))) {
                    detectedLang = 'ar';
                } else if (englishLangs.some(l => browserLang.startsWith('en'))) {
                    detectedLang = 'en';
                } else if (browserLang.startsWith('fr')) {
                    detectedLang = 'fr';
                }

                if (translations[detectedLang]) {
                    setLanguage(detectedLang);
                    localStorage.setItem('app-language', detectedLang);
                    updateDocument(detectedLang);
                }

            } catch (e) {
                // Fallback to default 'fr' is already set in state
            }
        };

        detectLanguage();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const updateDocument = (lang) => {
        if (typeof document !== 'undefined') {
            document.documentElement.lang = lang;
            document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        }
    };

    const changeLanguage = (lang) => {
        if (translations[lang]) {
            setLanguage(lang);
            try {
                localStorage.setItem('app-language', lang);
            } catch (e) {
                console.error('Failed to save to localStorage:', e);
            }
            updateDocument(lang);
        }
    };

    const t = (key) => {
        // Traverse key like 'nav.home'
        const keys = key.split('.');
        let value = translations[language];

        for (const k of keys) {
            value = value?.[k];
        }

        return value || key; // Return key if translation missing
    };

    // Always provide context, even before mount, to avoid undefined errors
    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t, dir: language === 'ar' ? 'rtl' : 'ltr' }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
