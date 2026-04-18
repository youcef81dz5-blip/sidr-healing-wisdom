import { AlertTriangle, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface Props {
  onDismiss: () => void;
}

export default function EmergencyAlert({ onDismiss }: Props) {
  const { t } = useTranslation();
  const symptoms = t("emergency.symptoms", { returnObjects: true }) as string[];

  return (
    <div className="fixed inset-0 z-[100] bg-destructive/95 flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="max-w-sm w-full text-center space-y-6">
        <div className="mx-auto h-20 w-20 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
          <AlertTriangle className="h-10 w-10 text-white" />
        </div>

        <h1 className="font-heading text-3xl font-bold text-white">{t("emergency.title")}</h1>

        <p className="text-white/90 text-sm leading-relaxed">
          {t("emergency.body")} <strong>{t("emergency.bodyStrong")}</strong>
        </p>

        <div className="bg-white/15 rounded-xl p-4 text-start space-y-2">
          <h3 className="text-white font-bold text-sm">{t("emergency.symptomsTitle")}</h3>
          <ul className="space-y-1.5">
            {symptoms.map((s, i) => (
              <li key={i} className="text-white/85 text-xs flex gap-2 items-start">
                <span className="text-white mt-0.5">•</span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <a href="tel:911" className="block">
            <Button className="w-full h-14 text-lg bg-white text-destructive hover:bg-white/90 font-bold">
              <Phone className="h-5 w-5 me-2" />
              {t("emergency.callNow")}
            </Button>
          </a>
          <Button
            variant="ghost"
            className="text-white/70 hover:text-white hover:bg-white/10 text-xs"
            onClick={onDismiss}
          >
            {t("emergency.notEmergency")}
          </Button>
        </div>
      </div>
    </div>
  );
}
