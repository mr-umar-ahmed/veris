// app/api/analyze/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize the OpenAI client pointing to OpenRouter's URL
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { imageBase64, filename } = await request.json();

    if (!imageBase64) {
      return NextResponse.json({ error: 'Image payload is required' }, { status: 400 });
    }

    // We are using Gemini 1.5 Flash VIA OpenRouter for speed and multimodal capabilities.
    // You can easily swap this to "anthropic/claude-3-haiku" if needed.
    const response = await openai.chat.completions.create({
      model: "google/gemini-1.5-flash",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are the Veris Integrity Engine, a forensic visual analyzer. 
          Your job is to analyze the provided media and output ONLY a JSON object evaluating its structural integrity.
          
          Look for:
          - Compression artifacts indicating re-saving
          - Deepfake/generative anomalies (weird hands, blurred edges, lighting mismatches)
          - Splicing or unnatural overlays
          
          Output exactly this JSON structure and nothing else:
          {
            "integrityScore": <number 0-100>,
            "confidence": <"High" | "Medium" | "Low">,
            "semanticDrift": <number 0-100, 0 means original, 100 means entirely different context>,
            "analysisNotes": "<Brief 1-sentence technical observation>"
          }`
        },
        {
          role: "user",
          content: [
            { type: "text", text: `Analyze this file named: ${filename}` },
            { 
              type: "image_url", 
              image_url: { 
                url: `data:image/jpeg;base64,${imageBase64}` 
              } 
            }
          ],
        },
      ],
    });

    // Parse the JSON string returned by the model
    const analysisResult = JSON.parse(response.choices[0].message.content || "{}");

    // Calculate the final Veris Trust Index (Formula from your pitch)
    // Origin Seal (Assuming 40 since it's passing through this route) + Integrity (30%) + Semantic (10%)
    const originScore = 40; // Base score for having a valid Continuity Chain link
    const integrityWeight = (analysisResult.integrityScore / 100) * 30;
    const semanticWeight = ((100 - (analysisResult.semanticDrift || 0)) / 100) * 10;
    const baseForensics = 20; // Assuming basic metadata checks pass

    const finalVerisIndex = Math.round(originScore + integrityWeight + semanticWeight + baseForensics);

    return NextResponse.json({ 
      success: true, 
      verisIndex: finalVerisIndex,
      details: analysisResult 
    });

  } catch (error) {
    console.error("OpenRouter Analysis Error:", error);
    return NextResponse.json({ error: 'Failed to analyze media integrity' }, { status: 500 });
  }
}