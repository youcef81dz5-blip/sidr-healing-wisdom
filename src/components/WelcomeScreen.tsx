import { Shield, Heart, BookOpen, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import sidrLogo from "@/assets/logo.png";
import { ThemeToggle, LanguageToggle } from "./SettingsToggles";

interface Props {
  onAccept: () => void;
}

export default function WelcomeScreen({ onAccept }: Props) {
  const { t } = useTranslation();
  const features = [
    { icon: Heart, text: t("welcome.feature1") },
    { icon: BookOpen, text: t("welcome.feature2") },
    { icon: Shield, text: t("welcome.feature3") },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-10 relative">
      <div className="absolute top-3 end-3 flex items-center gap-1">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="h-28 w-28 glow-primary">
          <img src={sidrLogo} alt={t("app.name")} className="h-full w-full object-contain" />
        </div>
        <h1 className="font-heading text-4xl font-bold text-gradient-primary">{t("app.name")}</h1>
        <p className="text-muted-foreground text-center text-sm max-w-xs">{t("welcome.tagline")}</p>
      </div>

      <div className="w-full max-w-sm space-y-3 mb-8">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-3 card-elevated p-3">
            <f.icon className="h-5 w-5 text-primary shrink-0" />
            <span className="text-sm text-foreground">{f.text}</span>
          </div>
        ))}
      </div>

      <div className="w-full max-w-sm rounded-xl border-2 border-warning/40 bg-warning/5 p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 text-warning shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h3 className="font-heading text-sm font-bold text-foreground">{t("welcome.warningTitle")}</h3>
            <p className="text-xs leading-relaxed text-foreground/80" dangerouslySetInnerHTML={{ __html: t("welcome.warningBody1") }} />
            <p className="text-xs leading-relaxed text-foreground/80">{t("welcome.warningBody2")}</p>
          </div>
        </div>
      </div>

      <Button onClick={onAccept} className="w-full max-w-sm h-12 text-base font-bold">
        {t("welcome.accept")}
      </Button>

      <p className="text-[10px] text-muted-foreground text-center mt-3 max-w-xs">{t("welcome.consent")}</p>
    </div>
  );
}
