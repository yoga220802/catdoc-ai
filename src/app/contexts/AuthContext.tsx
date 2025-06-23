"use client";

import { createContext, useState, ReactNode, useContext } from "react";

// Definisikan tipe untuk konteks
interface AuthContextType {
	pakarName: string | null;
	login: (name: string) => void;
	logout: () => void;
}

// Buat konteks dengan nilai default
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Buat provider yang akan membungkus aplikasi kita
export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [pakarName, setPakarName] = useState<string | null>(null);

	const login = (name: string) => {
		setPakarName(name);
		// Di aplikasi nyata, Anda akan menyimpan token di sini
	};

	const logout = () => {
		setPakarName(null);
		// Di aplikasi nyata, Anda akan menghapus token di sini
	};

	return (
		<AuthContext.Provider value={{ pakarName, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

// Buat custom hook untuk kemudahan penggunaan
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
