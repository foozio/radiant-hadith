import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

// Book Collection Loading Skeleton
export const BookCollectionSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header Skeleton */}
      <div className="text-center mb-12 animate-fade-in">
        <Skeleton className="h-12 w-80 mx-auto mb-4 bg-gradient-to-r from-primary/10 to-secondary/10" />
        <Skeleton className="h-6 w-96 mx-auto bg-muted/50" />
      </div>

      {/* Books Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="glass-card bg-gradient-card border-primary/10 animate-fade-in-scale" style={{animationDelay: `${index * 0.1}s`}}>
            <CardHeader className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Skeleton className="h-12 w-12 rounded-full bg-gradient-islamic/20" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-6 w-32 bg-primary/20" />
                  <Skeleton className="h-4 w-24 bg-muted/50" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-20 bg-secondary/20" />
                  <Skeleton className="h-5 w-16 bg-muted/50" />
                </div>
                <Skeleton className="h-2 w-full bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full" />
                <Skeleton className="h-10 w-full bg-gradient-islamic/10 rounded-xl" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Hadith Display Loading Skeleton
export const HadithDisplaySkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-fade-in">
      <Card className="glass-card bg-gradient-card border-primary/20 shadow-glass">
        <CardHeader className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-3 flex-1">
              <Skeleton className="h-8 w-64 bg-gradient-islamic/20" />
              <div className="flex gap-3">
                <Skeleton className="h-6 w-20 bg-primary/20 rounded-full" />
                <Skeleton className="h-6 w-24 bg-secondary/20 rounded-full" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-10 rounded-full bg-muted/50" />
              <Skeleton className="h-10 w-10 rounded-full bg-muted/50" />
              <Skeleton className="h-10 w-10 rounded-full bg-muted/50" />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-8 pt-0">
          {/* Arabic Text Skeleton */}
          <div className="glass rounded-2xl p-8 bg-background/40 border border-primary/10 mb-6">
            <div className="space-y-4 text-right">
              <Skeleton className="h-8 w-full bg-gradient-to-l from-primary/20 to-transparent" />
              <Skeleton className="h-8 w-5/6 ml-auto bg-gradient-to-l from-primary/15 to-transparent" />
              <Skeleton className="h-8 w-4/5 ml-auto bg-gradient-to-l from-primary/10 to-transparent" />
              <Skeleton className="h-8 w-full bg-gradient-to-l from-primary/20 to-transparent" />
            </div>
          </div>
          
          {/* Translation Skeleton */}
          <div className="glass rounded-2xl p-8 bg-background/30 border border-primary/5">
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="h-4 w-1 bg-gradient-gold" />
              <Skeleton className="h-4 w-24 bg-muted/50" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-6 w-full bg-muted/30" />
              <Skeleton className="h-6 w-5/6 bg-muted/25" />
              <Skeleton className="h-6 w-4/5 bg-muted/20" />
            </div>
          </div>
          
          {/* Footer Skeleton */}
          <div className="flex justify-center mt-8">
            <Skeleton className="h-1 w-8 bg-gradient-islamic/50 rounded-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Search Results Loading Skeleton
export const SearchResultsSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8 animate-fade-in">
      {/* Search Header Skeleton */}
      <div className="mb-10 text-center">
        <Skeleton className="h-12 w-80 mx-auto mb-4 bg-gradient-islamic/20" />
        <Skeleton className="h-6 w-96 mx-auto mb-8 bg-muted/50" />
        
        {/* Search Form Skeleton */}
        <div className="glass-card bg-background/60 rounded-3xl p-8 border border-primary/10 max-w-4xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <Skeleton className="h-14 flex-1 bg-background/80 rounded-xl" />
            <Skeleton className="h-14 w-32 bg-gradient-islamic/20 rounded-xl" />
          </div>
        </div>
        
        {/* Filter Skeleton */}
        <div className="glass-card bg-background/40 rounded-2xl p-6 border border-primary/5 max-w-md mx-auto">
          <Skeleton className="h-12 w-full bg-background/80 rounded-xl" />
        </div>
      </div>
      
      {/* Results Skeleton */}
      <div className="space-y-8">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="glass-card bg-gradient-card border-primary/20 shadow-glass animate-fade-in-scale" style={{animationDelay: `${index * 0.1}s`}}>
            <CardContent className="p-8">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-2 bg-gradient-islamic rounded-full" />
                    <Skeleton className="h-8 w-48 bg-gradient-islamic/20" />
                  </div>
                  <div className="flex gap-3">
                    <Skeleton className="h-6 w-20 bg-primary/20 rounded-full" />
                    <Skeleton className="h-6 w-24 bg-secondary/20 rounded-full" />
                  </div>
                </div>
                <Skeleton className="h-12 w-12 rounded-full bg-gradient-islamic/20" />
              </div>
              
              {/* Arabic Text */}
              <div className="glass rounded-2xl p-6 bg-background/40 border border-primary/10 mb-6">
                <div className="space-y-3 text-right">
                  <Skeleton className="h-6 w-full bg-gradient-to-l from-primary/20 to-transparent" />
                  <Skeleton className="h-6 w-5/6 ml-auto bg-gradient-to-l from-primary/15 to-transparent" />
                  <Skeleton className="h-6 w-4/5 ml-auto bg-gradient-to-l from-primary/10 to-transparent" />
                </div>
              </div>
              
              {/* Translation */}
              <div className="glass rounded-2xl p-6 bg-background/30 border border-primary/5">
                <div className="flex items-center gap-2 mb-3">
                  <Skeleton className="h-4 w-1 bg-gradient-gold" />
                  <Skeleton className="h-4 w-20 bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-full bg-muted/30" />
                  <Skeleton className="h-5 w-4/5 bg-muted/25" />
                </div>
              </div>
              
              {/* Footer */}
              <div className="flex justify-center mt-6">
                <Skeleton className="h-1 w-8 bg-gradient-islamic/50 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Enhanced Loading Component with Islamic Theme
export const IslamicLoader = ({ message = "Loading...", arabicMessage = "جاري التحميل..." }) => {
  return (
    <div className="flex justify-center items-center py-16">
      <div className="glass-card bg-background/80 rounded-3xl p-12 shadow-glow max-w-md mx-auto">
        <div className="flex flex-col items-center space-y-6">
          {/* Animated Islamic Pattern */}
          <div className="relative">
            <div className="w-20 h-20 border-4 border-primary/20 rounded-full animate-spin">
              <div className="absolute inset-2 border-4 border-primary border-t-transparent rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1s'}}></div>
              <div className="absolute inset-4 w-12 h-12 bg-gradient-islamic rounded-full animate-pulse-glow flex items-center justify-center">
                <div className="w-6 h-6 bg-primary-foreground rounded-full opacity-80"></div>
              </div>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce"></div>
          </div>
          
          {/* Loading Text */}
          <div className="text-center space-y-2">
            <p className="text-xl font-bold text-gradient animate-pulse-glow">{arabicMessage}</p>
            <p className="text-muted-foreground font-medium">{message}</p>
          </div>
          
          {/* Progress Dots */}
          <div className="flex space-x-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div 
                key={i} 
                className="w-3 h-3 bg-primary rounded-full animate-bounce" 
                style={{animationDelay: `${i * 0.2}s`}}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};