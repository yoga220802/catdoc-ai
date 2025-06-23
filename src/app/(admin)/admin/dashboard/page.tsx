import StatCard from "@/app/components/dashboard/StatCard";
import Image from "next/image";
import { getAdminDashboardStats } from "@/lib/api";

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

export default async function AdminDashboardPage() {
	// Mengambil data nyata dari API
	const { gejalaCount, penyakitCount, pengetahuanCount, pakarCount } =
		await getAdminDashboardStats();

	return (
		<div>
			{/* Bagian Kartu Statistik dengan data nyata dan tautan */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
				<StatCard
					value={gejalaCount}
					label='Gejala'
					imageUrl='/images/dashboard/stats-gejala.png'
					color='#A1E6D0'
					href='/admin/data-gejala'
				/>
				<StatCard
					value={penyakitCount}
					label='Penyakit'
					imageUrl='/images/dashboard/stats-penyakit.png'
					color='#6CCDAF'
					href='/admin/data-penyakit'
				/>
				<StatCard
					value={pengetahuanCount}
					label='Basis Pengetahuan'
					imageUrl='/images/dashboard/stats-pengetahuan.png'
					color='#4BB79A'
					href='/admin/basis-pengetahuan'
				/>
				<StatCard
					value={pakarCount}
					label='Admin Pakar'
					imageUrl='/images/dashboard/stats-pakar.png'
					color='#3A8A7A'
					href="/admin/data-pakar"
				/>
			</div>

			{/* Bagian Selamat Datang */}
			<div className='bg-white rounded-lg shadow-md p-6 flex items-center justify-between gap-8 mb-8'>
				<div className='flex-1'>
					<h2 className='text-5xl md:text-7xl font-bold text-[#4fb8af] font-secondary leading-none'>
						SELAMAT <br /> DATANG
					</h2>
					<div className='flex items-center gap-4 mt-2'>
						<p className='text-3xl md:text-5xl font-bold text-[#4fb8af] font-secondary'>
							DI
						</p>
						<div className='text-gray-600'>
							<p className='font-semibold'>SISTEM PAKAR</p>
							<p>DIAGNOSA PENYAKIT KUCING</p>
						</div>
					</div>
				</div>
				<div className='hidden md:block flex-shrink-0'>
					<Image
						src='/images/dashboard/welcome-cat.png'
						alt='Ilustrasi kucing'
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
