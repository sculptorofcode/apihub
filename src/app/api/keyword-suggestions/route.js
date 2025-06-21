import axios from 'axios';

// Function to transform the API response into organized structure
function transformKeywordData(apiResponse, searchQuestion, searchCountry) {
  const { keyword, volume, cpc, avg_monthly_searches, "search-intent": searchIntent, competition_value, Source } = apiResponse;

  if (!keyword || typeof keyword !== 'object') {
    return {
      total_keywords: 0,
      search_question: searchQuestion,
      search_country: searchCountry,
      keywords: []
    };
  }

  const keywords = [];
  const keywordIndices = Object.keys(keyword);

  keywordIndices.forEach(index => {
    const keywordData = {
      keyword: keyword[index] || '',
      volume: volume?.[index] || 0,
      cpc: cpc?.[index] || 0,
      competition_value: competition_value?.[index] || 'UNKNOWN',
      search_intent: searchIntent?.[index] || 'Unknown',
      source: Source?.[index] || 'Google',
      avg_monthly_searches: avg_monthly_searches?.[index] || []
    };

    keywords.push(keywordData);
  });

  // Sort by volume (highest first)
  keywords.sort((a, b) => b.volume - a.volume);

  return {
    total_keywords: keywords.length,
    search_question: searchQuestion,
    search_country: searchCountry,
    keywords: keywords
  };
}

export async function POST(req) {
  try {
    const { search_question, search_country } = await req.json();

    if (!search_question) {
      return new Response(JSON.stringify({ error: 'search_question is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const apiKey = process.env.KEYWORD_SEARCH_API;

    if (!apiKey) {
      console.error('Missing KEYWORD_SEARCH_API in environment variables');
      return new Response(JSON.stringify({ error: 'Missing API key' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const url = 'https://keywordresearch.api.kwrds.ai/keywords-with-volumes';
    
    const data = {
      search_question: search_question,
      search_country: search_country || 'en-US'
    };

    const response = await axios.post(url, data, {
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json'
      }
    });

    // Transform the response data into organized structure
    const organizedData = transformKeywordData(response.data, search_question, search_country || 'en-US');

    return new Response(JSON.stringify(organizedData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fetching keyword suggestions:', error);
    
    if (error.response) {
      // API returned an error response
      return new Response(JSON.stringify({ 
        error: 'Keyword API error', 
        details: error.response.data 
      }), {
        status: error.response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Failed to fetch keyword suggestions' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const search_question = url.searchParams.get('search_question');
    const search_country = url.searchParams.get('search_country');

    if (!search_question) {
      return new Response(JSON.stringify({ error: 'search_question parameter is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const apiKey = process.env.KEYWORD_SEARCH_API;

    if (!apiKey) {
      console.error('Missing KEYWORD_SEARCH_API in environment variables');
      return new Response(JSON.stringify({ error: 'Missing API key' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const apiUrl = 'https://keywordresearch.api.kwrds.ai/keywords-with-volumes';
    
    const data = {
      search_question: search_question,
      search_country: search_country || 'en-US',
      limit : 50
    };

    const response = await axios.post(apiUrl, data, {
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json'
      }
    });

    // Transform the response data into organized structure
    const organizedData = transformKeywordData(response.data, search_question, search_country || 'en-US');

    return new Response(JSON.stringify(organizedData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fetching keyword suggestions:', error);
    
    if (error.response) {
      // API returned an error response
      return new Response(JSON.stringify({ 
        error: 'Keyword API error', 
        details: error.response.data 
      }), {
        status: error.response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Failed to fetch keyword suggestions' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}