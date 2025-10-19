
import { GoogleGenAI, Type } from '@google/genai';
import { AdCopy, ToneOfVoice, Language, WebsiteAnalysis } from '../types';
import { HEADLINE_MAX_LENGTH, DESCRIPTION_MAX_LENGTH } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    headlines: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
        description: `Ad headline, maximum ${HEADLINE_MAX_LENGTH} characters.`,
      },
    },
    descriptions: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
        description: `Ad description, maximum ${DESCRIPTION_MAX_LENGTH} characters.`,
      },
    },
  },
  required: ['headlines', 'descriptions'],
};

export async function generateAdCopy(
  productName: string,
  targetAudience: string,
  keywords: string,
  tone: ToneOfVoice,
  language: Language
): Promise<AdCopy> {
  const prompt = `
    Generate high-performing Google Ads copy in ${language}.

    Product or Service: ${productName}
    Target Audience: ${targetAudience}
    Keywords to include: ${keywords}
    Tone of Voice: ${tone}
    Language: ${language}

    Strictly follow these rules:
    1. Generate exactly 3 unique headlines.
    2. Each headline MUST be ${HEADLINE_MAX_LENGTH} characters or less.
    3. Generate exactly 2 unique descriptions.
    4. Each description MUST be ${DESCRIPTION_MAX_LENGTH} characters or less.
    5. Ensure the copy is compliant, conversion-focused, and tailored to the specified tone and audience. Try to naturally include the provided keywords.
    6. Return the result in the specified JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      },
    });

    const jsonString = response.text.trim();
    const parsedJson = JSON.parse(jsonString);

    if (
      !parsedJson.headlines ||
      !parsedJson.descriptions ||
      !Array.isArray(parsedJson.headlines) ||
      !Array.isArray(parsedJson.descriptions)
    ) {
      throw new Error('Invalid JSON structure received from API.');
    }

    return parsedJson as AdCopy;
  } catch (error) {
    console.error('Error generating ad copy:', error);
    throw new Error(
      'Failed to generate ad copy. The model may have returned an unexpected format.'
    );
  }
}

export async function analyzeWebsite(url: string): Promise<WebsiteAnalysis> {
  const prompt = `
    Analyze the main content of the website at the URL "${url}" to understand its core business, offerings, and intended audience.

    Based on this analysis, extract the following three pieces of information:
    1.  **Product or Service Name:** A concise name for the primary product or service offered (e.g., "Handcrafted Leather Wallets", "AI-Powered SEO Tool").
    2.  **Target Audience:** A brief description of the ideal customer (e.g., "Eco-conscious millennials", "Small business owners, digital marketers").
    3.  **Keywords:** The top 5-7 most relevant SEO and marketing keywords for a Google Ads campaign, returned as a single comma-separated string (e.g., "sustainable wallets, minimalist leather goods, eco-friendly gifts").

    Return ONLY a single, minified JSON object with the exact keys "productName", "targetAudience", and "keywords".
    Do not add any other text, explanation, or formatting like markdown backticks.
    Example valid response:
    {"productName":"Artisan Coffee Beans","targetAudience":"Coffee connoisseurs, home baristas","keywords":"specialty coffee, single-origin beans, fresh roasted coffee, gourmet coffee"}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const jsonString = response.text.trim();
    // It's possible the model wraps the JSON in markdown backticks, so let's clean it up.
    const cleanedJsonString = jsonString.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    const parsedJson = JSON.parse(cleanedJsonString);

    if (
      typeof parsedJson.productName !== 'string' ||
      typeof parsedJson.targetAudience !== 'string' ||
      typeof parsedJson.keywords !== 'string'
    ) {
      throw new Error('Invalid JSON structure or types received from the model.');
    }

    return parsedJson as WebsiteAnalysis;
  } catch (error) {
    console.error('Error analyzing website:', error);
    throw new Error('Failed to analyze website. The URL may be inaccessible or the content could not be processed into the required format.');
  }
}
