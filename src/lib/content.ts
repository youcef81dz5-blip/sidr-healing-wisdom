import { dataByLang } from "@/i18n";
import i18n from "@/i18n";

export interface Herb {
  id: string;
  nameAr: string;
  nameLatin: string;
  nameEn: string;
  category: "prophetic" | "traditional" | "scientific";
  usedPart: string;
  preparation: string;
  dosage: string;
  benefits: string[];
  contraindications: string[];
  drugInteractions: string[];
  hadith?: string;
  hadithSource?: string;
  scientificEvidence: "strong" | "moderate" | "limited";
  bodySystem: string[];
  suitableFor: string[];
  imageEmoji: string;
}

export interface CommonCondition {
  id: string;
  name: string;
  emoji: string;
  bodySystem: string;
  description: string;
  dietaryTips: string[];
  herbalSuggestions: string[];
  lifestyleTips: string[];
}

export interface FAQ {
  question: string;
  answer: string;
  category: string;
}

function getLang(): "ar" | "en" | "fr" {
  const l = (i18n.language || "ar").split("-")[0];
  return (["ar", "en", "fr"].includes(l) ? l : "ar") as "ar" | "en" | "fr";
}

export function getHerbs(): Herb[] {
  const lang = getLang();
  const map = dataByLang[lang].herbs as Record<string, Herb>;
  return Object.values(map);
}

export function getHerb(id: string): Herb | undefined {
  const lang = getLang();
  return (dataByLang[lang].herbs as Record<string, Herb>)[id];
}

export function getConditions(): CommonCondition[] {
  const lang = getLang();
  const map = dataByLang[lang].conditions as Record<string, CommonCondition>;
  return Object.values(map);
}

export function getCondition(id: string): CommonCondition | undefined {
  const lang = getLang();
  return (dataByLang[lang].conditions as Record<string, CommonCondition>)[id];
}

export function getFAQs(): FAQ[] {
  const lang = getLang();
  return dataByLang[lang].faq as FAQ[];
}

export function getFAQCategories(): string[] {
  return [...new Set(getFAQs().map((f) => f.category))];
}

// Body systems: derive unique from current-language herbs
export function getBodySystems(): string[] {
  const set = new Set<string>();
  getHerbs().forEach((h) => h.bodySystem.forEach((s) => set.add(s)));
  return Array.from(set);
}

export function getCategoryLabels(t: (k: string) => string) {
  return [
    { value: "prophetic", label: t("herbs.categories.prophetic") },
    { value: "traditional", label: t("herbs.categories.traditional") },
    { value: "scientific", label: t("herbs.categories.scientific") },
  ];
}

export function getEvidenceLabels(t: (k: string) => string) {
  return [
    { value: "strong", label: t("herbs.evidence.strong"), color: "bg-success/15 text-success" },
    { value: "moderate", label: t("herbs.evidence.moderate"), color: "bg-warning/15 text-warning-foreground" },
    { value: "limited", label: t("herbs.evidence.limited"), color: "bg-muted text-muted-foreground" },
  ];
}
