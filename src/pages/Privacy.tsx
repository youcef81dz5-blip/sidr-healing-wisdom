import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight, Shield, Eye, Lock, Server, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function PrivacyPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";
  const ArrowBack = isRtl ? ArrowRight : ArrowLeft;

  const sections = [
    { icon: Eye, title: t("privacy.section1Title"), content: t("privacy.section1", { returnObjects: true }) as string[] },
    { icon: Server, title: t("privacy.section2Title"), content: t("privacy.section2", { returnObjects: true }) as string[] },
    { icon: Lock, title: t("privacy.section3Title"), content: t("privacy.section3", { returnObjects: true }) as string[] },
    { icon: Trash2, title: t("privacy.section4Title"), content: t("privacy.section4", { returnObjects: true }) as string[] },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowBack className="h-5 w-5" />
          </Button>
          <Shield className="h-5 w-5 text-primary" />
          <h1 className="font-heading text-lg font-bold">{t("privacy.title")}</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6 space-y-4 pb-8">
        <p className="text-sm text-muted-foreground leading-relaxed">{t("privacy.intro")}</p>

        {sections.map((section, i) => (
          <div key={i} className="card-elevated p-4 space-y-2">
            <div className="flex items-center gap-2">
              <section.icon className="h-5 w-5 text-primary" />
              <h3 className="font-heading font-bold text-sm">{section.title}</h3>
            </div>
            <ul className="space-y-1.5">
              {section.content.map((item, j) => (
                <li key={j} className="flex gap-2 text-xs text-foreground/80 leading-relaxed">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="rounded-lg bg-muted p-4 text-center">
          <p className="text-[10px] text-muted-foreground">{t("privacy.footer")}</p>
        </div>
      </main>
    </div>
  );
}
