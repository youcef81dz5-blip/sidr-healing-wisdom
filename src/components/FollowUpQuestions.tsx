import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, User, Clock, MapPin, Pill, Activity } from "lucide-react";

export interface PatientContext {
  gender: string;
  ageGroup: string;
  painLocation: string;
  duration: string;
  severity: string;
  chronicDiseases: string[];
  currentMedications: string;
  isPregnant?: boolean;
}

interface Props {
  onComplete: (context: PatientContext) => void;
  onSkip: () => void;
}

const SEVERITY_OPTIONS = [
  { value: "خفيف", label: "خفيف", emoji: "😊" },
  { value: "متوسط", label: "متوسط", emoji: "😐" },
  { value: "شديد", label: "شديد", emoji: "😣" },
  { value: "شديد جداً", label: "شديد جداً", emoji: "😫" },
];

const CHRONIC_DISEASES = [
  "السكري", "الضغط", "القلب", "الربو", "الكلى", "الكبد",
  "الغدة الدرقية", "فقر الدم", "السيولة", "لا يوجد"
];

const DURATION_OPTIONS = [
  "أقل من يوم", "يوم إلى 3 أيام", "أسبوع", "أكثر من أسبوع", "أكثر من شهر", "مزمن"
];

const BODY_LOCATIONS = [
  "الرأس", "العين", "الأذن", "الحلق", "الصدر", "البطن",
  "الظهر", "المفاصل", "الجلد", "القدم", "عام (الجسم كله)", "أخرى"
];

export default function FollowUpQuestions({ onComplete, onSkip }: Props) {
  const [step, setStep] = useState(0);
  const [ctx, setCtx] = useState<PatientContext>({
    gender: "",
    ageGroup: "",
    painLocation: "",
    duration: "",
    severity: "",
    chronicDiseases: [],
    currentMedications: "",
  });

  const update = (key: keyof PatientContext, value: any) => {
    setCtx((prev) => ({ ...prev, [key]: value }));
  };

  const toggleChronic = (disease: string) => {
    setCtx((prev) => {
      if (disease === "لا يوجد") return { ...prev, chronicDiseases: ["لا يوجد"] };
      const arr = prev.chronicDiseases.filter((d) => d !== "لا يوجد");
      return {
        ...prev,
        chronicDiseases: arr.includes(disease)
          ? arr.filter((d) => d !== disease)
          : [...arr, disease],
      };
    });
  };

  const steps = [
    {
      icon: User,
      title: "معلومات أساسية",
      content: (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-bold text-foreground mb-2 block">الجنس</label>
            <div className="flex gap-2">
              {["ذكر", "أنثى"].map((g) => (
                <Button
                  key={g}
                  variant={ctx.gender === g ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => update("gender", g)}
                >
                  {g}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-bold text-foreground mb-2 block">الفئة العمرية</label>
            <div className="grid grid-cols-3 gap-2">
              {["طفل (0-12)", "مراهق (13-17)", "شاب (18-35)", "بالغ (36-55)", "كبير (56+)"].map((a) => (
                <Button
                  key={a}
                  variant={ctx.ageGroup === a ? "default" : "outline"}
                  size="sm"
                  className="text-xs"
                  onClick={() => update("ageGroup", a)}
                >
                  {a}
                </Button>
              ))}
            </div>
          </div>
          {ctx.gender === "أنثى" && (
            <div>
              <label className="text-sm font-bold text-foreground mb-2 block">هل أنتِ حامل أو مرضع؟</label>
              <div className="flex gap-2">
                {[
                  { label: "نعم", value: true },
                  { label: "لا", value: false },
                ].map((o) => (
                  <Button
                    key={o.label}
                    variant={ctx.isPregnant === o.value ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => update("isPregnant", o.value)}
                  >
                    {o.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      icon: MapPin,
      title: "موقع الألم أو الأعراض",
      content: (
        <div className="grid grid-cols-3 gap-2">
          {BODY_LOCATIONS.map((loc) => (
            <Button
              key={loc}
              variant={ctx.painLocation === loc ? "default" : "outline"}
              size="sm"
              className="text-xs"
              onClick={() => update("painLocation", loc)}
            >
              {loc}
            </Button>
          ))}
        </div>
      ),
    },
    {
      icon: Clock,
      title: "مدة الأعراض وشدتها",
      content: (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-bold text-foreground mb-2 block">منذ متى بدأت الأعراض؟</label>
            <div className="grid grid-cols-2 gap-2">
              {DURATION_OPTIONS.map((d) => (
                <Button
                  key={d}
                  variant={ctx.duration === d ? "default" : "outline"}
                  size="sm"
                  className="text-xs"
                  onClick={() => update("duration", d)}
                >
                  {d}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-bold text-foreground mb-2 block">شدة الأعراض</label>
            <div className="flex gap-2">
              {SEVERITY_OPTIONS.map((s) => (
                <Button
                  key={s.value}
                  variant={ctx.severity === s.value ? "default" : "outline"}
                  className="flex-1 flex-col gap-1 h-auto py-2"
                  size="sm"
                  onClick={() => update("severity", s.value)}
                >
                  <span className="text-lg">{s.emoji}</span>
                  <span className="text-[10px]">{s.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: Pill,
      title: "التاريخ الطبي",
      content: (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-bold text-foreground mb-2 block">أمراض مزمنة</label>
            <div className="flex flex-wrap gap-2">
              {CHRONIC_DISEASES.map((d) => (
                <Button
                  key={d}
                  variant={ctx.chronicDiseases.includes(d) ? "default" : "outline"}
                  size="sm"
                  className="text-xs"
                  onClick={() => toggleChronic(d)}
                >
                  {d}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-bold text-foreground mb-2 block">أدوية حالية (اختياري)</label>
            <input
              type="text"
              value={ctx.currentMedications}
              onChange={(e) => update("currentMedications", e.target.value)}
              placeholder="مثال: ميتفورمين، أسبرين..."
              className="w-full rounded-lg border bg-muted/50 px-3 py-2 text-sm"
            />
          </div>
        </div>
      ),
    },
  ];

  const currentStep = steps[step];
  const Icon = currentStep.icon;
  const canNext = step < steps.length - 1;
  const canPrev = step > 0;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Progress */}
      <div className="flex items-center gap-1">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= step ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>

      <div className="card-elevated p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          <h3 className="font-heading text-lg font-bold text-foreground">{currentStep.title}</h3>
          <span className="mr-auto text-xs text-muted-foreground">{step + 1}/{steps.length}</span>
        </div>

        {currentStep.content}

        <div className="flex gap-2 pt-2">
          {canPrev && (
            <Button variant="outline" size="sm" onClick={() => setStep(step - 1)}>
              <ArrowRight className="h-4 w-4 ml-1" />
              السابق
            </Button>
          )}
          <div className="flex-1" />
          <Button variant="ghost" size="sm" onClick={onSkip} className="text-muted-foreground">
            تخطي
          </Button>
          {canNext ? (
            <Button size="sm" onClick={() => setStep(step + 1)}>
              التالي
              <ArrowLeft className="h-4 w-4 mr-1" />
            </Button>
          ) : (
            <Button size="sm" onClick={() => onComplete(ctx)}>
              <Activity className="h-4 w-4 ml-1" />
              تحليل
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
