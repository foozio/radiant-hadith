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

  const fetchHadithWithRetry = async (bookId: string, maxRetries: number = 10): Promise<HadithData | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // Use reasonable default range for hadith numbers based on common collections
      const maxHadithByBook: { [key: string]: number } = {
        'bukhari': 7563,
        'muslim': 7563,
        'abudawud': 5274,
        'tirmidzi': 3956,
        'nasai': 5761,
        'ibnumajah': 4341,
        'ahmad': 26363,
        'darimi': 3367,
        'malik': 1594
      };
      
      const maxHadith = maxHadithByBook[bookId] || 500; // Default fallback
      console.log(`📚 Mencari hadith dari kitab ${bookId} (maksimal: ${maxHadith})`);
      
      // Try multiple random hadith until we find one that works
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const randomNumber = Math.floor(Math.random() * Math.min(maxHadith, 1000)) + 1;
          console.log(`🔄 Mencoba hadith #${randomNumber} (percobaan ${attempt + 1}/${maxRetries})`);
          
          const response = await fetch(`${BASE_URL}/books/${bookId}/${randomNumber}`);
          
          if (!response.ok) {
            console.log(`❌ HTTP error ${response.status} untuk hadith #${randomNumber}`);
            continue; // Try next hadith
          }
          
          const data: APIResponse<HadithData> = await response.json();
          
          if (data.error) {
            console.log(`❌ API error untuk hadith #${randomNumber}: ${data.message}`);
            continue; // Try next hadith
          }
          
          if (data.data && data.data.contents && data.data.contents.arab && data.data.contents.id) {
            console.log(`✅ Berhasil memuat hadith #${randomNumber} dari ${data.data.name}`);
            return data.data;
          }
          
          console.log(`❌ Data tidak lengkap untuk hadith #${randomNumber}`);
        } catch (err) {
          console.log(`❌ Error pada percobaan ${attempt + 1}:`, err instanceof Error ? err.message : 'Unknown error');
          continue; // Try next hadith
        }
        
        // Add small delay between retries to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      // If all retries failed
      throw new Error(`Tidak dapat memuat hadith setelah ${maxRetries} percobaan. Silakan coba lagi nanti.`);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal mengambil hadith';
      console.error('fetchHadithWithRetry error:', err);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchHadith, fetchHadithRange, fetchHadithWithRetry, loading, error };
};