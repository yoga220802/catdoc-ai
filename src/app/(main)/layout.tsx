import Header from "../components/features/Header";
import RandomPawsBackground from "../components/features/RandomPawsBackground";
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Container utama harus 'relative' untuk menjadi induk dari background
    // Warna background dipindahkan ke sini
    <div className="relative min-h-screen bg-[#A1E6D0] overflow-hidden">
      {/* Komponen background acak ditempatkan di sini */}
      <RandomPawsBackground />
      
      {/* Konten utama (header & children) ditempatkan di atas background */}
      <div className="relative z-10">
        <Header />
        <main>{children}</main>
      </div>
    </div>
  );
}
