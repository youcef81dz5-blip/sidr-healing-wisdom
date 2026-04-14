import { useState } from "react";
import { ArrowRight, Search, Filter, Leaf, AlertTriangle, Pill, BookOpen, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { herbs, BODY_SYSTEMS, CATEGORIES, EVIDENCE_LEVELS, type Herb } from "@/data/herbs";
import { useNavigate } from "react-router-dom";

const EvidenceBadge = ({ level }: { level: Herb["scientificEvidence"] }) => {
  const info = EVIDENCE_LEVELS.find((e) => e.value === level)!;
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${info.color}`}>{info.label}</span>;
};

const CategoryBadge = ({ category }: { category: Herb["category"] }) => {
  const info = CATEGORIES.find((c) => c.value === category)!;
  return (
    <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-medium">
      {info.label}
    </span>
  );
};

export default function HerbEncyclopedia() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterSystem, setFilterSystem] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "evidence">("name");
  const [selectedHerb, setSelectedHerb] = useState<Herb | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = herbs
    .filter((h) => {
      const matchSearch = !search || h.nameAr.includes(search) || h.nameEn.toLowerCase().includes(search.toLowerCase());
      const matchCat = filterCategory === "all" || h.category === filterCategory;
      const matchSys = filterSystem === "all" || h.bodySystem.includes(filterSystem);
      return matchSearch && matchCat && matchSys;
    })
    .sort((a, b) => {
      if (sortBy === "evidence") {
        const order = { strong: 0, moderate: 1, limited: 2 };
        return order[a.scientificEvidence] - order[b.scientificEvidence];
      }
      return a.nameAr.localeCompare(b.nameAr, "ar");
    });

  if (selectedHerb) {
    return <HerbDetail herb={selectedHerb} onBack={() => setSelectedHerb(null)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowRight className="h-5 w-5" />
          </Button>
          <Leaf className="h-5 w-5 text-primary" />
          <h1 className="font-heading text-lg font-bold">موسوعة الأعشاب والطب النبوي</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-4 space-y-4">
        {/* Search */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن عشبة..."
              className="w-full rounded-lg border bg-muted/50 pr-9 pl-3 py-2.5 text-sm"
            />
          </div>
          <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="card-elevated p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div>
              <label className="text-xs font-bold text-foreground mb-1.5 block">التصنيف</label>
              <div className="flex flex-wrap gap-1.5">
                <Button size="sm" variant={filterCategory === "all" ? "default" : "outline"} className="text-xs h-7" onClick={() => setFilterCategory("all")}>الكل</Button>
                {CATEGORIES.map((c) => (
                  <Button key={c.value} size="sm" variant={filterCategory === c.value ? "default" : "outline"} className="text-xs h-7" onClick={() => setFilterCategory(c.value)}>{c.label}</Button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-foreground mb-1.5 block">الجهاز</label>
              <div className="flex flex-wrap gap-1.5">
                <Button size="sm" variant={filterSystem === "all" ? "default" : "outline"} className="text-xs h-7" onClick={() => setFilterSystem("all")}>الكل</Button>
                {BODY_SYSTEMS.map((s) => (
                  <Button key={s} size="sm" variant={filterSystem === s ? "default" : "outline"} className="text-xs h-7" onClick={() => setFilterSystem(s)}>{s}</Button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-foreground mb-1.5 block">الترتيب</label>
              <div className="flex gap-1.5">
                <Button size="sm" variant={sortBy === "name" ? "default" : "outline"} className="text-xs h-7" onClick={() => setSortBy("name")}>أبجدي</Button>
                <Button size="sm" variant={sortBy === "evidence" ? "default" : "outline"} className="text-xs h-7" onClick={() => setSortBy("evidence")}>قوة الأدلة</Button>
              </div>
            </div>
          </div>
        )}

        {/* Results count */}
        <p className="text-xs text-muted-foreground">{filtered.length} عشبة</p>

        {/* Herb Cards */}
        <div className="space-y-2">
          {filtered.map((herb) => (
            <button
              key={herb.id}
              className="w-full text-right card-elevated p-4 flex items-start gap-3 hover:border-primary/30 transition-colors"
              onClick={() => setSelectedHerb(herb)}
            >
              <span className="text-2xl mt-0.5">{herb.imageEmoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading text-sm font-bold text-foreground truncate">{herb.nameAr}</h3>
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
          ))}
        </div>
      </main>
    </div>
  );
}

function HerbDetail({ herb, onBack }: { herb: Herb; onBack: () => void }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowRight className="h-5 w-5" />
          </Button>
          <span className="text-xl">{herb.imageEmoji}</span>
          <h1 className="font-heading text-lg font-bold truncate">{herb.nameAr}</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-4 pb-8 space-y-4">
        {/* Header Card */}
        <div className="card-elevated p-5 text-center space-y-2">
          <span className="text-5xl block">{herb.imageEmoji}</span>
          <h2 className="font-heading text-xl font-bold">{herb.nameAr}</h2>
          <p className="text-sm text-muted-foreground italic">{herb.nameLatin} — {herb.nameEn}</p>
          <div className="flex justify-center gap-2">
            <CategoryBadge category={herb.category} />
            <EvidenceBadge level={herb.scientificEvidence} />
          </div>
        </div>

        {/* Hadith */}
        {herb.hadith && (
          <div className="card-elevated p-4 border-r-4 border-primary/40 bg-success/5">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold text-primary">المرجع الشرعي</span>
            </div>
            <p className="text-sm italic text-foreground/85 leading-relaxed">❝ {herb.hadith} ❞</p>
            <p className="text-[10px] text-muted-foreground mt-1">{herb.hadithSource}</p>
          </div>
        )}

        {/* Usage Info */}
        <div className="card-elevated p-4 space-y-3">
          <h3 className="font-heading font-bold text-sm flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-primary" />
            معلومات الاستخدام
          </h3>
          <div className="space-y-2 text-sm">
            <div><strong className="text-foreground">الجزء المستخدم:</strong> <span className="text-foreground/80">{herb.usedPart}</span></div>
            <div><strong className="text-foreground">طريقة التحضير:</strong> <span className="text-foreground/80">{herb.preparation}</span></div>
            <div><strong className="text-foreground">الجرعة التقريبية:</strong> <span className="text-foreground/80">{herb.dosage}</span></div>
          </div>
        </div>

        {/* Benefits */}
        <div className="card-elevated p-4 space-y-2">
          <h3 className="font-heading font-bold text-sm text-primary">✅ الفوائد</h3>
          <ul className="space-y-1.5">
            {herb.benefits.map((b, i) => (
              <li key={i} className="flex gap-2 text-sm text-foreground/85">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-success shrink-0" />
                {b}
              </li>
            ))}
          </ul>
        </div>

        {/* Suitable For */}
        <div className="card-elevated p-4 space-y-2">
          <h3 className="font-heading font-bold text-sm">مناسبة لـ</h3>
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

        {/* Contraindications */}
        {herb.contraindications.length > 0 && (
          <div className="card-elevated p-4 space-y-2 border-destructive/30 bg-destructive/5">
            <h3 className="font-heading font-bold text-sm text-destructive flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              ⛔ موانع الاستعمال
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

        {/* Drug Interactions */}
        {herb.drugInteractions.length > 0 && (
          <div className="card-elevated p-4 space-y-2 border-warning/30 bg-warning/5">
            <h3 className="font-heading font-bold text-sm text-warning-foreground flex items-center gap-2">
              <Pill className="h-4 w-4" />
              ⚠ التداخلات الدوائية
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
