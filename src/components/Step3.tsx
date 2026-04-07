import React from 'react';
import { IdentityData, MainInputData, GeneratorOutput, Question, KisiKisiItem } from '../types';
import { Download, FileText, CheckCircle, Table } from 'lucide-react';

interface Step3Props {
  identity: IdentityData;
  mainInput: MainInputData;
  output: GeneratorOutput;
  onBack: () => void;
  onDownload: () => void;
}

export const Step3: React.FC<Step3Props> = ({ identity, mainInput, output, onBack, onDownload }) => {
  return (
    <div className="space-y-12 max-w-6xl mx-auto p-6 pb-24">
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
              <p><span className="font-bold">Fase/Kelas/Semester:</span> {identity.fase}/{identity.kelas}/{identity.semester}</p>
              <p><span className="font-bold">Tahun Pelajaran:</span> {identity.tahunPelajaran}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
            <h4 className="font-bold text-[#00695C] border-b pb-2">Capaian & Tujuan Pembelajaran</h4>
            {mainInput.cpTpPairs.map((pair, index) => (
              <div key={index} className="space-y-1 text-sm">
                <p><span className="font-bold">CP #{index + 1}:</span> {pair.cp}</p>
                <p><span className="font-bold">TP #{index + 1}:</span> {pair.tp}</p>
              </div>
            ))}
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
                    <td className="border border-[#B2DFDB] p-2 text-center">{item.no}</td>
                    <td className="border border-[#B2DFDB] p-2 text-center">{item.fase}</td>
                    <td className="border border-[#B2DFDB] p-2 text-left">{item.cp}</td>
                    <td className="border border-[#B2DFDB] p-2 text-left">{item.materi}</td>
                    <td className="border border-[#B2DFDB] p-2 text-left">{item.indikator}</td>
                    <td className="border border-[#B2DFDB] p-2 text-center">{item.levelKognitif}</td>
                    <td className="border border-[#B2DFDB] p-2 text-center">{item.noSoal}</td>
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
              <p><span className="inline-block w-32">Kelas/Semester</span>: {identity.kelas} / {identity.semester}</p>
            </div>
            <div className="space-y-1">
              <p><span className="inline-block w-32">Tahun Pelajaran</span>: {identity.tahunPelajaran}</p>
              <p><span className="inline-block w-32">Waktu</span>: 90 Menit</p>
            </div>
          </div>

          {/* Pilihan Ganda */}
          {output.soal.filter(s => s.tipe === 'Pilihan Ganda').length > 0 && (
            <div className="space-y-6">
              <h5 className="font-bold border-b pb-1">I. Berilah tanda silang (x) pada huruf a, b, c, atau d di depan jawaban yang paling benar!</h5>
              {output.soal.filter(s => s.tipe === 'Pilihan Ganda').map((s, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex space-x-2">
                    <span className="font-bold">{s.no}.</span>
                    <div className="flex-1">
                      <p className="leading-relaxed">{s.pertanyaan}</p>
                      {s.imagePrompt && (
                        <div className="my-4 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                          <p className="text-xs text-gray-400 uppercase font-bold mb-2">Box Gambar</p>
                          <p className="text-sm text-gray-600 italic">Prompt: {s.imagePrompt}</p>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <p>a. {s.opsi?.a}</p>
                        <p>b. {s.opsi?.b}</p>
                        <p>c. {s.opsi?.c}</p>
                        <p>d. {s.opsi?.d}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pilihan Ganda Kompleks */}
          {output.soal.filter(s => s.tipe === 'Pilihan Ganda Kompleks').length > 0 && (
            <div className="space-y-6 pt-8">
              <h5 className="font-bold border-b pb-1">II. Berilah tanda silang (x) pada huruf a, b, c, d, atau e di depan jawaban yang paling benar (Jawaban dapat lebih dari satu)!</h5>
              {output.soal.filter(s => s.tipe === 'Pilihan Ganda Kompleks').map((s, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex space-x-2">
                    <span className="font-bold">{s.no}.</span>
                    <div className="flex-1">
                      <p className="leading-relaxed">{s.pertanyaan}</p>
                      {s.imagePrompt && (
                        <div className="my-4 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                          <p className="text-xs text-gray-400 uppercase font-bold mb-2">Box Gambar</p>
                          <p className="text-sm text-gray-600 italic">Prompt: {s.imagePrompt}</p>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <p>a. {s.opsi?.a}</p>
                        <p>b. {s.opsi?.b}</p>
                        <p>c. {s.opsi?.c}</p>
                        <p>d. {s.opsi?.d}</p>
                        {s.opsi?.e && <p>e. {s.opsi?.e}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Isian */}
          {output.soal.filter(s => s.tipe === 'Isian').length > 0 && (
            <div className="space-y-6 pt-8">
              <h5 className="font-bold border-b pb-1">{output.soal.filter(s => s.tipe === 'Pilihan Ganda Kompleks').length > 0 ? 'III' : 'II'}. Isilah titik-titik di bawah ini dengan jawaban yang tepat!</h5>
              {output.soal.filter(s => s.tipe === 'Isian').map((s, i) => (
                <div key={i} className="flex space-x-2">
                  <span className="font-bold">{s.no}.</span>
                  <div className="flex-1">
                    <p className="leading-relaxed">{s.pertanyaan}</p>
                    {s.imagePrompt && (
                      <div className="my-4 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                        <p className="text-xs text-gray-400 uppercase font-bold mb-2">Box Gambar</p>
                        <p className="text-sm text-gray-600 italic">Prompt: {s.imagePrompt}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Uraian */}
          {output.soal.filter(s => s.tipe === 'Uraian').length > 0 && (
            <div className="space-y-6 pt-8">
              <h5 className="font-bold border-b pb-1">
                {output.soal.filter(s => s.tipe === 'Pilihan Ganda Kompleks').length > 0 ? 'IV' : 'III'}. Jawablah pertanyaan-pertanyaan di bawah ini dengan benar!
              </h5>
              {output.soal.filter(s => s.tipe === 'Uraian').map((s, i) => (
                <div key={i} className="flex space-x-2">
                  <span className="font-bold">{s.no}.</span>
                  <div className="flex-1">
                    <p className="leading-relaxed">{s.pertanyaan}</p>
                    {s.imagePrompt && (
                      <div className="my-4 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                        <p className="text-xs text-gray-400 uppercase font-bold mb-2">Box Gambar</p>
                        <p className="text-sm text-gray-600 italic">Prompt: {s.imagePrompt}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
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
                {s.no}
              </span>
              <p className="text-[#004D40] font-medium">
                {s.kunciJawaban}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
