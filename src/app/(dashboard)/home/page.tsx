import StatCard from "@/app/components/dashboard/StatCard";
import Image from "next/image";
import { getDashboardStats } from "@/lib/api";

export const dynamic = "force-dynamic";

const infoCards = [
	{
		icon: "/images/dashboard/responsive.png",
		title: "Aplikasi Responsif",
		description:
			"Aplikasi kami dirancang responsif agar nyaman diakses melalui komputer, tablet, maupun smartphone Anda. Dapatkan informasi penting di genggaman, kapan pun Anda butuhkan.",
	},
	{
		icon: "/images/dashboard/health.png",
		title: "Kesehatan Kucing Terjaga",
		description:
			"Sistem pakar ini terus diperbarui dan disesuaikan oleh para ahli untuk meningkatkan akurasi diagnosa. Bantu Anda mengenali gejala lebih dini dan mengambil langkah yang tepat untuk anabul tercinta.",
	},
	{
		icon: "/images/dashboard/pakar.png",
		title: "Admin Pakar",
		description:
			"Dilengkapi fitur khusus bagi admin pakar untuk mengatur basis pengetahuan mulai dari gejala, penyakit, hingga nilai kepastian (CF). Tampilan intuitif memudahkan pakar menjaga sistem tetap relevan dan akurat.",
	},
];

export default async function HomePage() {
	const { gejalaCount, penyakitCount, pakarCount } =
		await getDashboardStats();

	return (
		<div>
			{/* Bagian Kartu Statistik */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
				<StatCard
					value={gejalaCount}
					label='Gejala'
					imageUrl='/images/dashboard/stats-gejala.png'
					color='#A1E6D0'
					href="/diagnose"
				/>
				<StatCard
					value={penyakitCount}
					label='Penyakit'
					imageUrl='/images/dashboard/stats-penyakit.png'
					color='#6CCDAF'
					href="/info"
				/>
				<StatCard
					value={pakarCount}
					label='Pengetahuan'
					imageUrl='/images/dashboard/stats-pengetahuan.png'
					color='#4BB79A'
				/>
			</div>

			{/* Bagian Selamat Datang - Tampilan Diperbarui */}
			<div className='bg-white rounded-lg shadow-md p-6 flex items-center justify-between gap-8 mb-8'>
				{/* Kolom Teks */}
				<div className='flex-1'>
					<h2 className='text-5xl md:text-7xl font-bold text-[#4fb8af] font-secondary leading-none'>
						SELAMAT <br /> DATANG
					</h2>
					<div className='flex items-center gap-4 mt-2'>
						<p className='text-3xl md:text-5xl font-bold text-[#4fb8af] font-secondary'>
							DI
						</p>
						<div className='text-gray-600'>
							<p className='font-semibold text-[#35a89f]'>SISTEM PAKAR</p>
							<p className='text-[#35a89f]'>DIAGNOSA PENYAKIT KUCING</p>
						</div>
					</div>
				</div>
				{/* Kolom Gambar */}
				<div className='hidden md:block flex-shrink-0'>
					<Image
						src='/images/dashboard/welcome-cat.png'
						alt='Ilustrasi kucing lucu sedang meregangkan badan'
						width={300}
						height={200}
						className='object-contain'
					/>
				</div>
			</div>

			{/* Bagian Informasi Tambahan */}
			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				{infoCards.map((card, index) => (
					<div key={index} className='bg-white rounded-lg shadow-md p-6 text-center'>
						<Image
							src={card.icon}
							alt={card.title}
							width={64}
							height={64}
							className='mx-auto mb-4'
						/>
						<h3 className='text-xl font-bold text-[#00695c] font-secondary mb-2'>
							{card.title}
						</h3>
						<p className='text-gray-600 text-sm'>{card.description}</p>
					</div>
				))}
			</div>
		</div>
	);
}
