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
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-hero overflow-hidden">
      {/* Enhanced Islamic pattern overlay with floating elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-foreground/5 to-primary-foreground/10"></div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/5 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-32 right-16 w-24 h-24 bg-accent/10 rounded-full blur-lg animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-secondary/8 rounded-full blur-md animate-float" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center animate-fade-in-up">
        {/* Enhanced Main heading */}
        <div className="mb-12">
          <div className="mb-6">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight text-shadow-soft">
              <span className="inline-block animate-fade-in-scale">Penjelajah</span>
              <br />
              <span className="inline-block animate-fade-in-scale" style={{animationDelay: '0.2s'}}>Hadits</span>
            </h1>
          </div>
          <div className="space-y-4">
            <p className="text-2xl md:text-3xl text-primary-foreground/95 font-light text-shadow-soft animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              Temukan ajaran indah Nabi Muhammad ﷺ
            </p>
            <p className="text-xl md:text-2xl text-primary-foreground/85 font-arabic animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              استكشف الأحاديث النبوية الشريفة
            </p>
          </div>
        </div>

        {/* Enhanced Search form */}
        <form onSubmit={handleSearch} className="mb-12 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
          <div className="relative max-w-3xl mx-auto">
            <div className={`relative glass-card rounded-2xl p-2 transition-all duration-500 ${
              isSearchFocused ? 'shadow-glow scale-105' : 'shadow-glass'
            }`}>
              <Search className={`absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 transition-colors duration-300 ${
                isSearchFocused ? 'text-primary' : 'text-muted-foreground'
              }`} />
              <Input
                type="text"
                placeholder="Cari hadits, kata kunci, atau topik..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="pl-14 pr-28 h-16 text-lg bg-transparent border-none shadow-none focus:ring-0 focus:outline-none placeholder:text-muted-foreground"
              />
              <Button 
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-12 px-8 bg-gradient-islamic hover:shadow-glow text-primary-foreground rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              >
                <Search className="mr-2 h-4 w-4" />
                Cari
              </Button>
            </div>
          </div>
        </form>

        {/* Enhanced Browse books section */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up" style={{animationDelay: '1s'}}>
          <Button
            onClick={onBrowseBooks}
            variant="secondary"
            size="lg"
            className="glass-card bg-gradient-gold hover:shadow-gold text-secondary-foreground min-w-[240px] h-14 text-lg font-semibold rounded-xl hover-lift hover-glow transition-all duration-300 group"
          >
            <BookOpen className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
            Jelajahi Koleksi
          </Button>
          
          <div className="glass rounded-full px-6 py-3 text-secondary-foreground text-sm font-medium backdrop-blur-sm">
            ✨ 9 koleksi hadits sahih tersedia
          </div>
        </div>
        
        {/* Additional decorative elements */}
        <div className="mt-16 flex justify-center space-x-8 opacity-80 animate-fade-in-up" style={{animationDelay: '1.2s'}}>
          <div className="text-primary-foreground/80 text-xs font-medium tracking-wider uppercase">
            Sahih • Authentic • صَحِيْح
          </div>
        </div>
      </div>
    </section>
  );
};