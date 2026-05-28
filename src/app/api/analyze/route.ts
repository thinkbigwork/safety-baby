import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { buildAnalysisPrompt } from "@/lib/prompts";
import type { BabyStage, AnalysisResult } from "@/lib/types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { photos, stage, locale } = body as {
      photos: { room: string; base64: string; mimeType: string }[];
      stage: BabyStage;
      locale: string;
    };

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    if (!photos || photos.length === 0 || !stage) {
      return NextResponse.json(
        { error: "Missing photos or stage" },
        { status: 400 }
      );
    }

    const systemPrompt = buildAnalysisPrompt(stage, locale || "en");

    // Build content parts: system prompt + all room images
    const contents: Array<
      | { text: string }
      | { inlineData: { mimeType: string; data: string } }
    > = [{ text: systemPrompt }];

    for (const photo of photos) {
      contents.push({
        text: `\n--- Photo of: ${photo.room.toUpperCase()} ---`,
      });
      contents.push({
        inlineData: {
          mimeType: photo.mimeType || "image/jpeg",
          data: photo.base64,
        },
      });
    }

    contents.push({
      text: locale === "es"
        ? "\nAhora analiza todas las fotos de las habitaciones anteriores y proporciona la evaluación de seguridad completa en formato JSON."
        : "\nNow analyze all the room photos above and provide the complete safety evaluation as JSON.",
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
    });

    const text = response.text || "";

    // Parse JSON from response (handle potential markdown code fences)
    let jsonStr = text.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const result: AnalysisResult = JSON.parse(jsonStr);

    // Calculate total findings
    result.totalFindings = result.rooms.reduce(
      (sum, room) => sum + room.findings.length,
      0
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      {
        error: "Failed to analyze images",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
