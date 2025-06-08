'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
// Pastikan Anda mengimpor LoadingScreen yang sudah bersih dari folder components
import LoadingScreen from './components/features/LoadingScreen';

export default function RootPage() {
  const router = useRouter();

  // useEffect adalah tempat yang aman untuk efek samping seperti navigasi.
  // Ini akan berjalan setelah komponen selesai dirender.
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/landing'); // Arahkan ke halaman utama
    }, 3000); 

    // Membersihkan timer jika komponen di-unmount sebelum waktunya habis
    return () => clearTimeout(timer);
  }, [router]); // Dependency array memastikan efek ini hanya berjalan sekali

  // Selama render, komponen ini hanya mengembalikan UI LoadingScreen.
  return <LoadingScreen />;
}
