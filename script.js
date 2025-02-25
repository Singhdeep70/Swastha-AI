import { GoogleGenerativeAI } from "@google/generative-ai"; // Import Gemini SDK

const API_KEY = "AIzaSyC3KSzvNC7qknWa-G7azbsqmBgMFMuGpMU"; // Move this to an environment variable in backend
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const chatMessages = document.getElementById('chatMessages');
const loading = document.getElementById('loading');

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

async function generateResponse(prompt) {
    try {
        loading.style.display = 'block';
        const result = await model.generateContent(prompt);
        
        if (result.candidates && result.candidates.length > 0) {
            return result.candidates[0].content; // Correct way to extract text
        }
        return "I'm not sure how to respond. Please try again.";
    } catch (error) {
        console.error("Error:", error);
        return "Sorry, I ran into an issue. Try again later.";
    } finally {
        loading.style.display = 'none';
    }
}

function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    
    const messageContent = document.createElement('p');
    messageContent.textContent = message;
    
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

sendButton.addEventListener('click', async () => {
    const message = userInput.value.trim();
    if (!message) return;

    addMessage(message, true);
    userInput.value = '';

    const response = await generateResponse(`
        As Swasthya AI, a healthcare assistant, respond to this health-related query: ${message}
        Provide clear, professional medical information while advising to consult a doctor for serious concerns.
    `);
    
    addMessage(response);
});

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendButton.click();
    }
});
