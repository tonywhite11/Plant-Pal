
import { GoogleGenAI, Type, Part } from "@google/genai";
import type { DiagnosisReport } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const diagnosisSchema = {
  type: Type.OBJECT,
  properties: {
    possibleDiseases: {
      type: Type.ARRAY,
      description: "A list of potential diseases matching the symptoms. Provide 1 to 3 possibilities.",
      items: {
        type: Type.OBJECT,
        properties: {
          diseaseName: {
            type: Type.STRING,
            description: "The common name of the plant disease.",
          },
          description: {
            type: Type.STRING,
            description: "A brief, easy-to-understand description of the disease and its typical symptoms.",
          },
          remedies: {
            type: Type.ARRAY,
            description: "A list of actionable steps or treatments to remedy the disease.",
            items: { type: Type.STRING },
          },
          prevention: {
            type: Type.ARRAY,
            description: "A list of tips to prevent this disease from occurring in the future.",
            items: { type: Type.STRING },
          },
        },
        required: ["diseaseName", "description", "remedies", "prevention"],
      },
    },
    summary: {
      type: Type.STRING,
      description: "A brief, encouraging summary of the diagnosis and next steps for the user."
    }
  },
  required: ["possibleDiseases", "summary"],
};


export const diagnosePlant = async (
  symptoms: string,
  plantType: string,
  imageBase64: string | null,
  mimeType: string | null
): Promise<DiagnosisReport> => {
  const plantContext = plantType ? `The user has specified the plant type as: "${plantType}". Take this into special consideration when diagnosing.` : "The user has not specified the plant type.";
  
  const prompt = `
    You are an expert botanist and plant pathologist AI assistant named 'Plant Pal'. 
    A user is describing their plant's symptoms and has optionally provided an image and plant type. Your task is to analyze these inputs and provide a helpful diagnosis.

    ${plantContext}

    User's description of symptoms: "${symptoms}"

    Analyze the user's text description and, if provided, the image and plant type. Identify potential diseases. For each disease, provide its name, a simple description, 
    a list of remedies, and a list of prevention tips. Also, include a brief overall summary. 
    Format your response according to the provided JSON schema. If the image is unclear or doesn't seem to show a plant, mention that in your summary but still provide a diagnosis based on the text if possible.
  `;

  const contentParts: Part[] = [];

  if (imageBase64 && mimeType) {
    contentParts.push({
        inlineData: {
            mimeType: mimeType,
            data: imageBase64,
        }
    });
  }

  contentParts.push({ text: prompt });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: contentParts },
      config: {
        responseMimeType: 'application/json',
        responseSchema: diagnosisSchema,
        temperature: 0.5,
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
      throw new Error("API returned an empty response.");
    }

    const diagnosisData = JSON.parse(jsonText);
    return diagnosisData as DiagnosisReport;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get a diagnosis from the AI model.");
  }
};
