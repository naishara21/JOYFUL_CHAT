// public/script.js
async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value;
    userInput.value = '';

    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML += `<div class="message user">${message}</div>`;

    const loadingMessage = `<div class="message assistant">Loading...</div>`;
    messagesDiv.innerHTML += loadingMessage;

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        const data = await response.json();

        const loadingDiv = messagesDiv.querySelector('.assistant:last-child');
        loadingDiv.remove();
        messagesDiv.innerHTML += `<div class="message assistant">${data.reply}</div>`;
    } catch (error) {
        const loadingDiv = messagesDiv.querySelector('.assistant:last-child');
        loadingDiv.remove();
        messagesDiv.innerHTML += `<div class="message assistant">Error: ${error.message}</div>`;
    }
}
