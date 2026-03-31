// Bu dosya app/api/chat/route.ts ile aynıdır.
// Buildathon gereksinimine göre features/ klasörüne kopyalandı.
// Gerçek kod: app/api/chat/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userText, systemPrompt } = await req.json();

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ text: "API key not configured." }, { status: 500 });
  }

  const prompt = `${systemPrompt}\n\nUser: ${userText}`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 256,
        },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ text: "AI error: " + err }, { status: 500 });
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "Could you repeat that?";
  return NextResponse.json({ text });
}
