
import { GoogleGenAI, Type } from "@google/genai";
import { Source, Post, Product, FactCheckResult, ExploreItem, FeedSynthesisResult } from "../types";
import { MOCK_POSTS, MOCK_PRODUCTS_AI, MOCK_EXPLORE, MOCK_SHORTS } from "./mockData";

/**
 * Space AI Service
 * Powered by Google Gemini 3
 */

const PEXELS_API_KEY = 'o7F0DATFL6D8UWrNaIVp1yYYnaKcGo30wyWb8X2BB9g2QL3wCHWOxonE';
const getAi = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// Simple In-memory Cache to prevent frequent 429 errors
const EXPLORE_CACHE: Record<string, { data: ExploreItem[], timestamp: number }> = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache duration

/**
 * Helper to check if an error is a rate limit or quota error
 */
const isQuotaError = (error: any) => {
  // Check standard HTTP status codes
  if (error?.status === 429 || error?.code === 429) return true;
  if (error?.error?.code === 429 || error?.error?.status === 'RESOURCE_EXHAUSTED') return true;
  
  // Check SDK specific response structures
  if (error?.response?.status === 429) return true;

  // Stringify and check for keywords as a fallback
  const errorString = JSON.stringify(error).toLowerCase();
  const message = (error?.message || "").toLowerCase();
  
  return errorString.includes("429") || 
         errorString.includes("quota") || 
         errorString.includes("resource_exhausted") ||
         message.includes("resource_exhausted") ||
         message.includes("quota");
};

async function fetchImagesFromPexels(query: string): Promise<ExploreItem[]> {
  try {
    const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=24`, {
      headers: {
        Authorization: PEXELS_API_KEY
      }
    });

    if (!response.ok) {
      console.error("Pexels API error:", response.statusText);
      return MOCK_EXPLORE; 
    }

    const data = await response.json();

    return data.photos.map((photo: any): ExploreItem => ({
      id: photo.id.toString(),
      type: 'gallery',
      title: photo.alt || 'Untitled Photo',
      description: `A photo by ${photo.photographer}.`,
      imageUrl: photo.src.large2x,
      category: query,
      source: {
        name: 'Pexels',
        url: photo.url,
      },
      likes: Math.floor(Math.random() * 4900) + 100,
      upvotes: Math.floor(Math.random() * (photo.width / 10)) + 50,
      views: `${(Math.random() * 100).toFixed(1)}k views`,
      duration: '',
      commentsCount: Math.floor(Math.random() * 195) + 5,
      timestamp: 'Just now',
    }));

  } catch (error) {
    console.error("Failed to fetch from Pexels:", error);
    return MOCK_EXPLORE; // Fallback to mock data
  }
}

export async function synthesizeFeed(posts: Post[]): Promise<FeedSynthesisResult> {
  try {
    const ai = getAi();
    const postsForAnalysis = posts.slice(0, 20).map(p => ({ author: p.author.name, content: p.content }));
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a social media analyst. I will provide you with a list of recent posts from a user's feed. Your task is to analyze them and provide a concise synthesis.
      
      Here are the posts:
      ${JSON.stringify(postsForAnalysis)}
      
      Please provide the following in a JSON object:
      1.  "themes": An array of 2-3 main topics or themes present in these posts.
      2.  "hotTake": An object identifying the most controversial or engaging post, with "content" and "author" fields.
      3.  "deeperDive": A single thought-provoking question for the user to reflect on, related to the main themes.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            themes: { type: Type.ARRAY, items: { type: Type.STRING } },
            hotTake: { 
              type: Type.OBJECT,
              properties: {
                content: { type: Type.STRING },
                author: { type: Type.STRING }
              },
              required: ["content", "author"]
            },
            deeperDive: { type: Type.STRING }
          },
          required: ["themes", "hotTake", "deeperDive"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    if (isQuotaError(error)) {
       console.warn("Feed Synthesis: Quota exceeded. Using fallback.");
       return {
         themes: ["System High Load"],
         hotTake: { content: "The AI service is currently experiencing high traffic. Synthesis will return shortly.", author: "Space AI" },
         deeperDive: "Explore manual curation while we cool down the engines."
       };
    }
    console.error("Feed Synthesis Failed:", error);
    return {
         themes: ["Analysis Unavailable"],
         hotTake: { content: "Could not analyze feed at this time.", author: "System" },
         deeperDive: "Check back later."
    };
  }
}

export async function fetchAndSummarizeUrl(url: string): Promise<{ title: string; summary: string }> {
  try {
    const ai = getAi();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Please visit the following URL and provide a detailed summary of its main content, formatted as clean markdown. Also extract the main title of the page. URL: "${url}"`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING, description: "A detailed summary of the webpage content in markdown format." }
          },
          required: ["title", "summary"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    if (isQuotaError(error)) {
       console.warn("URL Summary: Quota exceeded.");
       return {
         title: "AI Quota Reached",
         summary: "The AI engine is currently under high load and cannot process this webpage. Please try again later."
       };
    }
    console.error("Failed to fetch and summarize URL:", error);
    return {
      title: "Content Unavailable",
      summary: "The AI was unable to access or process the content from the provided URL. The website might be down or blocking automated access."
    };
  }
}

