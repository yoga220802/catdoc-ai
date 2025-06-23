"use client";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/app/contexts/AuthContext";
import { MenuIcon, LogoutIcon } from "@/app/components/icons";

// PERBAIKAN: Menambahkan prop isSidebarOpen
interface AdminHeaderProps {
	toggleSidebar: () => void;
	isSidebarOpen: boolean;
}

export default function AdminHeader({
	toggleSidebar,
	isSidebarOpen,
}: AdminHeaderProps) {
	const { pakarName, logout } = useAuth();

	return (
		// PERBAIKAN: Header akan bergeser saat sidebar terbuka
		<header
			className={`sticky top-0 z-30 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 ease-in-out ${
				isSidebarOpen ? "md:ml-64" : ""
			}`}>
			<div className='container mx-auto px-6 py-3 flex justify-between items-center'>
				<div className='flex items-center gap-4'>
					{/* PERBAIKAN: Menambahkan aria-label untuk aksesibilitas */}
					<button
						onClick={toggleSidebar}
						className='text-[#004d40] hover:text-[#00796b]'
						aria-label='Toggle Menu'>
						<MenuIcon />
					</button>
					<Link href='/admin/dashboard' className='flex items-center gap-2'>
						<Image
							src='/images/logo.png'
							alt='CatDoc AI Logo'
							width={40}
							height={40}
						/>
						<span className='text-xl font-bold text-[#004d40]'>CatDoc AI</span>
					</Link>
				</div>
				<div className='flex items-center gap-4'>
					<span className='font-semibold text-gray-700 hidden md:block'>
						{pakarName || "Admin"}
					</span>
					<Link
						href='/landing'
						onClick={logout}
						className='flex items-center gap-2 px-4 py-2 text-red-600 rounded-lg hover:bg-red-50 transition-colors'>
						<LogoutIcon className='w-5 h-5' />
						<span className='font-semibold'>Keluar</span>
					</Link>
				</div>
			</div>
		</header>
	);
}
