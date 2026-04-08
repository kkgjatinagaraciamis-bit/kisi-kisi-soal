import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, AlignmentType, WidthType, BorderStyle, HeadingLevel, VerticalAlign, Footer, PageNumber, PageOrientation } from "docx";
import { saveAs } from "file-saver";
import { IdentityData, MainInputData, GeneratorOutput } from "../types";

export async function exportToWord(identity: IdentityData, mainInput: MainInputData, output: GeneratorOutput) {
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
          ...(() => {
            const pg = output.soal.filter(s => s.tipe === "Pilihan Ganda");
            const pgk = output.soal.filter(s => s.tipe === "Pilihan Ganda Kompleks");
            const isian = output.soal.filter(s => s.tipe === "Isian");
            const uraian = output.soal.filter(s => s.tipe === "Uraian");

            const result: any[] = [];

            if (pg.length > 0) {
              result.push(new Paragraph({
                children: [new TextRun({ text: "I. Berilah tanda silang (x) pada huruf a, b, c, atau d di depan jawaban yang paling benar!", bold: true })],
                spacing: { before: 200, after: 100 },
                border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } }
              }));
              pg.forEach(s => {
                result.push(new Paragraph({
                  children: [new TextRun({ text: `${s.no}. `, bold: true }), new TextRun(s.pertanyaan)],
                  spacing: { before: 200 },
                }));
                result.push(new Paragraph({ text: `a. ${s.opsi?.a}    b. ${s.opsi?.b}` }));
                result.push(new Paragraph({ text: `c. ${s.opsi?.c}    d. ${s.opsi?.d}` }));
                if (s.imagePrompt) {
                  result.push(new Paragraph({ children: [new TextRun({ text: `[BOX GAMBAR: ${s.imagePrompt}]`, italics: true })], spacing: { before: 100, after: 100 } }));
                }
              });
            }

            if (pgk.length > 0) {
              result.push(new Paragraph({
                children: [new TextRun({ text: "II. Berilah tanda silang (x) pada huruf a, b, c, d, atau e di depan jawaban yang paling benar (Jawaban dapat lebih dari satu)!", bold: true })],
                spacing: { before: 400, after: 100 },
                border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } }
              }));
              pgk.forEach(s => {
                result.push(new Paragraph({
                  children: [new TextRun({ text: `${s.no}. `, bold: true }), new TextRun(s.pertanyaan)],
                  spacing: { before: 200 },
                }));
                result.push(new Paragraph({ text: `a. ${s.opsi?.a}    b. ${s.opsi?.b}` }));
                result.push(new Paragraph({ text: `c. ${s.opsi?.c}    d. ${s.opsi?.d}${s.opsi?.e ? `    e. ${s.opsi?.e}` : ''}` }));
                if (s.imagePrompt) {
                  result.push(new Paragraph({ children: [new TextRun({ text: `[BOX GAMBAR: ${s.imagePrompt}]`, italics: true })], spacing: { before: 100, after: 100 } }));
                }
              });
            }

            if (isian.length > 0) {
              const sectionNum = pgk.length > 0 ? "III" : "II";
              result.push(new Paragraph({
                children: [new TextRun({ text: `${sectionNum}. Isilah titik-titik di bawah ini dengan jawaban yang tepat!`, bold: true })],
                spacing: { before: 400, after: 100 },
                border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } }
              }));
              isian.forEach(s => {
                result.push(new Paragraph({
                  children: [new TextRun({ text: `${s.no}. `, bold: true }), new TextRun(s.pertanyaan)],
                  spacing: { before: 200 },
                }));
                if (s.imagePrompt) {
                  result.push(new Paragraph({ children: [new TextRun({ text: `[BOX GAMBAR: ${s.imagePrompt}]`, italics: true })], spacing: { before: 100, after: 100 } }));
                }
              });
            }

            if (uraian.length > 0) {
              let sectionNum = "III";
              if (pgk.length > 0 && isian.length > 0) sectionNum = "IV";
              else if (pgk.length > 0 || isian.length > 0) sectionNum = "III";
              else sectionNum = "II";

              result.push(new Paragraph({
                children: [new TextRun({ text: `${sectionNum}. Jawablah pertanyaan-pertanyaan di bawah ini dengan benar!`, bold: true })],
                spacing: { before: 400, after: 100 },
                border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } }
              }));
              uraian.forEach(s => {
                result.push(new Paragraph({
                  children: [new TextRun({ text: `${s.no}. `, bold: true }), new TextRun(s.pertanyaan)],
                  spacing: { before: 200 },
                }));
                if (s.imagePrompt) {
                  result.push(new Paragraph({ children: [new TextRun({ text: `[BOX GAMBAR: ${s.imagePrompt}]`, italics: true })], spacing: { before: 100, after: 100 } }));
                }
              });
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
