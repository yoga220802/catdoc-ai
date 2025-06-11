"use client";

import { useState, useEffect, useMemo } from "react";
import {
	getAllGejala,
	getCFTerms,
	postDiagnosis,
	getAllPakar,
} from "@/lib/api";
import type { Gejala, CFTerm, DiagnosisResponse, Pakar } from "@/types";
import { InfoIcon } from "@/app/components/icons";
import Image from "next/image";
import LoadingScreen from "@/app/components/features/LoadingScreen"; 

type UserSelections = {
	[gejalaId: string]: number; // key: id gejala, value: nilai CF
};


type GroupedGejala = {
	[groupName: string]: Gejala[];
};

export default function DiagnosePage() {
	// State untuk data dari API
	const [gejalaList, setGejalaList] = useState<Gejala[]>([]);
	const [cfTerms, setCfTerms] = useState<CFTerm[]>([]);
	const [pakarList, setPakarList] = useState<Pakar[]>([]);

	// State untuk UI dan proses
	const [selections, setSelections] = useState<UserSelections>({});
	const [selectedPakar, setSelectedPakar] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isProcessing, setIsProcessing] = useState(false);
	const [showResults, setShowResults] = useState(false);
	const [diagnosisResult, setDiagnosisResult] =
		useState<DiagnosisResponse | null>(null);
	const [openGroups, setOpenGroups] = useState<{ [key: string]: boolean }>({});
	const [searchQuery, setSearchQuery] = useState("");

	// Mengelompokkan gejala berdasarkan kategori dan filter pencarian
	const groupedGejala = useMemo(() => {
		const filteredGejala = gejalaList.filter((gejala) =>
			gejala.pertanyaan.toLowerCase().includes(searchQuery.toLowerCase())
		);

		return filteredGejala.reduce((acc, gejala) => {
			const groupName = gejala.kelompoks[0]?.nama || "Lain-lain";
			if (!acc[groupName]) {
				acc[groupName] = [];
			}
			acc[groupName].push(gejala);
			return acc;
		}, {} as GroupedGejala);
	}, [gejalaList, searchQuery]);

	// Mengambil data awal
	useEffect(() => {
		async function fetchData() {
			setIsLoading(true);
			const [gejalaData, cfData, pakarData] = await Promise.all([
				getAllGejala(),
				getCFTerms(),
				getAllPakar(),
			]);
			setGejalaList(gejalaData);
			setCfTerms(cfData);
			setPakarList(pakarData);
			setIsLoading(false);
		}
		fetchData();
	}, []);

	// Efek untuk membuka semua grup saat pencarian aktif
	useEffect(() => {
		if (searchQuery) {
			const allGroupNames = Object.keys(groupedGejala);
			const allOpen = allGroupNames.reduce((acc, name) => {
				acc[name] = true;
				return acc;
			}, {} as { [key: string]: boolean });
			setOpenGroups(allOpen);
		} else {
			if (Object.keys(groupedGejala).length > 0) {
				const firstGroupName = Object.keys(groupedGejala)[0];
				setOpenGroups({ [firstGroupName]: true });
			}
		}
	}, [searchQuery, groupedGejala]);

	const toggleGroup = (groupName: string) => {
		setOpenGroups((prev) => ({ ...prev, [groupName]: !prev[groupName] }));
	};

	const handleSelectionChange = (gejalaId: string, cfValue: string) => {
		setSelections((prev) => ({ ...prev, [gejalaId]: parseFloat(cfValue) }));
	};

	const handleSubmit = async () => {
		setIsProcessing(true);
		const gejala_user = Object.entries(selections)
			.filter(([, cfValue]) => cfValue !== 0)
			.map(([gejalaId, cfValue]) => ({ id_gejala: gejalaId, cf_user: cfValue }));
		if (gejala_user.length === 0) {
			alert(
				'Silakan pilih minimal satu gejala dengan tingkat keyakinan selain "Tidak Tahu".'
			);
			setIsProcessing(false);
			return;
		}
		const result = await postDiagnosis({ gejala_user }, selectedPakar);
		setDiagnosisResult(result);
		setShowResults(true);
		setIsProcessing(false);
	};

	const handleReset = () => {
		setSelections({});
		setShowResults(false);
		setDiagnosisResult(null);
		setSearchQuery("");
		setSelectedPakar(null);
	};

	// Tampilan loading screen saat mengambil data awal
	if (isLoading) {
		return <LoadingScreen inline message='Memuat daftar gejala...' />;
	}

	if (showResults && diagnosisResult) {
		const topResult = diagnosisResult.ranked_results[0];
		return (
			<div className='bg-white p-6 rounded-lg shadow-md'>
				<h2 className='text-2xl font-bold mb-4 text-[#004d40]'>Hasil Diagnosa</h2>
				<div className='bg-teal-50 p-6 rounded-lg shadow-inner'>
					<h3 className='text-lg font-semibold mb-2 text-center text-gray-700'>
						Jenis Penyakit Yang Diderita
					</h3>
					<div className='flex flex-col md:flex-row items-center justify-center gap-8 text-center'>
						<div className='flex-1'>
							<p className='text-4xl font-bold text-teal-600'>
								{topResult.penyakit.nama.toUpperCase()}
							</p>
							<p className='text-7xl font-bold text-teal-500'>
								{(topResult.certainty_score * 100).toFixed(0)}%
							</p>
						</div>
						<Image
							src='/images/meme-cat.jpg'
							alt='Meme Kucing'
							width={200}
							height={150}
							className='rounded-lg object-cover'
						/>
					</div>
				</div>
				<div className='mt-6'>
					<h3 className='text-xl font-semibold text-gray-800'>Deskripsi</h3>
					<p className='text-gray-600 mt-2'>{topResult.penyakit.deskripsi}</p>
					<h3 className='text-xl font-semibold text-gray-800 mt-4'>
						Solusi Penanganan
					</h3>
					<p className='text-gray-600 mt-2'>{topResult.penyakit.solusi}</p>
				</div>
				<button
					onClick={handleReset}
					className='mt-8 w-full bg-teal-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-teal-600 transition-colors'>
					Diagnosa Ulang
				</button>
			</div>
		);
	}

	return (
		<div className='relative pb-24'>
			<div className='flex justify-between items-center mb-4 flex-wrap gap-4'>
				<h1 className='text-2xl font-bold text-[#004d40]'>Diagnosa Penyakit</h1>
				<div className='flex items-center gap-4'>
					<div className='relative w-56'>
						<select
							value={selectedPakar || ""}
							onChange={(e) => setSelectedPakar(e.target.value || null)}
							className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500  placeholder-[#004d40] text-[#004d40] focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500 disabled:border-gray-200'
							aria-label='Pilih Pakar'>
							<option value=''>Gunakan Semua Pakar</option>
							{pakarList.map((pakar) => (
								<option key={pakar.id} value={pakar.id}>
									{pakar.nama}
								</option>
							))}
						</select>
					</div>
					<div className='relative w-56'>
						<input
							type='text'
							placeholder='Cari gejala...'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500  placeholder-[#004d40] text-[#004d40] focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500 disabled:border-gray-200'
						/>
						<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
							<svg
								className='w-5 h-5 text-gray-400'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth='2'
									d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'></path>
							</svg>
						</div>
					</div>
				</div>
			</div>
			<div className='flex items-start bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg mb-6'>
				<InfoIcon className='w-6 h-6 mr-3 flex-shrink-0' />
				<p>
					Silakan memilih gejala sesuai dengan kondisi kucing anda, anda dapat
					memilih kepastian kondisi kucing dari pasti tidak sampai pasti ya, jika
					sudah tekan tombol proses (✓) di bawah untuk melihat hasil.
				</p>
			</div>

			<div className='space-y-4'>
				{Object.keys(groupedGejala).length > 0 ? (
					Object.entries(groupedGejala).map(([groupName, gejalaInGroup]) => (
						<div
							key={groupName}
							className='border border-gray-200 rounded-lg overflow-hidden'>
							<button
								onClick={() => toggleGroup(groupName)}
								className='w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100'
								aria-expanded={!!openGroups[groupName]}>
								<h2 className='font-semibold text-lg text-gray-700'>{groupName}</h2>
								<svg
									className={`w-5 h-5 text-gray-500 transform transition-transform ${
										openGroups[groupName] ? "rotate-180" : ""
									}`}
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth='2'
										d='M19 9l-7 7-7-7'></path>
								</svg>
							</button>
							{openGroups[groupName] && (
								<div className='bg-white'>
									<table className='w-full text-sm text-left text-gray-500'>
										<thead className='text-xs text-gray-700 uppercase bg-gray-50'>
											<tr>
												<th scope='col' className='px-6 py-3'>
													Gejala
												</th>
												<th scope='col' className='px-6 py-3 w-64'>
													Pilih Kondisi
												</th>
											</tr>
										</thead>
										<tbody>
											{gejalaInGroup.map((gejala) => (
												<tr key={gejala.id} className='bg-white border-t hover:bg-gray-50'>
													<td className='px-6 py-4'>{gejala.pertanyaan}</td>
													<td className='px-6 py-4'>
														<select
															className='w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500'
															value={selections[gejala.id] || 0}
															onChange={(e) =>
																handleSelectionChange(gejala.id, e.target.value)
															}
															aria-label={`Pilih kondisi untuk gejala: ${gejala.pertanyaan}`}>
															{cfTerms.map((term) => (
																<option key={term.value} value={term.value}>
																	{term.term}
																</option>
															))}
														</select>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							)}
						</div>
					))
				) : (
					<div className='text-center py-10 text-gray-500'>
						<p>Tidak ada gejala yang cocok dengan pencarian Anda.</p>
					</div>
				)}
			</div>

			<button
				onClick={handleSubmit}
				disabled={isProcessing}
				className='fixed bottom-10 right-10 bg-green-500 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 transition-transform transform hover:scale-110 disabled:bg-gray-400'
				aria-label='Proses Diagnosa'>
				{isProcessing ? (
					<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-white'></div>
				) : (
					<svg
						className='w-8 h-8'
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth='2'
							d='M5 13l4 4L19 7'></path>
					</svg>
				)}
			</button>
		</div>
	);
}
