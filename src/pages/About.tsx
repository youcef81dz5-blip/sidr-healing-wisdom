import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight, Shield, BookOpen, Heart, Users, Mail } from "lucide-react";
import sidrLogo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function AboutPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";
  const ArrowBack = isRtl ? ArrowRight : ArrowLeft;

  const values = [
    { icon: BookOpen, title: t("about.value1Title"), desc: t("about.value1Body") },
    { icon: Shield, title: t("about.value2Title"), desc: t("about.value2Body") },
    { icon: Users, title: t("about.value3Title"), desc: t("about.value3Body") },
  ];

  const sources = [
    "📖 \"زاد المعاد في هدي خير العباد\" — Ibn Qayyim al-Jawziyya",
    "📖 \"الطب النبوي\" — Ibn Qayyim",
    "📖 Sahih al-Bukhari & Sahih Muslim",
    "🔬 Peer-reviewed studies (PubMed, Google Scholar)",
    "🏥 WHO guidelines on traditional & complementary medicine",
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowBack className="h-5 w-5" />
          </Button>
          <h1 className="font-heading text-lg font-bold">{t("about.title")}</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6 space-y-6 pb-8">
        <div className="text-center space-y-3">
          <div className="mx-auto h-24 w-24 glow-primary">
            <img src={sidrLogo} alt={t("app.name")} className="h-full w-full object-contain" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-gradient-primary">{t("app.name")}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{t("about.intro")}</p>
        </div>

        <div className="card-elevated p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            <h3 className="font-heading font-bold">{t("about.missionTitle")}</h3>
          </div>
          <p className="text-sm leading-relaxed text-foreground/85">{t("about.missionBody")}</p>
        </div>

        <div className="space-y-3">
          {values.map((v, i) => (
            <div key={i} className="card-elevated p-4 flex gap-3">
              <v.icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-foreground">{v.title}</h4>
                <p className="text-xs text-foreground/75 leading-relaxed mt-1">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="card-elevated p-5 space-y-3">
          <h3 className="font-heading font-bold text-sm">{t("about.sourcesTitle")}</h3>
          <ul className="space-y-1.5 text-xs text-foreground/80">
            {sources.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>

        <div className="card-elevated p-5 space-y-3 text-center">
          <h3 className="font-heading font-bold text-sm">{t("about.contactTitle")}</h3>
          <p className="text-xs text-muted-foreground">{t("about.contactSub")}</p>
          <div className="flex justify-center">
            <Button variant="outline" size="sm" className="gap-2">
              <Mail className="h-4 w-4" />
              info@sidr-app.com
            </Button>
          </div>
        </div>

        <div className="rounded-lg bg-muted p-4 text-center">
          <p className="text-[10px] text-muted-foreground leading-relaxed">{t("about.footer")}</p>
        </div>
      </main>
    </div>
  );
}
