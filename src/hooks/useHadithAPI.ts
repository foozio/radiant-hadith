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
      const data: APIResponse<{ hadiths: HadithData[] }> = await response.json();
      
      if (data.error) {
        throw new Error(data.message);
      }
      
      return data.data.hadiths || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal mengambil rentang hadits';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchHadith, fetchHadithRange, loading, error };
};