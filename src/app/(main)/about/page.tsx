import ImageWithFallback from '@/app/components/ui/ImageWithFallback';
import Link from 'next/link';

export default function AboutPage() {
    return (
      <section className="container mx-auto px-6 md:px-12 lg:px-24 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12">
        {/* Kolom Gambar */}
        <div className="md:w-1/2 flex justify-center order-1 md:order-none">
          <ImageWithFallback
            src="/images/ilustration 2.png"
            fallbackSrc="https://placehold.co/450x400/e0f7fa/004d40?text=Kucing+Santai"
            alt="Ilustrasi kucing berbaring"
            width={450}
            height={400}
            className="object-contain"
          />
        </div>

        {/* Kolom Teks */}
        <div className="md:w-1/2 text-center md:text-left order-2 md:order-none">
          <p className="text-sm font-bold text-[#00796b] font-primary">ABOUT US</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#004d40] mt-2 leading-snug font-secondary">
            Cegah Penyakit dengan Diagnosa Secara Dini dan Cepat
          </h2>
          <p className="mt-4 text-lg text-gray-700 max-w-md mx-auto md:mx-0 font-primary">
            Konsultasikan keluhan gejala-gejala untuk diagnosa secara dini guna mencegah penyakit dengan mudah, cepat dan akurat. Sistem pakar ini mengimplementasikan pengetahuan pakar langsung yaitu dokter hewan.
          </p>
          <Link 
            href="/about" 
            className="mt-8 inline-flex items-center gap-3 bg-transparent border-2 border-[#00796b] text-[#00796b] font-bold py-3 px-8 rounded-full hover:bg-[#00796b] hover:text-white transition-colors"
          >
            More Detail
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </section>
    );
  }
