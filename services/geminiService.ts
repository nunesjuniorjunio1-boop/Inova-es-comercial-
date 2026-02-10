
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Order, InventoryItem, MenuItem } from "../types";

// Base helper for image to base64
export const fileToGenerativePart = async (file: File) => {
  return new Promise<{ inlineData: { data: string; mimeType: string } }>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.readAsDataURL(file);
  });
};

// 1. Live API: Conversational Audio
export const setupLiveSession = async (onMessage: (msg: any) => void) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const session = await ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
    callbacks: {
      onmessage: onMessage,
      onopen: () => console.log("Live session opened"),
      onerror: (e) => console.error("Live session error", e),
      onclose: () => console.log("Live session closed"),
    },
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } },
      },
      systemInstruction: 'Você é o GastroMaster AI, um assistente especializado em gestão de restaurantes. Responda de forma concisa e profissional por voz.',
    }
  });
  return session;
};

// 2. Image Understanding: Analyze receipts or ingredients
export const analyzeRestaurantImage = async (imageFile: File, prompt: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const imagePart = await fileToGenerativePart(imageFile);
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: { parts: [imagePart, { text: prompt }] },
  });
  
  return response.text;
};

// 3. Audio Transcription
export const transcribeVoiceNote = async (audioBase64: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: audioBase64, mimeType: 'audio/mp3' } },
        { text: "Por favor, transcreva este áudio exatamente como dito." }
      ]
    },
  });
  return response.text;
};

// 4. Maps Grounding: Search suppliers or competitors
export const searchSuppliersOnMaps = async (query: string, lat?: number, lng?: number) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: query,
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: lat && lng ? { latLng: { latitude: lat, longitude: lng } } : undefined
      }
    },
  });
  
  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

// 5. Thinking Mode: Complex Business Analysis
export const performDeepAnalysis = async (query: string, context: { orders: Order[], inventory: InventoryItem[] }) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Analise profundamente este cenário de negócio: ${query}. 
    Contexto atual do restaurante: 
    Ordens: ${JSON.stringify(context.orders.slice(0, 10))}
    Estoque: ${JSON.stringify(context.inventory)}`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 32768 }
    },
  });
  
  return response.text;
};

// Existing service kept for backward compatibility
export const getSmartInsights = async (orders: Order[], inventory: InventoryItem[], menu: MenuItem[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Como um consultor especialista em restaurantes, analise os seguintes dados e forneça 3 sugestões estratégicas para melhorar a eficiência ou lucratividade.
  Ordens: ${JSON.stringify(orders.slice(0, 5))}
  Inventário: ${JSON.stringify(inventory)}
  Itens do Menu: ${JSON.stringify(menu)}
  Retorne as sugestões em formato JSON estruturado.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            insights: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  impact: { type: Type.STRING }
                },
                required: ["title", "description", "impact"]
              }
            }
          }
        }
      }
    });

    return JSON.parse(response.text?.trim() || "{}").insights || [];
  } catch (error) {
    console.error("Erro insights:", error);
    return [];
  }
};
