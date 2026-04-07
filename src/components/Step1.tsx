import React from 'react';
import { IdentityData } from '../types';

interface Step1Props {
  data: IdentityData;
  onChange: (data: IdentityData) => void;
  onNext: () => void;
}

export const Step1: React.FC<Step1Props> = ({ data, onChange, onNext }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  const isComplete = data.namaSatuanPendidikan && data.namaGuru && data.namaKepalaMadrasah && data.tahunPelajaran && data.semester && data.fase && data.kelas && data.mataPelajaran;

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-xl border border-[#B2DFDB]">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#00695C]">Input Identitas</h2>
        <p className="text-gray-500 mt-1">Lengkapi data satuan pendidikan dan guru</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#00796B]">Nama Satuan Pendidikan</label>
          <input
            type="text"
            name="namaSatuanPendidikan"
            value={data.namaSatuanPendidikan}
            onChange={handleChange}
            placeholder="Contoh: MI Al-Ikhlas"
            className="w-full px-4 py-2 rounded-lg border border-[#B2DFDB] focus:ring-2 focus:ring-[#4DB6AC] focus:border-transparent outline-none transition-all"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#00796B]">Tahun Pelajaran</label>
          <select
            name="tahunPelajaran"
            value={data.tahunPelajaran}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-[#B2DFDB] focus:ring-2 focus:ring-[#4DB6AC] focus:border-transparent outline-none transition-all bg-white"
            required
          >
            <option value="">Pilih Tahun Pelajaran</option>
            <option value="2025/2026">2025/2026</option>
            <option value="2026/2027">2026/2027</option>
            <option value="2027/2028">2027/2028</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#00796B]">Nama Guru</label>
          <input
            type="text"
            name="namaGuru"
            value={data.namaGuru}
            onChange={handleChange}
            placeholder="Nama Lengkap & Gelar"
            className="w-full px-4 py-2 rounded-lg border border-[#B2DFDB] focus:ring-2 focus:ring-[#4DB6AC] focus:border-transparent outline-none transition-all"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#00796B]">NIP Guru</label>
          <input
            type="text"
            name="nipGuru"
            value={data.nipGuru}
            onChange={handleChange}
            placeholder="Masukkan NIP (Opsional)"
            className="w-full px-4 py-2 rounded-lg border border-[#B2DFDB] focus:ring-2 focus:ring-[#4DB6AC] focus:border-transparent outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#00796B]">Nama Kepala Madrasah</label>
          <input
            type="text"
            name="namaKepalaMadrasah"
            value={data.namaKepalaMadrasah}
            onChange={handleChange}
            placeholder="Nama Lengkap & Gelar"
            className="w-full px-4 py-2 rounded-lg border border-[#B2DFDB] focus:ring-2 focus:ring-[#4DB6AC] focus:border-transparent outline-none transition-all"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#00796B]">NIP Kepala Madrasah</label>
          <input
            type="text"
            name="nipKepalaMadrasah"
            value={data.nipKepalaMadrasah}
            onChange={handleChange}
            placeholder="Masukkan NIP (Opsional)"
            className="w-full px-4 py-2 rounded-lg border border-[#B2DFDB] focus:ring-2 focus:ring-[#4DB6AC] focus:border-transparent outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#00796B]">Semester</label>
          <select
            name="semester"
            value={data.semester}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-[#B2DFDB] focus:ring-2 focus:ring-[#4DB6AC] focus:border-transparent outline-none transition-all bg-white"
            required
          >
            <option value="">Pilih Semester</option>
            <option value="1 (Ganjil)">1 (Ganjil)</option>
            <option value="2 (Genap)">2 (Genap)</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#00796B]">Pilihan Fase</label>
          <select
            name="fase"
            value={data.fase}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-[#B2DFDB] focus:ring-2 focus:ring-[#4DB6AC] focus:border-transparent outline-none transition-all bg-white"
            required
          >
            <option value="">Pilih Fase</option>
            <option value="A">Fase A (Kelas 1-2)</option>
            <option value="B">Fase B (Kelas 3-4)</option>
            <option value="C">Fase C (Kelas 5-6)</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#00796B]">Pilihan Kelas</label>
          <input
            type="text"
            name="kelas"
            value={data.kelas}
            onChange={handleChange}
            placeholder="Contoh: 1, 2, 3..."
            className="w-full px-4 py-2 rounded-lg border border-[#B2DFDB] focus:ring-2 focus:ring-[#4DB6AC] focus:border-transparent outline-none transition-all"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#00796B]">Mata Pelajaran</label>
          <select
            name="mataPelajaran"
            value={data.mataPelajaran}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-[#B2DFDB] focus:ring-2 focus:ring-[#4DB6AC] focus:border-transparent outline-none transition-all bg-white"
            required
          >
            <option value="">Pilih Mata Pelajaran</option>
            <option value="Al-Qur'an Hadis">Al-Qur'an Hadis</option>
            <option value="Akidah Akhlak">Akidah Akhlak</option>
            <option value="Fikih">Fikih</option>
            <option value="SKI">SKI</option>
            <option value="Bahasa Arab">Bahasa Arab</option>
            <option value="Pendidikan Pancasila">Pendidikan Pancasila</option>
            <option value="Bahasa Indonesia">Bahasa Indonesia</option>
            <option value="Matematika">Matematika</option>
            <option value="IPAS">IPAS</option>
            <option value="PJOK">PJOK</option>
            <option value="Seni dan Budaya">Seni dan Budaya</option>
            <option value="Bahasa Inggris">Bahasa Inggris</option>
            <option value="Koding dan KA">Koding dan KA</option>
            <option value="Bahasa Daerah">Bahasa Daerah</option>
            <option value="Mulok">Mulok</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-semibold text-[#00796B] block">Pilih Tipe Soal</label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => onChange({ ...data, examType: 'simple' })}
            className={`py-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center space-y-2 ${
              data.examType === 'simple'
                ? 'bg-[#E0F2F1] border-[#00897B] text-[#00695C] shadow-md'
                : 'bg-white border-gray-200 text-gray-500 hover:border-[#B2DFDB]'
            }`}
          >
            <span className="text-lg font-bold">Soal Simple</span>
            <span className="text-xs">Format standar & sederhana</span>
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...data, examType: 'hots' })}
            className={`py-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center space-y-2 ${
              data.examType === 'hots'
                ? 'bg-[#E0F2F1] border-[#00897B] text-[#00695C] shadow-md'
                : 'bg-white border-gray-200 text-gray-500 hover:border-[#B2DFDB]'
            }`}
          >
            <span className="text-lg font-bold">Soal HOTS</span>
            <span className="text-xs">Analisis & Berpikir Kritis</span>
          </button>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={onNext}
          disabled={!isComplete}
          className="px-8 py-3 bg-[#00897B] text-white font-bold rounded-xl shadow-lg hover:bg-[#00695C] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
        >
          Selanjutnya
        </button>
      </div>
    </div>
  );
};
