import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import OpenAI from "openai";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import FormData from "form-data";
import { Readable } from "stream";
import "dotenv/config";
import fs from "fs";
import * as pdfLib from "pdf-parse";
const pdf = pdfLib.default; //

// 1. INITIALIZE THE AI CLIENT (This was likely missing or configured wrong)
const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY, // Make sure this is in your .env file
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai" // Required for Gemini
});

export const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { prompt, length } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        succes: false,
        message: "Limit reached. Upgrade to continue.",
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: length,
    });

    const content = response.choices[0].message.content;

    await sql` INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'article') `;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.json({ success: true, content });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};


// ==========================================
// 2. GENERATE BLOG TITLE
// ==========================================
export const generateBlogTitle = async (req, res) => {
    // 1. DEBUG LOGGING START
    console.log("🚀 Starting Request...");
    
    try {
        // CHECK AUTH
        if (!req.auth?.userId) throw new Error("Missing userId in req.auth");
        const { userId } = req.auth;
        const { prompt } = req.body;
        console.log(`👤 User: ${userId}, Prompt: ${prompt}`);

        // CHECK AI CLIENT
        if (!AI) throw new Error("AI Client is undefined");

        // 2. TRY AI GENERATION
        console.log("🤖 Calling Gemini...");
        let content;
        try {
            const response = await AI.chat.completions.create({
                model: "gemini-2.5-flash",
                messages: [
                    { role: "system", content: "You are an expert copywriter." },
                    { role: "user", content: `Generate 5 blog titles for: ${prompt}` }
                ],
                max_tokens: 500,
            });
            content = response.choices?.[0]?.message?.content;
            if (!content) throw new Error("AI returned empty content (Safety Filter?)");
        } catch (aiError) {
            console.error("❌ AI CALL FAILED:", aiError);
            return res.status(500).json({ success: false, message: "AI Generation Failed: " + aiError.message });
        }

        // 3. TRY DATABASE INSERT
        console.log("💾 Saving to DB...");
        try {
            await sql`INSERT INTO creations (user_id, prompt, content, type) 
                      VALUES (${userId}, ${prompt}, ${content}, 'blog-title')`;
        } catch (dbError) {
            console.error("❌ DATABASE FAILED:", dbError);
            return res.status(500).json({ success: false, message: "Database Error: " + dbError.message });
        }

        // 4. TRY CLERK UPDATE
        console.log("👤 Updating Clerk...");
        try {
            if (req.plan !== 'premium') {
                await clerkClient.users.updateUserMetadata(userId, {
                    privateMetadata: { free_usage: (req.free_usage || 0) + 1 }
                });
            }
        } catch (clerkError) {
            console.error("❌ CLERK FAILED:", clerkError);
            // Don't block the response if just Clerk fails
        }

        console.log("✅ Success!");
        return res.status(200).json({ success: true, content });

    } catch (error) {
        console.error("❌ UNEXPECTED CRASH:", error);
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



export const removeImageBackground = async (req, res) => {
  try {
    const { userId } = req.auth();
    const image = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        succes: false,
        message: "This feature is only available for premium subscriptions",
      });
    }

    const { secure_url } = await cloudinary.uploader.upload(image.path, {
      transformation: [
        {
          effect: "background_removal",
          background_removal: "remove_the_background",
        },
      ],
    });

    await sql` INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, 'Remove background from image', ${secure_url}, 'image') `;

    res.json({ success: true, content: secure_url });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const removeImageObject = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { object } = req.body;
    const image = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        succes: false,
        message: "This feature is only available for premium subscriptions",
      });
    }

    const { public_id } = await cloudinary.uploader.upload(image.path);

    const imageUrl = cloudinary.url(public_id, {
      transformation: [{ effect: `gen_remove:${object}` }],
      resource_type: "image",
    });

    await sql` INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${`Removed ${object} from image`}, ${imageUrl}, 'image') `;

    res.json({ success: true, content: imageUrl });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const resumeReview = async (req, res) => {
  try {
    const { userId } = req.auth();
    const resume = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        succes: false,
        message: "This feature is only available for premium subscriptions",
      });
    }

    if (resume.size > 5 * 1024 * 1024) {
      return res.json({
        success: false,
        message: "Resume file size exceeds allowed size (5MB).",
      });
    }

    const dataBuffer = fs.readFileSync(resume.path);
    const pdfData = await pdf(dataBuffer);

    const prompt = `Review the following resume and provide constructive feedback on its strengths, weaknesses, and areas for improvement. Resume Content:\n\n${pdfData.text}`;

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;

    await sql` INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, 'Review the uploaded resume', ${content}, 'resume-review') `;

    res.json({ success: true, content });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};