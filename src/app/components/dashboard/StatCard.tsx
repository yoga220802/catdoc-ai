import Image from "next/image";

interface StatCardProps {
	value: number | string;
	label: string;
	imageUrl: string;
	color: String;
}

export default function StatCard({ value, label, imageUrl, color }: StatCardProps) {
	return (
		<div className={`relative bg-[${color}] text-white p-6 rounded-lg shadow-lg overflow-hidden`}>
			<div className='relative z-10'>
				<h3 className='text-5xl font-bold'>{value}</h3>
				<p className='mt-1 text-lg font-semibold'>{label}</p>
			</div>
			<Image
				src={imageUrl}
				alt={`Ilustrasi untuk ${label}`}
				width={100}
				height={100}
				className='absolute -right-4 -bottom-4 opacity-30 z-0'
			/>
		</div>
	);
}
