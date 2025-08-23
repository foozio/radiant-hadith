// Debug script untuk menguji pencarian hadits
const testSearch = async () => {
  console.log('=== Testing Hadith Search Debug ===');
  
  // Test normalization function (same as in useHadithSearch.ts)
  const normalizeText = (text) => {
    if (!text) return '';
    return text
      .toLowerCase()
      .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '') // Remove Arabic diacritics
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();
  };

  // Test matching function (same as in useHadithSearch.ts)
  const matchesQuery = (text, query) => {
    if (!text || !query) return false;
    
    const normalizedText = normalizeText(text);
    const normalizedQuery = normalizeText(query);
    
    console.log('\n--- Matching Process ---');
    console.log('Original text:', text.substring(0, 200) + '...');
    console.log('Normalized text:', normalizedText.substring(0, 200) + '...');
    console.log('Query:', query);
    console.log('Normalized query:', normalizedQuery);
    
    // Split query into words for better matching
    const queryWords = normalizedQuery.split(' ').filter(word => word.length > 0);
    console.log('Query words:', queryWords);
    
    // Check if all query words are found in the text
    const matches = queryWords.every(word => {
      const found = normalizedText.includes(word);
      console.log(`Word "${word}" found: ${found}`);
      if (found) {
        const index = normalizedText.indexOf(word);
        const context = normalizedText.substring(Math.max(0, index - 30), index + word.length + 30);
        console.log(`Context: "${context}"`);
      }
      return found;
    });
    
    console.log('Final match result:', matches);
    return matches;
  };
  
  // Test with sample Indonesian text from API
  const sampleText = 'Telah menceritakan kepada kami [Al Humaidi Abdullah bin Az Zubair] dia berkata, Telah menceritakan kepada kami [Sufyan] yang berkata, bahwa Telah menceritakan kepada kami [Yahya bin Sa\'id Al Anshari] berkata, telah mengabarkan kepada kami [Muhammad bin Ibrahim At Taimi], bahwa dia pernah mendengar [Alqamah bin Waqash Al Laitsi] berkata; saya pernah mendengar [Umar bin Al Khaththab] diatas mimbar berkata; saya mendengar Rasulullah shallallahu \'alaihi wasallam bersabda: "Semua perbuatan tergantung niatnya, dan (balasan) bagi tiap-tiap orang (tergantung) apa yang diniatkan; Barangsiapa niat hijrahnya karena dunia yang ingin digapainya atau karena seorang perempuan yang ingin dinikahinya, maka hijrahnya adalah kepada apa dia diniatkan"';
  
  console.log('\n=== Testing search for "niat" ===');
  const result1 = matchesQuery(sampleText, 'niat');
  
  console.log('\n=== Testing search for "niatnya" ===');
  const result2 = matchesQuery(sampleText, 'niatnya');
  
  console.log('\n=== Testing search for "perbuatan" ===');
  const result3 = matchesQuery(sampleText, 'perbuatan');
  
  console.log('\n=== Summary ===');
  console.log('"niat" found:', result1);
  console.log('"niatnya" found:', result2);
  console.log('"perbuatan" found:', result3);
};

// Run the test
testSearch().catch(console.error);