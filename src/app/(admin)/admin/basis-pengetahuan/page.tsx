"use client";

import { useState, useEffect, useMemo } from "react";
import { getAllRules, getAllPakar } from "@/lib/api";
import type { Rule, Pakar } from "@/types";
import LoadingScreen from "@/app/components/features/LoadingScreen";

const ITEMS_PER_PAGE = 20;

// Tipe baru untuk item yang sudah diproses dengan rowSpan
type ProcessedRule = Rule & {
	rowSpan: number;
};

// Custom hook untuk debounce
function useDebounce<T>(value: T, delay?: number): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

		return () => {
			clearTimeout(timer);
		};
	}, [value, delay]);

	return debouncedValue;
}

export default function BasisPengetahuanPage() {
	const [allRules, setAllRules] = useState<Rule[]>([]);
	const [pakarList, setPakarList] = useState<Pakar[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState("");

	const debouncedSearchQuery = useDebounce(searchQuery, 500);

	// Fetch semua data sekali saat komponen dimuat
	useEffect(() => {
		async function fetchData() {
			setIsLoading(true);
			const [rulesResponse, pakarData] = await Promise.all([
				getAllRules(1, 1000), // Ambil semua data (atau jumlah yang sangat besar)
				getAllPakar(),
			]);
			setAllRules(rulesResponse.items);
			setPakarList(pakarData.items);
			setIsLoading(false);
		}
		fetchData();
	}, []);

	// Logika untuk filter, paginasi, dan pemrosesan baris di sisi klien
	const processedRules = useMemo(() => {
		// 1. Filter berdasarkan pencarian
		const filtered = allRules.filter(
			(rule) =>
				rule.penyakit.nama
					.toLowerCase()
					.includes(debouncedSearchQuery.toLowerCase()) ||
				rule.gejala.nama.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
		);

		// 2. Lakukan paginasi pada hasil filter
		const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
		const paginated = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

		// 3. Proses untuk menggabungkan sel (rowSpan)
		const rulesWithRowSpan: ProcessedRule[] = [];
		for (let i = 0; i < paginated.length; i++) {
			if (i > 0 && paginated[i].penyakit.id === paginated[i - 1].penyakit.id) {
				rulesWithRowSpan.push({ ...paginated[i], rowSpan: 0 });
			} else {
				let rowSpan = 1;
				for (let j = i + 1; j < paginated.length; j++) {
					if (paginated[j].penyakit.id === paginated[i].penyakit.id) {
						rowSpan++;
					} else {
						break;
					}
				}
				rulesWithRowSpan.push({ ...paginated[i], rowSpan });
			}
		}
		return rulesWithRowSpan;
	}, [allRules, currentPage, debouncedSearchQuery]);

	const totalPages = Math.ceil(
		allRules.filter(
			(rule) =>
				rule.penyakit.nama
					.toLowerCase()
					.includes(debouncedSearchQuery.toLowerCase()) ||
				rule.gejala.nama.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
		).length / ITEMS_PER_PAGE
	);

	// Reset ke halaman 1 setiap kali pencarian berubah
	useEffect(() => {
		setCurrentPage(1);
	}, [debouncedSearchQuery]);

	const handlePageChange = (newPage: number) => {
		if (newPage > 0 && newPage <= totalPages) {
			setCurrentPage(newPage);
		}
	};

	if (isLoading) {
		return <LoadingScreen inline message='Memuat basis pengetahuan...' />;
	}

	return (
		<div>
			<div className='flex flex-col md:flex-row justify-between items-center mb-6 gap-4'>
				<h1 className='text-2xl font-bold text-[#004d40]'>Basis Pengetahuan</h1>
				<div className='flex gap-4 w-full md:w-auto'>
					<input
						type='text'
						placeholder='Cari penyakit/gejala...'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className='w-full md:w-64 px-4 py-2 border rounded-lg'
					/>
					<button className='bg-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-600 transition-colors'>
						Tambah +
					</button>
				</div>
			</div>
			<div className='bg-white shadow-md rounded-lg overflow-x-auto'>
				<table className='w-full text-sm text-left text-gray-500'>
					<thead className='text-xs text-gray-700 uppercase bg-gray-50'>
						<tr>
							<th className='px-6 py-3'>Penyakit</th>
							<th className='px-6 py-3'>Gejala</th>
							{pakarList.map((pakar) => (
								<th key={pakar.id} className='px-6 py-3'>
									CF {pakar.nama}
								</th>
							))}
							<th className='px-6 py-3'>Pilihan</th>
						</tr>
					</thead>
					<tbody>
						{processedRules.length > 0 ? (
							processedRules.map((rule) => (
								<tr key={rule.id} className='bg-white border-b hover:bg-gray-50'>
									{rule.rowSpan > 0 && (
										<td
											rowSpan={rule.rowSpan}
											className='px-6 py-4 font-medium text-gray-900 align-top border-r'>
											{rule.penyakit.nama}
										</td>
									)}
									<td className='px-6 py-4'>{rule.gejala.nama}</td>
									{pakarList.map((pakar) => {
										const cf = rule.rule_cfs.find((rcf) => rcf.pakar.id === pakar.id);
										return (
											<td key={pakar.id} className='px-6 py-4 text-center'>
												{cf ? cf.nilai : "N/A"}
											</td>
										);
									})}
									<td className='px-6 py-4 flex gap-2'>
										<button className='bg-blue-500 text-white text-xs font-bold py-1 px-3 rounded hover:bg-blue-600'>
											Ubah
										</button>
										<button className='bg-red-500 text-white text-xs font-bold py-1 px-3 rounded hover:bg-red-600'>
											Hapus
										</button>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={pakarList.length + 3} className='text-center p-4'>
									Data tidak ditemukan.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			{/* Kontrol Paginasi */}
			<div className='flex justify-between items-center mt-4'>
				<button
					onClick={() => handlePageChange(currentPage - 1)}
					disabled={currentPage === 1}
					className='px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50'>
					Sebelumnya
				</button>
				<span className='text-sm text-gray-700'>
					Halaman <span className='font-semibold'>{currentPage}</span> dari{" "}
					<span className='font-semibold'>{totalPages > 0 ? totalPages : 1}</span>
				</span>
				<button
					onClick={() => handlePageChange(currentPage + 1)}
					disabled={currentPage === totalPages || totalPages === 0}
					className='px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50'>
					Berikutnya
				</button>
			</div>
		</div>
	);
}
