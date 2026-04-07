import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#E0F2F1] border-b border-[#B2DFDB] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img 
            src="https://i.imgur.com/gUuF59Z.png" 
            alt="Logo" 
            className="h-10 w-10 object-contain"
            referrerPolicy="no-referrer"
          />
          <h1 className="text-xl font-bold text-[#00695C] tracking-tight">
            APLIKASI KISI KISI DAN SOAL
          </h1>
        </div>
        <nav className="hidden md:flex space-x-6">
          <a href="#" className="text-[#00796B] hover:text-[#004D40] transition-colors font-medium">Beranda</a>
          <a href="#" className="text-[#00796B] hover:text-[#004D40] transition-colors font-medium">Tentang</a>
          <a href="#" className="text-[#00796B] hover:text-[#004D40] transition-colors font-medium">Panduan</a>
        </nav>
      </div>
    </header>
  );
};
