const startVoiceButton = document.querySelector("#start-voice");
const submitTextButton = document.querySelector("#submit-text");
const taskInput = document.querySelector("#task-input");
const responseContainer = document.querySelector("#response-container");
const themeToggleButton = document.querySelector("#theme-toggle-button");

// Initialize the speech recognition API
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.interimResults = false;
recognition.lang = 'en-US';

// Initialize the speech synthesis API
const synth = window.speechSynthesis;

const startRecognition = () => {
    recognition.start();
};

const stopRecognition = () => {
    recognition.stop();
};

const getChatResponse = async (userText) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    
    //add here your openAI key to run the code
    const API_KEY = "ADD-YOUR KEY";
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "user", content: userText }
            ],
            max_tokens: 150,
            temperature: 0.7
        })
    };

    try {
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();
        const messageContent = data.choices[0].message.content;
        return messageContent;
    } catch (error) {
        console.error("Error:", error);
        return "Sorry, I couldn't process your request.";
    }
};

const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    synth.speak(utterance);
};

recognition.onresult = async (event) => {
    const transcript = event.results[0][0].transcript;
    taskInput.value = transcript;

    const response = await getChatResponse(transcript);
    responseContainer.textContent = response;
    speak(response);
};

recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
};

startVoiceButton.addEventListener("click", startRecognition);
submitTextButton.addEventListener("click", async () => {
    const userText = taskInput.value.trim();
    if (userText) {
        const response = await getChatResponse(userText);
        responseContainer.textContent = response;
        speak(response);
    }
});

function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark-theme');
    
    const isDark = body.classList.contains('dark-theme');
    const themeIcon = themeToggleButton.querySelector('i');

    if (isDark) {
        themeIcon.classList.remove('fa-solid', 'fa-lightbulb');
        themeIcon.classList.add('fa-regular', 'fa-lightbulb');
        themeIcon.style.color = '#FFD43B';
    } else {
        themeIcon.classList.remove('fa-regular', 'fa-lightbulb');
        themeIcon.classList.add('fa-solid', 'fa-lightbulb');
        themeIcon.style.color = '';
    }
}
taskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        handleTextInput();
    }
});
const handleTextInput = async () => {
    const userText = taskInput.value.trim();
    if (userText) {
        console.log("Text input submitted:", userText);
        const response = await getChatResponse(userText);
        responseContainer.textContent = response;
        speak(response);
    }
};
