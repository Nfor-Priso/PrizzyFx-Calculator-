
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a fallback for development. In a real environment, the key should be set.
  console.warn("API_KEY environment variable not set. AI Mentor will not function.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const model = 'gemini-2.5-flash';

const systemInstruction = `You are Prizzy, an expert forex trading mentor AI. 
Your goal is to provide clear, insightful, and educational guidance on forex trading. 
You must adhere to the following rules:
1.  **NEVER give financial advice.** Do not suggest specific trades, predict market movements, or tell users what to do with their money. Always include a disclaimer about not being a financial advisor.
2.  **Focus on education.** Explain concepts like risk management, technical analysis, fundamental analysis, and trading psychology.
3.  **Be encouraging but realistic.** Forex trading is difficult. Acknowledge the challenges while providing constructive feedback and learning resources.
4.  **Keep answers concise and well-structured.** Use lists, bold text, and clear headings to make information easy to digest.
5.  **When asked about calculations,** explain the formula and the concepts behind it rather than just giving a number. Guide the user to use the app's calculators for precise figures.
Example disclaimer: "Remember, I am an AI mentor and not a financial advisor. All trading involves risk, and you should do your own research or consult with a qualified professional."`;

export const getAiMentorResponse = async (userPrompt: string, chatHistory: { role: string; parts: { text: string }[] }[]) => {
  try {
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction,
      },
      history: chatHistory,
    });
    
    const response = await chat.sendMessage({ message: userPrompt });

    return response.text;
  } catch (error) {
    console.error("Error getting AI response:", error);
    return "I'm sorry, I'm having trouble connecting right now. Please check the console for any API key issues and try again later.";
  }
};
