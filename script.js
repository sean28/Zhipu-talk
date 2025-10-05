// --- DOM Elements ---
const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const statusArea = document.getElementById('statusArea');

// --- 智谱 API 设置 ---
const API_KEY = "c58b9fb5df634d4faf8a3f40b92e963d.HsrRebXw7hzQsH4O";
const MODEL_NAME = "glm-4.5-flash"; 
const API_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions";

// --- 对话上下文记录 ---
let conversationHistory = [
    { role: "system", content: "你是一个体贴、有情感的智能AI助手，会用温柔的方式回答问题。" }
];

// --- 添加信息到聊天框 ---
function addMessage(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.textContent = text;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// --- 发送消息主逻辑 ---
async function handleSendMessage() {
    const userText = userInput.value.trim();
    if (!userText) return;

    addMessage(userText, 'user');
    conversationHistory.push({ role: 'user', content: userText });

    userInput.value = '';
    statusArea.textContent = '智谱AI 思考中...';
    sendButton.disabled = true;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: MODEL_NAME,
                messages: conversationHistory,
                temperature: 0.95
            })
        });

        const data = await response.json();

        const reply = data.choices?.[0]?.message?.content || "⚠️ 出错了，未返回预期内容";
        addMessage(reply, 'bot');
        conversationHistory.push({ role: 'assistant', content: reply });

    } catch (error) {
        console.error("API 调用失败：", error);
        addMessage("❌ 网络或接口错误：" + error.message, 'bot');
    } finally {
        statusArea.textContent = '';
        sendButton.disabled = false;
        userInput.focus();
    }
}

// --- 事件绑定 ---
sendButton.addEventListener('click', handleSendMessage);
userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSendMessage();
    }
});