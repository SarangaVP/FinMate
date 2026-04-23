require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const transactionRoutes = require('./src/routes/transactionRoutes');
const userRoutes = require('./src/routes/userRoutes');
const recurringRoutes = require('./src/routes/recurringRoutes');
const budgetGoalRoutes = require('./src/routes/budgetGoalRoutes');
const reportRoutes = require('./src/routes/reportRoutes');
const sharedGroupRoutes = require('./src/routes/sharedGroupRoutes');
const sharedExpenseRoutes = require('./src/routes/sharedExpenseRoutes');

connectDB();

const app = express();
const PORT = process.env.PORT || 5000; 

// CORS must come BEFORE routes
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes come AFTER cors and json middleware
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/recurring', recurringRoutes);
app.use('/api/planning', budgetGoalRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/shared-groups', sharedGroupRoutes);
app.use('/api/shared-expenses', sharedExpenseRoutes);

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