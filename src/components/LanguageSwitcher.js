"use client";
import { useLanguage } from '@/context/LanguageContext';
import { Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function LanguageSwitcher() {
    const { language, changeLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const languages = [
        { code: 'fr', label: 'Français', flag: '🇫🇷' },
        { code: 'en', label: 'English', flag: '🇬🇧' },
        { code: 'ar', label: 'العربية', flag: '🇩🇿' },
        { code: 'ja', label: '日本語', flag: '🇯🇵' },
    ];

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    const currentLang = languages.find(l => l.code === language) || languages[0];

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
            >
                <Globe size={18} />
                <span className="text-sm font-medium hidden md:block">{currentLang.code.toUpperCase()}</span>
            </button>

            {isOpen && (
                <div
                    style={{ animation: 'dropdownFadeIn 0.15s ease-out' }}
                    className="absolute right-0 mt-2 w-48 bg-[#0a0e17] border border-gray-800 rounded-xl shadow-xl z-50 overflow-hidden"
                >
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => {
                                changeLanguage(lang.code);
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between hover:bg-gray-800 transition-colors ${language === lang.code ? 'text-[#a78bfa] bg-white/5' : 'text-gray-300'
                                }`}
                        >
                            <span className="flex items-center gap-3">
                                <span className="text-lg">{lang.flag}</span>
                                {lang.label}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
