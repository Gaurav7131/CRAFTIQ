import express from "express";
import { requireAuth } from "@clerk/express"; 
import { auth } from "../middlewares/auth.js";
import { generateArticle, generateBlogTitle, generateImage } from "../controllers/aiController.js";

const aiRouter = express.Router();

// Chain: Clerk Auth -> Plan Check -> Controller
aiRouter.post('/generate-article', requireAuth(), auth, generateArticle);
aiRouter.post('/generate-blog-title', requireAuth(), auth, generateBlogTitle);
aiRouter.post('/generate-image', requireAuth(), auth, generateImage);

export default aiRouter;