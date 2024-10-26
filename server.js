// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Chat route
app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        // Make the request to the OpenAI API
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: userMessage }],
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            }
        });

        // Log the full response from OpenAI
        console.log('OpenAI Response:', response.data);

        // Check if the response structure is as expected
        const aiReply = response.data.choices[0]?.message?.content;

        // If the AI reply is undefined or null, send an error response
        if (!aiReply) {
            return res.status(500).json({ error: 'No reply from AI.' });
        }

        // Send the AI response back to the client
        res.json({ reply: aiReply });
    } catch (error) {
        console.error('Error:', error);  // Log the error for debugging
        const errorMessage = error.response?.data?.error?.message || 'Error processing your request.';
        res.status(500).json({ error: errorMessage });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
