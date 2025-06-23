"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import AdminSidebar from "@/app/components/admin/AdminSidebar";
import AdminHeader from "@/app/components/admin/AdminHeader";

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [isSidebarOpen, setSidebarOpen] = useState(false);
	const { pakarName } = useAuth();
	const router = useRouter();

	// Proteksi rute: jika belum login, tendang ke halaman login
	useEffect(() => {
		if (pakarName === null) {
			router.push("/login");
		}
	}, [pakarName, router]);

	const toggleSidebar = () => {
		setSidebarOpen(!isSidebarOpen);
	};

	// Jangan render apapun jika sedang proses redirect
	if (pakarName === null) {
		return null;
	}

	return (
		<div className='relative flex h-screen bg-gray-50'>
			<AdminSidebar isOpen={isSidebarOpen} />
			{isSidebarOpen && (
				<div
					onClick={() => setSidebarOpen(false)}
					className='fixed inset-0 z-30 bg-black/50 md:hidden'
					aria-label='Tutup sidebar'></div>
			)}
			<div className={`flex-1 flex flex-col overflow-hidden`}>
				{/* PERBAIKAN: Mengirim prop isSidebarOpen ke AdminHeader */}
				<AdminHeader toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
				<main className='flex-1 overflow-x-hidden overflow-y-auto bg-gray-50'>
					<div className='container mx-auto px-6 py-8'>{children}</div>
				</main>
			</div>
		</div>
	);
}
