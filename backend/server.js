require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const transactionRoutes = require('./src/routes/transactionRoutes');

connectDB();

const app = express();
const PORT = process.env.PORT || 5000; 

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

app.use(cors({
    origin: 'http://localhost:5173', // Update this to your React/Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/', (req, res) => {
    res.status(200).json({ 
        message: 'FinMate Backend API is running!',
        dbStatus: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected' 
    });
});

app.listen(PORT, () => {
    console.log(`Server is running and listening on port ${PORT}`);
    console.log(`Access the API at: http://localhost:${PORT}`);
});