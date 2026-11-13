// Copy this code into your Cloudflare Worker script.

export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json',
    };

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Use POST for chat requests." }), {
        status: 405,
        headers: corsHeaders,
      });
    }

    if (!env.OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: "The worker API secret is not configured." }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    let userInput;
    try {
      userInput = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "Request body must be valid JSON." }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    if (!Array.isArray(userInput.messages)) {
      return new Response(JSON.stringify({ error: "Request must include a messages array." }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const apiUrl = "https://api.openai.com/v1/chat/completions";
    const systemPrompt = `
You are L'Oréal Beauty Advisor, a friendly and knowledgeable assistant.

Your job is to help with:
- L'Oréal skincare, makeup, haircare, and fragrance products
- Beauty routines and product recommendations
- General beauty questions related to choosing or using products

Only answer questions related to L'Oréal products, beauty, skincare, makeup,
haircare, fragrance, or personal beauty routines. If a question is unrelated,
politely explain that you can only help with those topics and invite the user
to ask a L'Oréal beauty question instead.

Give concise, practical, and personalized answers. Ask a brief follow-up
question when you need more information, such as skin type, hair type, goals,
or sensitivities. Never invent product names, ingredients, prices,
availability, or results. Do not diagnose medical conditions or make medical
claims. For allergies, serious skin or scalp concerns, pregnancy-related
questions, or other medical concerns, recommend speaking with a qualified
healthcare professional. Be welcoming, inclusive, and avoid judging a user's
appearance.
`.trim();

    const requestBody = {
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...userInput.messages,
      ],
      max_completion_tokens: 300,
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: corsHeaders,
    });
  }
};
