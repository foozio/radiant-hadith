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
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Hasil Pencarian
        </h2>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Cari hadits, kata kunci, atau topik..."
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <Button type="submit" className="h-12 px-8">
              <Search className="mr-2 h-4 w-4" />
              Cari
            </Button>
          </div>
        </form>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Filter berdasarkan koleksi:</span>
          </div>
          <Select
            value={selectedBook || "all"}
            onValueChange={(value) => onFilterByBook(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Semua koleksi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua koleksi</SelectItem>
              {books.map((book) => (
                <SelectItem key={book.id} value={book.id}>
                  {book.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Info */}
      {!loading && (
        <div className="mb-6">
          <p className="text-muted-foreground">
            {searchResults.length > 0 ? (
              <>
                Menampilkan {startIndex + 1}-{endIndex} dari {searchResults.length} hasil untuk 
                <span className="font-semibold text-foreground">"{searchQuery}"</span>
                {selectedBook && (
                  <>
                    {" "} dalam{" "}
                    <Badge variant="secondary" className="ml-1">
                      {books.find(b => b.id === selectedBook)?.name}
                    </Badge>
                  </>
                )}
              </>
            ) : searchQuery ? (
              <>Tidak ada hasil ditemukan untuk <span className="font-semibold text-foreground">"{searchQuery}"</span></>
            ) : (
              "Masukkan kata kunci untuk mencari hadits"
            )}
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg text-muted-foreground">Mencari hadits...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 mb-6">
          <p className="text-destructive font-medium">Terjadi kesalahan saat mencari:</p>
          <p className="text-destructive/80 mt-1">{error}</p>
        </div>
      )}

      {/* Search Results */}
      {!loading && !error && currentResults.length > 0 && (
        <div className="space-y-6">
          {currentResults.map((hadith, index) => (
            <Card key={`${hadith.id}-${hadith.contents.number}`} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onSelectHadith(hadith)}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground mb-1">
                      {hadith.name} - Hadits #{hadith.contents.number}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {hadith.id}
                    </Badge>
                  </div>
                </div>
                
                {/* Arabic Text */}
                <div className="mb-4">
                  <p className="text-right text-xl leading-relaxed font-arabic text-foreground" dir="rtl">
                    {highlightText(hadith.contents.arab, searchQuery)}
                  </p>
                </div>
                
                {/* English Translation (if available) */}
                {hadith.contents.id && (
                  <div className="border-t pt-4">
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {highlightText(hadith.contents.id, searchQuery)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && searchResults.length > ITEMS_PER_PAGE && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button
            variant="outline"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Sebelumnya
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
                  className="w-10 h-10"
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
            className="flex items-center gap-2"
          >
            Selanjutnya
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && searchResults.length === 0 && searchQuery && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No results found
            </h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search terms or browse through the collections to find what you're looking for.
            </p>
            <Button onClick={() => onFilterByBook(null)} variant="outline">
              Clear filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};