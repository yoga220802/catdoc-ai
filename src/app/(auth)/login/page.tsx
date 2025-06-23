"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import RandomPawsBackground from "@/app/components/features/RandomPawsBackground";
import Header from "@/app/components/features/Header";

export default function LoginPage() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const router = useRouter();
	const { login } = useAuth();

	const handleLogin = (e: React.FormEvent) => {
		e.preventDefault();
		// Logika login dummy
		if (username === "admin" && password === "admin") {
			setError("");
			login("drh. Budi Santoso"); // Nama pakar dummy
			router.push("/admin/dashboard"); // Arahkan ke dashboard admin
		} else {
			setError("Username atau password salah!");
		}
	};

	return (
		<div className='relative min-h-screen bg-[#A1E6D0] overflow-hidden'>
			<RandomPawsBackground />
			<div className='relative z-10'>
				<Header />
				<main className='flex items-center justify-center pt-20'>
					<div className='bg-white p-8 rounded-2xl shadow-xl w-full max-w-md'>
						<h2 className='text-2xl font-bold text-center text-[#004d40]'>LOGIN</h2>
						<p className='text-center text-gray-500 mb-6'>PAKAR ADMIN</p>
						<form onSubmit={handleLogin}>
							<div className='mb-4'>
								<label
									className='block text-gray-700 text-sm font-bold mb-2'
									htmlFor='username'>
									Username
								</label>
								<input
									type='text'
									id='username'
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									className='shadow-inner appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100'
									placeholder='Masukkan username'
								/>
							</div>
							<div className='mb-6'>
								<label
									className='block text-gray-700 text-sm font-bold mb-2'
									htmlFor='password'>
									Password
								</label>
								<input
									type='password'
									id='password'
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className='shadow-inner appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-100'
									placeholder='*********'
								/>
							</div>
							{error && <p className='text-red-500 text-xs italic mb-4'>{error}</p>}
							<div className='flex items-center justify-center'>
								<button
									type='submit'
									className='bg-[#00796b] hover:bg-[#004d40] text-white font-bold py-3 px-8 rounded-full shadow-md transition-colors'>
									Login
								</button>
							</div>
						</form>
					</div>
				</main>
			</div>
		</div>
	);
}
