import express from "express";
import { requireAuth } from "@clerk/express"; 
import { auth } from "../middlewares/auth.js";
import { generateArticle, generateBlogTitle, generateImage,  removeImageBackground,
  removeImageObject,
  resumeReview } from "../controllers/aiController.js";
  import { upload } from "../configs/multer.js";


const aiRouter = express.Router();

// Chain: Clerk Auth -> Plan Check -> Controller
aiRouter.post('/generate-article', requireAuth(), auth, generateArticle);
aiRouter.post('/generate-blog-title', requireAuth(), auth, generateBlogTitle);
aiRouter.post('/generate-image', requireAuth(), auth, generateImage);
aiRouter.post("/remove-image-background",upload.single("image"),auth,removeImageBackground);
aiRouter.post("/remove-image-object",upload.single("image"),auth,removeImageObject);
aiRouter.post("/resume-review", upload.single("resume"), auth, resumeReview);

export default aiRouter;