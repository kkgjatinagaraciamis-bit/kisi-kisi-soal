import React from 'react';
import { MainInputData, ExamType } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Target, Lightbulb, Info } from 'lucide-react';

interface Step2Props {
  data: MainInputData;
  examType: ExamType;
  onChange: (data: MainInputData) => void;
  onBack: () => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export const Step2: React.FC<Step2Props> = ({ data, examType, onChange, onBack, onGenerate, isLoading }) => {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let val: any = value;
    if (type === 'number' || name === 'jumlahOpsiPG' || name === 'jumlahOpsiPGK') {
      val = parseInt(value) || 0;
    }
    onChange({ ...data, [name]: val });
  };

  const handleCPTPChange = (index: number, field: 'cp' | 'tp', value: string) => {
    const newPairs = [...data.cpTpPairs];
    newPairs[index][field] = value;
    onChange({ ...data, cpTpPairs: newPairs });
  };

  const addCPTPPair = () => {
    const newPairs = [...data.cpTpPairs, { cp: '', tp: '' }];
    onChange({ ...data, cpTpPairs: newPairs });
    setActiveIndex(newPairs.length - 1);
  };

  const removeCPTPPair = (index: number) => {
    if (data.cpTpPairs.length > 1) {
      const newPairs = data.cpTpPairs.filter((_, i) => i !== index);
      onChange({ ...data, cpTpPairs: newPairs });
      if (activeIndex >= newPairs.length) {
        setActiveIndex(newPairs.length - 1);
      }
    }
  };

