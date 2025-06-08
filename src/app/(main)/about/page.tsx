'use client';

import { useState } from 'react';
import ImageWithFallback from '@/app/components/ui/ImageWithFallback';
import AboutModal from '@/app/components/ui/AboutModal';

export default function AboutPage() {
  // State untuk mengontrol visibilitas modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fungsi untuk membuka modal
  const openModal = () => setIsModalOpen(true);
  
  // Fungsi untuk menutup modal
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <section className="container mx-auto px-6 md:px-12 lg:px-24 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12">
        {/* Kolom Gambar */}
        <div className="md:w-1/2 flex justify-center">
          <ImageWithFallback
            src="/images/ilustration 2.png" // Anda mungkin perlu menambahkan gambar ilustrasi baru
            fallbackSrc="https://placehold.co/450x450/e0f7fa/004d40?text=About+Us"
            alt="Ilustrasi tentang CatDoc AI"
            width={450}
            height={450}
            className="object-contain"
          />
        </div>

        {/* Kolom Teks */}
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#004d40] leading-tight font-secondary">
            Tentang CatDoc AI
          </h1>
          <p className="mt-4 text-lg text-gray-700 max-w-md mx-auto md:mx-0 font-primary">
            CatDoc AI adalah sebuah sistem pakar yang dirancang untuk membantu pemilik kucing dan praktisi kesehatan hewan dalam melakukan diagnosa awal terhadap penyakit yang diderita oleh kucing.
          </p>
          <button
            onClick={openModal} // Membuka modal ketika tombol diklik
            className="mt-8 inline-block bg-[#4fb8af] text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-[#00796b] transition-transform transform hover:scale-105"
          >
            More Detail
          </button>
        </div>
      </section>

      {/* Komponen Modal */}
      {/* Modal hanya akan dirender jika isModalOpen bernilai true */}
      <AboutModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}
