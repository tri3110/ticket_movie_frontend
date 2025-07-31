'use client';

import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', label: 'EN', icon: 'fi fi-gb' , border:'border-r'},
  { code: 'vi', label: 'VI', icon: 'fi fi-vn' , border:''}
];

export const LanguageDropdown = () => {
  const { i18n } = useTranslation();
  const handleChangeLang = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('i18nextLng', langCode);
  };

  return (
    <div className="flex">
      {languages.map((lang) => (
        <button
          key={lang.code}
          className={`flex items-center px-1 ${lang.border} ${i18n.language === lang.code ? 'bg-white text-red-600' : 'bg-white text-gray-500'}`}
          onClick={() => handleChangeLang(lang.code)}
        > {lang.label}
        </button>
      ))}
    </div>
  );
};