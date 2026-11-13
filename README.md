# Project 8: L'Oréal Chatbot

L’Oréal is exploring the power of AI, and your job is to showcase what's possible. Your task is to build a chatbot that helps users discover and understand L’Oréal’s extensive range of products—makeup, skincare, haircare, and fragrances—as well as provide personalized routines and recommendations.

## 🚀 Launch via GitHub Codespaces

1. In the GitHub repo, click the **Code** button and select **Open with Codespaces → New codespace**.
2. Once your codespace is ready, open the `index.html` file via the live preview.

## ☁️ Cloudflare Note

When deploying through Cloudflare, make sure your API request body (in `script.js`) includes a `messages` array and handle the response by extracting `data.choices[0].message.content`.

## Setup checklist

1. Create a Cloudflare Worker and paste in the code from `RESOURCE_cloudflare-worker.js`.
2. In the Worker dashboard, open **Settings → Variables and Secrets**, add a secret
   named `OPENAI_API_KEY`, and paste your key there. Never put the key in this
   repository or in browser JavaScript.
3. Deploy the Worker and copy its public URL.
4. Replace `https://your-worker-subdomain.workers.dev/` in `script.js` with
   that URL.
5. Open `index.html` in Live Preview and test both a beauty question and an
   unrelated question.

The worker keeps the API key private and adds the chatbot's L’Oréal-only system
prompt before forwarding requests to OpenAI. You do not need to create a
`secrets.js` file.

Enjoy building your L’Oréal beauty assistant! 💄
