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
    - Exam Type: ${identity.jenisUjian}
    - Phase: ${identity.fase}
    - Class: ${identity.kelas}
    - Semester: ${identity.semester}
    - Year: ${identity.tahunPelajaran}
    - Exam Mode: ${identity.examType.toUpperCase()}
    
    Content Details:
    - CP & Indikator Pairs:
      ${mainInput.cpTpPairs.map((p, i) => `Pair #${i + 1}:\n      CP: ${p.cp}\n      Indikator: ${p.tp}${p.fase ? `\n      Phase (Fase): ${p.fase}` : ''}`).join('\n      ')}
    - Question Counts: PG=${mainInput.jumlahPilihanGanda}, PG Kompleks=${mainInput.jumlahPilihanGandaKompleks}, Isian=${mainInput.jumlahIsian}, Uraian=${mainInput.jumlahUraian}, Menjodohkan=${mainInput.jumlahMenjodohkan}, Benar Salah=${mainInput.jumlahBenarSalah}
    - Cognitive Levels: L1=${mainInput.persenL1}%, L2=${mainInput.persenL2}%, L3=${mainInput.persenL3}%
    - Image Percentage: ${mainInput.persenGambar}% of questions should have an imagePrompt.
    
    Guidelines:
    - L1 = C1, C2 (Remembering, Understanding)
    - L2 = C3, C4 (Applying, Analyzing)
    - L3 = C5, C6 (Evaluating, Creating)
    - IMPORTANT: For UJIAN MADRASAH, use the specific 'Phase (Fase)' provided for each CP/TP pair in the Kisi-kisi grid. If not provided, use the global Phase: ${identity.fase}.
    - HOTS Mode Requirements:
      * Focus heavily on L2 and L3 levels.
      * Indicators in Kisi-kisi MUST follow the pattern: [Stimulus] + Murid + [Indikator] + [Keterangan].
      * Example Indicator: "Disajikan peristiwa singkat tentang Asmaul husna As-Sami', Murid Menjelaskan makna al-Asma' al-Husna (as-Sami') dengan benar".
      * Questions MUST be based on the stimulus provided in the indicator (e.g., start with a short story, case study, table, or image).
    - Stimulus Guidelines:
      * If Exam Mode is SIMPLE: The stimulus in the question must be brief and concise (1-2 short sentences).
      * If Exam Mode is HOTS: The stimulus in the question must be longer, providing more context or a short story (3-5 sentences).
    - Pilihan Ganda (PG): Provide exactly ${mainInput.jumlahOpsiPG} options.
    - Pilihan Ganda Kompleks (PGK): Questions where students can choose more than one correct answer. Provide exactly ${mainInput.jumlahOpsiPGK} options and ensure exactly 2 correct answers for each PGK question.
    - Menjodohkan: Questions where students match items from two columns. For each Menjodohkan question, provide the statement in 'pertanyaan' and the corresponding correct matching item in 'matchingAnswer' and 'kunciJawaban'.
    - Benar Salah: Questions where students choose between "Benar" or "Salah".
    - For Isian and Uraian, DO NOT provide any options (opsi).
    - Indicators must be derived from the provided Indikator field in the input, but enhanced with the stimulus pattern for HOTS.
    - The entire content (kisi-kisi, questions, and answer key) must be in:
      * ${identity.mataPelajaran === 'Bahasa Sunda' ? 'Sundanese (Bahasa Sunda)' : identity.mataPelajaran === 'Bahasa Arab' ? 'Arabic (Bahasa Arab) using proper Arabic script (with harakat if appropriate for MI level)' : 'Indonesian (Bahasa Indonesia)'}.
    - For Bahasa Arab: The 'pertanyaan' and 'opsi' MUST be in Arabic script. The 'indikator' and 'materi' in Kisi-kisi can be in Indonesian but the 'pertanyaan' in the Soal section MUST be Arabic.
    - For questions that might need an image, provide a descriptive 'imagePrompt'.
    - Ensure the number of questions matches the requested counts.
    - IMPORTANT: The question numbers ('no') MUST be sequential across ALL types, starting from 1 for the first section and continuing through the last section (e.g., if PG is 1-10, PGK starts at 11).
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
                matchingAnswer: { type: Type.STRING },
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
