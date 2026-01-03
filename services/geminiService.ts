
import { GoogleGenAI } from "@google/genai";
import { LogoGenerationResult } from "../types";

export const generateLogo = async (
  prompt: string
): Promise<LogoGenerationResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const fullPrompt = `High-end professional corporate logo design for: ${prompt}. Minimalist, vector style, clean lines, white background, high contrast, centered.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: fullPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      },
    });

    let base64 = '';
    // Nano banana models may return image in any part
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        base64 = part.inlineData.data;
        break;
      }
    }

    if (!base64) throw new Error("No image data returned from model.");

    return {
      imageUrl: `data:image/png;base64,${base64}`,
      base64,
      prompt: fullPrompt
    };
  } catch (error) {
    console.error("Error generating logo:", error);
    throw error;
  }
};
