const RecurringPayment = require('../models/RecurringPayment');

exports.addRecurringPayment = async (req, res) => {
    try {
        const { description, amount, paymentType, frequency, startDate } = req.body;

        // 1. Create the new recurring document
        const newPayment = new RecurringPayment({
            userId: req.user, // Extracted from JWT by protect middleware
            description,
            amount,
            paymentType,
            frequency,
            // If the user doesn't pick a date, default to today
            nextDueDate: startDate ? new Date(startDate) : new Date()
        });

        // 2. Save to database
        await newPayment.save();

        res.status(201).json({
            message: "Recurring payment added successfully",
            data: newPayment
        });
    } catch (err) {
        console.error("Add Recurring Error:", err.message);
        res.status(500).json({ error: "Failed to schedule payment" });
    }
};