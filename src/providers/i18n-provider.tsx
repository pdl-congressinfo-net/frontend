import { I18nProvider } from "@refinedev/core";
import i18n from "../i18n";

/**
 * Check out the I18n Provider documentation for detailed information
 * https://refine.dev/docs/api-reference/core/providers/i18n-provider/
 **/
export const i18nProvider: I18nProvider = {
  translate: (key: string, options?: any, defaultMessage?: string) => {
    return i18n.t(key, { ...options, defaultValue: defaultMessage }) as string;
  },

  changeLocale: async (lang: string, options?: any) => {
    // Save to localStorage before changing
    localStorage.setItem("i18nextLng", lang);
    return i18n.changeLanguage(lang, options);
  },

  getLocale: () => {
    return i18n.language || localStorage.getItem("i18nextLng") || "en";
  },
};
