import { useTranslation } from "react-i18next";
import { ArrowRight, ArrowLeft, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { getConditions, getCondition, type CommonCondition } from "@/lib/content";

export default function ConditionsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";
  const ArrowBack = isRtl ? ArrowRight : ArrowLeft;

  if (id) {
    const condition = getCondition(id);
    if (!condition) return <div className="p-8 text-center">{t("conditions.notFound")}</div>;
    return <ConditionDetail condition={condition} onBack={() => navigate("/conditions")} />;
  }

  const conditions = getConditions();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowBack className="h-5 w-5" />
          </Button>
          <Leaf className="h-5 w-5 text-primary" />
          <h1 className="font-heading text-lg font-bold">{t("conditions.title")}</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-4 space-y-2 pb-8">
        <p className="text-xs text-muted-foreground mb-2">{t("conditions.subtitle")}</p>
        {conditions.map((c) => (
          <button
            key={c.id}
            className="w-full text-start card-elevated p-4 flex items-center gap-3 hover:border-primary/30 transition-colors"
            onClick={() => navigate(`/conditions/${c.id}`)}
          >
            <span className="text-2xl">{c.emoji}</span>
            <div className="flex-1">
              <h3 className="font-heading text-sm font-bold">{c.name}</h3>
              <p className="text-[10px] text-muted-foreground line-clamp-1">{c.description}</p>
            </div>
            <span className="text-xs text-primary bg-primary/10 rounded-full px-2 py-0.5">{c.bodySystem}</span>
          </button>
        ))}
      </main>
    </div>
  );
}

function ConditionDetail({ condition, onBack }: { condition: CommonCondition; onBack: () => void }) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";
  const ArrowBack = isRtl ? ArrowRight : ArrowLeft;
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowBack className="h-5 w-5" />
          </Button>
          <span className="text-xl">{condition.emoji}</span>
          <h1 className="font-heading text-lg font-bold">{condition.name}</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-4 space-y-4 pb-8">
        <div className="card-elevated p-4">
          <p className="text-sm leading-relaxed text-foreground/85">{condition.description}</p>
        </div>

        <div className="card-elevated p-4 space-y-2">
          <h3 className="font-heading font-bold text-sm text-primary">{t("conditions.dietary")}</h3>
          <ul className="space-y-1.5">
            {condition.dietaryTips.map((tip, i) => (
              <li key={i} className="flex gap-2 text-xs text-foreground/85"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />{tip}</li>
            ))}
          </ul>
        </div>

        <div className="card-elevated p-4 space-y-2 border-success/30 bg-success/5">
          <h3 className="font-heading font-bold text-sm text-success">{t("conditions.herbal")}</h3>
          <ul className="space-y-1.5">
            {condition.herbalSuggestions.map((tip, i) => (
              <li key={i} className="flex gap-2 text-xs text-foreground/85"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-success shrink-0" />{tip}</li>
            ))}
          </ul>
        </div>

        <div className="card-elevated p-4 space-y-2">
          <h3 className="font-heading font-bold text-sm">{t("conditions.lifestyle")}</h3>
          <ul className="space-y-1.5">
            {condition.lifestyleTips.map((tip, i) => (
              <li key={i} className="flex gap-2 text-xs text-foreground/85"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />{tip}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg bg-muted p-3 text-center">
          <p className="text-[10px] text-muted-foreground">{t("conditions.disclaimer")}</p>
        </div>
      </main>
    </div>
  );
}
