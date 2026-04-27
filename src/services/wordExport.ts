import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, AlignmentType, WidthType, BorderStyle, HeadingLevel, VerticalAlign, Footer, PageNumber, PageOrientation, ImageRun } from "docx";
import { saveAs } from "file-saver";
import { IdentityData, MainInputData, GeneratorOutput } from "../types";
import { Buffer } from "buffer";
import { toArabicNumerals } from "../lib/arabicUtils";

export async function exportToWord(identity: IdentityData, mainInput: MainInputData, output: GeneratorOutput) {
  const isArabic = identity.mataPelajaran === 'Bahasa Arab';
  const toArabicOption = (char: string) => {
    const map: Record<string, string> = {
      'a': 'أ',
      'b': 'ب',
      'c': 'ج',
      'd': 'د',
      'e': 'هـ'
    };
    return map[char.toLowerCase()] || char;
  };
  const formatNo = (no: number | string) => isArabic ? toArabicNumerals(no) : `${no}.`;
  const fetchImage = async (prompt: string, seed: number): Promise<Uint8Array | null> => {
    try {
      const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=800&nologo=true&seed=${seed}`;
      const response = await fetch(url);
      if (!response.ok) return null;
      const arrayBuffer = await response.arrayBuffer();
      return new Uint8Array(arrayBuffer);
    } catch (error) {
      console.error("Failed to fetch image:", error);
      return null;
    }
  };

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              width: "210mm",
              height: "297mm",
            },
            margin: {
              top: "2cm",
              right: "2cm",
              bottom: "2cm",
              left: "2cm",
            },
          },
        },
        children: [
          // KISI-KISI TITLE
          new Paragraph({
            text: "KISI-KISI INSTRUMEN SOAL",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),

          // IDENTITY TABLE
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph(`Nama Guru: ${identity.namaGuru}`)] }),
                  new TableCell({ 
                    children: [
                      new Paragraph(
                        identity.jenisUjian === 'UJIAN MADRASAH' 
                        ? "UJIAN MADRASAH" 
                        : `Fase/Kelas/Sem: ${identity.fase}/${identity.kelas}/${identity.semester}`
                      )
                    ] 
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph(`Satuan Pendidikan: ${identity.namaSatuanPendidikan}`)] }),
                  new TableCell({ children: [new Paragraph(`Tahun Pelajaran: ${identity.tahunPelajaran}`)] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph(`Mata Pelajaran: ${identity.mataPelajaran}`)] }),
                  new TableCell({ children: [new Paragraph("")] }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: "", spacing: { after: 200 } }),

          // KISI-KISI MAIN TABLE
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  "NO", "FASE", "CP", "MATERI", "INDIKATOR", "LEVEL", "NO SOAL", "BENTUK"
                ].map(text => new TableCell({
                  shading: { fill: "E0F2F1" },
                  verticalAlign: VerticalAlign.CENTER,
                  children: [new Paragraph({ text, alignment: AlignmentType.CENTER, style: "bold" })]
                }))
              }),
              ...output.kisiKisi.map(item => new TableRow({
                children: [
                  isArabic ? toArabicNumerals(item.no) : item.no.toString(),
                  item.fase,
                  item.cp,
                  item.materi,
                  item.indikator,
                  item.levelKognitif,
                  isArabic ? toArabicNumerals(item.noSoal) : item.noSoal.toString(),
                  item.bentukSoal
                ].map(text => new TableCell({
                  children: [new Paragraph({ 
                    children: [new TextRun({ text, font: isArabic ? "Traditional Arabic" : undefined, size: isArabic ? 24 : undefined })],
                    bidirectional: isArabic,
                    alignment: isArabic ? AlignmentType.RIGHT : AlignmentType.LEFT 
                  })]
                }))
              }))
            ]
          }),

          new Paragraph({ text: "", spacing: { before: 400 } }),

          // SIGNATURES
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({ text: "Mengetahui,", alignment: AlignmentType.CENTER }),
                      new Paragraph({ text: "Kepala Madrasah,", alignment: AlignmentType.CENTER }),
                      new Paragraph({ text: "", spacing: { before: 800 } }),
                      new Paragraph({ text: identity.namaKepalaMadrasah, style: "bold", alignment: AlignmentType.CENTER }),
                      new Paragraph({ text: `NIP. ${identity.nipKepalaMadrasah || "...................."}`, alignment: AlignmentType.CENTER }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({ text: `Ciamis, ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`, alignment: AlignmentType.CENTER }),
                      new Paragraph({ text: "Guru Mata Pelajaran,", alignment: AlignmentType.CENTER }),
                      new Paragraph({ text: "", spacing: { before: 800 } }),
                      new Paragraph({ text: identity.namaGuru, style: "bold", alignment: AlignmentType.CENTER }),
                      new Paragraph({ text: `NIP. ${identity.nipGuru || "...................."}`, alignment: AlignmentType.CENTER }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // PAGE BREAK FOR SOAL
          new Paragraph({ text: "", pageBreakBefore: true }),

          // NASKAH SOAL TITLE
          new Paragraph({
            text: "NASKAH SOAL",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),

          // SOAL CONTENT
          ...await (async () => {
            const pg = output.soal.filter(s => s.tipe === "Pilihan Ganda");
            const pgk = output.soal.filter(s => s.tipe === "Pilihan Ganda Kompleks");
            const menjodohkan = output.soal.filter(s => s.tipe === "Menjodohkan");
            const bs = output.soal.filter(s => s.tipe === "Benar Salah");
            const isian = output.soal.filter(s => s.tipe === "Isian");
            const uraian = output.soal.filter(s => s.tipe === "Uraian");

            const result: any[] = [];

            const createQuestionTable = async (questions: any[], type: string, extraHeaders?: string[], shuffledAnswers?: string[]) => {
              const rows = [];
              const isEssayLike = type === "PG" || type === "PGK" || type === "Essay";
              
              // Header if needed
              if (extraHeaders) {
                const headers = ["NO", "PERNYATAAN", ...extraHeaders];
                if (isArabic) headers.reverse();

                rows.push(new TableRow({
                  tableHeader: true,
                  children: headers.map(text => {
                    let localizedText = text;
                    if (isArabic) {
                      if (text === "NO") localizedText = "رقم";
                      if (text === "PERNYATAAN") localizedText = "البيان";
                      if (text === "BENAR") localizedText = "صح";
                      if (text === "SALAH") localizedText = "خطأ";
                      if (text === "JAWABAN") localizedText = "الإجابة";
                    }
                    return new TableCell({ 
                      shading: { fill: "F2F2F2" }, 
                      width: text === "NO" ? { size: 8, type: WidthType.PERCENTAGE } : (text === "PERNYATAAN" ? undefined : { size: 15, type: WidthType.PERCENTAGE }),
                      children: [new Paragraph({ 
                        children: [new TextRun({ text: localizedText, bold: true, size: isArabic ? 26 : undefined, font: isArabic ? "Traditional Arabic" : undefined })], 
                        alignment: AlignmentType.CENTER 
                      })] 
                    });
                  })
                }));
              }

              for (let idx = 0; idx < questions.length; idx++) {
                const s = questions[idx];
                const isPG = type === "PG" || type === "PGK";

                // 1. Question Text Row
                const questionContent: any[] = [
                  new Paragraph({ 
                    children: [new TextRun({ text: s.pertanyaan, font: isArabic ? "Traditional Arabic" : undefined, size: isArabic ? 26 : undefined })],
                    bidirectional: isArabic,
                    alignment: isArabic ? AlignmentType.RIGHT : AlignmentType.LEFT,
                    spacing: { before: 100 }
                  })
                ];
                
                if (s.imagePrompt) {
                  const imageBuffer = await fetchImage(s.imagePrompt, s.no);
                  if (imageBuffer) {
                    questionContent.push(new Paragraph({
                      children: [
                        new ImageRun({
                          data: imageBuffer,
                          transformation: { width: 200, height: 200 },
                        } as any),
                      ],
                      spacing: { before: 200, after: 200 },
                      alignment: isArabic ? AlignmentType.RIGHT : AlignmentType.LEFT,
                    }));
                  }
                }

                const qNoCell = new TableCell({ 
                  width: { size: 8, type: WidthType.PERCENTAGE }, 
                  borders: isEssayLike ? { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } : undefined,
                  children: [new Paragraph({ 
                    children: [new TextRun({ text: formatNo(s.no), size: isArabic ? 26 : undefined, bold: true, font: isArabic ? "Traditional Arabic" : undefined })], 
                    alignment: isArabic ? AlignmentType.RIGHT : AlignmentType.CENTER 
                  })] 
                });
                const qMainCell = new TableCell({ 
                  children: questionContent, 
                  verticalAlign: VerticalAlign.TOP,
                  borders: isEssayLike ? { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } : undefined,
                });

                const qCells = [qNoCell, qMainCell];
                if (extraHeaders) {
                  extraHeaders.forEach((h) => {
                    let cellText = "";
                    if (type === "Menjodohkan" && h === "JAWABAN" && shuffledAnswers) {
                      cellText = shuffledAnswers[idx] || "";
                    }
                    qCells.push(new TableCell({ 
                      children: [
                        new Paragraph({ 
                          children: [new TextRun({ text: cellText, font: isArabic ? "Traditional Arabic" : undefined, size: isArabic ? 26 : undefined })],
                          bidirectional: isArabic,
                          alignment: AlignmentType.CENTER
                        })
                      ] 
                    }));
                  });
                }

                if (isArabic) {
                  const arCells = [...qCells.slice(2).reverse(), qMainCell, qNoCell];
                  rows.push(new TableRow({ children: extraHeaders ? arCells : [qMainCell, qNoCell] }));
                } else {
                  rows.push(new TableRow({ children: qCells }));
                }

                // 2. Options Rows (for Multiple Choice)
                if (isPG && s.opsi) {
                  const count = Number(type === "PG" ? mainInput.jumlahOpsiPG : mainInput.jumlahOpsiPGK);
                  const options = [
                    { key: 'a', label: isArabic ? '.أ' : 'a.' },
                    { key: 'b', label: isArabic ? '.ب' : 'b.' },
                    { key: 'c', label: isArabic ? '.ج' : 'c.' },
                    { key: 'd', label: isArabic ? '.د' : 'd.' },
                    { key: 'e', label: isArabic ? '.هـ' : 'e.' }
                  ].slice(0, count);

                  for (const opt of options) {
                    const val = (s.opsi as any)[opt.key];
                    if (val) {
                      const optLabelCell = new TableCell({
                        width: { size: 8, type: WidthType.PERCENTAGE },
                        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                        children: [new Paragraph({
                          children: [new TextRun({ text: opt.label, size: isArabic ? 26 : undefined, bold: true, font: isArabic ? "Traditional Arabic" : undefined })],
                          alignment: isArabic ? AlignmentType.RIGHT : AlignmentType.CENTER
                        })]
                      });
                      const optValCell = new TableCell({
                        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                        children: [new Paragraph({
                          children: [new TextRun({ text: val, font: isArabic ? "Traditional Arabic" : undefined, size: isArabic ? 26 : undefined })],
                          bidirectional: isArabic,
                          alignment: isArabic ? AlignmentType.RIGHT : AlignmentType.LEFT,
                          spacing: { before: 50 }
                        })]
                      });

                      if (isArabic) {
                        rows.push(new TableRow({ children: [optValCell, optLabelCell] }));
                      } else {
                        rows.push(new TableRow({ children: [optLabelCell, optValCell] }));
                      }
                    }
                  }
                }
              }

              return new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                borders: isEssayLike ? {
                  top: { style: BorderStyle.NONE },
                  bottom: { style: BorderStyle.NONE },
                  left: { style: BorderStyle.NONE },
                  right: { style: BorderStyle.NONE },
                  insideHorizontal: { style: BorderStyle.NONE },
                  insideVertical: { style: BorderStyle.NONE },
                } : {
                  top: { style: BorderStyle.SINGLE, size: 4 },
                  bottom: { style: BorderStyle.SINGLE, size: 4 },
                  left: { style: BorderStyle.SINGLE, size: 4 },
                  right: { style: BorderStyle.SINGLE, size: 4 },
                  insideHorizontal: { style: BorderStyle.SINGLE, size: 2 },
                  insideVertical: { style: BorderStyle.SINGLE, size: 2 },
                },
                rows: rows
              });
            };

            const sections = [
              { 
                tipe: 'Pilihan Ganda', 
                label: (optionsStr: string) => isArabic 
                  ? `أشر بالعلامة (x) على حرف ${optionsStr} أمام أصح الإجابات!` 
                  : `Berilah tanda silang (x) pada huruf ${optionsStr} di depan jawaban yang paling benar!` 
              },
              { 
                tipe: 'Pilihan Ganda Kompleks', 
                label: (optionsStr: string) => isArabic 
                  ? `أشر بالعلامة (x) على حرف ${optionsStr} أمام أصح الإجابات (اختر إجابتين صحيحتين)!` 
                  : `Berilah tanda silang (x) pada huruf ${optionsStr} di depan jawaban yang paling benar (Pilih 2 jawaban yang benar)!` 
              },
              { 
                tipe: 'Menjodohkan', 
                label: () => isArabic 
                  ? `قم بمطابقة البيانات التالية بالإجابات المناسبة!` 
                  : `Pasangkanlah pernyataan di bawah ini dengan jawaban yang tepat!` 
              },
              { 
                tipe: 'Benar Salah', 
                label: () => isArabic 
                  ? `ضع علامة (√) في عمود صح أو خطأ!` 
                  : `Berilah tanda centang (√) pada kolom Benar atau Salah!` 
              },
              { 
                tipe: 'Isian', 
                label: () => isArabic 
                  ? `املأ الفراغات التالية بالإجابات المناسبة!` 
                  : `Isilah titik-titik di bawah ini dengan jawaban yang tepat!` 
              },
              { 
                tipe: 'Uraian', 
                label: () => isArabic 
                  ? `أجب عن الأسئلة التالية بوضوح!` 
                  : `Jawablah pertanyaan-pertanyaan di bawah ini dengan benar!` 
              }
            ];

            const activeSections = sections.filter(sec => output.soal.some(s => s.tipe === sec.tipe));
            const romanNumerals = ["I", "II", "III", "IV", "V", "VI"];
            for (let idx = 0; idx < activeSections.length; idx++) {
              const sec = activeSections[idx];
              const soalList = output.soal.filter(s => s.tipe === sec.tipe);
              const roman = romanNumerals[idx];

              if (sec.tipe === 'Pilihan Ganda' || sec.tipe === 'Pilihan Ganda Kompleks') {
                const count = Number(sec.tipe === 'Pilihan Ganda' ? mainInput.jumlahOpsiPG : mainInput.jumlahOpsiPGK);
                const optionsStr = isArabic 
                  ? (count === 3 ? 'أ، ب، أو ج' : count === 4 ? 'أ، ب، ج، أو د' : 'أ، ب، ج، د، أو هـ')
                  : (count === 3 ? 'a, b, atau c' : count === 4 ? 'a, b, c, atau d' : 'a, b, c, d, atau e');
                
                result.push(new Paragraph({
                  children: [new TextRun({ text: `${roman}. ${sec.label(optionsStr)}`, bold: true, size: isArabic ? 28 : undefined, font: isArabic ? "Traditional Arabic" : undefined })],
                  spacing: { before: idx === 0 ? 200 : 400, after: 100 },
                  border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
                  bidirectional: isArabic,
                  alignment: isArabic ? AlignmentType.RIGHT : AlignmentType.LEFT
                }));

                // Use the question table helper for consistent layout
                result.push(await createQuestionTable(soalList, "PG"));
              } else if (sec.tipe === 'Menjodohkan') {
                result.push(new Paragraph({
                  children: [new TextRun({ text: `${roman}. ${sec.label("")}`, bold: true, size: isArabic ? 28 : undefined, font: isArabic ? "Traditional Arabic" : undefined })],
                  spacing: { before: 400, after: 100 },
                  border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
                  bidirectional: isArabic,
                  alignment: isArabic ? AlignmentType.RIGHT : AlignmentType.LEFT
                }));
                const answers = soalList.map(s => s.matchingAnswer || s.kunciJawaban).filter(Boolean);
                const shuffledAnswers = [...answers].sort(() => Math.random() - 0.5);
                result.push(await createQuestionTable(soalList, "Menjodohkan", ["JAWABAN"], shuffledAnswers));
              } else if (sec.tipe === 'Benar Salah') {
                result.push(new Paragraph({
                  children: [new TextRun({ text: `${roman}. ${sec.label("")}`, bold: true, size: isArabic ? 28 : undefined, font: isArabic ? "Traditional Arabic" : undefined })],
                  spacing: { before: 400, after: 100 },
                  border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
                  bidirectional: isArabic,
                  alignment: isArabic ? AlignmentType.RIGHT : AlignmentType.LEFT
                }));
                result.push(await createQuestionTable(soalList, "Benar Salah", ["BENAR", "SALAH"]));
              } else if (sec.tipe === 'Isian' || sec.tipe === 'Uraian') {
                result.push(new Paragraph({
                  children: [new TextRun({ text: `${roman}. ${sec.label("")}`, bold: true, size: isArabic ? 28 : undefined, font: isArabic ? "Traditional Arabic" : undefined })],
                  spacing: { before: 400, after: 100 },
                  border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
                  bidirectional: isArabic,
                  alignment: isArabic ? AlignmentType.RIGHT : AlignmentType.LEFT
                }));

                result.push(await createQuestionTable(soalList, "Essay"));
              }
            }

            return result;
          })(),

          // PAGE BREAK FOR KUNCI
          new Paragraph({ text: "", pageBreakBefore: true }),

          // KUNCI JAWABAN TITLE
          new Paragraph({
            text: "KUNCI JAWABAN",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),

          // KUNCI JAWABAN
          ...output.soal.map(s => new Paragraph({
            children: [
              new TextRun({ text: formatNo(s.no) + " ", bold: true, size: isArabic ? 26 : undefined, font: isArabic ? "Traditional Arabic" : undefined }),
              new TextRun({ 
                text: isArabic && (s.tipe === 'Pilihan Ganda' || s.tipe === 'Pilihan Ganda Kompleks')
                  ? toArabicOption(s.kunciJawaban || '')
                  : (s.kunciJawaban || "-"), 
                font: isArabic ? "Traditional Arabic" : undefined,
                size: isArabic ? 26 : undefined
              }),
            ],
            bidirectional: isArabic,
            alignment: isArabic ? AlignmentType.RIGHT : AlignmentType.LEFT
          })),
        ],
      },
    ],
  });

  try {
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Soal_${identity.mataPelajaran.replace(/\//g, '-')}_Kelas${identity.kelas}.docx`);
  } catch (error) {
    console.error("Docx generation error:", error);
    alert("Gagal membuat file Word. Silakan coba lagi.");
  }
}
