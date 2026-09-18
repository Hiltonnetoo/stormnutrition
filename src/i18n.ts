import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "./locales/en/common.json";
import ptTranslation from "./locales/pt/common.json";

const resources = {
  en: {
    translation: enTranslation,
  },
  pt: {
    translation: ptTranslation,
  },
};

export const normalizeLanguage = (lng?: string | null): "pt" | "en" => {
  if (!lng) return "en";
  const lower = lng.toLowerCase();
  return lower.startsWith("pt") ? "pt" : "en";
};

export const syncDocumentLanguage = (lng: string): void => {
  if (typeof document !== "undefined" && document.documentElement) {
    document.documentElement.lang = lng.startsWith("pt") ? "pt-BR" : "en";
  }
};

const initialLng =
  typeof localStorage !== "undefined"
    ? normalizeLanguage(localStorage.getItem("language") || "en")
    : "en";

i18n.use(initReactI18next).init({
  resources,
  lng: initialLng,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

syncDocumentLanguage(initialLng);

i18n.on("languageChanged", (lng: string) => {
  const normalized = normalizeLanguage(lng);
  syncDocumentLanguage(normalized);
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("language", normalized);
  }
});

export default i18n;
