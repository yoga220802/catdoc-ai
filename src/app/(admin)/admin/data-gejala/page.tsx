"use client";

import { useState, useEffect, useMemo } from "react";
import {
	getAllGejala,
	createGejala,
	updateGejala,
	deleteGejala,
} from "@/lib/api";
import type { Gejala, GejalaPayload } from "@/types";
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

export default function DataGejalaPage() {
	const [allGejala, setAllGejala] = useState<Gejala[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [selectedGejala, setSelectedGejala] = useState<Gejala | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState("");
	const debouncedSearchQuery = useDebounce(searchQuery, 500);

	const fetchData = async () => {
		setIsLoading(true);
		const data = await getAllGejala(1, 1000);
		const sortedGejala = data.items.sort(
			(a, b) => parseInt(a.id.slice(1)) - parseInt(b.id.slice(1))
		);
		setAllGejala(sortedGejala);
		setIsLoading(false);
	};

	useEffect(() => {
		fetchData();
	}, []);

	const filteredGejala = useMemo(
		() =>
			allGejala.filter((g) =>
				g.pertanyaan.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
			),
		[allGejala, debouncedSearchQuery]
	);
	const paginatedGejala = useMemo(() => {
		const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
		return filteredGejala.slice(startIndex, startIndex + ITEMS_PER_PAGE);
	}, [filteredGejala, currentPage]);
	const totalPages = Math.ceil(filteredGejala.length / ITEMS_PER_PAGE);

	useEffect(() => {
		setCurrentPage(1);
	}, [debouncedSearchQuery]);

	const handlePageChange = (newPage: number) => {
		if (newPage > 0 && newPage <= totalPages) setCurrentPage(newPage);
	};
	const handleOpenModal = (gejala: Gejala | null = null) => {
		setSelectedGejala(gejala);
		setIsModalOpen(true);
	};
	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedGejala(null);
	};
	const handleOpenDeleteModal = (gejala: Gejala) => {
		setSelectedGejala(gejala);
		setIsDeleteModalOpen(true);
	};
	const handleCloseDeleteModal = () => {
		setIsDeleteModalOpen(false);
		setSelectedGejala(null);
	};

	const handleConfirmDelete = async () => {
		if (!selectedGejala) return;
		setIsSubmitting(true);
		try {
			await deleteGejala(selectedGejala.id);
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
		const kelompoksStr = formData.get("kelompoks") as string;
		const payload: GejalaPayload = {
			id: formData.get("id") as string,
			nama: formData.get("nama") as string,
			deskripsi: formData.get("deskripsi") as string,
			pertanyaan: formData.get("pertanyaan") as string,
			kelompoks: kelompoksStr
				.split(",")
				.map((s) => parseInt(s.trim()))
				.filter((n) => !isNaN(n)),
		};

		try {
			if (selectedGejala) {
				await updateGejala(selectedGejala.id, payload);
			} else {
				await createGejala(payload);
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

	if (isLoading) return <LoadingScreen inline message='Memuat data gejala...' />;

	return (
		<div>
			<div className='flex flex-col md:flex-row justify-between items-center mb-6 gap-4'>
				<h1 className='text-2xl font-bold text-[#004d40]'>Data Gejala</h1>
				<div className='flex gap-4 w-full md:w-auto'>
					<input
						type='text'
						placeholder='Cari gejala...'
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
							<th className='px-6 py-3'>Pertanyaan</th>
							<th className='px-6 py-3'>Pilihan</th>
						</tr>
					</thead>
					<tbody>
						{paginatedGejala.map((gejala, index) => (
							<tr key={gejala.id} className='bg-white border-b hover:bg-gray-50'>
								<td className='px-6 py-4'>
									{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
								</td>
								<td className='px-6 py-4 font-medium'>{gejala.id}</td>
								<td className='px-6 py-4'>{gejala.pertanyaan}</td>
								<td className='px-6 py-4 flex gap-2'>
									<button
										onClick={() => handleOpenModal(gejala)}
										className='bg-blue-500 text-white text-xs font-bold py-1 px-3 rounded hover:bg-blue-600'>
										Ubah
									</button>
									<button
										onClick={() => handleOpenDeleteModal(gejala)}
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
					className='px-4 py-2 bg-teal-500 text-sm rounded-md disabled:opacity-50'>
					Sebelumnya
				</button>
				<span className='text-sm text-teal-500 '>
					Halaman {currentPage} dari {totalPages > 0 ? totalPages : 1}
				</span>
				<button
					onClick={() => handlePageChange(currentPage + 1)}
					disabled={currentPage === totalPages || totalPages === 0}
					className='px-4 py-2 bg-teal-500 text-sm rounded-md disabled:opacity-50'>
					Berikutnya
				</button>
			</div>
			<AdminFormModal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				title={selectedGejala ? "Ubah Data Gejala" : "Tambah Data Gejala"}>
				<form onSubmit={handleFormSubmit}>
					<FormInput
						label='Kode Gejala'
						name='id'
						defaultValue={selectedGejala?.id}
						disabled={!!selectedGejala}
						required
					/>
					<FormInput
						label='Nama Gejala'
						name='nama'
						defaultValue={selectedGejala?.nama}
						required
					/>
					<FormTextarea
						label='Deskripsi'
						name='deskripsi'
						defaultValue={selectedGejala?.deskripsi}
						required
					/>
					<FormTextarea
						label='Pertanyaan Diagnosa'
						name='pertanyaan'
						defaultValue={selectedGejala?.pertanyaan}
						required
					/>
					<FormInput
						label='ID Kelompok (pisahkan koma)'
						name='kelompoks'
						defaultValue={selectedGejala?.kelompoks.map((k) => k.id).join(", ")}
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
				itemName={selectedGejala?.nama || ""}
			/>
		</div>
	);
}
