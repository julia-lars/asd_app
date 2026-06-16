import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_LOCALE, LANGUAGE_OPTIONS, messages } from './messages';

const STORAGE_KEY = 'asd_app_locale';
const FONT_SIZE_STORAGE_KEY = 'asd_app_font_size';
const DEFAULT_FONT_SIZE = 'medium';
const FONT_SIZE_OPTIONS = [
  { code: 'small', labelKey: 'profile.fontSmall', rootFontSize: 15 },
  { code: 'medium', labelKey: 'profile.fontMedium', rootFontSize: 16 },
  { code: 'large', labelKey: 'profile.fontLarge', rootFontSize: 17.5 },
  { code: 'xlarge', labelKey: 'profile.fontXLarge', rootFontSize: 19 }
];
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

function normalizeFontSize(value) {
  return FONT_SIZE_OPTIONS.some((option) => option.code === value) ? value : DEFAULT_FONT_SIZE;
}

function getInitialFontSize() {
  try {
    return normalizeFontSize(localStorage.getItem(FONT_SIZE_STORAGE_KEY));
  } catch {
    return DEFAULT_FONT_SIZE;
  }
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
  const [fontSize, setFontSizeState] = useState(getInitialFontSize);

  const setLocale = useCallback((nextLocale) => {
    setLocaleState(normalizeLocale(nextLocale));
  }, []);

  const setFontSize = useCallback((nextFontSize) => {
    setFontSizeState(normalizeFontSize(nextFontSize));
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

  useEffect(() => {
    const option = FONT_SIZE_OPTIONS.find((item) => item.code === fontSize)
      ?? FONT_SIZE_OPTIONS.find((item) => item.code === DEFAULT_FONT_SIZE);
    try {
      localStorage.setItem(FONT_SIZE_STORAGE_KEY, fontSize);
    } catch {
      // ignore storage errors
    }
    document.documentElement.style.fontSize = `${option.rootFontSize}px`;
  }, [fontSize]);

  const value = useMemo(() => ({
    locale,
    setLocale,
    fontSize,
    setFontSize,
    t,
    formatTime,
    formatDateTime,
    languages: LANGUAGE_OPTIONS,
    fontSizes: FONT_SIZE_OPTIONS
  }), [fontSize, formatDateTime, formatTime, locale, setFontSize, setLocale, t]);

  return React.createElement(LanguageContext.Provider, { value }, children);
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export { DEFAULT_LOCALE, LANGUAGE_OPTIONS, FONT_SIZE_OPTIONS };
