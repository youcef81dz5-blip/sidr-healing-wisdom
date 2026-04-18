import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import uiAr from "./locales/ui.ar.json";
import uiEn from "./locales/ui.en.json";
import uiFr from "./locales/ui.fr.json";

import herbsAr from "./locales/herbs.ar.json";
import herbsEn from "./locales/herbs.en.json";
import herbsFr from "./locales/herbs.fr.json";

import conditionsAr from "./locales/conditions.ar.json";
import conditionsEn from "./locales/conditions.en.json";
import conditionsFr from "./locales/conditions.fr.json";

import faqAr from "./locales/faq.ar.json";
import faqEn from "./locales/faq.en.json";
import faqFr from "./locales/faq.fr.json";

export const SUPPORTED_LANGUAGES = [
  { code: "ar", name: "العربية", dir: "rtl" as const },
  { code: "en", name: "English", dir: "ltr" as const },
  { code: "fr", name: "Français", dir: "ltr" as const },
];

export const dataByLang = {
  ar: { herbs: herbsAr as any, conditions: conditionsAr as any, faq: faqAr as any },
  en: { herbs: herbsEn as any, conditions: conditionsEn as any, faq: faqEn as any },
  fr: { herbs: herbsFr as any, conditions: conditionsFr as any, faq: faqFr as any },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ar: { translation: uiAr },
      en: { translation: uiEn },
      fr: { translation: uiFr },
    },
    fallbackLng: "ar",
    supportedLngs: ["ar", "en", "fr"],
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "sidr_lang",
    },
  });

const applyDir = (lng: string) => {
  const lang = SUPPORTED_LANGUAGES.find((l) => l.code === lng) ?? SUPPORTED_LANGUAGES[0];
  document.documentElement.lang = lang.code;
  document.documentElement.dir = lang.dir;
};

applyDir(i18n.language);
i18n.on("languageChanged", applyDir);

export default i18n;
