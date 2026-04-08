import { GoogleGenAI, Type } from "@google/genai";
import { IdentityData, MainInputData, GeneratorOutput } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateSoalAndKisiKisi(
  identity: IdentityData,
  mainInput: MainInputData
): Promise<GeneratorOutput> {
  const prompt = `
    Generate a structured exam grid (kisi-kisi), questions (soal), and answer key (kunci jawaban) for Madrasah Ibtidaiyah (MI).
    
    Identity:
    - School: ${identity.namaSatuanPendidikan}
    - Teacher: ${identity.namaGuru}
    - Subject: ${identity.mataPelajaran}
    - Phase: ${identity.fase}
    - Class: ${identity.kelas}
    - Semester: ${identity.semester}
    - Year: ${identity.tahunPelajaran}
    - Exam Mode: ${identity.examType.toUpperCase()}
    
    Content Details:
    - CP & Indikator Pairs:
      ${mainInput.cpTpPairs.map((p, i) => `Pair #${i + 1}:\n      CP: ${p.cp}\n      Indikator: ${p.tp}`).join('\n      ')}
    - Question Counts: PG=${mainInput.jumlahPilihanGanda}, PG Kompleks=${mainInput.jumlahPilihanGandaKompleks}, Isian=${mainInput.jumlahIsian}, Uraian=${mainInput.jumlahUraian}
    - Cognitive Levels: L1=${mainInput.persenL1}%, L2=${mainInput.persenL2}%, L3=${mainInput.persenL3}%
    - Image Percentage: ${mainInput.persenGambar}% of questions should have an imagePrompt.
    
    Guidelines:
    - L1 = C1, C2 (Remembering, Understanding)
    - L2 = C3, C4 (Applying, Analyzing)
    - L3 = C5, C6 (Evaluating, Creating)
    - If Exam Mode is HOTS, focus on L2 and L3 levels with complex scenarios.
    - Pilihan Ganda Kompleks: Questions where students can choose more than one correct answer (provide 5 options a-e).
    - Indicators must be derived from the provided Indikator field.
    - Questions must be in Indonesian (Bahasa Indonesia).
    - For PG, provide 4 options (a, b, c, d).
    - For questions that might need an image, provide a descriptive 'imagePrompt'.
    - Ensure the number of questions matches the requested counts.
    - Distribute cognitive levels according to the percentages.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          kisiKisi: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                no: { type: Type.NUMBER },
                fase: { type: Type.STRING },
                cp: { type: Type.STRING },
                materi: { type: Type.STRING },
                indikator: { type: Type.STRING },
                levelKognitif: { type: Type.STRING },
                noSoal: { type: Type.NUMBER },
                bentukSoal: { type: Type.STRING }
              },
              required: ["no", "fase", "cp", "materi", "indikator", "levelKognitif", "noSoal", "bentukSoal"]
            }
          },
          soal: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                no: { type: Type.NUMBER },
                tipe: { type: Type.STRING },
                pertanyaan: { type: Type.STRING },
                opsi: {
                  type: Type.OBJECT,
                  properties: {
                    a: { type: Type.STRING },
                    b: { type: Type.STRING },
                    c: { type: Type.STRING },
                    d: { type: Type.STRING },
                    e: { type: Type.STRING }
                  }
                },
                kunciJawaban: { type: Type.STRING },
                levelKognitif: { type: Type.STRING },
                indikator: { type: Type.STRING },
                imagePrompt: { type: Type.STRING }
              },
              required: ["no", "tipe", "pertanyaan", "kunciJawaban", "levelKognitif", "indikator"]
            }
          },
          kunciJawaban: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["kisiKisi", "soal", "kunciJawaban"]
      }
    }
  });

  return JSON.parse(response.text);
}
