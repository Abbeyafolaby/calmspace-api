import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";


const app = express();


// CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === "production"
        ? [
            "https://jtech-code1.github.io",
            "https://jtech-code1.github.io/Original_CalmSpace",
            "https://calmspace1.netlify.app",
            "https://calmspace-web.netlify.app"
        ]
        : [
            "http://localhost:3000",
            "http://localhost:5000",
            "http://127.0.0.1:5050",
            "http://127.0.0.1:5500"
        ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));



// Middleware to parse JSON body
app.use(express.json({ limit: '10mb' }));

// Middleware for form submissions
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


// Health check route
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Calmspace API is healthy 🚀",
    });
});

// Routes
app.use("/api/auth", authRoutes);

// Catch-all handler for other routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

export default app;