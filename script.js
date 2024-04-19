    const chatbotToggler = document.querySelector(".chatbot-toggler");
    const closeBtn = document.querySelector(".close-btn");
    const chatbox = document.querySelector(".chatbox");
    const chatInput = document.querySelector(".chat-input textarea");
    const sendChatBtn = document.querySelector("#send-btn");

    let userMessage = null;
    const API_KEY = "--PASTE YOUR KEY HERE--";
    const inputInitHeight = chatInput.scrollHeight;

    const createChatLi = (message, className) => {
        const chatLi = document.createElement("li");
        chatLi.classList.add("chat", `${className}`);
        let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
        chatLi.innerHTML = chatContent;
        chatLi.querySelector("p").textContent = message;
        return chatLi;
    }

    const generateResponse = (chatElement) => {
        const API_URL = "https://api.openai.com/v1/chat/completions";
        const messageElement = chatElement.querySelector("p");
        const statusElement = document.getElementById("s2");
        const statusDiv = document.getElementById("s1");
    
        const requestOptions = {    
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: userMessage }],
            })
        }
    
        fetch(API_URL, requestOptions)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(data => {
                messageElement.textContent = data.choices[0].message.content.trim();
                // Update status to online
                statusElement.textContent = "Online";
                // Change status div color back to default
                statusDiv.style.backgroundColor = "initial";
            })
            .catch(error => {
                console.error('There was an error with the fetch operation:', error);
                messageElement.classList.add("error");
                messageElement.textContent = "Oops! Something went wrong. Please try again.";
                // Update status to offline
                statusElement.textContent = "Offline";
                // Change status div color to red
                statusDiv.style.backgroundColor = "red";
            })
            .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
    }
    

    const handleChat = () => {
        userMessage = chatInput.value.trim();
        if (!userMessage) return;
        chatInput.value = "";
        chatInput.style.height = `${inputInitHeight}px`;
        chatbox.appendChild(createChatLi(userMessage, "outgoing"));
        chatbox.scrollTo(0, chatbox.scrollHeight);

        setTimeout(() => {
            const incomingChatLi = createChatLi("Typing...", "incoming");
            chatbox.appendChild(incomingChatLi);
            chatbox.scrollTo(0, chatbox.scrollHeight);
            generateResponse(incomingChatLi);
        }, 600);
    }

    chatInput.addEventListener("input", () => {
        chatInput.style.height = `${inputInitHeight}px`;
        chatInput.style.height = `${chatInput.scrollHeight}px`;
    });

    chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
            e.preventDefault();
            handleChat();
        }
    });

    const micButton = document.getElementById('speech-mic');
    const messageInput = document.getElementById('message-input');

    const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new speechRecognition();

    micButton.addEventListener('click', () => {
        recognition.start();
    });

    recognition.onresult = (event) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        messageInput.value += transcript;
    };

    document.getElementById('speak').addEventListener('click', function() {
        var chatbox = document.querySelector('.chatbox');
        var messages = chatbox.querySelectorAll('p');
        var text = '';
        messages.forEach(function(message) {
        text += message.textContent.trim() + ' ';
        });
        if ('speechSynthesis' in window) {
        var synthesis = window.speechSynthesis;
        var utterance = new SpeechSynthesisUtterance(text);
        synthesis.speak(utterance);
        } else {
        alert('Text-to-speech not supported in your browser.');
        }
    });
    

    sendChatBtn.addEventListener("click", handleChat);
    closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
    chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
