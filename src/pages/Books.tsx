import { BookOpen, Download, ExternalLink, ArrowRight } from "lucide-react";
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

interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  type: "local" | "external";
  url: string;
  cover: string;
}

const books: Book[] = [
  {
    id: 1,
    title: "التداوي بالأعشاب والطب النبوي",
    author: "مكتبة نور",
    description: "كتاب شامل يجمع بين الطب النبوي والتداوي بالأعشاب الطبيعية، مع وصفات علاجية موثقة.",
    type: "local",
    url: "/books/التداوي_بالأعشاب_والطب_النبوي.pdf",
    cover: book1Cover,
  },
  {
    id: 2,
    title: "الطب النبوي",
    author: "ابن القيم الجوزية",
    description: "من أهم المراجع في الطب النبوي، يتناول العلاجات النبوية والأدوية الطبيعية المذكورة في السنة.",
    type: "local",
    url: "/books/الطب_النبوي.pdf",
    cover: book2Cover,
  },
  {
    id: 3,
    title: "التداوي بالأعشاب والنباتات الطبية لابن حمدوش",
    author: "ابن حمدوش",
    description: "مرجع تراثي في الطب بالأعشاب من التراث المغاربي.",
    type: "external",
    url: "https://www.noor-book.com/ebook-%D8%A7%D9%84%D8%AA%D8%AF%D8%A7%D9%88%D9%8A-%D8%A8%D8%A7%D9%84%D8%A7%D8%B9%D8%B4%D8%A7%D8%A8-%D9%88%D8%A7%D9%84%D9%86%D8%A8%D8%A7%D8%AA%D8%A7%D8%AA-%D8%A7%D9%84%D8%B7%D8%A8%D9%8A%D9%87-%D9%84%D8%A7%D8%A8%D9%86-%D8%AD%D9%85%D8%AF%D9%88%D8%B4-pdf",
    cover: book3Cover,
  },
  {
    id: 4,
    title: "الموسوعة الأم للعلاج بالأعشاب والنباتات الطبية",
    author: "مؤلفون متعددون",
    description: "موسوعة شاملة تغطي مئات الأعشاب والنباتات الطبية مع استخداماتها العلاجية.",
    type: "external",
    url: "https://www.noor-book.com/ebook-%D8%A7%D9%84%D9%85%D9%88%D8%B3%D9%88%D8%B9%D9%87-%D8%A7%D9%84%D8%A7%D9%85-%D9%84%D9%84%D8%B9%D9%84%D8%A7%D8%AC-%D8%A8%D8%A7%D9%84%D8%A7%D8%B9%D8%B4%D8%A7%D8%A8-%D9%88%D8%A7%D9%84%D9%86%D8%A8%D8%A7%D8%AA%D8%A7%D8%AA-%D8%A7%D9%84%D8%B7%D8%A8%D9%8A%D9%87-pdf",
    cover: book4Cover,
  },
  {
    id: 5,
    title: "الأعشاب الطبية والنباتات الطبية",
    author: "حسين العليات",
    description: "كتاب يتناول أهم الأعشاب والنباتات الطبية المستخدمة في الطب الشعبي والحديث.",
    type: "external",
    url: "https://www.noor-book.com/book/review/566560",
    cover: book5Cover,
  },
  {
    id: 6,
    title: "الطب البديل - التداوي بالأعشاب والنباتات الطبية",
    author: "أندرو شوفالييه",
    description: "مرجع عالمي مترجم في طب الأعشاب يجمع بين الطب الغربي والشرقي.",
    type: "external",
    url: "https://www.noor-book.com/book/review/299488",
    cover: book6Cover,
  },
  {
    id: 7,
    title: "الوصفات الطبيعية للعلاج بالأعشاب والنباتات الطبية",
    author: "خالد السيد",
    description: "وصفات طبيعية عملية للعلاج بالأعشاب مع طرق التحضير.",
    type: "external",
    url: "https://www.noor-book.com/book/review/483588",
    cover: book7Cover,
  },
  {
    id: 8,
    title: "الدليل الشامل في التداوي بالأعشاب والنباتات الطبية",
    author: "أحمد توفيق منصور",
    description: "دليل شامل يغطي الأعشاب الطبية مع الجرعات والاستخدامات.",
    type: "external",
    url: "https://www.noor-book.com/book/review/358387",
    cover: book8Cover,
  },
];

