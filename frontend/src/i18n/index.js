import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_LOCALE, LANGUAGE_OPTIONS, messages } from './messages';

const STORAGE_KEY = 'asd_app_locale';
const LanguageContext = createContext(null);

export function normalizeLocale(value) {
  if (typeof value !== 'string' || !value.trim()) return DEFAULT_LOCALE;
  const normalized = value.trim().toLowerCase();
  if (normalized.startsWith('zh')) return 'zh-CN';
  if (normalized.startsWith('en')) return 'en';
  if (normalized.startsWith('ja') || normalized.startsWith('jp')) return 'ja';
  if (normalized.startsWith('ko') || normalized.startsWith('kr')) return 'ko';
  if (normalized.startsWith('es')) return 'es';
  if (normalized.startsWith('fr')) return 'fr';
  if (normalized.startsWith('de')) return 'de';
  if (normalized.startsWith('ar')) return 'ar';
  if (normalized.startsWith('pt')) return 'pt';
  if (normalized.startsWith('ru')) return 'ru';
  return DEFAULT_LOCALE;
}

function getInitialLocale() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return normalizeLocale(saved);
  } catch {
    // ignore storage errors
  }

  const candidates = typeof navigator !== 'undefined'
    ? [...(navigator.languages || []), navigator.language].filter(Boolean)
    : [];
  for (const candidate of candidates) {
    const locale = normalizeLocale(candidate);
    if (locale !== DEFAULT_LOCALE || String(candidate).toLowerCase().startsWith('zh')) {
      return locale;
    }
  }
  return DEFAULT_LOCALE;
}

function readMessage(locale, key) {
  return messages[locale]?.[key] ?? messages[DEFAULT_LOCALE]?.[key] ?? key;
}

function interpolate(template, values = {}) {
  return String(template).replace(/\{(\w+)\}/g, (_, name) => {
    const value = values[name];
    return value === undefined || value === null ? '' : String(value);
  });
}

export const LanguageProvider = ({ children }) => {
  const [locale, setLocaleState] = useState(getInitialLocale);

  const setLocale = useCallback((nextLocale) => {
    setLocaleState(normalizeLocale(nextLocale));
  }, []);

  const t = useCallback((key, values) => interpolate(readMessage(locale, key), values), [locale]);

  const formatTime = useCallback((date) => {
    if (!date) return '';
    try {
      return new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(date);
    } catch {
      return '';
    }
  }, [locale]);

  const formatDateTime = useCallback((date) => {
    if (!date) return '';
    try {
      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch {
      try {
        return date.toLocaleString();
      } catch {
        return '';
      }
    }
  }, [locale]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // ignore storage errors
    }
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.title = readMessage(locale, 'app.title');
  }, [locale]);

  const value = useMemo(() => ({
    locale,
    setLocale,
    t,
    formatTime,
    formatDateTime,
    languages: LANGUAGE_OPTIONS
  }), [formatDateTime, formatTime, locale, setLocale, t]);

  return React.createElement(LanguageContext.Provider, { value }, children);
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export { DEFAULT_LOCALE, LANGUAGE_OPTIONS };
