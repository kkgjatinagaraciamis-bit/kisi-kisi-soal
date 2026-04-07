import React, { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Step1 } from './components/Step1';
import { Step2 } from './components/Step2';
import { Step3 } from './components/Step3';
import { IdentityData, MainInputData, GeneratorOutput } from './types';
import { generateSoalAndKisiKisi } from './services/gemini';
import { exportToWord } from './services/wordExport';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [identity, setIdentity] = useState<IdentityData>({
    namaSatuanPendidikan: '',
    namaGuru: '',
    nipGuru: '',
    namaKepalaMadrasah: '',
    nipKepalaMadrasah: '',
    tahunPelajaran: '',
    semester: '',
    examType: 'simple',
    fase: 'A',
    kelas: '',
    mataPelajaran: '',
  });

  const [mainInput, setMainInput] = useState<MainInputData>({
    cpTpPairs: [{ cp: '', tp: '' }],
    materiEsensial: '',
    jumlahPilihanGanda: 10,
    jumlahPilihanGandaKompleks: 0,
    jumlahIsian: 5,
    jumlahUraian: 5,
    persenL1: 30,
    persenL2: 40,
    persenL3: 30,
    persenGambar: 20,
  });

  const [output, setOutput] = useState<GeneratorOutput | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const result = await generateSoalAndKisiKisi(identity, mainInput);
      setOutput(result);
      setStep(3);
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Gagal generate soal. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (output) {
      await exportToWord(identity, mainInput, output);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5FBFB] font-sans text-gray-900">
      <Header />
      
      <main className="pt-8 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="flex justify-between mb-2">
              <span className={`text-xs font-bold uppercase ${step >= 1 ? 'text-[#00897B]' : 'text-gray-400'}`}>Identitas</span>
              <span className={`text-xs font-bold uppercase ${step >= 2 ? 'text-[#00897B]' : 'text-gray-400'}`}>Input Utama</span>
              <span className={`text-xs font-bold uppercase ${step >= 3 ? 'text-[#00897B]' : 'text-gray-400'}`}>Hasil</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-[#00897B]"
                initial={{ width: '33%' }}
                animate={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Step1 
                  data={identity} 
                  onChange={setIdentity} 
                  onNext={() => setStep(2)} 
                />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Step2 
                  data={mainInput} 
                  examType={identity.examType}
                  onChange={setMainInput} 
                  onBack={() => setStep(1)}
                  onGenerate={handleGenerate}
                  isLoading={isLoading}
                />
              </motion.div>
            )}

            {step === 3 && output && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Step3 
                  identity={identity}
                  mainInput={mainInput}
                  output={output}
                  onBack={() => setStep(2)}
                  onDownload={handleDownload}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
