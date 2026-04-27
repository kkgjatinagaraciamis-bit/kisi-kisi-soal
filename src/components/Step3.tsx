import React from 'react';
import { IdentityData, MainInputData, GeneratorOutput, Question, KisiKisiItem } from '../types';
import { Download, FileText, CheckCircle, Table } from 'lucide-react';
import { toArabicNumerals } from '../lib/arabicUtils';

interface Step3Props {
  identity: IdentityData;
  mainInput: MainInputData;
  output: GeneratorOutput;
  onBack: () => void;
  onDownload: () => void;
}

export const Step3: React.FC<Step3Props> = ({ identity, mainInput, output, onBack, onDownload }) => {
  const isArabic = identity.mataPelajaran === 'Bahasa Arab';
  const formatNo = (no: number | string) => isArabic ? toArabicNumerals(no) : `${no}.`;

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

  return (
    <div className={`space-y-12 max-w-[1400px] mx-auto p-6 pb-24 ${isArabic ? 'font-arabic text-lg' : ''}`}>
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-lg border border-[#B2DFDB]">
        <div>
          <h2 className="text-2xl font-bold text-[#00695C]">Hasil Generate</h2>
          <p className="text-gray-500">Kisi-kisi, Soal, dan Kunci Jawaban telah siap</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={onBack}
            className="px-6 py-2 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all"
          >
            Edit Input
          </button>
          <button
            onClick={onDownload}
            className="px-6 py-2 bg-[#00897B] text-white font-bold rounded-xl shadow-lg hover:bg-[#00695C] transition-all flex items-center space-x-2"
          >
            <Download size={20} />
            <span>Download Word (A4)</span>
          </button>
        </div>
      </div>

      {/* Section 1: Kisi-kisi */}
      <section className="bg-white rounded-2xl shadow-xl border border-[#B2DFDB] overflow-hidden">
        <div className="bg-gradient-to-r from-[#00897B] via-[#4DB6AC] to-[#00897B] p-4 flex items-center space-x-3 text-white">
          <Table size={24} />
          <h3 className="text-xl font-bold uppercase">Kisi-kisi Instrumen Soal</h3>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#004D40]">
            <div className="space-y-1">
              <p><span className="font-bold">Nama Guru:</span> {identity.namaGuru}</p>
              <p><span className="font-bold">Satuan Pendidikan:</span> {identity.namaSatuanPendidikan}</p>
              <p><span className="font-bold">Mata Pelajaran:</span> {identity.mataPelajaran}</p>
            </div>
            <div className="space-y-1">
              {identity.jenisUjian === 'UJIAN MADRASAH' ? (
                <p className="font-bold text-lg">UJIAN MADRASAH</p>
              ) : (
                <p><span className="font-bold">Fase/Kelas/Semester:</span> {identity.fase}/{identity.kelas}/{identity.semester}</p>
              )}
              <p><span className="font-bold">Tahun Pelajaran:</span> {identity.tahunPelajaran}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-[#B2DFDB] text-sm">
              <thead>
                <tr className="bg-[#E0F2F1] text-[#00695C]">
                  <th className="border border-[#B2DFDB] p-2 text-center">NO</th>
                  <th className="border border-[#B2DFDB] p-2 text-center">FASE</th>
                  <th className="border border-[#B2DFDB] p-2 text-center">CAPAIAN PEMBELAJARAN (CP)</th>
                  <th className="border border-[#B2DFDB] p-2 text-center">MATERI ESENSIAL</th>
                  <th className="border border-[#B2DFDB] p-2 text-center">INDIKATOR</th>
                  <th className="border border-[#B2DFDB] p-2 text-center">LEVEL KOGNITIF</th>
                  <th className="border border-[#B2DFDB] p-2 text-center">NO SOAL</th>
                  <th className="border border-[#B2DFDB] p-2 text-center">BENTUK SOAL</th>
                </tr>
              </thead>
              <tbody>
                {output.kisiKisi.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#F5FBFB] transition-colors">
                    <td className="border border-[#B2DFDB] p-2 text-center">{isArabic ? toArabicNumerals(item.no) : item.no}</td>
                    <td className="border border-[#B2DFDB] p-2 text-center">{item.fase}</td>
                    <td className="border border-[#B2DFDB] p-2 text-left">{item.cp}</td>
                    <td className="border border-[#B2DFDB] p-2 text-left">{item.materi}</td>
                    <td className="border border-[#B2DFDB] p-2 text-left">{item.indikator}</td>
                    <td className="border border-[#B2DFDB] p-2 text-center">{item.levelKognitif}</td>
                    <td className="border border-[#B2DFDB] p-2 text-center">{isArabic ? toArabicNumerals(item.noSoal) : item.noSoal}</td>
                    <td className="border border-[#B2DFDB] p-2 text-center">{item.bentukSoal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between pt-12 text-sm text-[#004D40]">
            <div className="text-center">
              <p>Mengetahui,</p>
              <p className="mb-16">Kepala Madrasah</p>
              <p className="font-bold underline">{identity.namaKepalaMadrasah}</p>
              <p>NIP. {identity.nipKepalaMadrasah || '..........................'}</p>
            </div>
            <div className="text-center">
              <p>Ciamis, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p className="mb-16">Guru Mata Pelajaran</p>
              <p className="font-bold underline">{identity.namaGuru}</p>
              <p>NIP. {identity.nipGuru || '..........................'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Soal */}
      <section className="bg-white rounded-2xl shadow-xl border border-[#B2DFDB] overflow-hidden">
        <div className="bg-[#00897B] p-4 flex items-center space-x-3 text-white">
          <FileText size={24} />
          <h3 className="text-xl font-bold uppercase">Naskah Soal</h3>
        </div>
        
        <div className="p-12 space-y-8 font-serif max-w-[21cm] mx-auto bg-white">
          {/* KOP */}
          <div className="flex items-center border-b-4 border-double border-black pb-4 mb-6">
            <img src="https://i.imgur.com/gUuF59Z.png" alt="Logo" className="h-20 w-20 mr-6" referrerPolicy="no-referrer" />
            <div className="flex-1 text-center">
              <h4 className="text-xl font-bold uppercase">KEMENTERIAN AGAMA REPUBLIK INDONESIA</h4>
              <h4 className="text-lg font-bold uppercase">KANTOR KEMENTERIAN AGAMA KABUPATEN CIAMIS</h4>
              <h4 className="text-2xl font-bold uppercase">{identity.namaSatuanPendidikan}</h4>
              <p className="text-sm italic">Alamat: ....................................................................................................................</p>
            </div>
          </div>

          {/* Identitas Soal */}
          <div className="grid grid-cols-2 gap-4 text-sm border p-4 rounded-lg mb-8">
            <div className="space-y-1">
              <p><span className="inline-block w-32">Mata Pelajaran</span>: {identity.mataPelajaran}</p>
              {identity.jenisUjian === 'UJIAN MADRASAH' ? (
                <p className="font-bold">UJIAN MADRASAH</p>
              ) : (
                <p><span className="inline-block w-32">Kelas/Semester</span>: {identity.kelas} / {identity.semester}</p>
              )}
            </div>
            <div className="space-y-1">
              <p><span className="inline-block w-32">Tahun Pelajaran</span>: {identity.tahunPelajaran}</p>
              <p><span className="inline-block w-32">Waktu</span>: 90 Menit</p>
            </div>
          </div>

          {/* Render Sections Dynamically */}
          {(() => {
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

            return activeSections.map((sec, idx) => {
              const soalList = output.soal.filter(s => s.tipe === sec.tipe);
              const roman = romanNumerals[idx];

              if (sec.tipe === 'Pilihan Ganda' || sec.tipe === 'Pilihan Ganda Kompleks') {
                const count = sec.tipe === 'Pilihan Ganda' ? Number(mainInput.jumlahOpsiPG) : Number(mainInput.jumlahOpsiPGK);
                const optionsStr = isArabic 
                  ? (count === 3 ? 'أ، ب، أو ج' : count === 4 ? 'أ، ب، ج، أو د' : 'أ، ب، ج، د، أو هـ')
                  : (count === 3 ? 'a, b, atau c' : count === 4 ? 'a, b, c, atau d' : 'a, b, c, d, atau e');
                
                return (
                  <div key={sec.tipe} className="space-y-6 pt-8">
                    <h5 className={`font-bold border-b pb-1 ${isArabic ? 'text-right text-[14pt]' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
                      {roman}. {sec.label(optionsStr)}
                    </h5>
                    {soalList.map((s, i) => (
                      <div key={i} className={`grid ${isArabic ? 'grid-cols-[1fr_2.5rem]' : 'grid-cols-[2.5rem_1fr]'} gap-x-2 gap-y-2`}>
                        {/* Question Content */}
                        <div className={`${isArabic ? 'col-start-1 text-right text-[14pt]' : 'col-start-2'}`} dir={isArabic ? 'rtl' : 'ltr'}>
                          <p className="leading-relaxed">{s.pertanyaan}</p>
                          {s.imagePrompt && (
                            <div className="my-4 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-sm w-[6cm] h-[6cm]">
                              <img 
                                src={`https://image.pollinations.ai/prompt/${encodeURIComponent(s.imagePrompt)}?width=800&height=800&nologo=true&seed=${s.no}`} 
                                alt={s.imagePrompt}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          )}
                        </div>
                        {/* Question Number */}
                        <div className={`font-bold ${isArabic ? 'col-start-2 text-right text-[14pt]' : 'col-start-1 text-left'}`}>
                          {formatNo(s.no)}
                        </div>

                        {/* Multiple Choice Options */}
                        {s.opsi && (
                          <>
                            {[
                              { key: 'a', label: isArabic ? '.أ' : 'a.' },
                              { key: 'b', label: isArabic ? '.ب' : 'b.' },
                              { key: 'c', label: isArabic ? '.ج' : 'c.' },
                              { key: 'd', label: isArabic ? '.د' : 'd.' },
                              { key: 'e', label: isArabic ? '.هـ' : 'e.' },
                            ].slice(0, count).map((opt) => (
                              <React.Fragment key={opt.key}>
                                <div className={`${isArabic ? 'col-start-1 text-right text-[14pt]' : 'col-start-2'}`}>
                                  {s.opsi![opt.key as keyof typeof s.opsi]}
                                </div>
                                <div className={`font-bold ${isArabic ? 'col-start-2 text-right text-[14pt]' : 'col-start-1 text-left'}`}>
                                  {opt.label}
                                </div>
                              </React.Fragment>
                            ))}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                );
              }

              if (sec.tipe === 'Menjodohkan') {
                const answers = soalList.map(s => s.matchingAnswer || s.kunciJawaban).filter(Boolean);
                const shuffledAnswers = [...answers].sort(() => Math.random() - 0.5);
                return (
                  <div key={sec.tipe} className="space-y-4 pt-8">
                    <h5 className="font-bold border-b pb-1">{roman}. {sec.label("")}</h5>
                    <table className="w-full border-collapse border border-black text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-black p-2 w-8">NO</th>
                          <th className="border border-black p-2">PERNYATAAN</th>
                          <th className="border border-black p-2 w-48">JAWABAN</th>
                        </tr>
                      </thead>
                      <tbody>
                        {soalList.map((s, i) => (
                          <tr key={i}>
                            <td className="border border-black p-2 text-center font-bold">{formatNo(s.no)}</td>
                            <td className={`border border-black p-2 ${isArabic ? 'text-right' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
                              {s.pertanyaan}
                              {s.imagePrompt && (
                                <div className="mt-2 overflow-hidden rounded border border-gray-200 shadow-sm w-[6cm] h-[6cm]">
                                  <img 
                                    src={`https://image.pollinations.ai/prompt/${encodeURIComponent(s.imagePrompt)}?width=800&height=800&nologo=true&seed=${s.no}`} 
                                    alt={s.imagePrompt}
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                    loading="lazy"
                                  />
                                </div>
                              )}
                            </td>
                            <td className={`border border-black p-2 ${isArabic ? 'text-right' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>{shuffledAnswers[i] || ""}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }

              if (sec.tipe === 'Benar Salah') {
                return (
                  <div key={sec.tipe} className="space-y-4 pt-8">
                    <h5 className={`font-bold border-b pb-1 ${isArabic ? 'text-right text-[14pt]' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>{roman}. {sec.label("")}</h5>
                    <table className="w-full border-collapse border border-black text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className={`border border-black p-2 w-8 ${isArabic ? 'text-[14pt]' : ''}`}>NO</th>
                          <th className={`border border-black p-2 ${isArabic ? 'text-[14pt]' : ''}`}>PERNYATAAN</th>
                          <th className={`border border-black p-2 w-20 ${isArabic ? 'text-[14pt]' : ''}`}>BENAR</th>
                          <th className={`border border-black p-2 w-20 ${isArabic ? 'text-[14pt]' : ''}`}>SALAH</th>
                        </tr>
                      </thead>
                      <tbody>
                        {soalList.map((s, i) => (
                          <tr key={i}>
                            <td className={`border border-black p-2 text-center font-bold ${isArabic ? 'text-[14pt]' : ''}`}>{formatNo(s.no)}</td>
                            <td className={`border border-black p-2 ${isArabic ? 'text-right text-[14pt]' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
                              {s.pertanyaan}
                              {s.imagePrompt && (
                                <div className="mt-2 overflow-hidden rounded border border-gray-200 shadow-sm w-[6cm] h-[6cm]">
                                  <img 
                                    src={`https://image.pollinations.ai/prompt/${encodeURIComponent(s.imagePrompt)}?width=800&height=800&nologo=true&seed=${s.no}`} 
                                    alt={s.imagePrompt}
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                    loading="lazy"
                                  />
                                </div>
                              )}
                            </td>
                            <td className="border border-black p-2"></td>
                            <td className="border border-black p-2"></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }

              if (sec.tipe === 'Isian') {
                return (
                  <div key={sec.tipe} className="space-y-6 pt-8">
                    <h5 className={`font-bold border-b pb-1 ${isArabic ? 'text-right text-[14pt]' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
                      {roman}. {sec.label("")}
                    </h5>
                    {soalList.map((s, i) => (
                      <div key={i} className={`grid ${isArabic ? 'grid-cols-[1fr_2.5rem]' : 'grid-cols-[2.5rem_1fr]'} gap-2`}>
                        <div className={`${isArabic ? 'col-start-1 text-right text-[14pt]' : 'col-start-2'}`} dir={isArabic ? 'rtl' : 'ltr'}>
                          <p className="leading-relaxed">{s.pertanyaan}</p>
                          {s.imagePrompt && (
                            <div className="my-4 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-sm w-[6cm] h-[6cm]">
                              <img 
                                src={`https://image.pollinations.ai/prompt/${encodeURIComponent(s.imagePrompt)}?width=800&height=800&nologo=true&seed=${s.no}`} 
                                alt={s.imagePrompt}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          )}
                        </div>
                        <div className={`font-bold ${isArabic ? 'col-start-2 text-right text-[14pt]' : 'col-start-1 text-left'}`}>
                          {formatNo(s.no)}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              }

              if (sec.tipe === 'Uraian') {
                return (
                  <div key={sec.tipe} className="space-y-6 pt-8">
                    <h5 className={`font-bold border-b pb-1 ${isArabic ? 'text-right text-[14pt]' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
                      {roman}. {sec.label("")}
                    </h5>
                    {soalList.map((s, i) => (
                      <div key={i} className={`grid ${isArabic ? 'grid-cols-[1fr_2.5rem]' : 'grid-cols-[2.5rem_1fr]'} gap-2`}>
                        <div className={`${isArabic ? 'col-start-1 text-right text-[14pt]' : 'col-start-2'}`} dir={isArabic ? 'rtl' : 'ltr'}>
                          <p className="leading-relaxed">{s.pertanyaan}</p>
                          {s.imagePrompt && (
                            <div className="my-4 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-sm w-[6cm] h-[6cm]">
                              <img 
                                src={`https://image.pollinations.ai/prompt/${encodeURIComponent(s.imagePrompt)}?width=800&height=800&nologo=true&seed=${s.no}`} 
                                alt={s.imagePrompt}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          )}
                        </div>
                        <div className={`font-bold ${isArabic ? 'col-start-2 text-right text-[14pt]' : 'col-start-1 text-left'}`}>
                          {formatNo(s.no)}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              }

              return null;
            });
          })()}
        </div>
      </section>

      {/* Section 3: Kunci Jawaban */}
      <section className="bg-white rounded-2xl shadow-xl border border-[#B2DFDB] overflow-hidden">
        <div className="bg-[#00796B] p-4 flex items-center space-x-3 text-white">
          <CheckCircle size={24} />
          <h3 className="text-xl font-bold uppercase">Kunci Jawaban</h3>
        </div>
        
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {output.soal.map((s, i) => (
            <div key={i} className="flex items-center space-x-3 p-3 bg-[#F5FBFB] rounded-lg border border-[#B2DFDB]">
              <span className="w-8 h-8 flex items-center justify-center bg-[#00897B] text-white rounded-full font-bold text-sm">
                {isArabic ? toArabicNumerals(s.no) : s.no}
              </span>
              <p className={`text-[#004D40] font-medium ${isArabic ? 'text-[14pt]' : ''}`}>
                {isArabic && (s.tipe === 'Pilihan Ganda' || s.tipe === 'Pilihan Ganda Kompleks') 
                  ? toArabicOption(s.kunciJawaban || '') 
                  : s.kunciJawaban}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
