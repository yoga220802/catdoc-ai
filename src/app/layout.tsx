import type { Metadata } from "next";
import { Lexend, Manrope } from "next/font/google";
import "./styles/globals.css";

// Konfigurasi font Lexend untuk digunakan sebagai font utama (primary)
const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend", // Menetapkan variabel CSS --font-lexend
  display: 'swap',
});

// Konfigurasi font Manrope untuk digunakan sebagai font kedua (secondary)
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope", // Menetapkan variabel CSS --font-manrope
  display: 'swap',
});

export const metadata: Metadata = {
  title: "CatDoc AI",
  description: "Sistem Pakar untuk Diagnosa Penyakit Kucing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        // Menerapkan variabel font ke elemen body
        className={`${lexend.variable} ${manrope.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
