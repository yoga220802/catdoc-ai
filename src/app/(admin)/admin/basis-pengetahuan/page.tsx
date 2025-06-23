"use client";

import { useState, useEffect, useMemo } from "react";
import {
	getAllRules,
	getAllPakar,
	getAllPenyakit,
	getAllGejala,
	createRule,
	deleteRule,
	updateRuleCF,
} from "@/lib/api";
import type {
	Rule,
	Pakar,
	Penyakit,
	Gejala,
	RuleCreatePayload,
	RuleCFPayload,
} from "@/types";
import LoadingScreen from "@/app/components/features/LoadingScreen";
import AdminFormModal from "@/app/components/admin/AdminFormModal";
import ConfirmDeleteModal from "@/app/components/admin/ConfirmDeleteModal";
import FormInput from "@/app/components/admin/FormInput";

const ITEMS_PER_PAGE = 20;

type ProcessedRule = Rule & {
	rowSpan: number;
};

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
	const [rules, setRules] = useState<Rule[]>([]);
	const [pakarList, setPakarList] = useState<Pakar[]>([]);
	const [penyakitList, setPenyakitList] = useState<Penyakit[]>([]);
	const [gejalaList, setGejalaList] = useState<Gejala[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const [searchQuery, setSearchQuery] = useState("");
	const [modalState, setModalState] = useState<
		"add" | "editCF" | "delete" | null
	>(null);
	const [selectedRule, setSelectedRule] = useState<Rule | null>(null);
	const debouncedSearchQuery = useDebounce(searchQuery, 500);

	const fetchData = async () => {
		// isLoading diatur di dalam useEffect untuk mengelola state per-fetch
		// Tidak perlu setIsLoading(true) di sini
		try {
			const [penyakitRes, gejalaRes, pakarRes] = await Promise.all([
				getAllPenyakit(1, 1000),
				getAllGejala(1, 1000),
				getAllPakar(),
			]);
			setPenyakitList(penyakitRes.items);
			setGejalaList(gejalaRes.items);
			setPakarList(pakarRes.items);
		} catch (error) {
			console.error("Gagal mengambil data pendukung:", error);
		}
	};

	// useEffect untuk mengambil data awal (penyakit, gejala, pakar)
	useEffect(() => {
		fetchData();
	}, []);

	// useEffect untuk mengambil data rules berdasarkan halaman dan pencarian
	useEffect(() => {
		const fetchRules = async () => {
			setIsLoading(true);
			try {
				const rulesRes = await getAllRules(
					currentPage,
					ITEMS_PER_PAGE,
					debouncedSearchQuery
				);
				setRules(rulesRes.items);
				setTotalPages(rulesRes.total_page);
			} catch (error) {
				console.error("Gagal mengambil data aturan:", error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchRules();
	}, [currentPage, debouncedSearchQuery]);

	const processedRules = useMemo(() => {
		const rulesWithRowSpan: ProcessedRule[] = [];
		if (!rules) return [];
		for (let i = 0; i < rules.length; i++) {
			if (i > 0 && rules[i].penyakit.id === rules[i - 1].penyakit.id) {
				rulesWithRowSpan.push({ ...rules[i], rowSpan: 0 });
			} else {
				let rowSpan = 1;
				for (let j = i + 1; j < rules.length; j++) {
					if (rules[j].penyakit.id === rules[i].penyakit.id) rowSpan++;
					else break;
				}
				rulesWithRowSpan.push({ ...rules[i], rowSpan });
			}
		}
		return rulesWithRowSpan;
	}, [rules]);

	useEffect(() => {
		setCurrentPage(1);
	}, [debouncedSearchQuery]);

	const handlePageChange = (newPage: number) => {
		if (newPage > 0 && newPage <= totalPages) setCurrentPage(newPage);
	};
	const handleCloseModal = () => {
		setModalState(null);
		setSelectedRule(null);
	};

	const handleOpenModal = (
		type: "add" | "editCF" | "delete",
		rule: Rule | null = null
	) => {
		setModalState(type);
		setSelectedRule(rule);
	};

	const handleAddRuleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);
		const formData = new FormData(e.currentTarget);
		const payload: RuleCreatePayload = {
			id: formData.get("id") as string,
			id_penyakit: formData.get("id_penyakit") as string,
			id_gejala: formData.get("id_gejala") as string,
		};
		try {
			await createRule(payload);
			await fetchData(); // Refresh semua data
			handleCloseModal();
		} catch (error) {
			console.error(error);
			alert("Gagal membuat aturan.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleEditCfSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!selectedRule) return;
		setIsSubmitting(true);
		const formData = new FormData(e.currentTarget);

		try {
			for (const pakar of pakarList) {
				const nilai = parseFloat(formData.get(`cf-${pakar.id}`) as string);
				if (!isNaN(nilai)) {
					await updateRuleCF(selectedRule.id, { id_pakar: pakar.id, nilai: nilai });
				}
			}
			// Cukup fetch ulang rules, tidak perlu semua data
			const rulesRes = await getAllRules(
				currentPage,
				ITEMS_PER_PAGE,
				debouncedSearchQuery
			);
			setRules(rulesRes.items);
			handleCloseModal();
		} catch (error) {
			console.error(error);
			alert("Gagal memperbarui nilai CF.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleConfirmDelete = async () => {
		if (!selectedRule) return;
		setIsSubmitting(true);
		try {
			await deleteRule(selectedRule.id);
			await fetchData(); // Refresh semua data
			handleCloseModal();
		} catch (error) {
			console.error(error);
			alert("Gagal menghapus aturan.");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isLoading && rules.length === 0) {
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
					<button
						onClick={() => handleOpenModal("add")}
						className='bg-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-600'>
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
						{isLoading ? (
							<tr>
								<td colSpan={pakarList.length + 3} className='text-center p-4'>
									Memuat...
								</td>
							</tr>
						) : processedRules.length > 0 ? (
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
										<button
											onClick={() => handleOpenModal("editCF", rule)}
											className='bg-blue-500 text-white text-xs font-bold py-1 px-3 rounded hover:bg-blue-600'>
											Ubah
										</button>
										<button
											onClick={() => handleOpenModal("delete", rule)}
											className='bg-red-500 text-white text-xs font-bold py-1 px-3 rounded hover:bg-red-600'>
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
			<div className='flex justify-between items-center mt-4'>
				<button
					onClick={() => handlePageChange(currentPage - 1)}
					disabled={currentPage === 1 || isLoading}
					className='px-4 py-2 text-sm rounded-md disabled:opacity-50'>
					Sebelumnya
				</button>
				<span className='text-sm'>
					Halaman {currentPage} dari {totalPages > 0 ? totalPages : 1}
				</span>
				<button
					onClick={() => handlePageChange(currentPage + 1)}
					disabled={currentPage === totalPages || isLoading}
					className='px-4 py-2 text-sm rounded-md disabled:opacity-50'>
					Berikutnya
				</button>
			</div>

			<AdminFormModal
				isOpen={modalState === "add"}
				onClose={handleCloseModal}
				title='Tambah Aturan Baru'>
				<form onSubmit={handleAddRuleSubmit}>
					<FormInput label='ID Aturan (misal: R123)' name='id' required />
					<div className='mb-4'>
						<label htmlFor='id_penyakit' className='block text-sm font-bold mb-2'>
							Penyakit
						</label>
						<select
							id='id_penyakit'
							name='id_penyakit'
							required
							className='w-full p-2 border rounded-lg bg-gray-100'>
							<option value=''>Pilih Penyakit</option>
							{penyakitList.map((p) => (
								<option key={p.id} value={p.id}>
									{p.nama}
								</option>
							))}
						</select>
					</div>
					<div className='mb-4'>
						<label htmlFor='id_gejala' className='block text-sm font-bold mb-2'>
							Gejala
						</label>
						<select
							id='id_gejala'
							name='id_gejala'
							required
							className='w-full p-2 border rounded-lg bg-gray-100'>
							<option value=''>Pilih Gejala</option>
							{gejalaList.map((g) => (
								<option key={g.id} value={g.id}>
									{g.nama}
								</option>
							))}
						</select>
					</div>
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

			<AdminFormModal
				isOpen={modalState === "editCF"}
				onClose={handleCloseModal}
				title={`Ubah Nilai CF untuk Aturan ${selectedRule?.id}`}>
				<form onSubmit={handleEditCfSubmit}>
					<div className='mb-2'>
						<span className='font-semibold'>Penyakit:</span>{" "}
						{selectedRule?.penyakit.nama}
					</div>
					<div className='mb-4'>
						<span className='font-semibold'>Gejala:</span> {selectedRule?.gejala.nama}
					</div>
					<hr className='my-4' />
					{pakarList.map((pakar) => {
						const currentCf = selectedRule?.rule_cfs.find(
							(rcf) => rcf.pakar.id === pakar.id
						)?.nilai;
						return (
							<FormInput
								key={pakar.id}
								label={`CF ${pakar.nama}`}
								name={`cf-${pakar.id}`}
								type='number'
								step='0.01'
								defaultValue={currentCf !== undefined ? currentCf : ""}
							/>
						);
					})}
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
							Simpan Perubahan
						</button>
					</div>
				</form>
			</AdminFormModal>

			<ConfirmDeleteModal
				isOpen={modalState === "delete"}
				onClose={handleCloseModal}
				onConfirm={handleConfirmDelete}
				isDeleting={isSubmitting}
				itemName={`aturan ${selectedRule?.id}`}
			/>
		</div>
	);
}
