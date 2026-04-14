import { ArrowRight, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { commonConditions } from "@/data/commonConditions";

export default function ConditionsPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  if (id) {
    const condition = commonConditions.find((c) => c.id === id);
    if (!condition) return <div className="p-8 text-center">الحالة غير موجودة</div>;
    return <ConditionDetail condition={condition} onBack={() => navigate("/conditions")} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowRight className="h-5 w-5" />
          </Button>
          <Leaf className="h-5 w-5 text-primary" />
          <h1 className="font-heading text-lg font-bold">حالات شائعة</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-4 space-y-2 pb-8">
        <p className="text-xs text-muted-foreground mb-2">أكثر الحالات شيوعًا في المنطقة العربية مع نصائح عشبية وغذائية</p>
        {commonConditions.map((c) => (
          <button
            key={c.id}
            className="w-full text-right card-elevated p-4 flex items-center gap-3 hover:border-primary/30 transition-colors"
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

function ConditionDetail({ condition, onBack }: { condition: typeof commonConditions[0]; onBack: () => void }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowRight className="h-5 w-5" />
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
          <h3 className="font-heading font-bold text-sm text-primary">🥗 نصائح غذائية</h3>
          <ul className="space-y-1.5">
            {condition.dietaryTips.map((t, i) => (
              <li key={i} className="flex gap-2 text-xs text-foreground/85"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />{t}</li>
            ))}
          </ul>
        </div>

        <div className="card-elevated p-4 space-y-2 border-success/30 bg-success/5">
          <h3 className="font-heading font-bold text-sm text-success">🌿 مقترحات عشبية</h3>
          <ul className="space-y-1.5">
            {condition.herbalSuggestions.map((t, i) => (
              <li key={i} className="flex gap-2 text-xs text-foreground/85"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-success shrink-0" />{t}</li>
            ))}
          </ul>
        </div>

        <div className="card-elevated p-4 space-y-2">
          <h3 className="font-heading font-bold text-sm">🏃 نصائح نمط الحياة</h3>
          <ul className="space-y-1.5">
            {condition.lifestyleTips.map((t, i) => (
              <li key={i} className="flex gap-2 text-xs text-foreground/85"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />{t}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg bg-muted p-3 text-center">
          <p className="text-[10px] text-muted-foreground">هذه معلومات عامة ولا تغني عن مراجعة الطبيب المختص</p>
        </div>
      </main>
    </div>
  );
}