  const isComplete = data.cpTpPairs.every(p => p.cp && p.tp);

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-8 bg-white rounded-3xl shadow-2xl border border-[#B2DFDB]">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold text-[#00695C] tracking-tight">
          Input Bagian Utama {examType === 'hots' ? '(Mode HOTS)' : '(Mode Simple)'}
        </h2>
        <p className="text-gray-500 font-medium">Tentukan Capaian Pembelajaran dan konfigurasi Indikator</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: CP & Indikator Pairs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-[#B2DFDB] pb-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-6 bg-[#00897B] rounded-full"></div>
              <h3 className="font-bold text-[#00796B] uppercase tracking-wider text-sm">Capaian & Indikator</h3>
            </div>
            <button
              type="button"
              onClick={addCPTPPair}
              className="px-6 py-3 bg-[#00897B] text-white text-sm font-bold rounded-2xl hover:bg-[#00695C] hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Tambah CP & Indikator</span>
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Input Area */}
            <div className="flex-1">
              <AnimatePresence mode="wait">
                {data.cpTpPairs.map((pair, index) => (
                  index === activeIndex && (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                      className="p-8 bg-white rounded-3xl border-2 border-[#E0F2F1] space-y-6 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-[#00897B] text-white rounded-xl flex items-center justify-center font-black shadow-lg">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-bold text-[#00695C]">Bagian Input #{index + 1}</h4>
                            <p className="text-[10px] text-gray-400">Silakan lengkapi CP dan Indikator di bawah ini</p>
                          </div>
                        </div>
                        {data.cpTpPairs.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeCPTPPair(index)}
                            className="flex items-center space-x-1 px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-xs font-bold border border-transparent hover:border-red-100"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Hapus Bagian Ini</span>
                          </button>
                        )}
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <div className="p-1.5 bg-[#E0F2F1] rounded-lg">
                              <Target className="w-4 h-4 text-[#00796B]" />
                            </div>
                            <label className="text-sm font-bold text-gray-700">Capaian Pembelajaran (CP)</label>
                          </div>
                          <textarea
                            value={pair.cp}
                            onChange={(e) => handleCPTPChange(index, 'cp', e.target.value)}
                            rows={5}
                            placeholder="Contoh: Peserta didik mampu mengenal huruf hijaiyah..."
                            className="w-full px-5 py-4 rounded-2xl border-2 border-[#E0F2F1] focus:border-[#4DB6AC] outline-none transition-all resize-none bg-gray-50/30 text-sm leading-relaxed shadow-inner"
                            required
                          />
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <div className="p-1.5 bg-[#FFF3E0] rounded-lg">
                              <Lightbulb className="w-4 h-4 text-[#EF6C00]" />
                            </div>
                            <label className="text-sm font-bold text-gray-700">Indikator / Tujuan (TP)</label>
                          </div>
                          <textarea
                            value={pair.tp}
                            onChange={(e) => handleCPTPChange(index, 'tp', e.target.value)}
                            rows={5}
                            placeholder="Contoh: Menyebutkan 5 huruf hijaiyah pertama dengan benar..."
                            className="w-full px-5 py-4 rounded-2xl border-2 border-[#FFF3E0] focus:border-[#FFB74D] outline-none transition-all resize-none bg-gray-50/30 text-sm leading-relaxed shadow-inner"
                            required
                          />
                        </div>
                      </div>
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            </div>

            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 space-y-3">
              <div className="p-4 bg-[#F5FBFB] rounded-2xl border border-[#B2DFDB] space-y-4">
                <h4 className="text-[10px] font-black text-[#00796B] uppercase tracking-widest px-2">Daftar Bagian</h4>
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                  {data.cpTpPairs.map((pair, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveIndex(idx)}
                      className={`w-full flex items-center space-x-2 p-1.5 rounded-lg transition-all text-left border-2 ${
                        activeIndex === idx
                          ? 'bg-[#00897B] border-[#00897B] text-white shadow-sm transform scale-[1.01]'
                          : 'bg-white border-transparent text-gray-500 hover:border-[#B2DFDB] hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold shrink-0 ${
                        activeIndex === idx ? 'bg-white/20' : 'bg-gray-100'
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="flex-1 truncate">
                        <span className="text-[10px] font-bold block leading-tight">Bagian {idx + 1}</span>
                        <span className={`text-[8px] truncate block leading-tight font-bold ${pair.cp && pair.tp ? 'text-green-400' : 'text-red-400'}`}>
                          {pair.cp && pair.tp ? 'Sudah Terisi' : 'Belum Terisi'}
                        </span>
                      </div>
                      {pair.cp && pair.tp && (
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full shrink-0"></div>
                      )}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addCPTPPair}
                  className="w-full py-2 bg-white border-2 border-dashed border-[#00897B] text-[#00897B] text-[10px] font-bold rounded-lg hover:bg-[#E0F2F1] transition-all flex items-center justify-center space-x-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Tambah Baru</span>
                </button>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-blue-500 mt-0.5" />
                  <p className="text-[10px] text-blue-700 leading-tight">
                    Gunakan sidebar ini untuk berpindah antar Capaian Pembelajaran dengan cepat.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Question Settings */}
        <div className="space-y-6">
          {/* Jumlah Soal */}
          <div className="p-6 bg-[#F0F4F8] rounded-3xl border border-[#B2DFDB] space-y-6 shadow-sm">
            <div className="flex items-center space-x-2 border-b border-[#B2DFDB] pb-2">
              <div className="w-2 h-6 bg-[#00897B] rounded-full"></div>
              <h3 className="font-bold text-[#00796B] uppercase tracking-wider text-sm">Jumlah Soal</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#00796B] uppercase">Pilihan Ganda</label>
                <input
                  type="number"
                  name="jumlahPilihanGanda"
                  value={data.jumlahPilihanGanda}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-[#B2DFDB] focus:ring-2 focus:ring-[#4DB6AC] outline-none transition-all bg-white"
                  min="0"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#00796B] uppercase">PG Kompleks</label>
                <input
                  type="number"
                  name="jumlahPilihanGandaKompleks"
                  value={data.jumlahPilihanGandaKompleks}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-[#B2DFDB] focus:ring-2 focus:ring-[#4DB6AC] outline-none transition-all bg-white"
                  min="0"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#00796B] uppercase">Isian</label>
                <input
                  type="number"
                  name="jumlahIsian"
                  value={data.jumlahIsian}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-[#B2DFDB] focus:ring-2 focus:ring-[#4DB6AC] outline-none transition-all bg-white"
                  min="0"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#00796B] uppercase">Uraian</label>
                <input
                  type="number"
                  name="jumlahUraian"
                  value={data.jumlahUraian}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-[#B2DFDB] focus:ring-2 focus:ring-[#4DB6AC] outline-none transition-all bg-white"
                  min="0"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#00796B] uppercase">Menjodohkan</label>
                <input
                  type="number"
                  name="jumlahMenjodohkan"
                  value={data.jumlahMenjodohkan}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-[#B2DFDB] focus:ring-2 focus:ring-[#4DB6AC] outline-none transition-all bg-white"
                  min="0"
                  max="10"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#00796B] uppercase">Benar Salah</label>
                <input
                  type="number"
                  name="jumlahBenarSalah"
                  value={data.jumlahBenarSalah}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-[#B2DFDB] focus:ring-2 focus:ring-[#4DB6AC] outline-none transition-all bg-white"
                  min="0"
                  max="10"
                />
              </div>
            </div>
          </div>

          {/* Level Kognitif */}
          <div className="p-6 bg-[#E0F2F1] rounded-3xl border border-[#B2DFDB] space-y-6 shadow-sm">
            <div className="flex items-center space-x-2 border-b border-[#B2DFDB] pb-2">
              <div className="w-2 h-6 bg-[#00897B] rounded-full"></div>
              <h3 className="font-bold text-[#00796B] uppercase tracking-wider text-sm">Level Kognitif (%)</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#00796B] uppercase">L1</label>
                <input
                  type="number"
                  name="persenL1"
                  value={data.persenL1}
                  onChange={handleChange}
                  className="w-full px-2 py-2 text-sm rounded-xl border border-[#B2DFDB] bg-white"
                  min="0" max="100"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#00796B] uppercase">L2</label>
                <input
                  type="number"
                  name="persenL2"
                  value={data.persenL2}
                  onChange={handleChange}
                  className="w-full px-2 py-2 text-sm rounded-xl border border-[#B2DFDB] bg-white"
                  min="0" max="100"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#00796B] uppercase">L3</label>
                <input
                  type="number"
                  name="persenL3"
                  value={data.persenL3}
                  onChange={handleChange}
                  className="w-full px-2 py-2 text-sm rounded-xl border border-[#B2DFDB] bg-white"
                  min="0" max="100"
                />
              </div>
            </div>
            {(() => {
              const total = (Number(data.persenL1) || 0) + (Number(data.persenL2) || 0) + (Number(data.persenL3) || 0);
              return (
                <div className="space-y-1">
                  <p className={`text-[10px] italic ${total > 100 ? 'text-red-600 font-bold' : 'text-[#00796B]'}`}>
                    Total: {total}% {total > 100 ? '(Melebihi 100%!)' : '(Total harus 100% untuk hasil optimal)'}
                  </p>
                </div>
              );
            })()}
          </div>

          {/* Visual & Gambar */}
          <div className={`p-6 bg-[#E0F2F1] rounded-3xl border border-[#B2DFDB] space-y-6 shadow-sm transition-all ${examType === 'simple' ? 'opacity-60 grayscale-[0.3]' : ''}`}>
            <div className="flex items-center space-x-2 border-b border-[#B2DFDB] pb-2">
              <div className="w-2 h-6 bg-[#00897B] rounded-full"></div>
              <h3 className="font-bold text-[#00796B] uppercase tracking-wider text-sm">Visual & Gambar</h3>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#00796B]">Prosentase Gambar (%)</label>
              <input
                type="number"
                name="persenGambar"
                value={examType === 'simple' ? 0 : data.persenGambar}
                onChange={handleChange}
                disabled={examType === 'simple'}
                className={`w-full px-3 py-2 rounded-xl border border-[#B2DFDB] focus:ring-2 focus:ring-[#4DB6AC] outline-none transition-all ${examType === 'simple' ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                min="0"
                max="100"
              />
              {examType === 'simple' ? (
                <p className="text-[10px] text-[#00796B] italic font-bold">Menu ini hanya aktif pada Mode Soal HOTS.</p>
              ) : (
                <>
                  {Number(data.persenGambar) > 40 && (
                    <p className="text-[10px] text-red-600 font-bold italic">
                      Peringatan: Prosentase gambar maksimal 40%!
                    </p>
                  )}
                  <p className="text-[10px] text-[#00796B] italic">Maksimal 40% untuk performa terbaik.</p>
                </>
              )}
            </div>
          </div>

          {/* Konfigurasi Opsi */}
          <div className="p-6 bg-[#F0F4F8] rounded-3xl border border-[#B2DFDB] space-y-6 shadow-sm">
            <div className="flex items-center space-x-2 border-b border-[#B2DFDB] pb-2">
              <div className="w-2 h-6 bg-[#00897B] rounded-full"></div>
              <h3 className="font-bold text-[#00796B] uppercase tracking-wider text-sm">Konfigurasi Opsi</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#00796B]">Opsi Pilihan Ganda</label>
                <select
                  name="jumlahOpsiPG"
                  value={data.jumlahOpsiPG}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-[#B2DFDB] focus:ring-2 focus:ring-[#4DB6AC] outline-none transition-all bg-white"
                >
                  <option value={3}>3 Opsi (a, b, c)</option>
                  <option value={4}>4 Opsi (a, b, c, d)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#00796B]">Opsi PG Kompleks</label>
                <select
                  name="jumlahOpsiPGK"
                  value={data.jumlahOpsiPGK}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-[#B2DFDB] focus:ring-2 focus:ring-[#4DB6AC] outline-none transition-all bg-white"
                >
                  <option value={3}>3 Opsi (a, b, c)</option>
                  <option value={4}>4 Opsi (a, b, c, d)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t border-gray-100">
        <button
          onClick={onBack}
          className="px-10 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl shadow hover:bg-gray-200 transition-all transform hover:scale-105 active:scale-95 flex items-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span>Kembali</span>
        </button>
        <div className="flex flex-col items-end space-y-2">
          {!isComplete && (
            <p className="text-[10px] text-red-500 font-bold animate-pulse">
              * Semua bagian CP & Indikator wajib diisi!
            </p>
          )}
          <button
            onClick={onGenerate}
            disabled={!isComplete || isLoading}
            className="px-12 py-4 bg-[#00897B] text-white font-bold rounded-2xl shadow-xl hover:bg-[#00695C] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Memproses Data...</span>
              </>
            ) : (
              <>
                <span>Generate Instrumen</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.3 1.047a1 1 0 01.897.487l1.174 2.14a1 1 0 00.708.519l2.447.448a1 1 0 01.554 1.706l-1.845 1.638a1 1 0 00-.313.963l.543 2.426a1 1 0 01-1.483 1.077L11.3 11.13a1 1 0 00-1.047 0l-2.553 1.32a1 1 0 01-1.483-1.077l.543-2.426a1 1 0 00-.313-.963L4.603 6.347a1 1 0 01.554-1.706l2.447-.448a1 1 0 00.708-.519l1.174-2.14a1 1 0 01.897-.487z" clipRule="evenodd" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
