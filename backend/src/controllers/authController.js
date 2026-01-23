const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
    try {
        const { firstName, lastName, emailAddress, password, primaryCurrency } = req.body;

        // Check if user exists
        let user = await User.findOne({ emailAddress });
        if (user) return res.status(400).json({ message: "User already exists" });

        // Hash password for security
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user based on ER Diagram fields
        user = new User({
            firstName,
            lastName,
            emailAddress,
            password: hashedPassword,
            primaryCurrency
        });

        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Login user and return JWT
exports.login = async (req, res) => {
    try {
        const { emailAddress, password } = req.body;

        const user = await User.findOne({ emailAddress });
        if (!user) return res.status(400).json({ message: "Invalid Credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

        // Generate JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({
            token,
            user: { id: user._id, name: user.firstName, currency: user.primaryCurrency }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};