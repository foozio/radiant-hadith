import { useState } from "react";
import { Search, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HadithHeroProps {
  onSearch: (query: string) => void;
  onBrowseBooks: () => void;
}

export const HadithHero = ({ onSearch, onBrowseBooks }: HadithHeroProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-hero overflow-hidden">
      {/* Islamic pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-foreground/5 to-primary-foreground/10"></div>
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Main heading */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-4 leading-tight">
            Penjelajah Hadits
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-2 font-light">
            Temukan ajaran indah Nabi Muhammad ﷺ
          </p>
          <p className="text-lg text-primary-foreground/80 font-arabic">
            استكشف الأحاديث النبوية الشريفة
          </p>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Cari hadits, kata kunci, atau topik..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-24 h-14 text-lg bg-card/95 backdrop-blur-sm border-primary/20 shadow-islamic focus:shadow-gold transition-all duration-300"
              />
              <Button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 px-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft"
              >
                Cari
              </Button>
            </div>
          </div>
        </form>

        {/* Browse books button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={onBrowseBooks}
            variant="secondary"
            size="lg"
            className="bg-secondary/90 hover:bg-secondary text-secondary-foreground shadow-gold min-w-[200px] h-12"
          >
            <BookOpen className="mr-2 h-5 w-5" />
            Jelajahi Koleksi
          </Button>
          
          <div className="text-primary-foreground/70 text-sm">
            9 koleksi hadits sahih tersedia
          </div>
        </div>
      </div>
    </section>
  );
};