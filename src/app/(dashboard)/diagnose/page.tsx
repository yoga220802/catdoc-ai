"use client";

import { useState, useEffect, useMemo } from "react";
import {
	getAllGejala,
	getCFTerms,
	postDiagnosis,
	getAllPakar,
} from "@/lib/api";
import type {
	Gejala,
	CFTerm,
	DiagnosisResponse,
	Pakar,
	RankedResult,
	EvidenceDetail,
} from "@/types";
import { InfoIcon } from "@/app/components/icons";
import ImageWithFallback from "@/app/components/ui/ImageWithFallback";
import LoadingScreen from "@/app/components/features/LoadingScreen";

// Tipe untuk state yang menyimpan pilihan pengguna
type UserSelections = {
	[gejalaId: string]: number;
};

// Tipe untuk data gejala yang sudah dikelompokkan
type GroupedGejala = {
	[groupName: string]: Gejala[];
};

// Helper function untuk menentukan warna CF Evidence
const getCfEvidenceColor = (value: number) => {
	if (value > 0) return "text-green-600 font-semibold";
	if (value < 0) return "text-red-600 font-semibold";
	return "text-gray-500";
};

// Komponen baru untuk menampilkan detail gejala yang cocok
const MatchedEvidenceList = ({ details }: { details: EvidenceDetail[] }) => (
	<div className='bg-gray-100 p-4 rounded-lg'>
		<h3 className='text-lg font-semibold text-gray-800'>
			Gejala yang Cocok ({details.length})
		</h3>
		<ul className='mt-2 space-y-2'>
			{details.map((evidence) => (
				<li
					key={evidence.gejala.id}
					className='flex justify-between items-center text-sm'>
					<span className='text-gray-700'>{evidence.gejala.pertanyaan}</span>
					<span className={getCfEvidenceColor(evidence.cf_evidence)}>
						CF: {(evidence.cf_evidence * 100).toFixed(0)}%
					</span>
				</li>
			))}
		</ul>
	</div>
);

