import { useState, useCallback, useMemo } from 'react';
import { useHadith } from './useHadithAPI';

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

interface SearchState {
  results: HadithData[];
  loading: boolean;
  error: string | null;
  totalResults: number;
  searchPerformed: boolean;
}

const BATCH_SIZE = 50; // Number of hadith to fetch per batch
const MAX_HADITH_PER_BOOK = 200; // Limit to prevent excessive API calls

export const useHadithSearch = () => {
  const [searchState, setSearchState] = useState<SearchState>({
    results: [],
    loading: false,
    error: null,
    totalResults: 0,
    searchPerformed: false
  });

  const { fetchHadithRange } = useHadith();

  // Function to normalize text for searching (remove diacritics, normalize spaces)
  const normalizeText = useCallback((text: string): string => {
    return text
      .toLowerCase()
      .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '') // Remove Arabic diacritics
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();
  }, []);

  // Function to check if text matches query
  const matchesQuery = useCallback((text: string, query: string): boolean => {
    if (!text || !query) return false;
    
    const normalizedText = normalizeText(text);
    const normalizedQuery = normalizeText(query);
    
    // Debug logging for "niat" search
    if (query.toLowerCase().includes('niat')) {
      console.log('🔍 Debug search for "niat":');
      console.log('  Original text:', text.substring(0, 100) + '...');
      console.log('  Normalized text:', normalizedText.substring(0, 100) + '...');
      console.log('  Query:', query);
      console.log('  Normalized query:', normalizedQuery);
    }
    
    // Split query into words for better matching
    const queryWords = normalizedQuery.split(' ').filter(word => word.length > 0);
    
    // Check if all query words are found in the text
    const matches = queryWords.every(word => {
      const found = normalizedText.includes(word);
      if (query.toLowerCase().includes('niat') && word === 'niat') {
        console.log(`  Checking word "${word}" in text: ${found}`);
        if (found) {
          const index = normalizedText.indexOf(word);
          console.log(`  Found "${word}" at position ${index}`);
          console.log(`  Context: "${normalizedText.substring(Math.max(0, index-20), index+20)}"`);
        }
      }
      return found;
    });
    
    if (query.toLowerCase().includes('niat')) {
      console.log('  Final match result:', matches);
    }
    
    return matches;
  }, [normalizeText]);

  // Function to fetch hadith from a specific book
  const fetchHadithFromBook = useCallback(async (
    book: HadithBook,
    query: string,
    signal: AbortSignal
  ): Promise<HadithData[]> => {
    const results: HadithData[] = [];
    const maxHadith = Math.min(book.available, MAX_HADITH_PER_BOOK);
    
    // Fetch hadith in batches
    for (let start = 1; start <= maxHadith; start += BATCH_SIZE) {
      if (signal.aborted) {
        throw new Error('Search cancelled');
      }

      const end = Math.min(start + BATCH_SIZE - 1, maxHadith);
      
      try {
        console.log(`📖 Fetching hadith ${start}-${end} from ${book.id}`);
        const hadithBatch = await fetchHadithRange(book.id, start, end);
        console.log(`📖 Received ${hadithBatch?.length || 0} hadith from API`);
        
        if (hadithBatch) {
          // Filter hadith that match the query
          const matchingHadith = hadithBatch.filter(hadith => {
            const arabicMatch = matchesQuery(hadith.contents.arab, query);
            const translationMatch = hadith.contents.id ? matchesQuery(hadith.contents.id, query) : false;
            const matches = arabicMatch || translationMatch;
            if (matches) {
              console.log(`✨ Found match in hadith #${hadith.contents.number}`);
            }
            return matches;
          });
          
          console.log(`🎯 ${matchingHadith.length} hadith matched query in batch ${start}-${end}`);
          results.push(...matchingHadith);
        }
        
        // Add a small delay to prevent overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.warn(`Failed to fetch hadith batch ${start}-${end} from ${book.name}:`, error);
        // Continue with next batch instead of failing completely
      }
    }
    
    return results;
  }, [fetchHadithRange, matchesQuery]);

  // Main search function
  const searchHadith = useCallback(async (
    query: string,
    books: HadithBook[],
    selectedBookId?: string | null
  ) => {
    console.log('🔍 Starting search with query:', query, 'books:', books.length, 'selectedBook:', selectedBookId);
    
    if (!query.trim()) {
      setSearchState({
        results: [],
        loading: false,
        error: null,
        totalResults: 0,
        searchPerformed: false
      });
      return;
    }

    setSearchState(prev => ({
      ...prev,
      loading: true,
      error: null,
      searchPerformed: true
    }));

    const abortController = new AbortController();
    
    try {
      // Filter books based on selection
      const booksToSearch = selectedBookId 
        ? books.filter(book => book.id === selectedBookId)
        : books;

      console.log('📚 Books to search:', booksToSearch.map(b => b.name));

      if (booksToSearch.length === 0) {
        throw new Error('No books available for search');
      }

      const allResults: HadithData[] = [];
      
      // Search through each book
      for (const book of booksToSearch) {
        if (abortController.signal.aborted) break;
        
        try {
          console.log(`🔍 Searching in ${book.name}...`);
          const bookResults = await fetchHadithFromBook(book, query, abortController.signal);
          console.log(`✅ Found ${bookResults.length} results in ${book.name}`);
          allResults.push(...bookResults);
        } catch (error) {
          if (error instanceof Error && error.message === 'Search cancelled') {
            break;
          }
          console.warn(`❌ Failed to search in ${book.name}:`, error);
          // Continue with other books
        }
      }

      // Sort results by book name and hadith number
      allResults.sort((a, b) => {
        if (a.name !== b.name) {
          return a.name.localeCompare(b.name);
        }
        return a.contents.number - b.contents.number;
      });

      console.log('🎉 Search completed! Total results:', allResults.length);
      
      setSearchState({
        results: allResults,
        loading: false,
        error: null,
        totalResults: allResults.length,
        searchPerformed: true
      });

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Pencarian dibatalkan');
        return;
      }
      console.error('Kesalahan pencarian:', error);
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan saat mencari';
      setSearchState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
    }

    // Cleanup function
    return () => {
      abortController.abort();
    };
  }, [fetchHadithFromBook]);

  // Function to clear search results
  const clearSearch = useCallback(() => {
    setSearchState({
      results: [],
      loading: false,
      error: null,
      totalResults: 0,
      searchPerformed: false
    });
  }, []);

  // Memoized pagination helper
  const getPaginatedResults = useCallback((page: number, itemsPerPage: number = 10) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedResults = searchState.results.slice(startIndex, endIndex);
    const totalPages = Math.ceil(searchState.results.length / itemsPerPage);
    
    return {
      results: paginatedResults,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    };
  }, [searchState.results]);

  return {
    searchState,
    searchHadith,
    clearSearch,
    getPaginatedResults,
    isSearching: searchState.loading
  };
};