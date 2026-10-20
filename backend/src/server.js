import express from 'express';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const app = express(); // Create an instance of the Express application

const PORT = process.env.PORT || 3000; // Define a port for the server to listen on

app.use(express.json()); // Middleware to parse JSON request bodies

app.get('/api/health', (req, res) => { // Define a route for the health check endpoint
    res.status(200).json({ 
        status: 'OK',
        application: 'LookBook Smart Pricing AI Backend', 
        message: 'Server is healthy',
        timestamp: new Date().toISOString()
    }); 
});

// Catch-all route for undefined endpoints
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Endpoint not found',
        timestamp: new Date().toISOString()
    });
});

// Start the server and listen on the defined port
app.listen(PORT, () => {
  console.log(`LookBook Backend  is running on http://localhost:${PORT}`);
}); 