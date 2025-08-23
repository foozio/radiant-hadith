// Test script untuk memverifikasi perbaikan pencarian
const testSearchFix = async () => {
  console.log('=== Testing Search Fix ===');
  
  try {
    // Test API call dengan struktur yang benar
    const response = await fetch('https://api.hadith.gading.dev/books/bukhari?range=1-5');
    const data = await response.json();
    
    console.log('API Response structure:');
    console.log('- error:', data.error);
    console.log('- message:', data.message);
    console.log('- data.hadiths length:', data.data?.hadiths?.length || 0);
    
    if (data.data?.hadiths) {
      // Simulate the fixed parsing logic
      const hadithArray = data.data.hadiths.map((hadith) => ({
        name: data.data.name,
        id: data.data.id,
        available: data.data.available,
        contents: hadith
      }));
      
      console.log(`\nParsed ${hadithArray.length} hadith successfully`);
      
      // Test normalization and matching (same as useHadithSearch.ts)
      const normalizeText = (text) => {
        if (!text) return '';
        return text
          .toLowerCase()
          .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '') // Remove Arabic diacritics
          .replace(/\s+/g, ' ') // Normalize spaces
          .trim();
      };

      const matchesQuery = (text, query) => {
        if (!text || !query) return false;
        
        const normalizedText = normalizeText(text);
        const normalizedQuery = normalizeText(query);
        
        // Split query into words for better matching
        const queryWords = normalizedQuery.split(' ').filter(word => word.length > 0);
        
        // Check if all query words are found in the text
        return queryWords.every(word => normalizedText.includes(word));
      };
      
      // Test search for "niat"
      console.log('\n=== Testing search for "niat" ===');
      const searchQuery = 'niat';
      let foundCount = 0;
      
      hadithArray.forEach((hadith, index) => {
        // Test Indonesian text
        const indonesianMatch = hadith.contents.id ? matchesQuery(hadith.contents.id, searchQuery) : false;
        // Test Arabic text
        const arabicMatch = hadith.contents.arab ? matchesQuery(hadith.contents.arab, searchQuery) : false;
        
        const matches = indonesianMatch || arabicMatch;
        
        if (matches) {
          foundCount++;
          console.log(`✅ Found match in hadith #${hadith.contents.number}`);
          console.log(`   Indonesian match: ${indonesianMatch}`);
          console.log(`   Arabic match: ${arabicMatch}`);
          if (indonesianMatch) {
            const text = hadith.contents.id;
            const normalizedText = normalizeText(text);
            const index = normalizedText.indexOf('niat');
            if (index !== -1) {
              const context = normalizedText.substring(Math.max(0, index - 30), index + 30);
              console.log(`   Context: "${context}"`);
            }
          }
        }
      });
      
      console.log(`\n🎯 Total matches found: ${foundCount}`);
      
      if (foundCount > 0) {
        console.log('\n✅ SUCCESS: Search function is working correctly!');
      } else {
        console.log('\n❌ ISSUE: No matches found, there might still be a problem.');
      }
    }
    
  } catch (error) {
    console.error('❌ Error testing search fix:', error);
  }
};

// Run the test
testSearchFix().catch(console.error);