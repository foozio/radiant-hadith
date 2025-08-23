import { useState } from "react";
import { BookOpen, Copy, Share2, Heart } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
      title: "Hadith copied",
      description: "The hadith has been copied to your clipboard.",
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
    <Card className="max-w-4xl mx-auto bg-card/95 backdrop-blur-sm border-primary/10 shadow-islamic">
      <CardHeader className="border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-gold rounded-lg shadow-soft">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-card-foreground">
                {hadith.name}
              </h3>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-secondary/80">
                  Hadith #{hadith.contents.number}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFavorited(!isFavorited)}
              className={`${isFavorited ? 'bg-accent text-accent-foreground' : ''} border-primary/20`}
            >
              <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="border-primary/20 hover:bg-primary/5"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="border-primary/20 hover:bg-primary/5"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-8">
        {/* Arabic text */}
        <div className="mb-8 p-6 bg-gradient-to-br from-secondary/30 to-accent/20 rounded-xl border border-primary/10">
          <p className="arabic text-2xl md:text-3xl leading-relaxed text-card-foreground">
            {hadith.contents.arab}
          </p>
        </div>
        
        {/* Translation */}
        <div className="prose prose-lg max-w-none">
          <p className="hadith-text text-card-foreground leading-relaxed">
            {hadith.contents.id}
          </p>
        </div>
        
        {/* Source attribution */}
        <div className="mt-8 pt-6 border-t border-border/50">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              <span className="font-medium">{hadith.name}</span> • 
              <span className="ml-1">Hadith #{hadith.contents.number}</span>
            </div>
            <div className="text-xs">
              Source: api.hadith.gading.dev
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};