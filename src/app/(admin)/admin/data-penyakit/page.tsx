"use client";
// Halaman ini akan menampilkan tabel data penyakit.
// Fungsionalitas CRUD akan ditambahkan nanti.

export default function DataPenyakitPage() {
	return (
		<div>
			<div className='flex justify-between items-center mb-6'>
				<h1 className='text-2xl font-bold text-[#004d40]'>Data Penyakit</h1>
				<button className='bg-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-600 transition-colors'>
					Tambah +
				</button>
			</div>
			<div className='bg-white shadow-md rounded-lg overflow-x-auto'>
				<table className='w-full text-sm text-left text-gray-500'>
					<thead className='text-xs text-gray-700 uppercase bg-gray-50'>
						<tr>
							<th className='px-6 py-3'>No</th>
							<th className='px-6 py-3'>Kode Penyakit</th>
							<th className='px-6 py-3'>Penyakit</th>
							<th className='px-6 py-3'>Informasi</th>
							<th className='px-6 py-3'>Saran</th>
							<th className='px-6 py-3'>Pilihan</th>
						</tr>
					</thead>
					<tbody>
						{/* Contoh baris data, nanti akan diganti dengan data dari API */}
						<tr className='bg-white border-b'>
							<td className='px-6 py-4'>1</td>
							<td className='px-6 py-4 font-medium text-gray-900'>P001</td>
							<td className='px-6 py-4'>Scabies (Kudis)</td>
							<td className='px-6 py-4'>Infeksi tungau Sarcoptes scabiei...</td>
							<td className='px-6 py-4'>Lakukan konsultasi dengan dokter...</td>
							<td className='px-6 py-4 flex gap-2'>
								<button className='bg-blue-500 text-white text-xs font-bold py-1 px-3 rounded hover:bg-blue-600'>
									Ubah
								</button>
								<button className='bg-red-500 text-white text-xs font-bold py-1 px-3 rounded hover:bg-red-600'>
									Hapus
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
}
