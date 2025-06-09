"use client";

import { useState } from "react";
import Sidebar from "@/app/components/dashboard/Sidebar";
import Header from "@/app/components/dashboard/Header";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// State untuk mengontrol visibilitas sidebar
	const [isSidebarOpen, setSidebarOpen] = useState(false);

	const toggleSidebar = () => {
		setSidebarOpen(!isSidebarOpen);
	};

	// Fungsi untuk menutup sidebar secara eksplisit
	const closeSidebar = () => {
		setSidebarOpen(false);
	};

	return (
		<div className='relative flex h-screen bg-gray-50'>
			<Sidebar isOpen={isSidebarOpen} />

			{/* Overlay untuk menutup sidebar di tampilan mobile */}
			{isSidebarOpen && (
				<div
					onClick={closeSidebar}
					className='fixed inset-0 z-30 bg-black/50 md:hidden'
					aria-label='Tutup sidebar'></div>
			)}

			{/* Wrapper untuk konten utama */}
			<div className='flex-1 flex flex-col overflow-hidden'>
				{/* Mengirim state `isSidebarOpen` ke Header */}
				<Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

				{/* Konten utama juga akan bergeser saat sidebar terbuka di layar desktop */}
				<main
					className={`flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 transition-all duration-300 ease-in-out ${
						isSidebarOpen ? "md:ml-64" : "ml-0"
					}`}>
					<div className='container mx-auto px-6 py-8'>{children}</div>
				</main>
			</div>
		</div>
	);
}
