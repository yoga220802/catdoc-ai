import ImageWithFallback from '@/app/components/ui/ImageWithFallback';
import Link from 'next/link';

export default function HomePage() {
  return (
    <section className="container mx-auto px-6 md:px-12 lg:px-24 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12">
      {/* Kolom Teks */}
      <div className="md:w-1/2 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#004d40] leading-tight font-primary">
          SISTEM PAKAR
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold text-[#00695c] mt-2 font-primary">
          Diagnosa Penyakit Kucing
        </h2>
        <p className="mt-4 text-lg font-bold text-[#565D6D] max-w-md mx-auto md:mx-0 font-primary">
          Konsultasi keluhan kucing anda, diagnosa dini penyakit kucing dengan cepat untuk mencegah penyakit semakin parah.
        </p>
        <Link 
          href="/home" 
          className="mt-8 inline-block bg-[#4fb8af] text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-[#00796b] transition-transform transform hover:scale-105 font-secondary"
        >
          Yuk, Cek Kesehatan
        </Link>
      </div>
      
      {/* Kolom Gambar */}
      <div className="md:w-1/2 flex justify-center">
        <ImageWithFallback
          src="/images/ilustration 1.png"
          fallbackSrc="https://placehold.co/450x450/e0f7fa/004d40?text=Ilustrasi+Kucing"
          alt="Ilustrasi kucing untuk diagnosa"
          width={450}
          height={450}
          priority
          className="object-contain"
        />
      </div>
    </section>
  );
}
