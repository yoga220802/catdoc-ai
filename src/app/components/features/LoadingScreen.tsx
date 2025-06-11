"use client";

import Image from "next/image";

interface LoadingScreenProps {
	/**
	 * @default false
	 */
	inline?: boolean;
	/**
	 * @default "Memuat data..."
	 */
	message?: string;
}

export default function LoadingScreen({
	inline = false,
	message = "Memuat data...",
}: LoadingScreenProps) {
	const containerClasses = inline
		? "flex flex-col items-center justify-center h-full p-20" // Kelas untuk mode inline
		: "flex flex-col items-center justify-center min-h-screen bg-white"; // Kelas untuk mode layar penuh

	return (
		<div className={containerClasses}>
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
				<div className='bg-gray-200 rounded-full h-2.5 w-full relative overflow-hidden'>
					<div className='absolute h-full w-full bg-gradient-to-r from-[#4fb8af] to-[#6de5de] left-0 top-0 animate-indeterminate' />
				</div>
				<p className='mt-2 text-sm text-center text-gray-600 font-semibold'>
					{message}
				</p>
			</div>

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
