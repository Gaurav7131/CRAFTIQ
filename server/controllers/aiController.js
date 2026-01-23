import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import OpenAI from "openai";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import FormData from "form-data";
import { Readable } from "stream";

const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

// ==========================================
// 1. GENERATE ARTICLE
// ==========================================
export const generateArticle = async (req, res) => {
    try {
        const { userId } = req.auth; 
        const { prompt, length } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        if (plan !== 'premium' && free_usage >= 10) {
            return res.json({ success: false, message: "Limit reached. Upgrade to continue!" });
        }

        const response = await AI.chat.completions.create({
            model: "gemini-2.5-flash",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_completion_tokens: length,
        });

        const content = response.choices[0].message.content;

        await sql`INSERT INTO creations (user_id, prompt, content, type) 
                  VALUES (${userId}, ${prompt}, ${content}, 'article')`;

        if (plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: { free_usage: free_usage + 1 }
            });
        }

        return res.status(200).json({ success: true, content });

    } catch (error) {
        console.error("❌ Article Generator Error:", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
}


// ==========================================
// 2. GENERATE BLOG TITLE
// ==========================================
export const generateBlogTitle = async (req, res) => {
    try {
        const { userId } = req.auth; 
        const { prompt, length } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        if (plan !== 'premium' && free_usage >= 10) {
            return res.json({ success: false, message: "Limit reached. Upgrade to continue!" });
        }

        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_completion_tokens: 200,
        });

        const content = response.choices[0].message.content;

        await sql`INSERT INTO creations (user_id, prompt, content, type) 
                  VALUES (${userId}, ${prompt}, ${content}, 'blog-title')`;

        if (plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: { free_usage: free_usage + 1 }
            });
        }

        return res.status(200).json({ success: true, content });

    } catch (error) {
        console.error("❌ Blog Title Generator Error:", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
}


// ==========================================
// 3. GENERATE IMAGE (FIXED LOGIC)
// ==========================================
// ==========================================
// 3. GENERATE IMAGE (ROBUST DEBUG VERSION)
// ==========================================
// ==========================================
// ==========================================
// 3. GENERATE IMAGE (DIAGNOSTIC MODE)
// ==========================================
// ==========================================
// 3. GENERATE IMAGE (DIAGNOSTIC MODE)
// ==========================================
const streamUpload = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "ai-generated" },
            (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            }
        );
        Readable.from(buffer).pipe(stream);
    });
};

// ==========================================
// 3. GENERATE IMAGE (FIX: FORCE IMAGE TYPE)
// ==========================================
// ==========================================
// 3. GENERATE IMAGE (BASE64 + MAGIC NUMBERS)
// ==========================================
export const generateImage = async (req, res) => {
    try {
        const { userId } = req.auth; 
        const { prompt, publish } = req.body;

        console.log(`🎨 Generating image for: "${prompt}"`);

        // 1. Check API Key
        if (!process.env.CLIPDROP_API_KEY) {
            return res.status(500).json({ success: false, message: "Server Error: CLIPDROP_API_KEY is missing." });
        }

        const formData = new FormData();
        formData.append('prompt', prompt);

        // 2. Call Clipdrop API (Get Raw Buffer)
        //  - Visualizing how we capture raw binary data
        const response = await axios.post("https://clipdrop-api.co/text-to-image/v1", formData, {
            headers: {
                'x-api-key': process.env.CLIPDROP_API_KEY,
                ...formData.getHeaders(),
            },
            responseType: "arraybuffer", // ⚠️ Must be arraybuffer to preserve binary data
            validateStatus: () => true, 
        });

        // 3. Handle API Errors
        if (response.status !== 200) {
            const errorText = Buffer.from(response.data).toString('utf-8');
            console.error(`❌ Clipdrop API Error (${response.status}):`, errorText);
            return res.status(response.status).json({ success: false, message: `AI Service Error: ${errorText}` });
        }

        const buffer = Buffer.from(response.data);
        console.log(`📦 Image Size: ${buffer.length} bytes`);

        // 4. DETECT MIME TYPE (MAGIC NUMBERS)
        // We do this manually to ensure we create the correct Base64 string
        let mimeType = 'image/png'; // Default
        
        // Check for JPEG signature (FF D8 FF)
        if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
            mimeType = 'image/jpeg';
        } 
        // Check for PNG signature (89 50 4E 47)
        else if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
            mimeType = 'image/png';
        }

        console.log(`🔍 Detected Type: ${mimeType}`);

        // 5. CONVERT TO BASE64 DATA URI
        // This is the safest way to upload to Cloudinary without stream errors
        //  - Visualizing conversion from binary to text string
        const base64Image = `data:${mimeType};base64,${buffer.toString('base64')}`;

        // 6. UPLOAD TO CLOUDINARY
        console.log("⬆️  Uploading to Cloudinary...");
        
        const result = await cloudinary.uploader.upload(base64Image, {
            folder: "ai-generated",
            resource_type: "image" // ⚠️ FORCE IMAGE TYPE
        });
        
        console.log("✅ Upload Success:", result.secure_url);

        // 7. Save to DB
        await sql`INSERT INTO creations (user_id, prompt, content, type, publish) 
                  VALUES (${userId}, ${prompt}, ${result.secure_url}, 'image', ${publish ?? false})`;

        return res.status(200).json({ success: true, content: result.secure_url });

    } catch (error) {
        console.error("❌ Image Gen Error:", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
}