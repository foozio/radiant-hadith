import { useState, useEffect } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HadithHero } from "@/components/HadithHero";
import { HadithBook } from "@/components/HadithBook";
import { HadithDisplay } from "@/components/HadithDisplay";
import { SearchResults } from "@/components/SearchResults";
import { useHadithBooks, useHadith } from "@/hooks/useHadithAPI";
import { useHadithSearch } from "@/hooks/useHadithSearch";
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
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const { books, loading: booksLoading, error: booksError } = useHadithBooks();
  const { fetchHadith, fetchHadithWithRetry, loading: hadithLoading, error: hadithError } = useHadith();
  const { searchState, searchHadith, clearSearch, getPaginatedResults } = useHadithSearch();
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

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setViewMode('search');
    setCurrentPage(1);
    
    // Perform the actual search
    await searchHadith(query, books, selectedBook);
  };

  const handleBrowseBooks = () => {
    setViewMode('books');
  };

  const handleSelectBook = async (bookId: string) => {
    // Use retry mechanism to find a working hadith
    const hadith = await fetchHadithWithRetry(bookId, 10);
    
    if (hadith) {
      setSelectedHadith(hadith);
      setViewMode('hadith');
    }
    // Error handling is already done in the hook
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
              Kembali
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
                  Koleksi Hadits
                </h2>
                <p className="text-xl text-muted-foreground">
                  Jelajahi hadits autentik dari ulama terkemuka
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
                  <span className="ml-2 text-lg text-muted-foreground">Mencari hadith yang tersedia...</span>
                </div>
              ) : (
                <HadithDisplay hadith={selectedHadith} />
              )}
            </div>
          </section>
        )}

        {viewMode === 'search' && (
          <section className="py-12">
            <SearchResults
              searchQuery={searchQuery}
              searchResults={searchState.results}
              loading={searchState.loading}
              error={searchState.error}
              books={books}
              selectedBook={selectedBook}
              currentPage={currentPage}
              totalPages={Math.ceil(searchState.results.length / 10)}
              onSearch={handleSearch}
              onFilterByBook={(bookId) => {
                setSelectedBook(bookId);
                setCurrentPage(1);
                if (searchQuery) {
                  searchHadith(searchQuery, books, bookId);
                }
              }}
              onPageChange={(page) => setCurrentPage(page)}
              onSelectHadith={(hadith) => {
                setSelectedHadith(hadith);
                setViewMode('hadith');
              }}
            />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-muted/30 border-t border-border/50 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="mb-4">
            <a
              href="/changelog"
              className="text-primary hover:text-primary/80 transition-colors text-sm font-medium"
            >
              Changelog
            </a>
          </div>
          <p className="text-muted-foreground">
            Data koleksi hadits diambil dari{' '}
            <a
              href="https://github.com/gadingnst/hadith-api"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              API Hadits
            </a>
            {' '}oleh{' '}
            <a
              href="https://www.linkedin.com/in/gadingnst/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              Sutan Gading Fadhillah Nasution
            </a>
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Dibangun oleh{' '}
            <a
              href="https://www.linkedin.com/in/nuzlilatief"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              Nuzli L. Hernawan
            </a>
            {' '}untuk Komunitas Muslim Indonesia
          </p>
        </div>
      </footer>
    </div>
  );
};