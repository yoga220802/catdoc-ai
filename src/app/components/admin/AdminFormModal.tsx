"use client";

interface AdminFormModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
}

export default function AdminFormModal({
	isOpen,
	onClose,
	title,
	children,
}: AdminFormModalProps) {
	if (!isOpen) return null;

	return (
		<div
			onClick={onClose}
			className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
			<div
				onClick={(e) => e.stopPropagation()}
				className='relative bg-gray-50 rounded-lg shadow-xl m-4 max-w-2xl w-full'
				role='dialog'
				aria-modal='true'>
				<div className='p-6'>
					<h2 className='text-xl font-bold text-[#004d40] mb-6'>{title}</h2>
					{children}
				</div>
			</div>
		</div>
	);
}
