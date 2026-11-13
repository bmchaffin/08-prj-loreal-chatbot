// Replace this placeholder with the URL of your deployed Cloudflare Worker.
const WORKER_URL = "https://open-secret.silent-forest-cefb.workers.dev/";
const systemPrompt = `
You are L'Oréal Beauty Advisor, a friendly and knowledgeable assistant.

Only help with L'Oréal products, skincare, makeup, haircare, fragrance,
beauty routines, and beauty-related recommendations. If a question is
unrelated, politely explain that you can only help with L'Oréal beauty topics.

Give concise, practical, and personalized recommendations. Ask follow-up
questions about skin type, hair type, goals, or sensitivities when needed.
Remember details the user shares, such as their name, skin type, hair type,
beauty goals, and earlier questions, and use that context in later replies.
Never invent product names, ingredients, prices, availability, or results.
Do not diagnose medical conditions or make medical claims. For allergies or
serious skin, scalp, or health concerns, recommend speaking with a qualified
healthcare professional.
`.trim();

// Keep the system prompt at the start of the conversation sent to the Worker.
const conversation = [{ role: "system", content: systemPrompt }];

/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");
const sendBtn = document.getElementById("sendBtn");

function addMessage(text, sender) {
  const message = document.createElement("div");
  message.className = `msg ${sender}`;
  message.textContent = text;
  chatWindow.appendChild(message);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return message;
}

addMessage(
  "Welcome! What L’Oréal product or beauty routine can I help you explore?",
  "ai",
);

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = userInput.value.trim();

  if (!message) return;

  addMessage(message, "user");
  conversation.push({ role: "user", content: message });
  userInput.value = "";
  sendBtn.disabled = true;
  const loadingMessage = addMessage("Thinking…", "ai loading");

  try {
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: conversation }),
    });

    if (!response.ok) {
      throw new Error(`Worker returned status ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      throw new Error("The worker response did not include a reply.");
    }

    conversation.push({ role: "assistant", content: reply });
    loadingMessage.remove();
    addMessage(reply, "ai");
  } catch (error) {
    console.error("Chat request failed:", error);
    loadingMessage.remove();
    addMessage(
      "Sorry, I could not connect right now. Check your worker URL and try again.",
      "ai",
    );
  } finally {
    sendBtn.disabled = false;
    userInput.focus();
  }
});
