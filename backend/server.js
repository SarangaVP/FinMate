const express = require('express');

const PORT = 5000;

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ 
        message: 'FinMate Backend API is running!'
    });
});

app.listen(PORT, () => {
    console.log(`Server is running and listening on port ${PORT}`);
    console.log(`Access the API at: http://localhost:${PORT}`);
});