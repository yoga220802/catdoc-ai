import Image from "next/image";
import Link from "next/link"; // Import Link for navigation

interface StatCardProps {
	value: number | string;
	label: string;
	imageUrl: string;
	color: string;
	href?: string;
}

export default function StatCard({
	value,
	label,
	imageUrl,
	color,
	href,
}: StatCardProps) {
	const cardContent = (
		<div
			style={{ backgroundColor: color }}
			className='relative text-white p-6 rounded-lg shadow-lg overflow-hidden'>
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

	return href ? (
		<Link href={href} className='block'>
			{cardContent}
		</Link>
	) : (
		cardContent
	);
}
