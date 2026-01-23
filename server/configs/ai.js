import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

// ✅ NAMED EXPORT: This is what your controller looks for.
export const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY, 
    // ⚠️ CRITICAL: You MUST use this URL ending in '/openai/'
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/" 
});