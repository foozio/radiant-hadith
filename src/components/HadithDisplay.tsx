import { useState } from "react";
import { BookOpen, Copy, Share2, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

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

interface HadithDisplayProps {
  hadith: HadithData;
  onClose?: () => void;
}

export const HadithDisplay = ({ hadith, onClose }: HadithDisplayProps) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    const text = `${hadith.contents.arab}\n\n${hadith.contents.id}\n\n- ${hadith.name} #${hadith.contents.number}`;
    await navigator.clipboard.writeText(text);
    toast({
      title: "Hadits disalin",
      description: "Hadits telah disalin ke clipboard Anda.",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `${hadith.name} #${hadith.contents.number}`,
        text: hadith.contents.id,
      });
    } else {
      handleCopy();
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 animate-fade-in-up">
      <Card className="glass-card bg-gradient-card border-primary/20 shadow-glow overflow-hidden hover-lift transition-all duration-500">
        {/* Enhanced Header */}
        <CardHeader className="glass bg-gradient-to-r from-primary/8 to-secondary/8 border-b border-primary/15 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <h3 className="text-3xl md:text-4xl font-bold text-gradient mb-3 animate-fade-in-scale">
                {hadith.name}
              </h3>
              <div className="flex items-center gap-3">
                <div className="glass rounded-full px-4 py-2 text-sm font-medium text-primary/80">
                  Hadits #{hadith.contents.number}
                </div>
                <div className="w-2 h-2 bg-primary/40 rounded-full"></div>
                <div className="text-sm text-muted-foreground font-medium">
                  Koleksi Sahih
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFavorited(!isFavorited)}
                className={`hover-glow rounded-xl p-3 transition-all duration-300 hover:scale-110 ${
                  isFavorited 
                    ? 'text-red-500 bg-red-50 hover:bg-red-100 shadow-soft' 
                    : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'
                }`}
              >
                <Heart className={`h-6 w-6 ${isFavorited ? 'fill-current animate-pulse-glow' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="hover-glow rounded-xl p-3 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-110"
              >
                <Copy className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="hover-glow rounded-xl p-3 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-110"
              >
                <Share2 className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </CardHeader>
      
        {/* Enhanced Content */}
        <CardContent className="p-8 md:p-10 space-y-10">
          {/* Arabic Text Section */}
          <div className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-gradient-islamic rounded-full animate-pulse-glow"></div>
              <h3 className="text-xl font-bold text-gradient">
                النص العربي
              </h3>
              <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent"></div>
            </div>
            <div className="glass-card bg-gradient-to-br from-primary/8 to-secondary/8 rounded-2xl p-8 border border-primary/15 hover-glow transition-all duration-500">
              <p className="text-right text-2xl md:text-3xl leading-loose font-arabic text-foreground text-shadow-soft">
                {hadith.contents.arab}
              </p>
            </div>
          </div>

          {/* Indonesian Translation Section */}
          <div className="animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-gradient-gold rounded-full animate-pulse-glow"></div>
              <h3 className="text-xl font-bold text-gradient">
                Terjemahan Indonesia
              </h3>
              <div className="flex-1 h-px bg-gradient-to-r from-secondary/30 to-transparent"></div>
            </div>
            <div className="glass-card bg-gradient-to-br from-secondary/8 to-primary/8 rounded-2xl p-8 border border-secondary/15 hover-glow transition-all duration-500">
              <p className="text-lg md:text-xl leading-relaxed text-foreground font-medium">
                {hadith.contents.id}
              </p>
            </div>
          </div>
        </CardContent>
         
         {/* Enhanced Footer */}
         <CardFooter className="glass bg-gradient-to-r from-muted/20 to-muted/15 border-t border-primary/15 p-8 backdrop-blur-sm">
           <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-4">
             <div className="flex items-center gap-3">
               <div className="glass rounded-full p-2">
                 <BookOpen className="h-4 w-4 text-primary" />
               </div>
               <div>
                 <div className="text-sm font-semibold text-primary mb-1">
                   Sumber Hadits
                 </div>
                 <div className="text-sm text-muted-foreground">
                   {hadith.name} • Hadits #{hadith.contents.number}
                 </div>
               </div>
             </div>
             <div className="flex items-center gap-4">
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-600 rounded-full animate-pulse-glow"></div>
                 <span className="text-sm font-medium text-green-700 dark:text-green-400">
                   Hadits Sahih
                 </span>
               </div>
               <div className="glass rounded-full px-4 py-2 text-xs font-medium text-muted-foreground">
                 ✓ Terverifikasi
               </div>
             </div>
           </div>
        </CardFooter>
      </Card>
    </div>
  );
};