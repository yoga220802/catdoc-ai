"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingScreen from "./components/features/LoadingScreen";

export default function RootPage() {
	const router = useRouter();

	useEffect(() => {
		// Komponen ini bertanggung jawab atas pengalihan awal setelah penundaan.
		// Komponen LoadingScreen murni untuk visual.
		const timer = setTimeout(() => {
			router.push("/landing");
		}, 3000); // Arahkan setelah 3 detik

		// Membersihkan timer jika komponen dilepas sebelum timer selesai
		return () => clearTimeout(timer);
	}, [router]);

	// Render layar loading visual sambil menunggu timer.
	return <LoadingScreen />;
}
