export type Fase = 'A' | 'B' | 'C';
export type ExamType = 'simple' | 'hots';

export interface IdentityData {
  namaSatuanPendidikan: string;
  namaGuru: string;
  nipGuru: string;
  namaKepalaMadrasah: string;
  nipKepalaMadrasah: string;
  tahunPelajaran: string;
  semester: string;
  examType: ExamType;
  fase: Fase;
  kelas: string;
  mataPelajaran: string;
}

export interface CPTPPair {
  cp: string;
  tp: string;
}

export interface MainInputData {
  cpTpPairs: CPTPPair[];
  jumlahPilihanGanda: number;
  jumlahPilihanGandaKompleks: number;
  jumlahIsian: number;
  jumlahUraian: number;
  persenL1: number;
  persenL2: number;
  persenL3: number;
  persenGambar: number;
  jumlahOpsiPG: number;
  jumlahOpsiPGK: number;
}

export interface Question {
  no: number;
  tipe: 'Pilihan Ganda' | 'Pilihan Ganda Kompleks' | 'Isian' | 'Uraian';
  pertanyaan: string;
  opsi?: {
    a: string;
    b: string;
    c: string;
    d: string;
    e?: string;
  };
  kunciJawaban: string;
  levelKognitif: 'L1' | 'L2' | 'L3';
  indikator: string;
  imagePrompt?: string;
}

export interface KisiKisiItem {
  no: number;
  fase: string;
  cp: string;
  materi: string;
  indikator: string;
  levelKognitif: string;
  noSoal: number;
  bentukSoal: string;
}

export interface GeneratorOutput {
  kisiKisi: KisiKisiItem[];
  soal: Question[];
  kunciJawaban: string[];
}
