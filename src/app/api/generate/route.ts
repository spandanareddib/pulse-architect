import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize the AI with your key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    // Try 'gemini-1.5-flash'. If it fails, we'll know it's a region/key issue.
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const systemPrompt = `
      You are a Software Architect. Analyze this idea and return ONLY a JSON object.
      Format:
      {
        "projectName": "Name",
        "architecture": {
          "nodes": [{"id": "1", "label": "Frontend", "type": "client"}, {"id": "2", "label": "Backend", "type": "server"}],
          "edges": [{"from": "1", "to": "2", "label": "API"}]
        },
        "tasks": [{"title": "Task 1", "priority": "high", "role": "frontend"}],
        "suggestedStack": "Next.js"
      }
    `;

    const result = await model.generateContent([systemPrompt, prompt]);
    const responseText = result.response.text();
    
    // Find the first '{' and the last '}' to ignore any extra text
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error("AI response did not contain a valid JSON object");
    }
    
    const parsedData = JSON.parse(jsonMatch[0]);
    return NextResponse.json(parsedData);

  } catch (error: any) {
    console.error("DETAILED AI ERROR:", error);
    return NextResponse.json(
      { error: "AI Error", details: error.message }, 
      { status: 500 }
    );
  }
}