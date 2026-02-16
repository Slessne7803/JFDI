
import { GoogleGenAI, Type } from "@google/genai";
import { BrainItem, BrainItemType, UserPreferences } from "../types";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const categorizeBrainDump = async (text: string, preferences?: UserPreferences): Promise<{
  title: string;
  type: BrainItemType;
  category: string;
  tags: string[];
  priority: 'low' | 'medium' | 'high';
}> => {
  const contextInstruction = preferences?.aiContext 
    ? `Personal user context to consider: "${preferences.aiContext}". Use this to better categorize and title the item.`
    : "";

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze this brain dump: "${text}". ${contextInstruction} 
    Categorize it as a 'task', 'idea', 'win', or 'note'. Provide a short clear title, a broad category (like Work, Personal, Creative, Health), and relevant tags. Also suggest a priority if it's a task.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          type: { type: Type.STRING, enum: ['task', 'idea', 'win', 'note'] },
          category: { type: Type.STRING },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          priority: { type: Type.STRING, enum: ['low', 'medium', 'high'] }
        },
        required: ['title', 'type', 'category', 'tags', 'priority']
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const generateGentleNudge = async (items: BrainItem[], preferences?: UserPreferences): Promise<string> => {
  const pendingTasks = items.filter(i => i.type === 'task' && !i.completed);
  if (pendingTasks.length === 0) return "You're all caught up! How about a quick moment of mindfulness?";

  const contextInstruction = preferences?.aiContext 
    ? `The user's personal context is: "${preferences.aiContext}". Tailor the nudge to be relevant to their life/work.`
    : "";

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Based on these tasks: ${pendingTasks.map(t => t.title).join(', ')}, generate a "Gentle Nudge". ${contextInstruction} 
    This should be a kind, ADHD-friendly reminder that reduces overwhelm and suggests one small, actionable step. Keep it under 25 words.`,
  });

  return response.text || "Just checking in. Remember to breathe and take it one step at a time.";
};
