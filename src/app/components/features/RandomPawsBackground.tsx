'use client';

import Image from 'next/image';
// Mengganti useMemo dengan useState dan useEffect untuk mengatasi hydration error
import { useState, useEffect } from 'react';

// Definisikan tipe untuk properti setiap tapak kaki
interface PawProps {
  top: string;
  left: string;
  size: number;
  rotation: number;
  opacity: number;
}

/**
 * Komponen ini menghasilkan tapak kaki kucing dengan posisi, ukuran,
 * dan rotasi acak. useEffect digunakan untuk memastikan nilai acak
 * hanya dibuat di sisi klien setelah render awal, untuk menghindari hydration error.
 */
export default function RandomPawsBackground() {
  // State untuk menyimpan properti tapak kaki. Defaultnya adalah array kosong.
  const [paws, setPaws] = useState<PawProps[]>([]);

  // useEffect hanya berjalan di sisi klien setelah komponen di-mount.
  // Ini adalah tempat yang aman untuk menghasilkan nilai acak.
  useEffect(() => {
    const pawArray: PawProps[] = [];
    const numPaws = 25; // Jumlah tapak kaki yang ingin ditampilkan

    for (let i = 0; i < numPaws; i++) {
      pawArray.push({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() * (50 - 20) + 20, // Ukuran acak
        rotation: Math.random() * 360,
        opacity: Math.random() * (0.4 - 0.15) + 0.15, // Opasitas acak
      });
    }

    // Update state, yang akan memicu re-render dengan tapak kaki yang terlihat
    setPaws(pawArray);
  }, []); // Array dependensi kosong memastikan efek ini hanya berjalan sekali

  return (
    // Container untuk semua tapak kaki
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0" aria-hidden="true">
      {paws.map((paw, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            top: paw.top,
            left: paw.left,
            transform: `translate(-50%, -50%) rotate(${paw.rotation}deg)`,
          }}
        >
          <Image
            src="/images/cat-paw.svg"
            alt="" // Alt text dikosongkan karena ini adalah elemen dekoratif
            width={paw.size}
            height={paw.size}
            style={{ opacity: paw.opacity }}
          />
        </div>
      ))}
    </div>
  );
}
