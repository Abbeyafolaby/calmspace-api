import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Start server
app.listen(PORT, () => {
  console.log(
    `🚀 Calmspace Api server is running, view the health route http://localhost:${PORT}/api/health`
  );
});
