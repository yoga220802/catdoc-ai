"use client";

interface InfoModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
	color?: "info" | "suggestion";
}

export default function InfoModal({
	isOpen,
	onClose,
	title,
	children,
	color = "info",
}: InfoModalProps) {
	if (!isOpen) return null;

	const headerColor =
		color === "info" ? "bg-white text-gray-800" : "bg-[#EF8A8A] text-white";
	const titleId = "info-modal-title";

	return (
		<div
			onClick={onClose}
			className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
			<div
				onClick={(e) => e.stopPropagation()}
				className='relative bg-white rounded-lg shadow-xl m-4 max-w-2xl w-full transform transition-all animate-fade-in-scale'
				role='dialog'
				aria-modal='true'
				aria-labelledby={titleId}>
				<div
					className={`flex justify-between items-center p-4 rounded-t-lg ${headerColor}`}>
					<h3 id={titleId} className='text-xl font-bold'>
						{title}
					</h3>
					<button onClick={onClose} className='hover:opacity-75' aria-label='Tutup'>
						<svg
							className='w-6 h-6'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2'
								d='M6 18L18 6M6 6l12 12'></path>
						</svg>
					</button>
				</div>

				<div className='p-6 text-gray-700 whitespace-pre-wrap'>{children}</div>
			</div>
			<style jsx>{`
				@keyframes fade-in-scale {
					from {
						transform: scale(0.95);
						opacity: 0;
					}
					to {
						transform: scale(1);
						opacity: 1;
					}
				}
				.animate-fade-in-scale {
					animation: fade-in-scale 0.3s ease-out forwards;
				}
			`}</style>
		</div>
	);
}
