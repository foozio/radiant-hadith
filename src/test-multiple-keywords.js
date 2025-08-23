// Test script untuk menguji berbagai kata kunci pencarian
const testMultipleKeywords = async () => {
  console.log('=== Testing Multiple Keywords ===');
  
  const keywords = [
    'niat',
    'sholat', 
    'puasa',
    'zakat',
    'haji',
    'iman',
    'islam',
    'allah',
    'rasul',
    'perbuatan'
  ];
  
  try {
    // Fetch sample data
    const response = await fetch('https://api.hadith.gading.dev/books/bukhari?range=1-20');
    const data = await response.json();
    
    if (!data.data?.hadiths) {
      console.error('❌ No hadith data found');
      return;
    }
    
    // Parse hadith data
    const hadithArray = data.data.hadiths.map((hadith) => ({
      name: data.data.name,
      id: data.data.id,
      available: data.data.available,
      contents: hadith
    }));
    
    console.log(`Testing with ${hadithArray.length} hadith entries\n`);
    
    // Test normalization and matching functions
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
    
    // Test each keyword
    const results = {};
    
    for (const keyword of keywords) {
      console.log(`🔍 Testing keyword: "${keyword}"`);
      let foundCount = 0;
      const matches = [];
      
      hadithArray.forEach((hadith) => {
        // Test Indonesian text
        const indonesianMatch = hadith.contents.id ? matchesQuery(hadith.contents.id, keyword) : false;
        // Test Arabic text  
        const arabicMatch = hadith.contents.arab ? matchesQuery(hadith.contents.arab, keyword) : false;
        
        if (indonesianMatch || arabicMatch) {
          foundCount++;
          matches.push({
            number: hadith.contents.number,
            indonesianMatch,
            arabicMatch
          });
        }
      });
      
      results[keyword] = {
        count: foundCount,
        matches: matches.slice(0, 3) // Show first 3 matches
      };
      
      if (foundCount > 0) {
        console.log(`   ✅ Found ${foundCount} matches`);
        matches.slice(0, 2).forEach(match => {
          console.log(`      - Hadith #${match.number} (ID: ${match.indonesianMatch}, AR: ${match.arabicMatch})`);
        });
      } else {
        console.log(`   ❌ No matches found`);
      }
      console.log('');
    }
    
    // Summary
    console.log('=== SUMMARY ===');
    const totalKeywords = keywords.length;
    const successfulKeywords = Object.values(results).filter(r => r.count > 0).length;
    
    console.log(`Total keywords tested: ${totalKeywords}`);
    console.log(`Keywords with matches: ${successfulKeywords}`);
    console.log(`Success rate: ${((successfulKeywords / totalKeywords) * 100).toFixed(1)}%`);
    
    if (successfulKeywords > 0) {
      console.log('\n✅ Search functionality is working for Indonesian keywords!');
    } else {
      console.log('\n❌ Search functionality needs more investigation.');
    }
    
  } catch (error) {
    console.error('❌ Error testing multiple keywords:', error);
  }
};

// Run the test
testMultipleKeywords().catch(console.error);