"use client";

import { useState, useEffect, useMemo } from "react";
import { getAllPakar } from "@/lib/api";
import type { Pakar } from "@/types";
import LoadingScreen from "@/app/components/features/LoadingScreen";

const ITEMS_PER_PAGE = 10;

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

export default function DataPakarPage() {
	const [allPakar, setAllPakar] = useState<Pakar[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState("");
	const debouncedSearchQuery = useDebounce(searchQuery, 500);

	useEffect(() => {
		async function fetchData() {
			setIsLoading(true);
			const data = await getAllPakar(1, 1000); // Ambil semua data
			setAllPakar(data.items);
			setIsLoading(false);
		}
		fetchData();
	}, []);

	const filteredPakar = useMemo(() => {
		if (!debouncedSearchQuery) {
			return allPakar;
		}
		return allPakar.filter((p) =>
			p.nama.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
		);
	}, [allPakar, debouncedSearchQuery]);

	const paginatedPakar = useMemo(() => {
		const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
		return filteredPakar.slice(startIndex, startIndex + ITEMS_PER_PAGE);
	}, [filteredPakar, currentPage]);

	const totalPages = Math.ceil(filteredPakar.length / ITEMS_PER_PAGE);

	useEffect(() => {
		setCurrentPage(1);
	}, [debouncedSearchQuery]);

	const handlePageChange = (newPage: number) => {
		if (newPage > 0 && newPage <= totalPages) {
			setCurrentPage(newPage);
		}
	};

	if (isLoading) {
		return <LoadingScreen inline message='Memuat data pakar...' />;
	}

	return (
		<div>
			<div className='flex flex-col md:flex-row justify-between items-center mb-6 gap-4'>
				<h1 className='text-2xl font-bold text-[#004d40]'>Data Pakar</h1>
				<div className='flex gap-4 w-full md:w-auto'>
					<input
						type='text'
						placeholder='Cari nama pakar...'
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
							<th className='px-6 py-3'>No</th>
							<th className='px-6 py-3'>ID Pakar</th>
							<th className='px-6 py-3'>Nama Pakar</th>
							<th className='px-6 py-3'>Pilihan</th>
						</tr>
					</thead>
					<tbody>
						{paginatedPakar.length > 0 ? (
							paginatedPakar.map((pakar, index) => (
								<tr key={pakar.id} className='bg-white border-b hover:bg-gray-50'>
									<td className='px-6 py-4'>
										{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
									</td>
									<td className='px-6 py-4 font-medium text-gray-900'>{pakar.id}</td>
									<td className='px-6 py-4'>{pakar.nama}</td>
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
								<td colSpan={4} className='text-center p-4'>
									Data tidak ditemukan.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
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
