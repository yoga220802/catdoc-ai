"use client";

interface ConfirmDeleteModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	isDeleting: boolean;
	itemName: string;
}

export default function ConfirmDeleteModal({
	isOpen,
	onClose,
	onConfirm,
	isDeleting,
	itemName,
}: ConfirmDeleteModalProps) {
	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
			<div
				className='bg-white p-6 rounded-lg shadow-xl w-full max-w-sm text-center'
				role='alertdialog'
				aria-modal='true'>
				<div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100'>
					<svg
						className='h-6 w-6 text-red-600'
						fill='none'
						viewBox='0 0 24 24'
						strokeWidth='1.5'
						stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z'
						/>
					</svg>
				</div>
				<h3 className='mt-4 text-lg font-semibold text-gray-900'>HAPUS</h3>
				<p className='mt-2 text-sm text-gray-500'>
					Hapus data penyakit: <span className='font-medium'>{itemName}</span>?
				</p>
				<div className='mt-6 flex justify-center gap-4'>
					<button
						onClick={onClose}
						disabled={isDeleting}
						className='px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50'>
						Batal
					</button>
					<button
						onClick={onConfirm}
						disabled={isDeleting}
						className='px-6 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-red-300'>
						{isDeleting ? "Menghapus..." : "Ya, hapus"}
					</button>
				</div>
			</div>
		</div>
	);
}
