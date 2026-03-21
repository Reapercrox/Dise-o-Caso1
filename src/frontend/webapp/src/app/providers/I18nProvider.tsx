import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n/index';

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  useEffect(() => {
    // Detect browser locale on mount
    const browserLang = navigator.language.split('-')[0];
    if (i18n.options.supportedLngs?.includes(browserLang)) {
      i18n.changeLanguage(browserLang);
    }
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};
