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
    <Card className="group hover:shadow-islamic transition-all duration-300 bg-card/95 backdrop-blur-sm border-primary/10 hover:border-primary/30 cursor-pointer"
          onClick={() => onSelect(book.id)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-gold rounded-lg shadow-soft group-hover:shadow-gold transition-all duration-300">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
                {book.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Authentic Collection
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{book.available.toLocaleString()} hadiths</span>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-primary/20 hover:bg-primary hover:text-primary-foreground"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(book.id);
            }}
          >
            Explore
          </Button>
        </div>
        
        {/* Progress indicator */}
        <div className="mt-4 w-full bg-muted rounded-full h-1">
          <div 
            className="bg-gradient-islamic h-1 rounded-full transition-all duration-500 group-hover:bg-gradient-gold" 
            style={{ width: `${Math.min((book.available / 7000) * 100, 100)}%` }}
          ></div>
        </div>
      </CardContent>
    </Card>
  );
};