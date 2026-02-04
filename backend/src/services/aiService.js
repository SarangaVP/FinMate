const { GoogleGenAI } = require("@google/genai");

// The client can automatically pick up the API key from 
// the GEMINI_API_KEY environment variable
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

exports.analyzeTransaction = async (description) => {
    try {
        const prompt = `Analyze this financial transaction: "${description}". 
                        Return ONLY a raw JSON object with "category" (e.g., Food, Transport, Utilities) 
                        and "amount" (as a number). If amount is not found, return null. 
                        Do not include markdown formatting or backticks.`;

        // Using the latest stable model: gemini-2.0-flash
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        // The new SDK returns response.text directly
        let text = response.text;

        // Still good practice to clean the string to handle non-deterministic outputs
        const cleanJson = text.replace(/```json|```/gi, "").trim();

        return JSON.parse(cleanJson);
    } catch (error) {
        console.error("GenAI SDK Error:", error.message);
        return { category: 'Uncategorized', amount: null };
    }
};