// Komponen baru untuk menampilkan hasil diagnosis lainnya
const OtherResultCard = ({
	result,
	rank,
}: {
	result: RankedResult;
	rank: number;
}) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className='border border-gray-200 rounded-lg'>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className='w-full flex justify-between items-center p-4 text-left'
				aria-expanded={isOpen}>
				<div className='flex items-center gap-4'>
					<span className='text-lg font-bold text-gray-400'>{rank}</span>
					<span className='font-semibold text-gray-800'>{result.penyakit.nama}</span>
				</div>
				<div className='flex items-center gap-3'>
					<span className='text-lg font-bold text-gray-600'>
						{result.certainty_score.toFixed(0)}%
					</span>
					<svg
						className={`w-5 h-5 text-gray-500 transform transition-transform ${
							isOpen ? "rotate-180" : ""
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
				</div>
			</button>
			{isOpen && (
				<div className='p-4 border-t border-gray-200 space-y-4'>
					<div>
						<h4 className='font-semibold text-gray-700'>Deskripsi:</h4>
						<p className='text-sm text-gray-600'>{result.penyakit.deskripsi}</p>
					</div>
					<div>
						<h4 className='font-semibold text-gray-700'>Solusi:</h4>
						<p className='text-sm text-gray-600'>{result.penyakit.solusi}</p>
					</div>
					<div>
						<h4 className='font-semibold text-gray-700'>Pencegahan:</h4>
						<p className='text-sm text-gray-600'>{result.penyakit.pencegahan}</p>
					</div>
					<MatchedEvidenceList details={result.evidence_details} />
				</div>
			)}
		</div>
	);
};

export default function DiagnosePage() {
	const [gejalaList, setGejalaList] = useState<Gejala[]>([]);
	const [cfTerms, setCfTerms] = useState<CFTerm[]>([]);
	const [pakarList, setPakarList] = useState<Pakar[]>([]);
	const [selections, setSelections] = useState<UserSelections>({});
	const [selectedPakar, setSelectedPakar] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isProcessing, setIsProcessing] = useState(false);
	const [showResults, setShowResults] = useState(false);
	const [diagnosisResult, setDiagnosisResult] =
		useState<DiagnosisResponse | null>(null);
	const [openGroups, setOpenGroups] = useState<{ [key: string]: boolean }>({});
	const [searchQuery, setSearchQuery] = useState("");

	const groupedGejala = useMemo(() => {
		const filteredGejala = gejalaList.filter((gejala) =>
			gejala.pertanyaan.toLowerCase().includes(searchQuery.toLowerCase())
		);
		return filteredGejala.reduce((acc, gejala) => {
			const groupName = gejala.kelompoks[0]?.nama || "Lain-lain";
			if (!acc[groupName]) acc[groupName] = [];
			acc[groupName].push(gejala);
			return acc;
		}, {} as GroupedGejala);
	}, [gejalaList, searchQuery]);

	useEffect(() => {
		async function fetchData() {
			setIsLoading(true);
			const [gejalaData, cfData, pakarData] = await Promise.all([
				getAllGejala(),
				getCFTerms(),
				getAllPakar(),
			]);
			setGejalaList(gejalaData.items);
			setCfTerms(cfData);
			setPakarList(pakarData.items);
			setIsLoading(false);
		}
		fetchData();
	}, []);

	useEffect(() => {
		if (searchQuery) {
			const allGroupNames = Object.keys(groupedGejala);
			const allOpen = allGroupNames.reduce(
				(acc, name) => ({ ...acc, [name]: true }),
				{}
			);
			setOpenGroups(allOpen);
		} else {
			if (Object.keys(groupedGejala).length > 0) {
				const firstGroupName = Object.keys(groupedGejala)[0];
				setOpenGroups({ [firstGroupName]: true });
			}
		}
	}, [searchQuery, groupedGejala]);

	const toggleGroup = (groupName: string) =>
		setOpenGroups((prev) => ({ ...prev, [groupName]: !prev[groupName] }));
	const handleSelectionChange = (gejalaId: string, cfValue: string) =>
		setSelections((prev) => ({ ...prev, [gejalaId]: parseFloat(cfValue) }));

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

	if (isLoading) {
		return <LoadingScreen inline message='Memuat daftar gejala...' />;
	}

	if (showResults && diagnosisResult) {
		if (
			!diagnosisResult.ranked_results ||
			diagnosisResult.ranked_results.length === 0
		) {
			return (
				<div className='text-center p-10 bg-white rounded-lg shadow-md'>
					<h2 className='text-2xl font-bold mb-4 text-[#004d40]'>
						Hasil Tidak Ditemukan
					</h2>
					<p className='text-gray-600 mb-6'>
						Tidak ada penyakit yang cocok dengan kombinasi gejala yang Anda pilih.
						Silakan coba lagi.
					</p>
					<button
						onClick={handleReset}
						className='bg-teal-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-teal-600 transition-colors'>
						Diagnosa Ulang
					</button>
				</div>
			);
		}

		const topResult = diagnosisResult.ranked_results[0];
		const otherResults = diagnosisResult.ranked_results.slice(1);

		return (
			<div className='bg-white p-6 rounded-lg shadow-md space-y-8'>
				<h2 className='text-3xl font-bold text-center text-[#004d40]'>
					Hasil Diagnosa
				</h2>

				{/* HASIL UTAMA */}
				<div className='bg-teal-50 p-6 rounded-lg shadow-inner'>
					<h3 className='text-lg font-semibold mb-4 text-center text-gray-700'>
						Diagnosis Paling Mungkin
					</h3>
					<div className='flex flex-col md:flex-row items-center justify-center gap-8 text-center'>
						<div className='flex-1'>
							<p className='text-4xl font-bold text-teal-600'>
								{topResult.penyakit.nama.toUpperCase()}
							</p>
							<p className='text-7xl font-bold text-teal-500'>
								{topResult.certainty_score.toFixed(0)}%
							</p>
						</div>
						<ImageWithFallback
							src={topResult.penyakit.image_url || ""}
							fallbackSrc='https://placehold.co/200x150/e0f7fa/004d40?text=Gambar+Penyakit'
							alt={`Gambar untuk penyakit ${topResult.penyakit.nama}`}
							width={200}
							height={150}
							className='rounded-lg object-cover'
						/>
					</div>
				</div>

				<div className='space-y-4'>
					<div>
						<h3 className='text-xl font-semibold text-gray-800'>Deskripsi</h3>
						<p className='text-gray-600 mt-1'>{topResult.penyakit.deskripsi}</p>
					</div>
					<div>
						<h3 className='text-xl font-semibold text-gray-800'>Solusi Penanganan</h3>
						<p className='text-gray-600 mt-1'>{topResult.penyakit.solusi}</p>
					</div>
					<div>
						<h3 className='text-xl font-semibold text-gray-800'>Pencegahan</h3>
						<p className='text-gray-600 mt-1'>{topResult.penyakit.pencegahan}</p>
					</div>
				</div>

				<MatchedEvidenceList details={topResult.evidence_details} />

				{/* HASIL LAINNYA */}
				{otherResults.length > 0 && (
					<div className='mt-8'>
						<h3 className='text-xl font-bold mb-4 text-gray-800'>
							Kemungkinan Penyakit Lain
						</h3>
						<div className='space-y-2'>
							{otherResults.map((result, index) => (
								<OtherResultCard
									key={result.penyakit.id}
									result={result}
									rank={index + 2}
								/>
							))}
						</div>
					</div>
				)}

				{/* DAFTAR GEJALA YANG DIPILIH */}
				<div className='bg-gray-100 p-4 rounded-lg'>
					<h3 className='text-lg font-semibold text-gray-800'>
						Gejala yang Dipilih
					</h3>
					<ul className='mt-2 space-y-2'>
						{Object.entries(selections)
							.filter(([, cfValue]) => cfValue !== 0)
							.map(([gejalaId, cfValue]) => {
								const gejala = gejalaList.find((g) => g.id === gejalaId);
								const certaintyTerm = cfTerms.find((term) => term.value === cfValue)?.term || "Tidak Tahu";
								return (
									<li
										key={gejalaId}
										className='flex justify-between items-center text-sm'>
										<span className='text-gray-700'>{gejala?.pertanyaan}</span>
										<span className='text-gray-600 font-semibold'>{certaintyTerm}</span>
									</li>
								);
							})}
					</ul>
				</div>

				{/* TOMBOL DIAGNOSA ULANG */}
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
			{/* PERBAIKAN: Tata letak dibuat responsif */}
			<div className='flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4'>
				<h1 className='text-2xl font-bold text-[#004d40] flex-shrink-0'>
					Diagnosa Penyakit
				</h1>
				<div className='flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto'>
					{/* Dropdown untuk memilih pakar */}
					<div className='relative w-full sm:w-56'>
						<select
							value={selectedPakar || ""}
							onChange={(e) => setSelectedPakar(e.target.value || null)}
							className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 placeholder-[#004d40] text-[#004d40] focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500 disabled:border-gray-200'
							aria-label='Pilih Pakar'>
							<option value=''>Gunakan Semua Pakar</option>
							{pakarList.map((pakar) => (
								<option key={pakar.id} value={pakar.id}>
									{pakar.nama}
								</option>
							))}
						</select>
					</div>
					{/* Input pencarian */}
					<div className='relative w-full sm:w-56'>
						<input
							type='text'
							placeholder='Cari gejala...'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 placeholder-[#004d40] text-[#004d40] focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500 disabled:border-gray-200'
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
					sudah tekan <b>TEKAN TOMBOL (✓)</b> di bawah untuk melihat hasil.
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
								<h2 className='font-semibold text-2xl text-gray-700'>{groupName}</h2>
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
												<th scope='col' className='px-6 py-3 text-base'>
													Gejala
												</th>
												<th scope='col' className='px-6 py-3 w-64 text-base'>
													Pilih Kondisi
												</th>
											</tr>
										</thead>
										<tbody>
											{gejalaInGroup.map((gejala) => (
												<tr key={gejala.id} className='bg-white border-t hover:bg-gray-50'>
													<td className='px-6 py-4 text-black text-base'>
														{gejala.pertanyaan}
													</td>
													<td className='px-6 py-4'>
														<select
															className='w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 text-black text-base'
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
				className='fixed bottom-10 right-10 bg-green-500 text-white h-16 w-16 rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 transition-all transform hover:w-auto hover:px-6 disabled:bg-gray-400 group'
				aria-label='Proses Diagnosa'>
				{isProcessing ? (
					<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-white'></div>
				) : (
					<div className='flex items-center gap-2'>
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
						<span className='hidden group-hover:block text-sm font-semibold'>
							Periksa Sekarang
						</span>
					</div>
				)}
			</button>
		</div>
	);
}
