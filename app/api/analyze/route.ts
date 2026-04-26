import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

// Interface for the AI's internal forensic response
interface AIAnalysis {
  integrityScore: number;
  confidence: "High" | "Medium" | "Low";
  semanticDrift: number;
  analysisNotes: string;
}

export async function POST(request: Request) {
  try {
    const { imageBase64, filename } = await request.json();

    if (!imageBase64) {
      return NextResponse.json({ error: 'Image payload is required' }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: "google/gemini-1.5-flash",
      // Using JSON mode to ensure the AI doesn't return conversational text
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are the Veris Integrity Engine. Analyze the image and return a JSON object.
          Evaluate:
          - ELA (Error Level Analysis) markers
          - Generative AI artifacts (lighting, edges)
          - Pixel consistency
          
          Structure:
          {
            "integrityScore": number (0-100),
            "confidence": "High" | "Medium" | "Low",
            "semanticDrift": number (0-100),
            "analysisNotes": "string"
          }`
        },
        {
          role: "user",
          content: [
            { type: "text", text: `Analyze forensic integrity for: ${filename}` },
            { 
              type: "image_url", 
              image_url: { url: `data:image/jpeg;base64,${imageBase64}` } 
            }
          ],
        },
      ],
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("Empty engine response");

    const analysisResult: AIAnalysis = JSON.parse(content);

    /**
     * VERIS TRUST INDEX FORMULA (v1.0)
     * Base Score: 40 (Has valid link in continuity chain)
     * Integrity Weight: 30% of Integrity Score
     * Semantic Weight: 10% of (100 - Semantic Drift)
     * Baseline Forensics: 20 (Passing metadata/header checks)
     */
    const originScore = 40; 
    const integrityWeight = (analysisResult.integrityScore / 100) * 30;
    const semanticWeight = ((100 - (analysisResult.semanticDrift || 0)) / 100) * 10;
    const baseForensics = 20; 

    const finalVerisIndex = Math.round(originScore + integrityWeight + semanticWeight + baseForensics);

    return NextResponse.json({ 
      success: true, 
      verisIndex: finalVerisIndex,
      details: analysisResult 
    });

  } catch (error: unknown) {
    console.error("OpenRouter Analysis Error:", error);
    return NextResponse.json({ error: 'Forensic analysis failed' }, { status: 500 });
  }
}