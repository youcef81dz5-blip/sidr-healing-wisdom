import { ArrowRight, Shield, Eye, Lock, Server, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function PrivacyPage() {
  const navigate = useNavigate();

  const sections = [
    {
      icon: Eye,
      title: "ما البيانات التي نجمعها؟",
      content: [
        "الأعراض أو الأوصاف النصية التي تُدخلها للتحليل (تُعالج لحظيًا ولا تُخزّن).",
        "الصور المرفقة للتحليل (تُرسل مباشرة لنموذج الذكاء الاصطناعي ولا تُحفظ على أي خادم).",
        "لا نجمع أي بيانات شخصية مثل الاسم أو رقم الهاتف أو البريد الإلكتروني.",
      ],
    },
    {
      icon: Server,
      title: "أين تُعالج البيانات؟",
      content: [
        "النصوص والصور تُرسل مباشرة إلى خوادم Google Gemini AI للتحليل.",
        "لا نملك خوادم خاصة لتخزين بياناتك الصحية.",
        "التحليل يتم لحظيًا ولا يُحفظ سجل لاستفساراتك السابقة.",
      ],
    },
    {
      icon: Lock,
      title: "كيف نحمي خصوصيتك؟",
      content: [
        "الاتصال مشفر بالكامل عبر بروتوكول HTTPS.",
        "لا نبيع أو نشارك أي بيانات مع أطراف ثالثة.",
        "لا نستخدم ملفات تتبع (Cookies) لأغراض إعلانية.",
        "لا نطلب تسجيل دخول أو إنشاء حساب.",
      ],
    },
    {
      icon: Trash2,
      title: "الصور والبيانات الحساسة",
      content: [
        "الصور التي ترفعها تُحلل فوريًا ثم تُحذف تلقائيًا.",
        "لا نحتفظ بنسخ من صورك على أي خادم.",
        "ننصح بعدم إرفاق صور تحتوي على معلومات شخصية واضحة (الوجه، بطاقات هوية...).",
        "في حال ظهور معلومات شخصية في الصورة، لا يتم حفظها أو معالجتها.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowRight className="h-5 w-5" />
          </Button>
          <Shield className="h-5 w-5 text-primary" />
          <h1 className="font-heading text-lg font-bold">سياسة الخصوصية</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6 space-y-4 pb-8">
        <p className="text-sm text-muted-foreground leading-relaxed">
          نلتزم في تطبيق سِدر بحماية خصوصيتك وبياناتك الصحية. هذه السياسة توضح كيف نتعامل مع معلوماتك.
        </p>

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
          <p className="text-[10px] text-muted-foreground">
            آخر تحديث: أبريل 2026 — نحتفظ بحق تعديل هذه السياسة مع إشعار المستخدمين بالتغييرات الجوهرية.
          </p>
        </div>
      </main>
    </div>
  );
}
