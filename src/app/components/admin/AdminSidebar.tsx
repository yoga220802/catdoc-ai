"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, DiagnoseIcon, InfoIcon } from "@/app/components/icons"; // Bisa gunakan ikon yang sama

// Definisikan tipe untuk properti Sidebar
interface SidebarProps {
	isOpen: boolean;
}

// Data untuk item menu admin
const adminMenuItems = [
	{ href: "/admin/dashboard", label: "Beranda", icon: HomeIcon },
	{ href: "/admin/data-penyakit", label: "Data Penyakit", icon: DiagnoseIcon },
	{ href: "/admin/data-gejala", label: "Data Gejala", icon: DiagnoseIcon },
	{
		href: "/admin/basis-pengetahuan",
		label: "Basis Pengetahuan",
		icon: InfoIcon,
	},
];

export default function AdminSidebar({ isOpen }: SidebarProps) {
	const pathname = usePathname();

	return (
		<aside
			className={`bg-[#4fb8af] text-white fixed top-0 left-0 h-full z-40 w-64 transition-transform duration-300 ease-in-out ${
				isOpen ? "translate-x-0" : "-translate-x-full"
			}`}>
			<div className='flex flex-col h-full pt-20'>
				<h2 className='px-6 mb-4 text-sm font-semibold tracking-wider text-teal-100 uppercase'>
					Menu
				</h2>
				<nav className='flex-1'>
					<ul>
						{adminMenuItems.map((item) => {
							const isActive = pathname.startsWith(item.href);
							return (
								<li key={item.href} className='px-4'>
									<Link
										href={item.href}
										className={`flex items-center gap-4 px-4 py-3 my-1 rounded-lg transition-colors ${
											isActive ? "bg-white/20" : "hover:bg-white/10"
										}`}>
										<item.icon className='w-5 h-5' />
										<span className='font-medium'>{item.label}</span>
									</Link>
								</li>
							);
						})}
					</ul>
				</nav>
			</div>
		</aside>
	);
}
