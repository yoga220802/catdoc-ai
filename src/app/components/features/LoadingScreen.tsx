"use client";

import Image from "next/image";

// Komponen ini tidak lagi mengelola state progress atau durasi.
// Ini murni untuk menampilkan UI loading.
export default function LoadingScreen() {
	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-white'>
			{/* Container untuk Logo dan Teks */}
			<div className='flex flex-col items-center justify-center mb-6'>
				<div className='w-72 h-72 md:w-[200px] md:h-[200px] rounded-full bg-[#4BB79A] flex items-center justify-center shadow-lg'>
					<Image
						src='/images/logo.png'
						alt='Logo CatDoc AI'
						width={100}
						height={100}
						priority
					/>
				</div>
				<h1 className='text-2xl font-bold text-[#333]'>CatDoc AI</h1>
			</div>

			{/* Container untuk Progress Bar */}
			<div className='w-64'>
				{/* Latar belakang progress bar dengan overflow-hidden */}
				<div className='bg-gray-200 rounded-full h-2.5 w-full relative overflow-hidden'>
					{/* Bar animasi yang bergerak terus-menerus */}
					<div className='absolute h-full w-full bg-gradient-to-r from-[#4fb8af] to-[#6de5de] left-0 top-0 animate-indeterminate' />
				</div>
				{/* Teks diubah menjadi lebih umum */}
				<p className='mt-2 text-sm text-center text-gray-600 font-semibold'>
					Memuat data...
				</p>
			</div>

			{/* Menambahkan keyframes untuk animasi indeterminate ke CSS global */}
			<style jsx global>{`
				@keyframes indeterminate-progress {
					0% {
						transform: translateX(-100%);
					}
					100% {
						transform: translateX(100%);
					}
				}

				.animate-indeterminate {
					animation: indeterminate-progress 2s ease-in-out infinite;
				}
			`}</style>
		</div>
	);
}
