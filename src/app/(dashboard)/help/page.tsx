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
			"Akses Menu: Arahkan kursor atau sentuh bagian menu di sisi kiri layar Anda.",
			"Pilih Menu: Klik atau sentuh menu yang ingin Anda buka.",
			"Selesai! Menu yang Anda pilih kini sudah terlihat.",
		],
	},
	{
		id: 2,
		title: "2. Cara Melakukan Diagnosa",
		videoId: "JsSYh1b2Zk0",
		steps: [
			"Mulai Diagnosa: Arahkan kursor atau sentuh bagian menu diagnosa.",
			"Pilih Pakar (Opsional): Anda bisa memilih ahli yang ingin Anda gunakaJika tidak memilih, sistem akan menggunakan gabungan informasi dari kedua ahli.",
			"Cari Gejala: Cari gejala yang terlihat, misalnya, 'Terdapat kerak di kulit.'",
			"Tentukan Keyakinan: Pilih seberapa yakin Anda terhadap gejala tersebut (misalnya, sangat yakin, cukup yakin, dll.).",
			"Tambahkan Gejala Lain (Jika Ada): Jika ada gejala lain, tambahkan lagi seperti langkah 3 dan 4.",
			"Lihat Hasil Diagnosa: Setelah semua gejala dimasukkan, tekan tombol Proses (✓) untuk melihat hasilnya.",
			"Hasil Diagnosa Muncul: Sistem akan menampilkan hasil diagnosa dan penyakit yang mungkin diderita.",
			"Diagnosa Ulang: Jika Anda ingin mencoba diagnosa lagi, cukup pilih tombol Diagnosa ulang dan ulangi dari langkah 1.",
		],
	},
	{
		id: 3,
		title: "3. Cara Membaca di Menu Keterangan",
		steps: [
			"Mulai dari Menu Keterangan: Arahkan kursor atau sentuh bagian menu keterangan.",
			"Pilih Daftar Penyakit: Selanjutnya, pilih Daftar penyakit.",
			"Cari Penyakit: Cari penyakit yang ingin Anda ketahui. Anda akan melihat tombol Detail dan Saran di bawahnya.",
			"Lihat Detail Penyakit: Tekan tombol Detail untuk melihat informasi lengkap tentang penyakit tersebut. Setelah selesai, Anda bisa menutupnya dengan menekan tanda (x) di pojok atas atau tombol Close di bawah.",
			"Lihat Saran Penyakit: Tekan tombol Saran untuk melihat anjuran terkait penyakit tersebut. Setelah selesai, Anda bisa menutupnya dengan menekan tanda (x) di pojok atas atau tombol Close di bawah.",
			"Pilih Daftar Gejala: Melihat daftar-daftar dari gejala penyakit.",
		],
		videoId: "mBvhVmrvckU",
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
