import type { PaginatedResponse } from '@/types'; // Mengimpor tipe dari model yang baru dibuat
import { CATDOC_API_BASE_URL } from './constant';

/**
 * Fungsi untuk mengambil data dari endpoint tertentu dan mengembalikan properti 'count'.
 * Dibuat generik untuk bisa menerima berbagai tipe item dari PaginatedResponse.
 * @param endpoint - Path endpoint API yang akan di-fetch (misal: 'gejala').
 * @returns Jumlah item (count) atau 0 jika gagal.
 */
async function fetchCount<T>(endpoint: string): Promise<number> {
    try {
        // Menggunakan template literal dengan konstanta base URL
        const response = await fetch(`${CATDOC_API_BASE_URL}/${endpoint}`, {
            cache: 'no-store' // Selalu mengambil data terbaru
        });

        // PERBAIKAN: Jika respons tidak OK (misal: 504 Gateway Timeout),
        // catat errornya dan kembalikan 0, jangan lempar error.
        if (!response.ok) {
            console.error(`Gagal mengambil data dari ${endpoint}: Status ${response.status} ${response.statusText}`);
            return 0; // <-- Ini akan mencegah halaman crash
        }

        // Memberikan tipe pada data yang di-parse dari JSON untuk type safety
        const data = await response.json() as PaginatedResponse<T>;
        return data.count || 0;
    } catch (error) {
        // Catch block ini akan menangani error jaringan (jika server tidak terjangkau sama sekali)
        console.error(`Terjadi kesalahan jaringan saat fetching dari ${endpoint}:`, error);
        return 0;
    }
}

/**
 * Mengambil statistik jumlah total gejala, penyakit, dan pengetahuan dari API.
 * @returns Objek yang berisi jumlah untuk setiap kategori.
 */
export async function getDashboardStats() {
    try {
        // Menggunakan Promise.all untuk menjalankan semua fetch secara paralel.
        // Tipe <unknown> digunakan karena kita tidak peduli dengan tipe 'items' di sini,
        // kita hanya butuh 'count' yang sudah dijamin oleh tipe PaginatedResponse.
        const [gejalaCount, penyakitCount, pakarCount] = await Promise.all([
            fetchCount<unknown>('gejala'),
            fetchCount<unknown>('penyakit'),
            fetchCount<unknown>('pakar') // Endpoint 'pakar' untuk data pengetahuan
        ]);

        return {
            gejalaCount,
            penyakitCount,
            pakarCount,
        };
    } catch (error) {
        console.error("Gagal mengambil data statistik dashboard:", error);
        // Mengembalikan nilai default jika terjadi kesalahan fatal
        return { gejalaCount: 0, penyakitCount: 0, pakarCount: 0 };
    }
}

// Di masa depan, Anda bisa menambahkan fungsi lain di sini, misalnya:
// export async function getAllGejala(): Promise<Gejala[]> { ... }
// export async function getPenyakitById(id: string): Promise<Penyakit> { ... }
