import { useTranslation } from "react-i18next";
import { AnalysisResult } from "@/lib/gemini";
import { AlertTriangle, CheckCircle, Shield, BookOpen, Activity, Heart, XCircle } from "lucide-react";

interface Props {
  result: AnalysisResult;
}

const UrgencyBadge = ({ level }: { level: string }) => {
  const { t } = useTranslation();
  const lower = (level || "").toLowerCase();
  const isHigh = lower.includes("high") || lower.includes("élevé") || level === "عالي";
  const isMed = lower.includes("medium") || lower.includes("moderate") || lower.includes("moyen") || level === "متوسط";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${
        isHigh
          ? "bg-destructive/15 text-destructive"
          : isMed
          ? "bg-warning/15 text-warning-foreground"
          : "bg-success/15 text-success"
      }`}
    >
      {isHigh ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
      {t("results.urgency")}: {level}
    </span>
  );
};

const Section = ({
  icon: Icon,
  title,
  children,
  variant = "default",
}: {
  icon: any;
  title: string;
  children: React.ReactNode;
  variant?: "default" | "warning" | "success";
}) => (
  <div
    className={`card-elevated p-5 space-y-3 ${
      variant === "warning" ? "border-destructive/30 bg-destructive/5" : variant === "success" ? "border-success/30 bg-success/5" : ""
    }`}
  >
    <div className="flex items-center gap-2">
      <Icon className={`h-5 w-5 ${variant === "warning" ? "text-destructive" : "text-primary"}`} />
      <h3 className="font-heading text-lg font-bold text-foreground">{title}</h3>
    </div>
    {children}
  </div>
);

const ListItems = ({ items }: { items: string[] }) => (
  <ul className="space-y-2">
    {items.map((item, i) => (
      <li key={i} className="flex gap-2 text-sm leading-relaxed text-foreground/85">
        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
        {item}
      </li>
    ))}
  </ul>
);

export default function AnalysisResults({ result }: Props) {
  const { t } = useTranslation();
  const { case_analysis, prophetic_medicine_integration, actionable_steps, strict_risk_assessment, medical_disclaimer } = result;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-center">
        <UrgencyBadge level={case_analysis.urgency_level} />
      </div>

      <Section icon={Activity} title={t("results.medicalAnalysis")}>
        <div className="flex flex-wrap gap-2 mb-3">
          {case_analysis.identified_symptoms.map((s, i) => (
            <span key={i} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              {s}
            </span>
          ))}
        </div>
        <p className="text-sm leading-relaxed text-foreground/85">{case_analysis.modern_medical_perspective}</p>
      </Section>

      <Section icon={BookOpen} title={t("results.propheticMedicine")} variant="success">
        <p className="text-sm leading-relaxed text-foreground/85 mb-3">{prophetic_medicine_integration.relevant_prophetic_guidance}</p>
        <div className="space-y-2 border-s-2 border-primary/30 ps-3 mb-3">
          {prophetic_medicine_integration.verified_sources_and_hadiths.map((h, i) => (
            <p key={i} className="text-sm italic text-muted-foreground">❝ {h} ❞</p>
          ))}
        </div>
        <p className="text-sm text-foreground/80">{prophetic_medicine_integration.scientific_validation}</p>
      </Section>

      <Section icon={Heart} title={t("results.treatmentSteps")}>
        <h4 className="text-sm font-bold text-foreground mb-1">{t("results.immediateActions")}</h4>
        <ListItems items={actionable_steps.immediate_actions} />
        <h4 className="text-sm font-bold text-foreground mt-3 mb-1">{t("results.naturalRemedies")}</h4>
        <ListItems items={actionable_steps.prophetic_and_natural_remedies_application} />
        <h4 className="text-sm font-bold text-destructive mt-3 mb-1">{t("results.whenSeeDoctor")}</h4>
        <ListItems items={actionable_steps.when_to_see_a_doctor} />
      </Section>

      <Section icon={Shield} title={t("results.riskAssessment")} variant="warning">
        <p className="text-sm leading-relaxed text-foreground/85 mb-3">{strict_risk_assessment.mismanagement_dangers}</p>
        <h4 className="text-sm font-bold text-destructive mb-1 flex items-center gap-1">
          <XCircle className="h-4 w-4" /> {t("results.contraindications")}
        </h4>
        <ListItems items={strict_risk_assessment.contraindications} />
      </Section>

      <div className="rounded-lg bg-muted p-4 text-center">
        <p className="text-xs text-muted-foreground leading-relaxed">{medical_disclaimer}</p>
      </div>
    </div>
  );
}
