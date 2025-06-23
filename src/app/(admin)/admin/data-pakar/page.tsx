"use client";

import { useState, useEffect, useMemo } from "react";
import { getAllPakar, createPakar, updatePakar } from "@/lib/api";
import type { Pakar, PakarPayload } from "@/types";
import LoadingScreen from "@/app/components/features/LoadingScreen";
import AdminFormModal from "@/app/components/admin/AdminFormModal";
import FormInput from "@/app/components/admin/FormInput";

const ITEMS_PER_PAGE = 10;

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
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [selectedPakar, setSelectedPakar] = useState<Pakar | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState("");
	const debouncedSearchQuery = useDebounce(searchQuery, 500);

	const fetchData = async () => {
		setIsLoading(true);
		try {
			const data = await getAllPakar(1, 1000);
			setAllPakar(data.items);
		} catch (error) {
			console.error("Gagal mengambil data pakar:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const filteredPakar = useMemo(() => {
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

	const handleOpenModal = (pakar: Pakar | null = null) => {
		setSelectedPakar(pakar);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedPakar(null);
	};

	const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);
		const formData = new FormData(e.currentTarget);
		const payload: PakarPayload = {
			id: formData.get("id") as string,
			nama: formData.get("nama") as string,
		};

		try {
			if (selectedPakar) {
				await updatePakar(selectedPakar.id, { nama: payload.nama });
			} else {
				await createPakar(payload);
			}
			await fetchData();
			handleCloseModal();
		} catch (error) {
			console.error(error);
			alert("Gagal menyimpan data pakar.");
		} finally {
			setIsSubmitting(false);
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
					<button
						onClick={() => handleOpenModal()}
						className='bg-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-600'>
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
						{paginatedPakar.map((pakar, index) => (
							<tr key={pakar.id} className='bg-white border-b hover:bg-gray-50'>
								<td className='px-6 py-4'>
									{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
								</td>
								<td className='px-6 py-4 font-medium'>{pakar.id}</td>
								<td className='px-6 py-4'>{pakar.nama}</td>
								<td className='px-6 py-4'>
									<button
										onClick={() => handleOpenModal(pakar)}
										className='bg-blue-500 text-white text-xs font-bold py-1 px-3 rounded hover:bg-blue-600'>
										Ubah
									</button>
								</td>
							</tr>
						))}
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
			<AdminFormModal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				title={selectedPakar ? "Ubah Data Pakar" : "Tambah Data Pakar"}>
				<form onSubmit={handleFormSubmit}>
					<FormInput
						label='ID Pakar'
						name='id'
						defaultValue={selectedPakar?.id}
						disabled={!!selectedPakar}
						required
					/>
					<FormInput
						label='Nama Pakar'
						name='nama'
						defaultValue={selectedPakar?.nama}
						required
					/>
					<div className='flex justify-end gap-2 mt-6'>
						<button
							type='button'
							onClick={handleCloseModal}
							className='px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300'>
							Batal
						</button>
						<button
							type='submit'
							disabled={isSubmitting}
							className='px-4 py-2 text-white bg-teal-500 rounded-lg hover:bg-teal-600 disabled:bg-teal-300'>
							{isSubmitting ? "Menyimpan..." : "Simpan"}
						</button>
					</div>
				</form>
			</AdminFormModal>
		</div>
	);
}
