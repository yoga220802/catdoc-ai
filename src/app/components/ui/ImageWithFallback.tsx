'use client';

import Image, { ImageProps } from 'next/image';
import { useState, useEffect } from 'react';

// Gabungkan props dari Next/Image dengan prop fallback kustom kita
interface ImageWithFallbackProps extends ImageProps {
  fallbackSrc: string;
}

/**
 * Komponen Image ini adalah Client Component ('use client') yang bisa menangani
 * event 'onError' untuk menampilkan gambar fallback jika gambar utama gagal dimuat.
 */
export default function ImageWithFallback({ src, fallbackSrc, ...rest }: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);

  // Jika prop 'src' berubah, reset state internal
  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <Image
      {...rest}
      src={imgSrc}
      onError={() => {
        // Jika terjadi error saat memuat 'src', ganti dengan 'fallbackSrc'
        setImgSrc(fallbackSrc);
      }}
    />
  );
}