export default function Books() {
  const navigate = useNavigate();

  return (
    <div dir="rtl" className="min-h-screen bg-background font-tajawal">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2">
            <img src={sidrLogo} alt="سِدر" className="h-8 w-8 object-contain" />
            <span className="font-amiri text-xl font-bold text-primary">سِدر</span>
          </button>
          <h1 className="font-amiri text-lg font-bold text-foreground">مكتبة الكتب</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <h2 className="font-amiri text-3xl font-bold text-foreground mb-2">
            مكتبة طب الأعشاب
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            مجموعة مختارة من أهم الكتب والمراجع في مجال التداوي بالأعشاب والطب النبوي
          </p>
        </div>

        {/* Local Books Section */}
        <div className="mb-10">
          <h3 className="font-amiri text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            كتب متاحة للتحميل المباشر
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {books.filter(b => b.type === "local").map(book => (
              <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 overflow-hidden">
                  <img src={book.cover} alt={book.title} loading="lazy" width={512} height={720} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-4 text-center">
                    <h4 className="font-amiri text-xl font-bold text-white leading-relaxed drop-shadow-lg">{book.title}</h4>
                    <p className="text-white/80 text-sm mt-1 font-tajawal">{book.author}</p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h4 className="font-amiri text-lg font-bold text-foreground mb-1">{book.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
                  <p className="text-sm text-foreground/70 mb-4 line-clamp-2">{book.description}</p>
                  <a href={book.url} download>
                    <Button className="w-full gap-2">
                      <Download className="h-4 w-4" />
                      تحميل PDF
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* External Books Section */}
        <div className="mb-10">
          <h3 className="font-amiri text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <ExternalLink className="h-5 w-5 text-accent" />
            كتب إضافية من مكتبة نور
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {books.filter(b => b.type === "external").map(book => (
              <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-40 overflow-hidden">
                  <img src={book.cover} alt={book.title} loading="lazy" width={512} height={720} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-3 text-center">
                    <h4 className="font-amiri text-lg font-bold text-white leading-relaxed drop-shadow-lg">{book.title}</h4>
                    <p className="text-white/80 text-xs mt-1 font-tajawal">{book.author}</p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h4 className="font-amiri text-lg font-bold text-foreground mb-1">{book.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
                  <p className="text-sm text-foreground/70 mb-4 line-clamp-2">{book.description}</p>
                  <a href={book.url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full gap-2">
                      <ExternalLink className="h-4 w-4" />
                      عرض على مكتبة نور
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Browse More */}
        <div className="text-center p-6 rounded-2xl bg-muted/50 border border-border">
          <p className="text-muted-foreground mb-3">تصفح المزيد من كتب التداوي بالأعشاب</p>
          <a
            href="https://www.noor-book.com/tag/%D8%A7%D9%84%D8%AA%D8%AF%D8%A7%D9%88%D9%8A-%D8%A8%D8%A7%D9%84%D8%A3%D8%B9%D8%B4%D8%A7%D8%A8-%D9%88%D8%A7%D9%84%D9%86%D8%A8%D8%A7%D8%AA%D8%A7%D8%AA-%D8%A7%D9%84%D8%B7%D8%A8%D9%8A%D8%A9"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" className="gap-2">
              تصفح مكتبة نور
              <ArrowRight className="h-4 w-4 rotate-180" />
            </Button>
          </a>
        </div>
      </main>
    </div>
  );
}
