import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en/common.json";
import de from "./locales/de/common.json";


const userLang = navigator.language;

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en,
      },
      de: {
        translation: de,
      },
    },

    lng: "de", // default language

    fallbackLng: "de", // use German if user's language is not available

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;