import { useState, useEffect } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HadithHero } from "@/components/HadithHero";
import { HadithBook } from "@/components/HadithBook";
import { HadithDisplay } from "@/components/HadithDisplay";
import { useHadithBooks, useHadith } from "@/hooks/useHadithAPI";
import { useToast } from "@/hooks/use-toast";

type ViewMode = 'home' | 'books' | 'hadith' | 'search';

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

export const HadithApp = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [selectedHadith, setSelectedHadith] = useState<HadithData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { books, loading: booksLoading, error: booksError } = useHadithBooks();
  const { fetchHadith, loading: hadithLoading, error: hadithError } = useHadith();
  const { toast } = useToast();

  useEffect(() => {
    if (booksError) {
      toast({
        title: "Error loading books",
        description: booksError,
        variant: "destructive",
      });
    }
  }, [booksError, toast]);

  useEffect(() => {
    if (hadithError) {
      toast({
        title: "Error loading hadith",
        description: hadithError,
        variant: "destructive",
      });
    }
  }, [hadithError, toast]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setViewMode('search');
    // For now, just show a message since the API doesn't have search endpoint
    toast({
      title: "Search feature",
      description: "Search functionality will be available in a future update. Please browse collections for now.",
    });
  };

  const handleBrowseBooks = () => {
    setViewMode('books');
  };

  const handleSelectBook = async (bookId: string) => {
    // Fetch a random hadith from the selected book for demonstration
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    const hadith = await fetchHadith(bookId, randomNumber);
    
    if (hadith) {
      setSelectedHadith(hadith);
      setViewMode('hadith');
    }
  };

  const handleBack = () => {
    if (viewMode === 'hadith') {
      setViewMode('books');
      setSelectedHadith(null);
    } else if (viewMode === 'books' || viewMode === 'search') {
      setViewMode('home');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      {viewMode !== 'home' && (
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="text-foreground hover:text-primary"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
        </header>
      )}

      {/* Content */}
      <main>
        {viewMode === 'home' && (
          <HadithHero
            onSearch={handleSearch}
            onBrowseBooks={handleBrowseBooks}
          />
        )}

        {viewMode === 'books' && (
          <section className="py-12 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Hadith Collections
                </h2>
                <p className="text-xl text-muted-foreground">
                  Explore authentic hadith from renowned scholars
                </p>
              </div>

              {booksLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2 text-lg text-muted-foreground">Loading collections...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {books.map((book) => (
                    <HadithBook
                      key={book.id}
                      book={book}
                      onSelect={handleSelectBook}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {viewMode === 'hadith' && selectedHadith && (
          <section className="py-12 px-6">
            <div className="max-w-7xl mx-auto">
              {hadithLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2 text-lg text-muted-foreground">Loading hadith...</span>
                </div>
              ) : (
                <HadithDisplay hadith={selectedHadith} />
              )}
            </div>
          </section>
        )}

        {viewMode === 'search' && (
          <section className="py-12 px-6">
            <div className="max-w-7xl mx-auto text-center">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Search Results
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Searching for: "{searchQuery}"
                </p>
                <div className="bg-card/50 rounded-xl p-8 border border-border/50">
                  <p className="text-muted-foreground">
                    The search functionality is not available in the current API.
                    Please browse through the collections to find specific hadiths.
                  </p>
                  <Button
                    onClick={handleBrowseBooks}
                    className="mt-4"
                  >
                    Browse Collections
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-muted/30 border-t border-border/50 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-muted-foreground">
            Hadith data provided by{' '}
            <a
              href="https://github.com/gadingnst/hadith-api"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              Hadith API
            </a>
            {' '}by Sutan Gading Fadhillah Nasution
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Built with love for the Muslim community
          </p>
        </div>
      </footer>
    </div>
  );
};