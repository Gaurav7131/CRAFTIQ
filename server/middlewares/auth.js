import { clerkClient } from "@clerk/express";

export const auth = async (req, res, next) => {
    try {
        // --- TEMPORARY BYPASS FOR DEBUGGING ---
        // We are forcing the system to believe you are this user
        const userId = "user_389npl36o9FA6R6lg1PZTPm1NJT"; 
        
        console.log("⚠️ DEBUG MODE: Using Hardcoded User ID:", userId);
        // --------------------------------------

        // 2. Fetch User Details
        const user = await clerkClient.users.getUser(userId);
        console.log("✅ User found:", user.id);

        // 3. Set Plan & Usage
        req.plan = user.publicMetadata.plan || 'free';
        req.free_usage = user.privateMetadata.free_usage || 0;
        
        // Inject auth object manually so the controller doesn't crash
        req.auth = { userId: userId }; 

        next();

    } catch (error) {
        console.error("❌ Auth Error:", error.message);
        return res.status(401).json({ success: false, message: error.message });
    }
};