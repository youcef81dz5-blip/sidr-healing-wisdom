import { useTranslation } from "react-i18next";
import { BookOpen, Download, ExternalLink, ArrowRight, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import sidrLogo from "@/assets/logo.png";
import book1Cover from "@/assets/books/book1.jpg";
import book2Cover from "@/assets/books/book2.jpg";
import book3Cover from "@/assets/books/book3.jpg";
import book4Cover from "@/assets/books/book4.jpg";
import book5Cover from "@/assets/books/book5.jpg";
import book6Cover from "@/assets/books/book6.jpg";
import book7Cover from "@/assets/books/book7.jpg";
import book8Cover from "@/assets/books/book8.jpg";

interface BookI18n {
  ar: string;
  en: string;
  fr: string;
}

interface Book {
  id: number;
  title: BookI18n;
  author: BookI18n;
  description: BookI18n;
  type: "local" | "external";
  url: string;
  cover: string;
}

const books: Book[] = [
  {
    id: 1,
    title: {
      ar: "التداوي بالأعشاب والطب النبوي",
      en: "Healing with Herbs and Prophetic Medicine",
      fr: "Guérison par les herbes et médecine prophétique",
    },
    author: { ar: "مكتبة نور", en: "Noor Library", fr: "Bibliothèque Noor" },
    description: {
      ar: "كتاب شامل يجمع بين الطب النبوي والتداوي بالأعشاب الطبيعية، مع وصفات علاجية موثقة.",
      en: "A comprehensive book combining prophetic medicine and herbal healing, with documented therapeutic recipes.",
      fr: "Un livre complet combinant la médecine prophétique et la phytothérapie, avec des recettes thérapeutiques documentées.",
    },
    type: "local",
    url: "/books/herbal-prophetic-medicine.pdf",
    cover: book1Cover,
  },
  {
    id: 2,
    title: { ar: "الطب النبوي", en: "Prophetic Medicine", fr: "Médecine prophétique" },
    author: { ar: "ابن القيم الجوزية", en: "Ibn Qayyim al-Jawziyya", fr: "Ibn Qayyim al-Jawziyya" },
    description: {
      ar: "من أهم المراجع في الطب النبوي، يتناول العلاجات النبوية والأدوية الطبيعية المذكورة في السنة.",
      en: "One of the most important references in prophetic medicine, covering prophetic treatments and natural remedies mentioned in the Sunnah.",
      fr: "L'une des références les plus importantes en médecine prophétique, traitant des remèdes prophétiques et naturels mentionnés dans la Sunna.",
    },
    type: "local",
    url: "/books/prophetic-medicine.pdf",
    cover: book2Cover,
  },
  {
    id: 3,
    title: {
      ar: "التداوي بالأعشاب والنباتات الطبية لابن حمدوش",
      en: "Healing with Herbs by Ibn Hamdoush",
      fr: "Guérison par les plantes médicinales d'Ibn Hamdoush",
    },
    author: { ar: "ابن حمدوش", en: "Ibn Hamdoush", fr: "Ibn Hamdoush" },
    description: {
      ar: "مرجع تراثي في الطب بالأعشاب من التراث المغاربي.",
      en: "A traditional reference on herbal medicine from the Maghreb heritage.",
      fr: "Une référence traditionnelle sur la phytothérapie issue du patrimoine maghrébin.",
    },
    type: "external",
    url: "https://www.noor-book.com/ebook-%D8%A7%D9%84%D8%AA%D8%AF%D8%A7%D9%88%D9%8A-%D8%A8%D8%A7%D9%84%D8%A7%D8%B9%D8%B4%D8%A7%D8%A8-%D9%88%D8%A7%D9%84%D9%86%D8%A8%D8%A7%D8%AA%D8%A7%D8%AA-%D8%A7%D9%84%D8%B7%D8%A8%D9%8A%D9%87-%D9%84%D8%A7%D8%A8%D9%86-%D8%AD%D9%85%D8%AF%D9%88%D8%B4-pdf",
    cover: book3Cover,
  },
  {
    id: 4,
    title: {
      ar: "الموسوعة الأم للعلاج بالأعشاب والنباتات الطبية",
      en: "The Mother Encyclopedia of Herbal Medicine",
      fr: "L'Encyclopédie principale de la phytothérapie",
    },
    author: { ar: "مؤلفون متعددون", en: "Multiple authors", fr: "Auteurs multiples" },
    description: {
      ar: "موسوعة شاملة تغطي مئات الأعشاب والنباتات الطبية مع استخداماتها العلاجية.",
      en: "A comprehensive encyclopedia covering hundreds of herbs and medicinal plants with their therapeutic uses.",
      fr: "Une encyclopédie complète couvrant des centaines d'herbes et de plantes médicinales et leurs usages thérapeutiques.",
    },
    type: "external",
    url: "https://www.noor-book.com/ebook-%D8%A7%D9%84%D9%85%D9%88%D8%B3%D9%88%D8%B9%D9%87-%D8%A7%D9%84%D8%A7%D9%85-%D9%84%D9%84%D8%B9%D9%84%D8%A7%D8%AC-%D8%A8%D8%A7%D9%84%D8%A7%D8%B9%D8%B4%D8%A7%D8%A8-%D9%88%D8%A7%D9%84%D9%86%D8%A8%D8%A7%D8%AA%D8%A7%D8%AA-%D8%A7%D9%84%D8%B7%D8%A8%D9%8A%D9%87-pdf",
    cover: book4Cover,
  },
  {
    id: 5,
    title: { ar: "الأعشاب الطبية والنباتات الطبية", en: "Medicinal Herbs and Plants", fr: "Herbes et plantes médicinales" },
    author: { ar: "حسين العليات", en: "Hussein Al-Aliyat", fr: "Hussein Al-Aliyat" },
    description: {
      ar: "كتاب يتناول أهم الأعشاب والنباتات الطبية المستخدمة في الطب الشعبي والحديث.",
      en: "A book covering the most important medicinal herbs and plants used in folk and modern medicine.",
      fr: "Un livre couvrant les herbes et plantes médicinales les plus importantes utilisées en médecine populaire et moderne.",
    },
    type: "external",
    url: "https://www.noor-book.com/book/review/566560",
    cover: book5Cover,
  },
  {
    id: 6,
    title: {
      ar: "الطب البديل - التداوي بالأعشاب والنباتات الطبية",
      en: "Alternative Medicine - Healing with Herbs",
      fr: "Médecine alternative - Guérison par les plantes",
    },
    author: { ar: "أندرو شوفالييه", en: "Andrew Chevallier", fr: "Andrew Chevallier" },
    description: {
      ar: "مرجع عالمي مترجم في طب الأعشاب يجمع بين الطب الغربي والشرقي.",
      en: "A translated international reference on herbal medicine combining Western and Eastern medicine.",
      fr: "Une référence internationale traduite sur la phytothérapie combinant médecine occidentale et orientale.",
    },
    type: "external",
    url: "https://www.noor-book.com/book/review/299488",
    cover: book6Cover,
  },
  {
    id: 7,
    title: {
      ar: "الوصفات الطبيعية للعلاج بالأعشاب والنباتات الطبية",
      en: "Natural Recipes for Herbal Treatment",
      fr: "Recettes naturelles pour le traitement par les herbes",
    },
    author: { ar: "خالد السيد", en: "Khaled El-Sayed", fr: "Khaled El-Sayed" },
    description: {
      ar: "وصفات طبيعية عملية للعلاج بالأعشاب مع طرق التحضير.",
      en: "Practical natural herbal recipes with preparation methods.",
      fr: "Recettes pratiques à base de plantes avec méthodes de préparation.",
    },
    type: "external",
    url: "https://www.noor-book.com/book/review/483588",
    cover: book7Cover,
  },
  {
    id: 8,
    title: {
      ar: "الدليل الشامل في التداوي بالأعشاب والنباتات الطبية",
      en: "The Complete Guide to Herbal Healing",
      fr: "Le Guide complet de la phytothérapie",
    },
    author: { ar: "أحمد توفيق منصور", en: "Ahmad Tawfik Mansour", fr: "Ahmad Tawfik Mansour" },
    description: {
      ar: "دليل شامل يغطي الأعشاب الطبية مع الجرعات والاستخدامات.",
      en: "A comprehensive guide covering medicinal herbs with dosages and uses.",
      fr: "Un guide complet couvrant les herbes médicinales avec posologies et utilisations.",
    },
    type: "external",
    url: "https://www.noor-book.com/book/review/358387",
    cover: book8Cover,
  },
];

export default function Books() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || "ar").split("-")[0] as "ar" | "en" | "fr";
  const isRtl = i18n.dir() === "rtl";
  const ArrowBack = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2">
            <img src={sidrLogo} alt={t("app.name")} className="h-8 w-8 object-contain" />
            <span className="font-heading text-xl font-bold text-primary">{t("app.name")}</span>
          </button>
          <h1 className="font-heading text-lg font-bold text-foreground">{t("books.title")}</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <h2 className="font-heading text-3xl font-bold text-foreground mb-2">{t("books.heroTitle")}</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">{t("books.heroSubtitle")}</p>
        </div>

        {/* Local */}
        <div className="mb-10">
          <h3 className="font-heading text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            {t("books.downloadSection")}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {books.filter((b) => b.type === "local").map((book) => (
              <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 overflow-hidden">
                  <img src={book.cover} alt={book.title[lang]} loading="lazy" width={512} height={720} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-4 text-center">
                    <h4 className="font-heading text-xl font-bold text-white leading-relaxed drop-shadow-lg">{book.title[lang]}</h4>
                    <p className="text-white/80 text-sm mt-1">{book.author[lang]}</p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h4 className="font-heading text-lg font-bold text-foreground mb-1">{book.title[lang]}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{book.author[lang]}</p>
                  <p className="text-sm text-foreground/70 mb-4 line-clamp-2">{book.description[lang]}</p>
                  <a href={book.url} target="_blank" rel="noopener noreferrer" download>
                    <Button className="w-full gap-2">
                      <Download className="h-4 w-4" />
                      {t("books.downloadPdf")}
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* External */}
        <div className="mb-10">
          <h3 className="font-heading text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <ExternalLink className="h-5 w-5 text-accent" />
            {t("books.externalSection")}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {books.filter((b) => b.type === "external").map((book) => (
              <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-40 overflow-hidden">
                  <img src={book.cover} alt={book.title[lang]} loading="lazy" width={512} height={720} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-3 text-center">
                    <h4 className="font-heading text-lg font-bold text-white leading-relaxed drop-shadow-lg">{book.title[lang]}</h4>
                    <p className="text-white/80 text-xs mt-1">{book.author[lang]}</p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h4 className="font-heading text-lg font-bold text-foreground mb-1">{book.title[lang]}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{book.author[lang]}</p>
                  <p className="text-sm text-foreground/70 mb-4 line-clamp-2">{book.description[lang]}</p>
                  <a href={book.url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full gap-2">
                      <ExternalLink className="h-4 w-4" />
                      {t("books.viewExternal")}
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center p-6 rounded-2xl bg-muted/50 border border-border">
          <p className="text-muted-foreground mb-3">{t("books.browseMore")}</p>
          <a
            href="https://www.noor-book.com/tag/%D8%A7%D9%84%D8%AA%D8%AF%D8%A7%D9%88%D9%8A-%D8%A8%D8%A7%D9%84%D8%A3%D8%B9%D8%B4%D8%A7%D8%A8-%D9%88%D8%A7%D9%84%D9%86%D8%A8%D8%A7%D8%AA%D8%A7%D8%AA-%D8%A7%D9%84%D8%B7%D8%A8%D9%8A%D8%A9"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" className="gap-2">
              {t("books.browseNoor")}
              <ArrowBack className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </main>
    </div>
  );
}
