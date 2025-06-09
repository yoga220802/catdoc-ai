"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function LoadingScreen() {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		// Efek ini SEKARANG HANYA mengontrol animasi progress bar.
		// Tidak ada lagi logika navigasi/routing di sini.
		const loadingDuration = 3000; // Durasi 3 detik
		const intervalTime = 30;

		const interval = setInterval(() => {
			setProgress((prevProgress) => {
				const newProgress = prevProgress + 100 / (loadingDuration / intervalTime);
				if (newProgress >= 100) {
					clearInterval(interval);
					return 100;
				}
				return newProgress;
			});
		}, intervalTime);

		// Membersihkan interval saat komponen dilepas (misalnya, setelah navigasi selesai)
		return () => clearInterval(interval);
	}, []); // Dependensi kosong, hanya berjalan sekali saat komponen dimuat.

	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-white'>
			{/* Container untuk Logo dan Teks */}
			<div className='flex flex-col items-center justify-center mb-6'>
				{/* Lingkaran Latar Belakang */}
				<div className='w-72 h-72 md:w-[200px] md:h-[200px] rounded-full bg-[#4BB79A] flex items-center justify-center shadow-lg'>
					<Image
						src='/images/logo.png'
						alt='CatDoc AI Logo'
						width={100}
						height={100}
						priority
					/>
				</div>
				<h1 className='text-2xl font-bold text-[#333]'>CatDoc AI</h1>
			</div>

			{/* Container untuk Progress Bar */}
			<div className='w-64'>
				{/* Latar belakang progress bar */}
				<div className='bg-gray-200 rounded-full h-2.5 dark:bg-gray-700'>
					{/* Indikator progress */}
					<div
						className='bg-gradient-to-r from-[#4fb8af] to-[#6de5de] h-2.5 rounded-full transition-all duration-150 ease-linear'
						style={{ width: `${progress}%` }}></div>
				</div>
				{/* Teks Persentase */}
				<p className='mt-2 text-sm text-center text-[#4CAF50] font-semibold'>
					{Math.round(progress)}%
				</p>
			</div>
		</div>
	);
}
