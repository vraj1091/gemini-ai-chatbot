const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export const callGeminiAPI = async (message) => {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

  console.log('API Call Debug:', {
    hasApiKey: !!apiKey,
    apiKeyLength: apiKey?.length || 0,
    endpoint: API_ENDPOINT
  });

  if (!apiKey) {
    throw new Error('API key not configured');
  }

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: message
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    }
  };

  try {
    console.log('Making API request to:', API_ENDPOINT);

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify(requestBody),
    });

    console.log('API Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);

      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText };
      }

      if (response.status === 400) {
        throw new Error('API key not valid. Please pass a valid API key.');
      } else if (response.status === 403) {
        throw new Error('API access forbidden. Check your API key restrictions.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else {
        throw new Error(`API request failed with status ${response.status}: ${errorData.message || 'Unknown error'}`);
      }
    }

    const data = await response.json();
    console.log('API Response data:', data);

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error('Invalid API response structure:', data);
      throw new Error('Invalid response format from API');
    }

    const content = data.candidates[0].content.parts[0].text;
    console.log('Extracted content:', content);
    return content;

  } catch (error) {
    console.error('API call failed:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    throw error;
  }
};
