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
    <div className="space-y-6 max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-xl border border-[#B2DFDB]">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#00695C]">
          Input Bagian Utama {examType === 'hots' ? '(Mode HOTS)' : '(Mode Simple)'}
        </h2>
        <p className="text-gray-500 mt-1">Lengkapi detail materi dan jumlah soal</p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#B2DFDB] pb-2">
          <h3 className="font-bold text-[#00695C]">Capaian & Tujuan Pembelajaran</h3>
          <button
            type="button"
            onClick={addCPTPPair}
            className="px-4 py-1 bg-[#00897B] text-white text-sm font-bold rounded-lg hover:bg-[#00695C] transition-all"
          >
            + Tambah CP & TP
          </button>
        </div>

        {data.cpTpPairs.map((pair, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-xl border border-[#B2DFDB] space-y-4 relative">
            {data.cpTpPairs.length > 1 && (
              <button
                type="button"
                onClick={() => removeCPTPPair(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold"
              >
                Hapus
              </button>
            )}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#00796B]">Capaian Pembelajaran (CP) #{index + 1}</label>
              <textarea
                value={pair.cp}
                onChange={(e) => handleCPTPChange(index, 'cp', e.target.value)}
                rows={2}
                placeholder="Masukkan CP..."
                className="w-full px-4 py-2 rounded-lg border border-[#B2DFDB] focus:ring-2 focus:ring-[#4DB6AC] focus:border-transparent outline-none transition-all resize-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#00796B]">Tujuan Pembelajaran (TP) #{index + 1}</label>
              <textarea
                value={pair.tp}
                onChange={(e) => handleCPTPChange(index, 'tp', e.target.value)}
                rows={2}
                placeholder="Masukkan TP..."
                className="w-full px-4 py-2 rounded-lg border border-[#B2DFDB] focus:ring-2 focus:ring-[#4DB6AC] focus:border-transparent outline-none transition-all resize-none"
                required
              />
            </div>
          </div>
        ))}

      </div>

      <div className="p-4 bg-[#F0F4F8] rounded-xl border border-[#B2DFDB] space-y-4">
        <h3 className="font-bold text-[#00695C] border-b border-[#B2DFDB] pb-2">Jumlah Soal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#00796B]">Pilihan Ganda</label>
            <input
              type="number"
              name="jumlahPilihanGanda"
              value={data.jumlahPilihanGanda}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-[#B2DFDB] focus:ring-2 focus:ring-[#4DB6AC] outline-none transition-all"
              min="0"
            />
          </div>
          {examType === 'hots' && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#00796B]">PG Kompleks</label>
              <input
                type="number"
                name="jumlahPilihanGandaKompleks"
                value={data.jumlahPilihanGandaKompleks}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-[#B2DFDB] focus:ring-2 focus:ring-[#4DB6AC] outline-none transition-all"
                min="0"
              />
            </div>
          )}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#00796B]">Isian</label>
            <input
              type="number"
              name="jumlahIsian"
              value={data.jumlahIsian}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-[#B2DFDB] focus:ring-2 focus:ring-[#4DB6AC] outline-none transition-all"
              min="0"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#00796B]">Uraian</label>
            <input
              type="number"
              name="jumlahUraian"
              value={data.jumlahUraian}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-[#B2DFDB] focus:ring-2 focus:ring-[#4DB6AC] outline-none transition-all"
              min="0"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-[#E0F2F1] rounded-xl border border-[#B2DFDB] space-y-4">
          <h3 className="font-bold text-[#00695C] border-b border-[#B2DFDB] pb-2">Level Kognitif (%)</h3>
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#00796B]">L1</label>
              <input
                type="number"
                name="persenL1"
                value={data.persenL1}
                onChange={handleChange}
                className="w-full px-2 py-1 text-sm rounded border border-[#B2DFDB]"
                min="0" max="100"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#00796B]">L2</label>
              <input
                type="number"
                name="persenL2"
                value={data.persenL2}
                onChange={handleChange}
                className="w-full px-2 py-1 text-sm rounded border border-[#B2DFDB]"
                min="0" max="100"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#00796B]">L3</label>
              <input
                type="number"
                name="persenL3"
                value={data.persenL3}
                onChange={handleChange}
                className="w-full px-2 py-1 text-sm rounded border border-[#B2DFDB]"
                min="0" max="100"
              />
            </div>
          </div>
        </div>

        {examType === 'hots' && (
          <div className="p-4 bg-[#E0F2F1] rounded-xl border border-[#B2DFDB] space-y-4">
            <h3 className="font-bold text-[#00695C] border-b border-[#B2DFDB] pb-2">Visual & Gambar</h3>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#00796B]">Prosentase Gambar pada Soal (%)</label>
              <input
                type="number"
                name="persenGambar"
                value={data.persenGambar}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-[#B2DFDB] focus:ring-2 focus:ring-[#4DB6AC] outline-none transition-all"
                min="0"
                max="100"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-8 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl shadow hover:bg-gray-200 transition-all transform hover:scale-105 active:scale-95"
        >
          Kembali
        </button>
        <button
          onClick={onGenerate}
          disabled={!isComplete || isLoading}
          className="px-8 py-3 bg-[#00897B] text-white font-bold rounded-xl shadow-lg hover:bg-[#00695C] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 flex items-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <span>Generate Soal</span>
          )}
        </button>
      </div>
    </div>
  );
};
