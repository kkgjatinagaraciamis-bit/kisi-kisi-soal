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
    <div className="space-y-8 max-w-6xl mx-auto p-8 bg-white rounded-3xl shadow-2xl border border-[#B2DFDB]">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold text-[#00695C] tracking-tight">Identitas Instrumen</h2>
        <p className="text-gray-500 font-medium">Lengkapi data administrasi untuk pembuatan kisi-kisi dan soal</p>
      </div>

      <div className="space-y-8">
        {/* Section 1: Madrasah & Waktu */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2 border-b border-[#B2DFDB] pb-2">
            <div className="w-2 h-6 bg-[#00897B] rounded-full"></div>
            <h3 className="font-bold text-[#00796B] uppercase tracking-wider text-sm">Informasi Madrasah & Waktu</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#00796B]">Nama Satuan Pendidikan</label>
              <input
                type="text"
                name="namaSatuanPendidikan"
                value={data.namaSatuanPendidikan}
                onChange={handleChange}
                placeholder="Contoh: MI Negeri 8 Ciamis"
                className="w-full px-4 py-2.5 rounded-xl border border-[#B2DFDB] focus:ring-2 focus:ring-[#4DB6AC] focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#00796B]">Tahun Pelajaran</label>
              <select
                name="tahunPelajaran"
                value={data.tahunPelajaran}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-[#B2DFDB] focus:ring-2 focus:ring-[#4DB6AC] focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                required
              >
                <option value="">Pilih Tahun Pelajaran</option>
                <option value="2025/2026">2025/2026</option>
                <option value="2026/2027">2026/2027</option>
                <option value="2027/2028">2027/2028</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#00796B]">Semester</label>
              <select
                name="semester"
                value={data.semester}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-[#B2DFDB] focus:ring-2 focus:ring-[#4DB6AC] focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                required
              >
                <option value="">Pilih Semester</option>
                <option value="1 (Ganjil)">1 (Ganjil)</option>
                <option value="2 (Genap)">2 (Genap)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Section 2: Guru & Kepala */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2 border-b border-[#B2DFDB] pb-2">
            <div className="w-2 h-6 bg-[#00897B] rounded-full"></div>
            <h3 className="font-bold text-[#00796B] uppercase tracking-wider text-sm">Informasi Guru & Kepala</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2 lg:col-span-1">
              <label className="text-sm font-semibold text-[#00796B]">Nama Guru</label>
              <input
                type="text"
                name="namaGuru"
                value={data.namaGuru}
                onChange={handleChange}
                placeholder="Nama & Gelar"
                className="w-full px-4 py-2.5 rounded-xl border border-[#B2DFDB] focus:ring-2 focus:ring-[#4DB6AC] focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                required
              />
            </div>

            <div className="space-y-2 lg:col-span-1">
              <label className="text-sm font-semibold text-[#00796B]">NIP Guru</label>
              <input
                type="text"
                name="nipGuru"
                value={data.nipGuru}
                onChange={handleChange}
                placeholder="NIP (Opsional)"
                className="w-full px-4 py-2.5 rounded-xl border border-[#B2DFDB] focus:ring-2 focus:ring-[#4DB6AC] focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
              />
            </div>

            <div className="space-y-2 lg:col-span-1">
              <label className="text-sm font-semibold text-[#00796B]">Nama Kepala Madrasah</label>
              <input
                type="text"
                name="namaKepalaMadrasah"
                value={data.namaKepalaMadrasah}
                onChange={handleChange}
                placeholder="Nama & Gelar"
                className="w-full px-4 py-2.5 rounded-xl border border-[#B2DFDB] focus:ring-2 focus:ring-[#4DB6AC] focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                required
              />
            </div>

            <div className="space-y-2 lg:col-span-1">
              <label className="text-sm font-semibold text-[#00796B]">NIP Kepala</label>
              <input
                type="text"
                name="nipKepalaMadrasah"
                value={data.nipKepalaMadrasah}
                onChange={handleChange}
                placeholder="NIP (Opsional)"
                className="w-full px-4 py-2.5 rounded-xl border border-[#B2DFDB] focus:ring-2 focus:ring-[#4DB6AC] focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
              />
            </div>
          </div>
        </section>

        {/* Section 3: Akademik */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2 border-b border-[#B2DFDB] pb-2">
            <div className="w-2 h-6 bg-[#00897B] rounded-full"></div>
            <h3 className="font-bold text-[#00796B] uppercase tracking-wider text-sm">Informasi Akademik</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#00796B]">Pilihan Fase</label>
              <select
                name="fase"
                value={data.fase}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-[#B2DFDB] focus:ring-2 focus:ring-[#4DB6AC] focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
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
                className="w-full px-4 py-2.5 rounded-xl border border-[#B2DFDB] focus:ring-2 focus:ring-[#4DB6AC] focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-[#00796B]">Mata Pelajaran</label>
              <select
                name="mataPelajaran"
                value={data.mataPelajaran}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-[#B2DFDB] focus:ring-2 focus:ring-[#4DB6AC] focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
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
        </section>

        {/* Section 4: Tipe Soal */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2 border-b border-[#B2DFDB] pb-2">
            <div className="w-2 h-6 bg-[#00897B] rounded-full"></div>
            <h3 className="font-bold text-[#00796B] uppercase tracking-wider text-sm">Tipe Instrumen</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              type="button"
              onClick={() => onChange({ ...data, examType: 'simple' })}
              className={`p-6 rounded-2xl border-2 transition-all flex items-center space-x-4 text-left ${
                data.examType === 'simple'
                  ? 'bg-[#E0F2F1] border-[#00897B] text-[#00695C] shadow-lg scale-[1.02]'
                  : 'bg-white border-gray-100 text-gray-500 hover:border-[#B2DFDB] hover:bg-gray-50'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${data.examType === 'simple' ? 'bg-[#00897B] text-white' : 'bg-gray-100 text-gray-400'}`}>
                <span className="text-xl font-bold">S</span>
              </div>
              <div>
                <span className="text-lg font-bold block">Soal Simple</span>
                <span className="text-xs opacity-80">Format standar, langsung, dan mudah dipahami oleh siswa.</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => onChange({ ...data, examType: 'hots' })}
              className={`p-6 rounded-2xl border-2 transition-all flex items-center space-x-4 text-left ${
                data.examType === 'hots'
                  ? 'bg-[#E0F2F1] border-[#00897B] text-[#00695C] shadow-lg scale-[1.02]'
                  : 'bg-white border-gray-200 text-gray-500 hover:border-[#B2DFDB] hover:bg-gray-50'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${data.examType === 'hots' ? 'bg-[#00897B] text-white' : 'bg-gray-100 text-gray-400'}`}>
                <span className="text-xl font-bold">H</span>
              </div>
              <div>
                <span className="text-lg font-bold block">Soal HOTS</span>
                <span className="text-xs opacity-80">Higher Order Thinking Skills. Fokus pada analisis dan logika.</span>
              </div>
            </button>
          </div>
        </section>
      </div>

      <div className="flex justify-end pt-6 border-t border-gray-100">
        <button
          onClick={onNext}
          disabled={!isComplete}
          className="px-12 py-4 bg-[#00897B] text-white font-bold rounded-2xl shadow-xl hover:bg-[#00695C] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 flex items-center space-x-2"
        >
          <span>Lanjutkan ke Input Utama</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};
