import { useState, useEffect } from 'react';

interface HadithBook {
  name: string;
  id: string;
  available: number;
}

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

interface HadithContent {
  number: number;
  arab: string;
  id: string;
}

interface HadithRangeResponse {
  name: string;
  id: string;
  available: number;
  contents: HadithContent[];
}

interface APIResponse<T> {
  code: number;
  message: string;
  data: T;
  error: boolean;
}

const BASE_URL = 'https://api.hadith.gading.dev';

export const useHadithBooks = () => {
  const [books, setBooks] = useState<HadithBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${BASE_URL}/books`);
        const data: APIResponse<HadithBook[]> = await response.json();
        
        if (data.error) {
          throw new Error(data.message);
        }
        
        setBooks(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal mengambil daftar kitab');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return { books, loading, error };
};

export const useHadith = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHadith = async (bookId: string, number: number): Promise<HadithData | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${BASE_URL}/books/${bookId}/${number}`);
      const data: APIResponse<HadithData> = await response.json();
      
      if (data.error) {
        throw new Error(data.message);
      }
      
      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal mengambil hadits';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchHadithRange = async (bookId: string, start: number, end: number): Promise<HadithData[] | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${BASE_URL}/books/${bookId}?range=${start}-${end}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📡 API Response for range:', data);
      
      // Check if API returned an error
      if (data.error) {
        throw new Error(data.message || 'API returned an error');
      }
      
      // The correct structure: data.data.hadiths
      if (data.data && data.data.hadiths && Array.isArray(data.data.hadiths)) {
        const hadithArray: HadithData[] = data.data.hadiths.map((hadith: HadithContent) => ({
          name: data.data.name,
          id: data.data.id,
          available: data.data.available,
          contents: hadith
        }));
        console.log(`📖 Parsed ${hadithArray.length} hadith from API response`);
        return hadithArray;
      }
      
      // Fallback: API returns array directly for range queries
      if (Array.isArray(data)) {
        return data as HadithData[];
      }
      
      // Fallback: if it's wrapped in data property as array
      if (data.data && Array.isArray(data.data)) {
        return data.data as HadithData[];
      }
      
      // Legacy fallback: if it has contents property
      if (data.contents && Array.isArray(data.contents)) {
        const hadithArray: HadithData[] = data.contents.map((content: HadithContent) => ({
          name: data.name,
          id: data.id,
          available: data.available,
          contents: content
        }));
        return hadithArray;
      }
      
      console.warn('Unexpected API response format:', data);
      return [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal mengambil rentang hadits';
      console.error('fetchHadithRange error:', err);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchHadith, fetchHadithRange, loading, error };
};