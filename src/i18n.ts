import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import de from "./locales/de.json";

i18n.use(initReactI18next).init({
    lng: "en",
    resources: {
        en: {
            translation: en,
        },
        de: {
            translation: de,
        },
    },
    supportedLngs: ["en", "de"],
    fallbackLng: ["en", "de"],
});

export default i18n;