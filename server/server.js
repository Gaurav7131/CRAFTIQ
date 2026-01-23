import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware } from '@clerk/express'; 
import aiRouter from './routes/aiRoutes.js'; 
import connectCloudinary from './configs/Cloudinary.js'; // Ensure the 'C' matches your filename

const app = express();
const port = process.env.PORT || 3000;

// 1. Essential Middlewares
app.use(cors());
app.use(express.json()); // <--- CRITICAL: Must be here to read JSON body

// 2. Clerk Authentication
app.use(clerkMiddleware()); 

// 3. Connect Services
connectCloudinary(); 

// 4. Routes
app.get('/', (req, res) => res.send('Server is Live!'));
app.use('/api/ai', aiRouter);

// 5. Start Server
app.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
});

{/* try this ifnot working above code  
 import express from 'express';
import cors from 'cors';
import 'dotenv/config'; // Loads .env file
import { clerkMiddleware } from '@clerk/express';
import aiRouter from './routes/aiRoutes.js';
import connectCloudinary from './configs/Cloudinary.js';

const app = express();
const port = process.env.PORT || 3000;

// 1. Essential Middlewares
app.use(cors());
app.use(express.json()); // Critical for parsing JSON bodies
app.use(clerkMiddleware());

// 2. Routes
app.get('/', (req, res) => res.send('Server is Live!'));
app.use('/api/ai', aiRouter);

// 3. Robust Server Startup
const startServer = async () => {
    try {
        // Wait for Cloudinary to connect BEFORE starting the server
        await connectCloudinary();

        // (Optional) If you have a DB connection later, await it here too:
        // await connectDB();

        app.listen(port, () => {
            console.log(`✅ Server running on port ${port}`);
        });

    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1); // Stop the process if connections fail
    }
};

startServer();*/}