import { BookOpen, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface HadithBookData {
  name: string;
  id: string;
  available: number;
}

interface HadithBookProps {
  book: HadithBookData;
  onSelect: (bookId: string) => void;
}

export const HadithBook = ({ book, onSelect }: HadithBookProps) => {
  return (
    <Card className="group glass-card bg-gradient-card border-primary/20 shadow-glass hover:shadow-glow cursor-pointer hover-lift transition-all duration-500 overflow-hidden animate-fade-in-scale"
          onClick={() => onSelect(book.id)}>
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute top-4 right-4 w-16 h-16 bg-primary/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-4 left-4 w-12 h-12 bg-secondary/8 rounded-full blur-lg"></div>
      </div>
      
      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="p-3 bg-gradient-islamic rounded-xl shadow-soft group-hover:shadow-glow transition-all duration-500 group-hover:scale-110">
                <BookOpen className="h-7 w-7 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-green-600 rounded-full animate-pulse-glow"></div>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-xl font-bold text-gradient group-hover:scale-105 transition-transform duration-300">
                {book.name}
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="glass rounded-full px-3 py-1 text-xs font-medium text-primary/80">
                  ✓ Koleksi Sahih
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 relative z-10 space-y-6">
        {/* Stats section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="glass rounded-full p-2">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-lg font-bold text-foreground">
                {book.available.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                hadits tersedia
              </div>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-all duration-500 glass-card bg-gradient-islamic hover:shadow-glow text-primary-foreground border-none font-semibold px-6 py-2 rounded-xl hover:scale-105"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(book.id);
            }}
          >
            Jelajahi
          </Button>
        </div>
        
        {/* Enhanced progress indicator */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-medium">Kelengkapan Koleksi</span>
            <span className="text-primary font-semibold">
              {Math.min(Math.round((book.available / 7000) * 100), 100)}%
            </span>
          </div>
          <div className="relative">
            <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-islamic h-2 rounded-full transition-all duration-1000 group-hover:bg-gradient-gold relative overflow-hidden" 
                style={{ width: `${Math.min((book.available / 7000) * 100, 100)}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional info */}
        <div className="flex items-center justify-center pt-2">
          <div className="text-xs text-muted-foreground font-medium tracking-wide uppercase">
            Hadits • Sahih • صَحِيْح
          </div>
        </div>
      </CardContent>
    </Card>
  );
};