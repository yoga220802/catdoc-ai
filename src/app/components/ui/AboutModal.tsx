'use client';

import Image from 'next/image';

// Mendefinisikan tipe untuk props komponen
interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  // Jangan render apapun jika modal tidak terbuka
  if (!isOpen) {
    return null;
  }

  return (
    // Latar belakang overlay
    <div
      onClick={onClose} // Menutup modal saat mengklik di luar area konten
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-opacity duration-300"
      aria-modal="true"
      role="dialog"
    >
      {/* Kontainer konten modal */}
      <div
        onClick={(e) => e.stopPropagation()} // Mencegah penutupan modal saat mengklik di dalam area konten
        className="relative bg-[#4fb8af] rounded-2xl shadow-xl p-8 m-4 max-w-lg w-full text-white text-center transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale"
        style={{
          animation: 'fade-in-scale 0.3s ease-out forwards',
        }}
      >
        {/* Logo */}
        <div className="mb-4">
          <Image
            src="/images/logo.png"
            alt="CatDoc AI Logo"
            width={60}
            height={60}
            className="mx-auto"
          />
        </div>

        {/* Judul dan Subjudul */}
        <h2 className="text-3xl font-bold font-secondary">CatDoc AI</h2>
        <h3 className="text-lg font-semibold mt-1 font-secondary">
          Sistem Pakar Diagnosa Penyakit Kucing
        </h3>
        
        {/* Copyright */}
        <p className="text-sm opacity-80 mt-2">
          Copyright © 2025, Codingers
        </p>

        {/* Deskripsi */}
        <p className="mt-6 text-base text-left font-primary leading-relaxed">
          Sistem pakar diagnosa penyakit kucing ini menggunakan pengetahuan dari pakar (dokter hewan) dan studi literatur, dengan metode Certainty Factor (CF) untuk akurasi diagnosa. Sistem mengolah data gejala, penyakit kucing, dan aturan guna memberikan pemahaman awal yang cepat dan mendukung keputusan tindakan yang tepat bagi pemilik kucing atau praktisi kesehatan hewan.
        </p>

        {/* Tombol Kembali */}
        <button
          onClick={onClose}
          className="mt-8 px-8 py-2 border-2 border-white rounded-full font-bold hover:bg-white hover:text-[#4fb8af] transition-colors duration-300"
        >
          Kembali
        </button>
      </div>
      
      {/* Menambahkan keyframes untuk animasi */}
      <style jsx>{`
        @keyframes fade-in-scale {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
