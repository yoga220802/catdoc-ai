"use client";

import { useState, useEffect, useMemo } from "react";
import {
	getAllPenyakit,
	createPenyakit,
	updatePenyakit,
	deletePenyakit,
} from "@/lib/api";
import type { Penyakit, PenyakitPayload } from "@/types";
import LoadingScreen from "@/app/components/features/LoadingScreen";
import AdminFormModal from "@/app/components/admin/AdminFormModal";
import ConfirmDeleteModal from "@/app/components/admin/ConfirmDeleteModal";
import FormInput from "@/app/components/admin/FormInput";
import FormTextarea from "@/app/components/admin/FormTextarea";

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

export default function DataPenyakitPage() {
	const [allPenyakit, setAllPenyakit] = useState<Penyakit[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [selectedPenyakit, setSelectedPenyakit] = useState<Penyakit | null>(
		null
	);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState("");
	const debouncedSearchQuery = useDebounce(searchQuery, 500);

	const fetchData = async () => {
		setIsLoading(true);
		const data = await getAllPenyakit(1, 1000);
		setAllPenyakit(data.items);
		setIsLoading(false);
	};

	useEffect(() => {
		fetchData();
	}, []);

	const filteredPenyakit = useMemo(
		() =>
			allPenyakit.filter((p) =>
				p.nama.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
			),
		[allPenyakit, debouncedSearchQuery]
	);
	const paginatedPenyakit = useMemo(() => {
		const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
		return filteredPenyakit.slice(startIndex, startIndex + ITEMS_PER_PAGE);
	}, [filteredPenyakit, currentPage]);
	const totalPages = Math.ceil(filteredPenyakit.length / ITEMS_PER_PAGE);

	useEffect(() => {
		setCurrentPage(1);
	}, [debouncedSearchQuery]);

	const handlePageChange = (newPage: number) => {
		if (newPage > 0 && newPage <= totalPages) setCurrentPage(newPage);
	};
	const handleOpenModal = (penyakit: Penyakit | null = null) => {
		setSelectedPenyakit(penyakit);
		setIsModalOpen(true);
	};
	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedPenyakit(null);
	};
	const handleOpenDeleteModal = (penyakit: Penyakit) => {
		setSelectedPenyakit(penyakit);
		setIsDeleteModalOpen(true);
	};
	const handleCloseDeleteModal = () => {
		setIsDeleteModalOpen(false);
		setSelectedPenyakit(null);
	};

	const handleConfirmDelete = async () => {
		if (!selectedPenyakit) return;
		setIsSubmitting(true);
		try {
			await deletePenyakit(selectedPenyakit.id);
			await fetchData();
			handleCloseDeleteModal();
		} catch (error) {
			console.error(error);
			alert("Gagal menghapus data.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);
		const formData = new FormData(e.currentTarget);
		const payload: PenyakitPayload = {
			id: formData.get("id") as string,
			nama: formData.get("nama") as string,
			deskripsi: formData.get("deskripsi") as string,
			solusi: formData.get("solusi") as string,
			pencegahan: formData.get("pencegahan") as string,
		};
		try {
			if (selectedPenyakit) {
				await updatePenyakit(selectedPenyakit.id, payload);
			} else {
				await createPenyakit(payload);
			}
			await fetchData();
			handleCloseModal();
		} catch (error) {
			console.error(error);
			alert("Gagal menyimpan data.");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isLoading)
		return <LoadingScreen inline message='Memuat data penyakit...' />;

	return (
		<div>
			<div className='flex flex-col md:flex-row justify-between items-center mb-6 gap-4'>
				<h1 className='text-2xl font-bold text-[#004d40]'>Data Penyakit</h1>
				<div className='flex gap-4 w-full md:w-auto'>
					<input
						type='text'
						placeholder='Cari penyakit...'
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
							<th className='px-6 py-3'>Kode</th>
							<th className='px-6 py-3'>Penyakit</th>
							<th className='px-6 py-3'>Deskripsi</th>
							<th className='px-6 py-3'>Pilihan</th>
						</tr>
					</thead>
					<tbody>
						{paginatedPenyakit.map((penyakit, index) => (
							<tr key={penyakit.id} className='bg-white border-b hover:bg-gray-50'>
								<td className='px-6 py-4'>
									{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
								</td>
								<td className='px-6 py-4 font-medium'>{penyakit.id}</td>
								<td className='px-6 py-4'>{penyakit.nama}</td>
								<td className='px-6 py-4 truncate max-w-xs'>{penyakit.deskripsi}</td>
								<td className='px-6 py-4 flex gap-2'>
									<button
										onClick={() => handleOpenModal(penyakit)}
										className='bg-blue-500 text-white text-xs font-bold py-1 px-3 rounded hover:bg-blue-600'>
										Ubah
									</button>
									<button
										onClick={() => handleOpenDeleteModal(penyakit)}
										className='bg-red-500 text-white text-xs font-bold py-1 px-3 rounded hover:bg-red-600'>
										Hapus
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
					className='px-4 py-2 text-sm rounded-md disabled:opacity-50'>
					Sebelumnya
				</button>
				<span className='text-sm'>
					Halaman {currentPage} dari {totalPages > 0 ? totalPages : 1}
				</span>
				<button
					onClick={() => handlePageChange(currentPage + 1)}
					disabled={currentPage === totalPages || totalPages === 0}
					className='px-4 py-2 text-sm rounded-md disabled:opacity-50'>
					Berikutnya
				</button>
			</div>
			<AdminFormModal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				title={selectedPenyakit ? "Ubah Data Penyakit" : "Tambah Data Penyakit"}>
				<form onSubmit={handleFormSubmit}>
					<FormInput
						label='Kode Penyakit'
						name='id'
						defaultValue={selectedPenyakit?.id}
						disabled={!!selectedPenyakit}
						required
					/>
					<FormInput
						label='Nama Penyakit'
						name='nama'
						defaultValue={selectedPenyakit?.nama}
						required
					/>
					<FormTextarea
						label='Deskripsi'
						name='deskripsi'
						defaultValue={selectedPenyakit?.deskripsi}
						required
					/>
					<FormTextarea
						label='Saran / Solusi'
						name='solusi'
						defaultValue={selectedPenyakit?.solusi}
						required
					/>
					<FormTextarea
						label='Pencegahan'
						name='pencegahan'
						defaultValue={selectedPenyakit?.pencegahan}
						required
					/>
					<div className='flex justify-end gap-2 mt-6'>
						<button
							type='button'
							onClick={handleCloseModal}
							className='px-4 py-2 rounded-lg'>
							Batal
						</button>
						<button
							type='submit'
							disabled={isSubmitting}
							className='px-4 py-2 text-white bg-teal-500 rounded-lg disabled:bg-teal-300'>
							Simpan
						</button>
					</div>
				</form>
			</AdminFormModal>
			<ConfirmDeleteModal
				isOpen={isDeleteModalOpen}
				onClose={handleCloseDeleteModal}
				onConfirm={handleConfirmDelete}
				isDeleting={isSubmitting}
				itemName={selectedPenyakit?.nama || ""}
			/>
		</div>
	);
}
