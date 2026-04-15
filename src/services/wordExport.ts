import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, AlignmentType, WidthType, BorderStyle, HeadingLevel, VerticalAlign, Footer, PageNumber, PageOrientation, ImageRun } from "docx";
import { saveAs } from "file-saver";
import { IdentityData, MainInputData, GeneratorOutput } from "../types";
import { Buffer } from "buffer";

export async function exportToWord(identity: IdentityData, mainInput: MainInputData, output: GeneratorOutput) {
  const fetchImage = async (prompt: string): Promise<Buffer | null> => {
    try {
      const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=450&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;
      const response = await fetch(url);
      if (!response.ok) return null;
      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
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
                  new TableCell({ children: [new Paragraph(`Fase/Kelas/Sem: ${identity.fase}/${identity.kelas}/${identity.semester}`)] }),
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

          // CP & INDIKATOR SUMMARY
          new Paragraph({
            children: [
              new TextRun({ text: "CAPAIAN & INDIKATOR", bold: true, size: 24 }),
            ],
            spacing: { before: 200, after: 100 },
          }),
          ...mainInput.cpTpPairs.map((pair, index) => [
            new Paragraph({
              children: [
                new TextRun({ text: `CP #${index + 1}: `, bold: true }),
                new TextRun(pair.cp),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: `Indikator #${index + 1}: `, bold: true }),
                new TextRun(pair.tp),
              ],
              spacing: { after: 100 },
            }),
          ]).flat(),

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
                  item.no.toString(),
                  item.fase,
                  item.cp,
                  item.materi,
                  item.indikator,
                  item.levelKognitif,
                  item.noSoal.toString(),
                  item.bentukSoal
                ].map(text => new TableCell({
                  children: [new Paragraph({ text, alignment: AlignmentType.LEFT })]
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
              
              // Header if needed
              if (extraHeaders) {
                rows.push(new TableRow({
                  tableHeader: true,
                  children: [
                    new TableCell({ shading: { fill: "F2F2F2" }, width: { size: 5, type: WidthType.PERCENTAGE }, children: [new Paragraph({ text: "NO", alignment: AlignmentType.CENTER, style: "bold" })] }),
                    new TableCell({ shading: { fill: "F2F2F2" }, children: [new Paragraph({ text: "PERNYATAAN", alignment: AlignmentType.CENTER, style: "bold" })] }),
                    ...extraHeaders.map(h => new TableCell({ shading: { fill: "F2F2F2" }, width: { size: 25, type: WidthType.PERCENTAGE }, children: [new Paragraph({ text: h, alignment: AlignmentType.CENTER, style: "bold" })] }))
                  ]
                }));
              }

              for (let idx = 0; idx < questions.length; idx++) {
                const s = questions[idx];
                const contentChildren: any[] = [new Paragraph({ text: s.pertanyaan })];
                
                if (s.imagePrompt) {
                  const imageBuffer = await fetchImage(s.imagePrompt);
                  if (imageBuffer) {
                    contentChildren.push(new Paragraph({
                      children: [
                        new ImageRun({
                          data: imageBuffer,
                          transformation: { width: 227, height: 227 },
                        } as any),
                      ],
                      spacing: { before: 200, after: 200 },
                    }));
                  }
                }

                if (type === "PG" || type === "PGK") {
                  if (s.opsi) {
                    contentChildren.push(new Paragraph({ text: `a. ${s.opsi.a}` }));
                    contentChildren.push(new Paragraph({ text: `b. ${s.opsi.b}` }));
                    if (s.opsi.c) contentChildren.push(new Paragraph({ text: `c. ${s.opsi.c}` }));
                    if (s.opsi.d) contentChildren.push(new Paragraph({ text: `d. ${s.opsi.d}` }));
                    if (s.opsi.e) contentChildren.push(new Paragraph({ text: `e. ${s.opsi.e}` }));
                  }
                }

                const rowChildren = [
                  new TableCell({ width: { size: 5, type: WidthType.PERCENTAGE }, children: [new Paragraph({ text: `${s.no}.`, alignment: AlignmentType.CENTER })] }),
                  new TableCell({ children: contentChildren })
                ];

                if (extraHeaders) {
                  extraHeaders.forEach((h) => {
                    let cellText = "";
                    if (type === "Menjodohkan" && h === "JAWABAN" && shuffledAnswers) {
                      cellText = shuffledAnswers[idx] || "";
                    }
                    rowChildren.push(new TableCell({ children: [new Paragraph(cellText)] }));
                  });
                }

                rows.push(new TableRow({ children: rowChildren }));
              }

              return new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: rows
              });
            };

            const sections = [
              { tipe: 'Pilihan Ganda', label: (optionsStr: string) => `Berilah tanda silang (x) pada huruf ${optionsStr} di depan jawaban yang paling benar!` },
              { tipe: 'Pilihan Ganda Kompleks', label: (optionsStr: string) => `Berilah tanda silang (x) pada huruf ${optionsStr} di depan jawaban yang paling benar (Pilih 2 jawaban yang benar)!` },
              { tipe: 'Menjodohkan', label: () => `Pasangkanlah pernyataan di bawah ini dengan jawaban yang tepat!` },
              { tipe: 'Benar Salah', label: () => `Berilah tanda centang (√) pada kolom Benar atau Salah!` },
              { tipe: 'Isian', label: () => `Isilah titik-titik di bawah ini dengan jawaban yang tepat!` },
              { tipe: 'Uraian', label: () => `Jawablah pertanyaan-pertanyaan di bawah ini dengan benar!` }
            ];

            const activeSections = sections.filter(sec => output.soal.some(s => s.tipe === sec.tipe));
            const romanNumerals = ["I", "II", "III", "IV", "V", "VI"];

            for (let idx = 0; idx < activeSections.length; idx++) {
              const sec = activeSections[idx];
              const soalList = output.soal.filter(s => s.tipe === sec.tipe);
              const roman = romanNumerals[idx];

              if (sec.tipe === 'Pilihan Ganda') {
                const count = Number(mainInput.jumlahOpsiPG);
                const optionsStr = count === 3 ? "a, b, atau c" : count === 4 ? "a, b, c, atau d" : "a, b, c, d, atau e";
                result.push(new Paragraph({
                  children: [new TextRun({ text: `${roman}. ${sec.label(optionsStr)}`, bold: true })],
                  spacing: { before: idx === 0 ? 200 : 400, after: 100 },
                  border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } }
                }));
                for (const s of soalList) {
                  result.push(new Paragraph({
                    children: [new TextRun({ text: `${s.no}. `, bold: true }), new TextRun(s.pertanyaan)],
                    spacing: { before: 200 },
                  }));

                  if (s.imagePrompt) {
                    const imageBuffer = await fetchImage(s.imagePrompt);
                    if (imageBuffer) {
                      result.push(new Paragraph({
                        children: [
                          new ImageRun({
                            data: imageBuffer,
                            transformation: { width: 227, height: 227 },
                          } as any),
                        ],
                        spacing: { before: 200, after: 200 },
                      }));
                    }
                  }

                  if (s.opsi) {
                    result.push(new Paragraph({ text: `a. ${s.opsi.a}` }));
                    result.push(new Paragraph({ text: `b. ${s.opsi.b}` }));
                    if (s.opsi.c) result.push(new Paragraph({ text: `c. ${s.opsi.c}` }));
                    if (s.opsi.d) result.push(new Paragraph({ text: `d. ${s.opsi.d}` }));
                    if (s.opsi.e) result.push(new Paragraph({ text: `e. ${s.opsi.e}` }));
                  }
                }
              } else if (sec.tipe === 'Pilihan Ganda Kompleks') {
                const count = Number(mainInput.jumlahOpsiPGK);
                const optionsStr = count === 3 ? "a, b, atau c" : count === 4 ? "a, b, c, atau d" : "a, b, c, d, atau e";
                result.push(new Paragraph({
                  children: [new TextRun({ text: `${roman}. ${sec.label(optionsStr)}`, bold: true })],
                  spacing: { before: 400, after: 100 },
                  border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } }
                }));

                for (const s of soalList) {
                  result.push(new Paragraph({
                    children: [new TextRun({ text: `${s.no}. `, bold: true }), new TextRun(s.pertanyaan)],
                    spacing: { before: 200 },
                  }));

                  if (s.imagePrompt) {
                    const imageBuffer = await fetchImage(s.imagePrompt);
                    if (imageBuffer) {
                      result.push(new Paragraph({
                        children: [
                          new ImageRun({
                            data: imageBuffer,
                            transformation: { width: 227, height: 227 },
                          } as any),
                        ],
                        spacing: { before: 200, after: 200 },
                      }));
                    }
                  }

                  if (s.opsi) {
                    result.push(new Paragraph({ text: `a. ${s.opsi.a}` }));
                    result.push(new Paragraph({ text: `b. ${s.opsi.b}` }));
                    if (s.opsi.c) result.push(new Paragraph({ text: `c. ${s.opsi.c}` }));
                    if (s.opsi.d) result.push(new Paragraph({ text: `d. ${s.opsi.d}` }));
                    if (s.opsi.e) result.push(new Paragraph({ text: `e. ${s.opsi.e}` }));
                  }
                }
              } else if (sec.tipe === 'Menjodohkan') {
                result.push(new Paragraph({
                  children: [new TextRun({ text: `${roman}. ${sec.label("")}`, bold: true })],
                  spacing: { before: 400, after: 100 },
                  border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } }
                }));
                const answers = soalList.map(s => s.matchingAnswer || s.kunciJawaban).filter(Boolean);
                const shuffledAnswers = [...answers].sort(() => Math.random() - 0.5);
                result.push(await createQuestionTable(soalList, "Menjodohkan", ["JAWABAN"], shuffledAnswers));
              } else if (sec.tipe === 'Benar Salah') {
                result.push(new Paragraph({
                  children: [new TextRun({ text: `${roman}. ${sec.label("")}`, bold: true })],
                  spacing: { before: 400, after: 100 },
                  border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } }
                }));
                result.push(await createQuestionTable(soalList, "Benar Salah", ["BENAR", "SALAH"]));
              } else if (sec.tipe === 'Isian') {
                result.push(new Paragraph({
                  children: [new TextRun({ text: `${roman}. ${sec.label("")}`, bold: true })],
                  spacing: { before: 400, after: 100 },
                  border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } }
                }));

                for (const s of soalList) {
                  result.push(new Paragraph({
                    children: [new TextRun({ text: `${s.no}. `, bold: true }), new TextRun(s.pertanyaan)],
                    spacing: { before: 200 },
                  }));
                  if (s.imagePrompt) {
                    const imageBuffer = await fetchImage(s.imagePrompt);
                    if (imageBuffer) {
                      result.push(new Paragraph({
                        children: [
                          new ImageRun({
                            data: imageBuffer,
                            transformation: { width: 227, height: 227 },
                          } as any),
                        ],
                        spacing: { before: 200, after: 200 },
                      }));
                    }
                  }
                }
              } else if (sec.tipe === 'Uraian') {
                result.push(new Paragraph({
                  children: [new TextRun({ text: `${roman}. ${sec.label("")}`, bold: true })],
                  spacing: { before: 400, after: 100 },
                  border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } }
                }));

                for (const s of soalList) {
                  result.push(new Paragraph({
                    children: [new TextRun({ text: `${s.no}. `, bold: true }), new TextRun(s.pertanyaan)],
                    spacing: { before: 200 },
                  }));
                  if (s.imagePrompt) {
                    const imageBuffer = await fetchImage(s.imagePrompt);
                    if (imageBuffer) {
                      result.push(new Paragraph({
                        children: [
                          new ImageRun({
                            data: imageBuffer,
                            transformation: { width: 227, height: 227 },
                          } as any),
                        ],
                        spacing: { before: 200, after: 200 },
                      }));
                    }
                  }
                }
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

          ...output.soal.map(s => new Paragraph({
            children: [
              new TextRun({ text: `${s.no}. `, bold: true }),
              new TextRun(s.kunciJawaban),
            ],
          })),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Soal_${identity.mataPelajaran}_Kelas${identity.kelas}.docx`);
}
