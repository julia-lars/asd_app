import React from 'react';
import { useLanguage } from '../../i18n';

const LanguageSwitcher = ({ compact = false, align = 'center' }) => {
  const { locale, setLocale, t, languages } = useLanguage();

  return (
    <div
      role="group"
      aria-label={t('common.switchLanguage')}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: align,
        gap: '0.4rem'
      }}
    >
      {languages.map((language) => {
        const active = language.code === locale;
        return (
          <button
            key={language.code}
            type="button"
            aria-pressed={active}
            onClick={() => setLocale(language.code)}
            style={{
              border: `1px solid ${active ? 'var(--spa-accent)' : 'var(--spa-line)'}`,
              borderRadius: '999px',
              background: active
                ? 'linear-gradient(135deg, rgba(122, 154, 184, 0.22), rgba(90, 127, 160, 0.18))'
                : 'rgba(255, 255, 255, 0.56)',
              color: active ? 'var(--spa-accent-strong)' : 'var(--spa-muted)',
              cursor: 'pointer',
              fontSize: compact ? '0.72rem' : '0.78rem',
              fontWeight: active ? 700 : 600,
              lineHeight: 1,
              padding: compact ? '0.42rem 0.55rem' : '0.5rem 0.7rem',
              boxShadow: active ? '0 4px 12px rgba(90, 127, 160, 0.12)' : 'none'
            }}
          >
            {compact ? language.shortLabel : language.label}
          </button>
        );
      })}
    </div>
  );
};

export default LanguageSwitcher;
