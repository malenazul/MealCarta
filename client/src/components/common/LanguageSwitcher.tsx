// src/components/common/LanguageSwitcher.tsx
import React from 'react';
import { SUPPORTED_LANGUAGES } from '../../i18n/translations';
import { useApp } from '../../store/AppContext';

/**
 * Reusable language selector component.
 * Renders a button for each supported language defined in SUPPORTED_LANGUAGES.
 * Calls the setLanguage function from AppContext to switch the UI language.
 * Accepts an optional className prop for custom positioning/layout.
 */
export const LanguageSwitcher: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { language, setLanguage } = useApp();

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {SUPPORTED_LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`px-1.5 py-0.5 rounded text-xs font-medium ${
            language === lang.code
              ? 'bg-cyan-700 text-white'
              : 'bg-dark-850 text-slate-300 hover:bg-dark-800'
          }`}
          title={lang.name}
        >
          {lang.flag}
        </button>
      ))}
    </div>
  );
};
