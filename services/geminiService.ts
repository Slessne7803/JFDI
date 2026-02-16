import { GoogleGenAI, Type as SchemaType } from "@google/genai";
import { BrainItem, BrainItemType, UserPreferences } from "../types";

// Using the key name you set in Vercel with the Vite requirement
const genAI = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

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

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          title: { type: SchemaType.STRING },
          type: { type: SchemaType.STRING, enum: ['task', 'idea', 'win', 'note'] },
          category: { type: SchemaType.STRING },
          tags: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
          priority: { type: SchemaType.STRING, enum: ['low', 'medium', 'high'] }
        },
        required: ['title', 'type', 'category', 'tags', 'priority']
      }
    }
  });

  const prompt = `Analyze this brain dump: "${text}". ${contextInstruction} 
    Categorize it as a 'task', 'idea', 'win', or 'note'. Provide a short clear title, a broad category (like Work, Personal, Creative, Health), and relevant tags. Also suggest a priority if it's a task.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return JSON.parse(response.text());
};

export const generateGentleNudge = async (items: BrainItem[], preferences?: UserPreferences): Promise<string> => {
  const pendingTasks = items.filter(i => i.type === 'task' && !i.completed);
  if (pendingTasks.length === 0) return "You're all caught up! How about a quick moment of mindfulness?";

  const contextInstruction = preferences?.aiContext 
    ? `The user's personal context is: "${preferences.aiContext}". Tailor the nudge to be relevant to their life/work.`
    : "";

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
  const prompt = `Based on these tasks: ${pendingTasks.map(t => t.title).join(', ')}, generate a "Gentle Nudge". ${contextInstruction} 
    This should be a kind, ADHD-friendly reminder that reduces overwhelm and suggests one small, actionable step. Keep it under 25 words.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text() || "Just checking in. Remember to breathe and take it one step at a time.";
};
