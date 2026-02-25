import { createContext, ReactNode, useState, useCallback, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language, translations, Translations } from '@/constants/localization';

interface LocalizationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

export const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export function LocalizationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ru');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved language on mount
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const saved = await AsyncStorage.getItem('game_language');
        if (saved && (saved === 'en' || saved === 'ru')) {
          setLanguageState(saved as Language);
        }
      } catch (error) {
        console.error('Failed to load language:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadLanguage();
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    AsyncStorage.setItem('game_language', lang).catch(error => {
      console.error('Failed to save language:', error);
    });
  }, []);

  const t = useMemo(() => translations[language], [language]);

  // Don't render children until language is loaded
  if (!isLoaded) {
    return null;
  }

  const value = useMemo(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t]
  );

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
}
