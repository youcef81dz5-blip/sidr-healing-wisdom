import { useTranslation } from "react-i18next";
import { Share2, MessageCircle, Send as SendIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnalysisResult } from "@/lib/gemini";

interface Props {
  result: AnalysisResult;
}

export default function ShareResults({ result }: Props) {
  const { t } = useTranslation();

  const generateShareText = () => {
    const symptoms = result.case_analysis.identified_symptoms.join(", ");
    return `🌿 *${t("app.name")} — ${t("app.tagline")}*\n\n${t("results.medicalAnalysis")}: ${symptoms}\n\n${result.case_analysis.modern_medical_perspective.slice(0, 150)}...\n\n${t("results.propheticMedicine")}: ${result.prophetic_medicine_integration.relevant_prophetic_guidance.slice(0, 100)}...\n\n${window.location.origin}`;
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(generateShareText());
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const shareTelegram = () => {
    const text = encodeURIComponent(generateShareText());
    window.open(`https://t.me/share/url?text=${text}`, "_blank");
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: t("app.name"), text: generateShareText() });
      } catch {}
    }
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={shareWhatsApp}>
        <MessageCircle className="h-4 w-4" />
        {t("share.whatsapp")}
      </Button>
      <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={shareTelegram}>
        <SendIcon className="h-4 w-4" />
        {t("share.telegram")}
      </Button>
      {typeof navigator.share === "function" && (
        <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={shareNative}>
          <Share2 className="h-4 w-4" />
          {t("share.share")}
        </Button>
      )}
    </div>
  );
}