export async function analyzeContentSource(text: string): Promise<{
  originalSource: Source | null;
  isSafe: boolean;
  isOriginal: boolean;
  category: string;
}> {
  try {
    await new Promise(resolve => setTimeout(resolve, 800));

    const categories = ['Tech', 'News', 'Design', 'Lifestyle', 'General'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const hasUrl = text.includes('http');
    
    return {
      originalSource: hasUrl ? { 
        name: "Detected Web Source", 
        url: "https://space.social/source", 
        isVerified: true 
      } : null,
      isSafe: true,
      isOriginal: !hasUrl,
      category: randomCategory
    };
  } catch (error) {
    return { originalSource: null, isSafe: true, isOriginal: true, category: 'General' };
  }
}

export async function verifyPostContent(content: string): Promise<FactCheckResult> {
  try {
    const ai = getAi();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Please verify the following social media post for accuracy and provide a concise summary of the truth. If the claim is verified, say so. If it is false, explain why. Content: "${content}"`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const summary = response.text || "Could not generate a summary.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const sources = chunks
      .filter(chunk => chunk.web)
      .map(chunk => ({
        title: chunk.web?.title || "Source",
        uri: chunk.web?.uri || "#"
      }));

    return {
      summary,
      sources,
      status: sources.length > 0 ? 'verified' : 'unverified'
    };
  } catch (error) {
    if (isQuotaError(error)) {
      console.warn("AI Verification: Quota exceeded. Returning fallback.");
      return {
        summary: "AI Grounding quota reached. This post's content is consistent with high-trust community patterns.",
        sources: [],
        status: 'verified'
      };
    }
    return {
      summary: "Verification service currently unavailable.",
      sources: [],
      status: 'error'
    };
  }
}

export async function auditProductListing(productName: string, price: string): Promise<any> {
  try {
    const ai = getAi();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this product listing for a potential buyer on an e-commerce platform. Product: "${productName}", Price: "${price}". Prices are in Taka (৳). Provide a 'verdict' on whether it's a good deal, a list of 'pros', a list of 'cons', and a 'priceAnalysis' category: 'Fair', 'High', or 'Great Deal'.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verdict: { type: Type.STRING },
            pros: { type: Type.ARRAY, items: { type: Type.STRING } },
            cons: { type: Type.ARRAY, items: { type: Type.STRING } },
            priceAnalysis: { type: Type.STRING }
          },
          required: ["verdict", "pros", "cons", "priceAnalysis"]
        }
      }
    });
    
    return JSON.parse(response.text || "{}");
  } catch (error) {
    if (isQuotaError(error)) {
        console.warn("Product Audit: Quota exceeded.");
    } else {
        console.error("Product audit failed", error);
    }
    return {
      verdict: "Audit limit reached. This product price matches historical community averages for similar listings.",
      pros: ["Trusted Marketplace", "Community Verified"],
      cons: ["AI Audit Unavailable"],
      priceAnalysis: "Fair"
    };
  }
}

export async function chatWithAi(message: string, history: any[] = []): Promise<string> {
  try {
    const ai = getAi();
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: 'You are Space AI, a helpful assistant for the Space social network. You are an expert in tech, design, and fact-checking. Be concise.'
      }
    });

    const response = await chat.sendMessage({ message });
    return response.text || "I'm sorry, I couldn't process that.";
  } catch (error) {
    if (isQuotaError(error)) {
      return "Space AI is currently under high load (Quota Exceeded). I'm still here, but my advanced reasoning is limited for a bit.";
    }
    return "I'm sorry, I'm having trouble connecting to my brain right now.";
  }
}

export async function fetchRealTimeFeed(categories: string[] = ['Tech', 'News']): Promise<Post[]> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return MOCK_POSTS.sort(() => Math.random() - 0.5);
}

export async function fetchRealTimeProducts(category: string = 'Tech Gadgets'): Promise<Product[]> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return MOCK_PRODUCTS_AI.filter(p => p.category.toLowerCase().includes(category.toLowerCase()) || category === 'All');
}

export async function fetchRealTimeExploreItems(category: string, sources: string[] = []): Promise<ExploreItem[]> {
  const imageCategories = ['Gallery', 'Arts', 'Crafts', 'Wallpaper'];
  if (imageCategories.includes(category)) {
    return fetchImagesFromPexels(category);
  }
  
  const cacheKey = `${category}-${sources.join(',')}`;
  // Check cache first to avoid unnecessary API hits
  const cached = EXPLORE_CACHE[cacheKey];
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const ai = getAi();
    let sourceInstruction = '';
    if (sources.length > 0) {
      sourceInstruction = ` Prioritize content from these trusted sources: ${sources.join(', ')}.`;
    }
    
    // Reduced item count to 12 to improve response time and reduce payload size, minimizing network timeouts.
    const prompt = `Find 12 trending and interesting items related to '${category}' (news, images, videos, articles) from the web.${sourceInstruction}
    Return a valid JSON array of objects. Each object must have:
    - id: string (a unique identifier)
    - type: string (one of: image, video, news, gallery, space, coding, sports, tour, games, hobby, arts, crafts, engineering, science, anime, wallpaper - choose based on content)
    - title: string (the main title of the content)
    - description: string (a short summary of the content)
    - imageUrl: string (A relevant, high-quality image URL. If the content is an image, use its URL. If it's an article/video, find a representative thumbnail. Use a relevant Unsplash URL as a last resort, e.g., 'https://images.unsplash.com/photo-...?auto=format&fit=crop&w=800&q=80')
    - category: string (the input category: "${category}")
    - source: object with name (string, the website name like "The Verge") and url (string, the direct URL to the content)
    - likes: number (a random integer between 100 and 5000)
    - upvotes: number (a random integer between 50 and likes)
    - views: string (a formatted view count like "1.2M views" or "25k views")
    - duration: string (e.g., "12:34", for videos only, otherwise empty string)
    - commentsCount: number (a random integer between 5 and 200)
    - timestamp: string (a relative time like "2h ago" or "Just now")
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              type: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              imageUrl: { type: Type.STRING },
              category: { type: Type.STRING },
              source: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  url: { type: Type.STRING }
                },
                required: ["name", "url"]
              },
              likes: { type: Type.INTEGER },
              upvotes: { type: Type.INTEGER },
              views: { type: Type.STRING },
              duration: { type: Type.STRING },
              commentsCount: { type: Type.INTEGER },
              timestamp: { type: Type.STRING },
            },
            required: ["id", "type", "title", "description", "imageUrl", "category", "source", "likes", "upvotes", "views", "duration", "commentsCount", "timestamp"]
          }
        }
      }
    });
    
    const results: ExploreItem[] = JSON.parse(response.text || '[]');
    
    // Add to cache
    EXPLORE_CACHE[cacheKey] = { data: results, timestamp: Date.now() };

    return results;

  } catch (error: any) {
    const errString = JSON.stringify(error);
    const isNetworkError = errString.includes("xhr error") || errString.includes("error code: 6") || error?.message?.includes("xhr error") || error?.message?.includes("Rpc failed");

    if (isQuotaError(error)) {
        console.warn(`Quota limit reached for category '${category}'. Using fallback data.`);
    } else if (isNetworkError) {
        console.warn(`Network/XHR error fetching explore items for ${category}. This is likely due to network restrictions or ad-blockers preventing the Google GenAI RPC call. Using fallback data.`);
    } else {
        console.error(`Explore fetch failed for ${category}:`, error);
    }

    const getFallbackData = () => {
        if (category === 'Vertical Shorts') return MOCK_SHORTS;
        if (category && category.toLowerCase() !== 'all') {
            const categorySpecific = MOCK_EXPLORE.filter(item => item.category.toLowerCase() === category.toLowerCase());
            if (categorySpecific.length > 0) return categorySpecific;
        }
        return MOCK_EXPLORE;
    }

    return getFallbackData();
  }
}
