"use client";

import { useState } from "react";

type HelpItem = {
	id: number;
	title: string;
	steps?: string[];
	videoId?: string;
	image?: string;
};

const helpData: HelpItem[] = [
	{
		id: 1,
		title: "1. Cara Mengakses Menu",
		steps: [
			"Langkah pertama adalah mengarahkan kursor atau tangan ke bagian menu di samping kiri.",
			"Selanjutnya silahkan klik atau tekan menu yang ingin anda masuki.",
			"Menu yang anda kehendaki telah di tampilkan.",
		],
	},
	{
		id: 2,
		title: "2. Cara Melakukan Diagnosa",
		videoId: "dQw4w9WgXcQ",
		steps: [
			"Langkah pertama adalah mengarahkan kursor atau tangan ke bagian menu diagnosa.",
			"Selanjutnya silahkan cari gejala yang di dapati di lapangan, misal ayam dengan gejala Nafsu makan berkurang.",
			"Pilih keyakinan anda terhadap gejala tersebut.",
		],
	},
	{
		id: 3,
		title: "3. Cara Membaca di Menu Keterangan",
		videoId: "wD_e59XUNdQ",
	},
];

const AccordionItem = ({
	item,
	isOpen,
	onToggle,
}: {
	item: HelpItem;
	isOpen: boolean;
	onToggle: () => void;
}) => {
	return (
		<div className='border-b border-gray-200'>
			<button
				onClick={onToggle}
				className='w-full text-left py-4 focus:outline-none'
				aria-expanded={isOpen}>
				<h2 className='text-lg font-semibold text-gray-800'>{item.title}</h2>
			</button>
			{isOpen && (
				<div className='pb-4 pr-4 pl-8 text-gray-600 space-y-4'>
					{item.steps && (
						<ul className='list-decimal list-inside space-y-1'>
							{item.steps.map((step, index) => (
								<li key={index}>{step}</li>
							))}
						</ul>
					)}
					{item.videoId && (
						<div className='aspect-video w-full max-w-2xl overflow-hidden rounded-lg shadow-md'>
							<iframe
								src={`https://www.youtube.com/embed/${item.videoId}`}
								title={`Tutorial YouTube untuk ${item.title}`}
								frameBorder='0'
								allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
								allowFullScreen
								className='w-full h-full'></iframe>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default function BantuanPage() {
	const [openItemId, setOpenItemId] = useState<number | null>(null);

	const handleToggle = (id: number) => {
		setOpenItemId(openItemId === id ? null : id);
	};

	return (
		<div>
			<h1 className='text-2xl font-bold mb-4 text-[#004d40]'>Bantuan</h1>
			<div className='bg-white p-6 rounded-lg shadow-md'>
				{helpData.map((item) => (
					<AccordionItem
						key={item.id}
						item={item}
						isOpen={openItemId === item.id}
						onToggle={() => handleToggle(item.id)}
					/>
				))}
			</div>
		</div>
	);
}
