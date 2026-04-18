import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight, Search, Filter, Leaf, AlertTriangle, Pill, BookOpen, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getHerbs, getBodySystems, getCategoryLabels, getEvidenceLabels, type Herb } from "@/lib/content";
import { useNavigate } from "react-router-dom";

export default function HerbEncyclopedia() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || "ar").split("-")[0];
  const isRtl = i18n.dir() === "rtl";
  const ArrowBack = isRtl ? ArrowRight : ArrowLeft;

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterSystem, setFilterSystem] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "evidence">("name");
  const [selectedHerb, setSelectedHerb] = useState<Herb | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const CATEGORIES = getCategoryLabels(t);
  const EVIDENCE_LEVELS = getEvidenceLabels(t);
  const BODY_SYSTEMS = getBodySystems();

  const allHerbs = getHerbs();
  const filtered = allHerbs
    .filter((h) => {
      const q = search.toLowerCase();
      const matchSearch = !q || h.nameAr.toLowerCase().includes(q) || h.nameEn.toLowerCase().includes(q);
      const matchCat = filterCategory === "all" || h.category === filterCategory;
      const matchSys = filterSystem === "all" || h.bodySystem.includes(filterSystem);
      return matchSearch && matchCat && matchSys;
    })
    .sort((a, b) => {
      if (sortBy === "evidence") {
        const order = { strong: 0, moderate: 1, limited: 2 } as const;
        return order[a.scientificEvidence] - order[b.scientificEvidence];
      }
      const aName = lang === "ar" ? a.nameAr : a.nameEn;
      const bName = lang === "ar" ? b.nameAr : b.nameEn;
      return aName.localeCompare(bName, lang);
    });

  const EvidenceBadge = ({ level }: { level: Herb["scientificEvidence"] }) => {
    const info = EVIDENCE_LEVELS.find((e) => e.value === level)!;
    return <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${info.color}`}>{info.label}</span>;
  };
  const CategoryBadge = ({ category }: { category: Herb["category"] }) => {
    const info = CATEGORIES.find((c) => c.value === category)!;
    return <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-medium">{info.label}</span>;
  };

  if (selectedHerb) {
    return <HerbDetail herb={selectedHerb} onBack={() => setSelectedHerb(null)} CategoryBadge={CategoryBadge} EvidenceBadge={EvidenceBadge} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowBack className="h-5 w-5" />
          </Button>
          <Leaf className="h-5 w-5 text-primary" />
          <h1 className="font-heading text-lg font-bold">{t("herbs.title")}</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-4 space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("herbs.search")}
              className="w-full rounded-lg border bg-muted/50 ps-9 pe-3 py-2.5 text-sm"
            />
          </div>
          <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {showFilters && (
          <div className="card-elevated p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div>
              <label className="text-xs font-bold text-foreground mb-1.5 block">{t("herbs.category")}</label>
              <div className="flex flex-wrap gap-1.5">
                <Button size="sm" variant={filterCategory === "all" ? "default" : "outline"} className="text-xs h-7" onClick={() => setFilterCategory("all")}>{t("common.all")}</Button>
                {CATEGORIES.map((c) => (
                  <Button key={c.value} size="sm" variant={filterCategory === c.value ? "default" : "outline"} className="text-xs h-7" onClick={() => setFilterCategory(c.value)}>{c.label}</Button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-foreground mb-1.5 block">{t("herbs.system")}</label>
              <div className="flex flex-wrap gap-1.5">
                <Button size="sm" variant={filterSystem === "all" ? "default" : "outline"} className="text-xs h-7" onClick={() => setFilterSystem("all")}>{t("common.all")}</Button>
                {BODY_SYSTEMS.map((s) => (
                  <Button key={s} size="sm" variant={filterSystem === s ? "default" : "outline"} className="text-xs h-7" onClick={() => setFilterSystem(s)}>{s}</Button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-foreground mb-1.5 block">{t("herbs.sort")}</label>
              <div className="flex gap-1.5">
                <Button size="sm" variant={sortBy === "name" ? "default" : "outline"} className="text-xs h-7" onClick={() => setSortBy("name")}>{t("herbs.sortName")}</Button>
                <Button size="sm" variant={sortBy === "evidence" ? "default" : "outline"} className="text-xs h-7" onClick={() => setSortBy("evidence")}>{t("herbs.sortEvidence")}</Button>
              </div>
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground">{filtered.length} {t("herbs.count")}</p>

        <div className="space-y-2">
          {filtered.map((herb) => {
            const displayName = lang === "ar" ? herb.nameAr : herb.nameEn || herb.nameAr;
            return (
              <button
                key={herb.id}
                className="w-full text-start card-elevated p-4 flex items-start gap-3 hover:border-primary/30 transition-colors"
                onClick={() => setSelectedHerb(herb)}
              >
                <span className="text-2xl mt-0.5">{herb.imageEmoji}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-sm font-bold text-foreground truncate">{displayName}</h3>
                  <p className="text-[10px] text-muted-foreground italic">{herb.nameLatin}</p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    <CategoryBadge category={herb.category} />
                    <EvidenceBadge level={herb.scientificEvidence} />
                  </div>
                </div>
                {herb.contraindications.length > 0 && (
                  <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-1" />
                )}
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}

function HerbDetail({
  herb,
  onBack,
  CategoryBadge,
  EvidenceBadge,
}: {
  herb: Herb;
  onBack: () => void;
  CategoryBadge: React.ComponentType<{ category: Herb["category"] }>;
  EvidenceBadge: React.ComponentType<{ level: Herb["scientificEvidence"] }>;
}) {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || "ar").split("-")[0];
  const isRtl = i18n.dir() === "rtl";
  const ArrowBack = isRtl ? ArrowRight : ArrowLeft;
  const displayName = lang === "ar" ? herb.nameAr : herb.nameEn || herb.nameAr;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowBack className="h-5 w-5" />
          </Button>
          <span className="text-xl">{herb.imageEmoji}</span>
          <h1 className="font-heading text-lg font-bold truncate">{displayName}</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-4 pb-8 space-y-4">
        <div className="card-elevated p-5 text-center space-y-2">
          <span className="text-5xl block">{herb.imageEmoji}</span>
          <h2 className="font-heading text-xl font-bold">{displayName}</h2>
          <p className="text-sm text-muted-foreground italic">{herb.nameLatin}{lang !== "en" && herb.nameEn ? ` — ${herb.nameEn}` : ""}</p>
          <div className="flex justify-center gap-2">
            <CategoryBadge category={herb.category} />
            <EvidenceBadge level={herb.scientificEvidence} />
          </div>
        </div>

        {herb.hadith && (
          <div className="card-elevated p-4 border-s-4 border-primary/40 bg-success/5">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold text-primary">{t("herbs.reference")}</span>
            </div>
            <p className="text-sm italic text-foreground/85 leading-relaxed" dir="rtl">❝ {herb.hadith} ❞</p>
            <p className="text-[10px] text-muted-foreground mt-1">{herb.hadithSource}</p>
          </div>
        )}

        <div className="card-elevated p-4 space-y-3">
          <h3 className="font-heading font-bold text-sm flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-primary" />
            {t("herbs.usageInfo")}
          </h3>
          <div className="space-y-2 text-sm">
            <div><strong className="text-foreground">{t("herbs.usedPart")}:</strong> <span className="text-foreground/80">{herb.usedPart}</span></div>
            <div><strong className="text-foreground">{t("herbs.preparation")}:</strong> <span className="text-foreground/80">{herb.preparation}</span></div>
            <div><strong className="text-foreground">{t("herbs.dosage")}:</strong> <span className="text-foreground/80">{herb.dosage}</span></div>
          </div>
        </div>

        <div className="card-elevated p-4 space-y-2">
          <h3 className="font-heading font-bold text-sm text-primary">{t("herbs.benefits")}</h3>
          <ul className="space-y-1.5">
            {herb.benefits.map((b, i) => (
              <li key={i} className="flex gap-2 text-sm text-foreground/85">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-success shrink-0" />
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div className="card-elevated p-4 space-y-2">
          <h3 className="font-heading font-bold text-sm">{t("herbs.suitableFor")}</h3>
          <div className="flex flex-wrap gap-1.5">
            {herb.suitableFor.map((s, i) => (
              <span key={i} className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">{s}</span>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {herb.bodySystem.map((s, i) => (
              <span key={i} className="rounded-full bg-primary/10 text-primary px-2.5 py-1 text-xs">{s}</span>
            ))}
          </div>
        </div>

        {herb.contraindications.length > 0 && (
          <div className="card-elevated p-4 space-y-2 border-destructive/30 bg-destructive/5">
            <h3 className="font-heading font-bold text-sm text-destructive flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {t("herbs.contraindications")}
            </h3>
            <ul className="space-y-1.5">
              {herb.contraindications.map((c, i) => (
                <li key={i} className="flex gap-2 text-sm text-foreground/85">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-destructive shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        )}

        {herb.drugInteractions.length > 0 && (
          <div className="card-elevated p-4 space-y-2 border-warning/30 bg-warning/5">
            <h3 className="font-heading font-bold text-sm text-warning-foreground flex items-center gap-2">
              <Pill className="h-4 w-4" />
              {t("herbs.interactions")}
            </h3>
            <ul className="space-y-1.5">
              {herb.drugInteractions.map((d, i) => (
                <li key={i} className="flex gap-2 text-sm text-foreground/85">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-warning shrink-0" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
