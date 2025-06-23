import type { Metadata } from "next";
import { Lexend, Manrope } from "next/font/google";
import "./styles/globals.css";
import { AuthProvider } from "./contexts/AuthContext";

const lexend = Lexend({
	subsets: ["latin"],
	variable: "--font-lexend",
	display: "swap",
});

const manrope = Manrope({
	subsets: ["latin"],
	variable: "--font-manrope",
	display: "swap",
});

export const metadata: Metadata = {
	title: "CatDoc AI",
	description: "Sistem Pakar untuk Diagnosa Penyakit Kucing",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='id'>
			<body className={`${lexend.variable} ${manrope.variable} antialiased`}>
				<AuthProvider>{children}</AuthProvider>
			</body>
		</html>
	);
}
