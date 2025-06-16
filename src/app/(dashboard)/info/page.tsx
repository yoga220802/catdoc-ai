"use client";

import { useState, useEffect } from "react";
import { getAllPenyakit, getAllGejala } from "@/lib/api";
import type { Penyakit, Gejala } from "@/types";
import LoadingScreen from "@/app/components/features/LoadingScreen";
import ImageWithFallback from "@/app/components/ui/ImageWithFallback";
import InfoModal from "@/app/components/ui/InfoModal";

// Komponen untuk satu kartu penyakit
const PenyakitCard = ({
	penyakit,
	onDetailClick,
	onSaranClick,
}: {
	penyakit: Penyakit;
	onDetailClick: () => void;
	onSaranClick: () => void;
}) => (
	<div className='bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300'>
		<ImageWithFallback
			src={penyakit.image_url || ""}
			fallbackSrc='https://placehold.co/400x250/e0f7fa/004d40?text=Gambar+Penyakit'
			alt={`Gambar untuk penyakit ${penyakit.nama}`}
			width={400}
			height={250}
			className='w-full h-48 object-cover'
		/>
		<div className='p-4'>
			<h3 className='font-bold text-center text-gray-800 mb-3'>{penyakit.nama}</h3>
			<div className='flex justify-around gap-2'>
				<button
					onClick={onDetailClick}
					className='flex-1 bg-[#F2A264] text-white py-2 px-4 rounded-md font-semibold hover:bg-opacity-90'>
					Detail
				</button>
				<button
					onClick={onSaranClick}
					className='flex-1 bg-[#4FB8AF] text-white py-2 px-4 rounded-md font-semibold hover:bg-opacity-90'>
					Saran
				</button>
			</div>
		</div>
	</div>
);

export default function InfoPage() {
	const [activeTab, setActiveTab] = useState<"penyakit" | "gejala">("penyakit");
	const [penyakitList, setPenyakitList] = useState<Penyakit[]>([]);
	const [gejalaList, setGejalaList] = useState<Gejala[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// State untuk modal
	const [selectedPenyakit, setSelectedPenyakit] = useState<Penyakit | null>(
		null
	);
	const [modalType, setModalType] = useState<"detail" | "saran" | null>(null);

	useEffect(() => {
		async function fetchData() {
			setIsLoading(true);
			const [penyakitData, gejalaData] = await Promise.all([
				getAllPenyakit(),
				getAllGejala(),
			]);

			// PERBAIKAN: Mengurutkan daftar gejala berdasarkan ID secara numerik
			const sortedGejala = gejalaData.sort((a, b) => {
				const numA = parseInt(a.id.slice(1), 10);
				const numB = parseInt(b.id.slice(1), 10);
				return numA - numB;
			});

			setPenyakitList(penyakitData);
			setGejalaList(sortedGejala); // Menyimpan daftar gejala yang sudah diurutkan
			setIsLoading(false);
		}
		fetchData();
	}, []);

	const handleOpenModal = (penyakit: Penyakit, type: "detail" | "saran") => {
		setSelectedPenyakit(penyakit);
		setModalType(type);
	};

	const handleCloseModal = () => {
		setSelectedPenyakit(null);
		setModalType(null);
	};

	if (isLoading) {
		return <LoadingScreen inline message='Memuat basis pengetahuan...' />;
	}

	return (
		<div>
			<h1 className='text-2xl font-bold mb-4 text-[#004d40]'>Keterangan</h1>

			{/* Tombol Tab */}
			<div className='flex border-b border-gray-200 mb-6'>
				<button
					onClick={() => setActiveTab("penyakit")}
					className={`py-2 px-4 font-semibold transition-colors ${
						activeTab === "penyakit"
							? "border-b-2 border-teal-500 text-teal-600"
							: "text-gray-500 hover:text-teal-500"
					}`}>
					Daftar Penyakit
				</button>
				<button
					onClick={() => setActiveTab("gejala")}
					className={`py-2 px-4 font-semibold transition-colors ${
						activeTab === "gejala"
							? "border-b-2 border-teal-500 text-teal-600"
							: "text-gray-500 hover:text-teal-500"
					}`}>
					Daftar Gejala
				</button>
			</div>

			{/* Konten Tab */}
			<div>
				{activeTab === "penyakit" && (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{penyakitList.map((p) => (
							<PenyakitCard
								key={p.id}
								penyakit={p}
								onDetailClick={() => handleOpenModal(p, "detail")}
								onSaranClick={() => handleOpenModal(p, "saran")}
							/>
						))}
					</div>
				)}
				{activeTab === "gejala" && (
					<div className='bg-white shadow-md rounded-lg overflow-hidden'>
						<table className='w-full text-sm text-left text-gray-500'>
							<thead className='text-xs text-gray-700 uppercase bg-gray-50'>
								<tr>
									<th scope='col' className='px-6 py-3 w-24'>
										Kode
									</th>
									<th scope='col' className='px-6 py-3'>
										Nama Gejala
									</th>
									<th scope='col' className='px-6 py-3'>
										Pertanyaan Diagnosa
									</th>
								</tr>
							</thead>
							<tbody>
								{gejalaList.map((g) => (
									<tr key={g.id} className='bg-white border-b hover:bg-gray-50'>
										<td className='px-6 py-4 font-medium text-gray-900'>{g.id}</td>
										<td className='px-6 py-4'>{g.nama}</td>
										<td className='px-6 py-4'>{g.pertanyaan}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>

			{/* Modal */}
			<InfoModal
				isOpen={!!selectedPenyakit}
				onClose={handleCloseModal}
				title={
					modalType === "detail"
						? `Detail untuk ${selectedPenyakit?.nama}`
						: modalType === "saran"
						? `Saran untuk ${selectedPenyakit?.nama}`
						: ""
				}
				color={modalType === "saran" ? "suggestion" : "info"}>
				{modalType === "detail"
					? selectedPenyakit?.deskripsi
					: selectedPenyakit?.solusi}
			</InfoModal>
		</div>
	);
}
