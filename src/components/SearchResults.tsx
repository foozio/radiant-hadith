import { useState } from "react";
import { Search, Filter, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HadithDisplay } from "./HadithDisplay";

interface HadithData {
  name: string;
  id: string;
  available: number;
  contents: {
    number: number;
    arab: string;
    id: string;
  };
}

interface HadithBook {
  name: string;
  id: string;
  available: number;
}

interface SearchResultsProps {
  searchQuery: string;
  searchResults: HadithData[];
  loading: boolean;
  error: string | null;
  books: HadithBook[];
  selectedBook: string | null;
  currentPage: number;
  totalPages: number;
  onSearch: (query: string) => void;
  onFilterByBook: (bookId: string | null) => void;
  onPageChange: (page: number) => void;
  onSelectHadith: (hadith: HadithData) => void;
}

const ITEMS_PER_PAGE = 10;

export const SearchResults = ({
  searchQuery,
  searchResults,
  loading,
  error,
  books,
  selectedBook,
  currentPage,
  totalPages,
  onSearch,
  onFilterByBook,
  onPageChange,
  onSelectHadith
}: SearchResultsProps) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      onSearch(localQuery.trim());
    }
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, searchResults.length);
  const currentResults = searchResults.slice(startIndex, endIndex);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 animate-fade-in">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/3 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-secondary/5 rounded-full blur-2xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>
      
      {/* Search Header */}
      <div className="mb-10 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gradient mb-3 animate-fade-in-up">
            نتائج البحث
          </h2>
          <h3 className="text-2xl font-semibold text-foreground/90 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            Hasil Pencarian
          </h3>
          <div className="w-24 h-1 bg-gradient-islamic mx-auto mt-4 rounded-full animate-scale" style={{animationDelay: '0.4s'}}></div>
        </div>
        
        {/* Enhanced Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
            <div className="relative flex-1 group">
              <div className="absolute inset-0 bg-gradient-islamic rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative glass-card bg-background/80 rounded-2xl p-1">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-primary h-5 w-5 z-10" />
                <Input
                  type="text"
                  placeholder="ابحث عن الأحاديث والكلمات المفتاحية..."
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                  className="pl-14 pr-6 h-14 text-lg bg-transparent border-none shadow-none focus:ring-0 focus:outline-none placeholder:text-muted-foreground font-medium"
                />
              </div>
            </div>
            <Button type="submit" className="h-16 px-10 bg-gradient-islamic hover:shadow-glow text-primary-foreground rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-islamic">
              <Search className="mr-3 h-5 w-5" />
              بحث
            </Button>
          </div>
        </form>

        {/* Enhanced Filters */}
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-center">
          <div className="glass rounded-2xl p-4 bg-background/60 backdrop-blur-sm border border-primary/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gradient-islamic rounded-lg">
                <Filter className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-sm font-semibold text-foreground">تصفية حسب المجموعة</span>
            </div>
            <Select
              value={selectedBook || "all"}
              onValueChange={(value) => onFilterByBook(value === "all" ? null : value)}
            >
              <SelectTrigger className="w-[250px] h-12 glass-card bg-background/80 border-primary/20 rounded-xl font-medium">
                <SelectValue placeholder="جميع المجموعات" />
              </SelectTrigger>
              <SelectContent className="glass-card bg-background/95 backdrop-blur-md border-primary/20">
                <SelectItem value="all" className="font-medium">جميع المجموعات</SelectItem>
                {books.map((book) => (
                  <SelectItem key={book.id} value={book.id} className="font-medium">
                    {book.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Enhanced Results Info */}
      {!loading && (
        <div className="mb-8">
          <div className="glass-card bg-background/60 rounded-2xl p-6 border border-primary/10 animate-fade-in-up">
            <div className="text-center">
              {searchResults.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-foreground">
                    عرض {startIndex + 1}-{endIndex} من {searchResults.length} نتيجة
                  </p>
                  <p className="text-muted-foreground">
                    Menampilkan hasil untuk{" "}
                    <span className="font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                      "{searchQuery}"
                    </span>
                    {selectedBook && (
                      <>
                        {" "} dalam{" "}
                        <Badge variant="secondary" className="glass bg-secondary/20 text-secondary-foreground font-semibold px-3 py-1">
                          {books.find(b => b.id === selectedBook)?.name}
                        </Badge>
                      </>
                    )}
                  </p>
                </div>
              ) : searchQuery ? (
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-muted-foreground">لا توجد نتائج</p>
                  <p className="text-muted-foreground">
                    Tidak ada hasil ditemukan untuk{" "}
                    <span className="font-semibold text-foreground">"{searchQuery}"</span>
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground font-medium">
                  أدخل كلمة مفتاحية للبحث عن الأحاديث
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Loading State */}
      {loading && (
        <div className="flex flex-col justify-center items-center py-16">
          <div className="relative">
            <div className="glass-card bg-background/80 rounded-3xl p-8 shadow-glow">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <div className="absolute inset-0 h-12 w-12 border-2 border-primary/20 rounded-full animate-pulse"></div>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-xl font-semibold text-primary animate-pulse-glow">جاري البحث...</p>
                  <p className="text-muted-foreground font-medium">Mencari hadits dalam koleksi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Error State */}
      {error && (
        <div className="glass-card bg-destructive/5 border border-destructive/20 rounded-2xl p-8 mb-8 animate-fade-in">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
              <Search className="h-8 w-8 text-destructive" />
            </div>
            <div>
              <p className="text-destructive font-bold text-lg">خطأ في البحث</p>
              <p className="text-destructive/80 mt-2 font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Search Results */}
      {!loading && !error && currentResults.length > 0 && (
        <div className="space-y-8 relative z-10">
          {currentResults.map((hadith, index) => (
            <Card 
              key={`${hadith.id}-${hadith.contents.number}`} 
              className="group glass-card bg-gradient-card border-primary/20 shadow-glass hover:shadow-glow cursor-pointer hover-lift transition-all duration-500 overflow-hidden animate-fade-in-scale" 
              style={{animationDelay: `${index * 0.1}s`}}
              onClick={() => onSelectHadith(hadith)}
            >
              {/* Decorative elements */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-4 right-4 w-20 h-20 bg-primary/5 rounded-full blur-2xl"></div>
                <div className="absolute bottom-4 left-4 w-16 h-16 bg-secondary/8 rounded-full blur-xl"></div>
              </div>
              
              <CardContent className="p-8 relative z-10">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-8 bg-gradient-islamic rounded-full"></div>
                      <h3 className="font-bold text-xl text-gradient group-hover:scale-105 transition-transform duration-300">
                        {hadith.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="glass bg-primary/10 text-primary border-primary/30 font-semibold px-3 py-1">
                        حديث #{hadith.contents.number}
                      </Badge>
                      <Badge variant="outline" className="glass bg-secondary/10 text-secondary-foreground border-secondary/30 font-medium px-3 py-1">
                        {hadith.id}
                      </Badge>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 bg-gradient-islamic rounded-full flex items-center justify-center shadow-glow">
                      <Search className="h-5 w-5 text-primary-foreground" />
                    </div>
                  </div>
                </div>
                
                {/* Arabic Text */}
                <div className="mb-6">
                  <div className="glass rounded-2xl p-6 bg-background/40 border border-primary/10">
                    <p className="text-right text-2xl leading-relaxed font-arabic text-foreground text-shadow-soft" dir="rtl">
                      {highlightText(hadith.contents.arab, searchQuery)}
                    </p>
                  </div>
                </div>
                
                {/* Translation */}
                {hadith.contents.id && (
                  <div className="glass rounded-2xl p-6 bg-background/30 border border-primary/5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1 h-4 bg-gradient-gold rounded-full"></div>
                      <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Terjemahan</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed font-medium">
                      {highlightText(hadith.contents.id, searchQuery)}
                    </p>
                  </div>
                )}
                
                {/* Footer indicator */}
                <div className="flex justify-center mt-6">
                  <div className="w-8 h-1 bg-gradient-islamic rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Enhanced Pagination */}
      {!loading && !error && searchResults.length > ITEMS_PER_PAGE && (
        <div className="flex justify-center items-center gap-6 mt-12">
          <div className="glass-card bg-background/60 rounded-2xl p-4 border border-primary/10">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="glass-card bg-background/80 border-primary/20 hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed h-12 px-6 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              >
                <ChevronLeft className="h-5 w-5 mr-2" />
                السابق
              </Button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  if (pageNum > totalPages) return null;
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => onPageChange(pageNum)}
                      className={`w-12 h-12 rounded-xl font-bold transition-all duration-300 ${
                        pageNum === currentPage 
                          ? 'bg-gradient-islamic text-primary-foreground shadow-glow scale-110' 
                          : 'glass-card bg-background/80 border-primary/20 hover:shadow-soft hover:scale-105'
                      }`}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="glass-card bg-background/80 border-primary/20 hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed h-12 px-6 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              >
                التالي
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Empty State */}
      {!loading && !error && searchResults.length === 0 && searchQuery && (
        <div className="text-center py-16">
          <div className="max-w-lg mx-auto">
            <div className="glass-card bg-background/60 rounded-3xl p-12 border border-primary/10 animate-fade-in">
              <div className="space-y-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-islamic/10 rounded-full flex items-center justify-center mx-auto">
                    <Search className="h-12 w-12 text-primary/80" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse-glow"></div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-gradient">
                    لا توجد نتائج
                  </h3>
                  <h4 className="text-xl font-semibold text-foreground">
                    Tidak ada hasil ditemukan
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Coba sesuaikan kata kunci pencarian atau jelajahi koleksi hadits untuk menemukan yang Anda cari.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => onFilterByBook(null)} 
                    variant="outline"
                    className="glass-card bg-background/80 border-primary/20 hover:shadow-glow h-12 px-8 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                  >
                    مسح المرشحات
                  </Button>
                  <Button 
                    onClick={() => setLocalQuery('')}
                    className="bg-gradient-islamic hover:shadow-glow text-primary-foreground h-12 px-8 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                  >
                    بحث جديد
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};