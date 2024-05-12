import { createI18n } from 'vue-i18n';
import en from './translations/en.json';
import es from './translations/es.json';

const translations = { en, es };

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: translations,
});

export default i18n;
