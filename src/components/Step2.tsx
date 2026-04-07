import React from 'react';
import { MainInputData, ExamType } from '../types';

interface Step2Props {
  data: MainInputData;
  examType: ExamType;
  onChange: (data: MainInputData) => void;
  onBack: () => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export const Step2: React.FC<Step2Props> = ({ data, examType, onChange, onBack, onGenerate, isLoading }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? parseInt(value) || 0 : value;
    onChange({ ...data, [name]: val });
  };

  const handleCPTPChange = (index: number, field: 'cp' | 'tp', value: string) => {
    const newPairs = [...data.cpTpPairs];
    newPairs[index][field] = value;
    onChange({ ...data, cpTpPairs: newPairs });
  };

  const addCPTPPair = () => {
    onChange({ ...data, cpTpPairs: [...data.cpTpPairs, { cp: '', tp: '' }] });
  };

  const removeCPTPPair = (index: number) => {
    if (data.cpTpPairs.length > 1) {
      const newPairs = data.cpTpPairs.filter((_, i) => i !== index);
      onChange({ ...data, cpTpPairs: newPairs });
    }
  };

  const isComplete = data.cpTpPairs.every(p => p.cp && p.tp);

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-8 bg-white rounded-3xl shadow-2xl border border-[#B2DFDB]">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold text-[#00695C] tracking-tight">
          Input Bagian Utama {examType === 'hots' ? '(Mode HOTS)' : '(Mode Simple)'}
        </h2>
        <p className="text-gray-500 font-medium">Tentukan Capaian Pembelajaran dan konfigurasi jumlah soal</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: CP & TP Pairs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-[#B2DFDB] pb-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-6 bg-[#00897B] rounded-full"></div>
              <h3 className="font-bold text-[#00796B] uppercase tracking-wider text-sm">Capaian & Tujuan Pembelajaran</h3>
            </div>
            <button
              type="button"
              onClick={addCPTPPair}
              className="px-4 py-2 bg-[#00897B] text-white text-xs font-bold rounded-xl hover:bg-[#00695C] transition-all shadow-md flex items-center space-x-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              <span>Tambah CP/TP</span>
            </button>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {data.cpTpPairs.map((pair, index) => (
              <div key={index} className="p-6 bg-gray-50 rounded-2xl border border-[#B2DFDB] space-y-4 relative group hover:border-[#4DB6AC] transition-all">
                {data.cpTpPairs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCPTPPair(index)}
                    className="absolute top-4 right-4 text-red-400 hover:text-red-600 transition-colors"
                    title="Hapus Pasangan"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#00796B] uppercase tracking-wide">Capaian Pembelajaran (CP) #{index + 1}</label>
                  <textarea
                    value={pair.cp}
                    onChange={(e) => handleCPTPChange(index, 'cp', e.target.value)}
                    rows={3}
                    placeholder="Masukkan CP..."
                    className="w-full px-4 py-3 rounded-xl border border-[#B2DFDB] focus:ring-2 focus:ring-[#4DB6AC] focus:border-transparent outline-none transition-all resize-none bg-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#00796B] uppercase tracking-wide">Tujuan Pembelajaran (TP) #{index + 1}</label>
                  <textarea
                    value={pair.tp}
                    onChange={(e) => handleCPTPChange(index, 'tp', e.target.value)}
                    rows={3}
                    placeholder="Masukkan TP..."
                    className="w-full px-4 py-3 rounded-xl border border-[#B2DFDB] focus:ring-2 focus:ring-[#4DB6AC] focus:border-transparent outline-none transition-all resize-none bg-white"
                    required
                  />
                </div>
              </div>
            ))}
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
              {examType === 'hots' && (
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
              )}
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
            </div>
          </div>

          {/* Level Kognitif */}
          <div className="p-6 bg-[#E0F2F1] rounded-3xl border border-[#B2DFDB] space-y-6 shadow-sm">
            <div className="flex items-center space-x-2 border-b border-[#B2DFDB] pb-2">
              <div className="w-2 h-6 bg-[#00897B] rounded-full"></div>
              <h3 className="font-bold text-[#00796B] uppercase tracking-wider text-sm">Level Kognitif (%)</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
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
            <p className="text-[10px] text-[#00796B] italic">Total harus 100% untuk hasil optimal.</p>
          </div>

          {/* Visual & Gambar (HOTS Only) */}
          {examType === 'hots' && (
            <div className="p-6 bg-[#E0F2F1] rounded-3xl border border-[#B2DFDB] space-y-6 shadow-sm">
              <div className="flex items-center space-x-2 border-b border-[#B2DFDB] pb-2">
                <div className="w-2 h-6 bg-[#00897B] rounded-full"></div>
                <h3 className="font-bold text-[#00796B] uppercase tracking-wider text-sm">Visual & Gambar</h3>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#00796B]">Prosentase Gambar (%)</label>
                <input
                  type="number"
                  name="persenGambar"
                  value={data.persenGambar}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-[#B2DFDB] focus:ring-2 focus:ring-[#4DB6AC] outline-none transition-all bg-white"
                  min="0"
                  max="100"
                />
              </div>
            </div>
          )}
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
  );
};
