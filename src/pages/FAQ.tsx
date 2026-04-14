import { ArrowRight, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { faqs, FAQ_CATEGORIES } from "@/data/faq";

export default function FAQPage() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [filterCat, setFilterCat] = useState("all");

  const filtered = filterCat === "all" ? faqs : faqs.filter((f) => f.category === filterCat);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowRight className="h-5 w-5" />
          </Button>
          <HelpCircle className="h-5 w-5 text-primary" />
          <h1 className="font-heading text-lg font-bold">الأسئلة الشائعة</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-4 space-y-4 pb-8">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-1.5">
          <Button size="sm" variant={filterCat === "all" ? "default" : "outline"} className="text-xs h-7" onClick={() => setFilterCat("all")}>الكل</Button>
          {FAQ_CATEGORIES.map((c) => (
            <Button key={c} size="sm" variant={filterCat === c ? "default" : "outline"} className="text-xs h-7" onClick={() => setFilterCat(c)}>{c}</Button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-2">
          {filtered.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <button
                key={i}
                className="w-full text-right card-elevated p-4 space-y-2"
                onClick={() => setOpenIndex(isOpen ? null : i)}
              >
                <div className="flex items-start gap-2">
                  <span className="text-xs rounded-full bg-primary/10 text-primary px-2 py-0.5 shrink-0 mt-0.5">{faq.category}</span>
                  <span className="text-sm font-bold text-foreground flex-1">{faq.question}</span>
                  {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
                </div>
                {isOpen && (
                  <p className="text-xs text-foreground/80 leading-relaxed pr-12 animate-in fade-in slide-in-from-top-1 duration-200">
                    {faq.answer}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
