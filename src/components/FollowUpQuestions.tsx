import { useState } from "react";
import { useTranslation } from "react-i18next";
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

export default function FollowUpQuestions({ onComplete, onSkip }: Props) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";
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

  const SEVERITY_OPTIONS = [
    { value: t("followUp.severities.mild"), emoji: "😊" },
    { value: t("followUp.severities.moderate"), emoji: "😐" },
    { value: t("followUp.severities.severe"), emoji: "😣" },
    { value: t("followUp.severities.verySevere"), emoji: "😫" },
  ];
  const NONE_LABEL = t("followUp.diseases.none");
  const CHRONIC_DISEASES = [
    t("followUp.diseases.diabetes"), t("followUp.diseases.bp"), t("followUp.diseases.heart"),
    t("followUp.diseases.asthma"), t("followUp.diseases.kidney"), t("followUp.diseases.liver"),
    t("followUp.diseases.thyroid"), t("followUp.diseases.anemia"), t("followUp.diseases.bleeding"),
    NONE_LABEL,
  ];
  const DURATION_OPTIONS = [
    t("followUp.durations.lessDay"), t("followUp.durations.fewDays"), t("followUp.durations.week"),
    t("followUp.durations.moreWeek"), t("followUp.durations.moreMonth"), t("followUp.durations.chronic"),
  ];
  const BODY_LOCATIONS = [
    t("followUp.locations.head"), t("followUp.locations.eye"), t("followUp.locations.ear"),
    t("followUp.locations.throat"), t("followUp.locations.chest"), t("followUp.locations.abdomen"),
    t("followUp.locations.back"), t("followUp.locations.joints"), t("followUp.locations.skin"),
    t("followUp.locations.foot"), t("followUp.locations.general"), t("followUp.locations.other"),
  ];
  const AGE_GROUPS = [
    t("followUp.ageChild"), t("followUp.ageTeen"), t("followUp.ageYoung"), t("followUp.ageAdult"), t("followUp.ageSenior"),
  ];

  const update = (key: keyof PatientContext, value: any) => {
    setCtx((prev) => ({ ...prev, [key]: value }));
  };

  const toggleChronic = (disease: string) => {
    setCtx((prev) => {
      if (disease === NONE_LABEL) return { ...prev, chronicDiseases: [NONE_LABEL] };
      const arr = prev.chronicDiseases.filter((d) => d !== NONE_LABEL);
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
      title: t("followUp.basicInfo"),
      content: (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-bold text-foreground mb-2 block">{t("followUp.gender")}</label>
            <div className="flex gap-2">
              {[t("followUp.male"), t("followUp.female")].map((g) => (
                <Button key={g} variant={ctx.gender === g ? "default" : "outline"} className="flex-1" onClick={() => update("gender", g)}>
                  {g}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-bold text-foreground mb-2 block">{t("followUp.ageGroup")}</label>
            <div className="grid grid-cols-3 gap-2">
              {AGE_GROUPS.map((a) => (
                <Button key={a} variant={ctx.ageGroup === a ? "default" : "outline"} size="sm" className="text-xs" onClick={() => update("ageGroup", a)}>
                  {a}
                </Button>
              ))}
            </div>
          </div>
          {ctx.gender === t("followUp.female") && (
            <div>
              <label className="text-sm font-bold text-foreground mb-2 block">{t("followUp.pregnantQ")}</label>
              <div className="flex gap-2">
                {[{ label: t("common.yes"), value: true }, { label: t("common.no"), value: false }].map((o) => (
                  <Button key={o.label} variant={ctx.isPregnant === o.value ? "default" : "outline"} className="flex-1" onClick={() => update("isPregnant", o.value)}>
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
      title: t("followUp.painLocation"),
      content: (
        <div className="grid grid-cols-3 gap-2">
          {BODY_LOCATIONS.map((loc) => (
            <Button key={loc} variant={ctx.painLocation === loc ? "default" : "outline"} size="sm" className="text-xs" onClick={() => update("painLocation", loc)}>
              {loc}
            </Button>
          ))}
        </div>
      ),
    },
    {
      icon: Clock,
      title: t("followUp.durationSeverity"),
      content: (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-bold text-foreground mb-2 block">{t("followUp.durationQ")}</label>
            <div className="grid grid-cols-2 gap-2">
              {DURATION_OPTIONS.map((d) => (
                <Button key={d} variant={ctx.duration === d ? "default" : "outline"} size="sm" className="text-xs" onClick={() => update("duration", d)}>
                  {d}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-bold text-foreground mb-2 block">{t("followUp.severity")}</label>
            <div className="flex gap-2">
              {SEVERITY_OPTIONS.map((s) => (
                <Button key={s.value} variant={ctx.severity === s.value ? "default" : "outline"} className="flex-1 flex-col gap-1 h-auto py-2" size="sm" onClick={() => update("severity", s.value)}>
                  <span className="text-lg">{s.emoji}</span>
                  <span className="text-[10px]">{s.value}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: Pill,
      title: t("followUp.medicalHistory"),
      content: (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-bold text-foreground mb-2 block">{t("followUp.chronicDiseases")}</label>
            <div className="flex flex-wrap gap-2">
              {CHRONIC_DISEASES.map((d) => (
                <Button key={d} variant={ctx.chronicDiseases.includes(d) ? "default" : "outline"} size="sm" className="text-xs" onClick={() => toggleChronic(d)}>
                  {d}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-bold text-foreground mb-2 block">{t("followUp.currentMeds")}</label>
            <input
              type="text"
              value={ctx.currentMedications}
              onChange={(e) => update("currentMedications", e.target.value)}
              placeholder={t("followUp.medsPlaceholder")}
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

  // Directional arrow icons
  const PrevIcon = isRtl ? ArrowRight : ArrowLeft;
  const NextIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-1">
        {steps.map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-muted"}`} />
        ))}
      </div>

      <div className="card-elevated p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          <h3 className="font-heading text-lg font-bold text-foreground">{currentStep.title}</h3>
          <span className="ms-auto text-xs text-muted-foreground">{step + 1}/{steps.length}</span>
        </div>

        {currentStep.content}

        <div className="flex gap-2 pt-2">
          {canPrev && (
            <Button variant="outline" size="sm" onClick={() => setStep(step - 1)}>
              <PrevIcon className="h-4 w-4 me-1" />
              {t("common.previous")}
            </Button>
          )}
          <div className="flex-1" />
          <Button variant="ghost" size="sm" onClick={onSkip} className="text-muted-foreground">
            {t("common.skip")}
          </Button>
          {canNext ? (
            <Button size="sm" onClick={() => setStep(step + 1)}>
              {t("common.next")}
              <NextIcon className="h-4 w-4 ms-1" />
            </Button>
          ) : (
            <Button size="sm" onClick={() => onComplete(ctx)}>
              <Activity className="h-4 w-4 me-1" />
              {t("followUp.analyze")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
