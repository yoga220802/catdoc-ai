"use client";

import Link from "next/link";
import Image from "next/image";
import { MenuIcon, LogoutIcon } from "@/app/components/icons";

interface HeaderProps {
	toggleSidebar: () => void;
	isSidebarOpen: boolean; // Menerima prop baru
}

export default function Header({ toggleSidebar, isSidebarOpen }: HeaderProps) {
	return (
		// Header akan mendapatkan margin kiri saat sidebar terbuka di layar medium (desktop) ke atas
		<header
			className={`sticky top-0 z-30 bg-[#4BB79A] backdrop-blur-sm shadow-sm transition-all duration-300 ease-in-out ${
				isSidebarOpen ? "md:ml-64" : "ml-0"
			}`}>
			<div className='container mx-auto px-6 py-3 flex justify-between items-center'>
				<div className='flex items-center gap-4'>
					<button
						onClick={toggleSidebar}
						className='text-[#FFFF] hover:text-[#00796b]'
						aria-label='Toggle Menu'>
						<MenuIcon />
					</button>
					<Link href='/home' className='flex items-center gap-2'>
						<Image
							src='/images/logo.png'
							alt='CatDoc AI Logo'
							width={40}
							height={40}
						/>
						<span className='text-xl font-bold text-[#FFFF]'>CatDoc AI</span>
					</Link>
				</div>
				<div>
					<Link
						href='/landing'
						className='flex items-center gap-2 px-4 py-2 text-[#FFF]-600 rounded-lg hover:bg-red-50 transition-colors'>
						<LogoutIcon className='w-5 h-5' />
						<span className='font-semibold'>Keluar</span>
					</Link>
				</div>
			</div>
		</header>
	);
}
