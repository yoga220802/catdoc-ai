import type {
    PaginatedResponse,
    Gejala,
    CFTerm,
    DiagnosisPayload,
    DiagnosisResponse,
    Pakar
} from '@/types';
import { CATDOC_API_BASE_URL } from './constant';

// Fungsi fetchCount yang sudah ada...
async function fetchCount<T>(endpoint: string): Promise<number> {
    try {
        const response = await fetch(`${CATDOC_API_BASE_URL}/${endpoint}`, { cache: 'no-store' });
        if (!response.ok) {
            console.error(`Gagal mengambil data dari ${endpoint}: Status ${response.status} ${response.statusText}`);
            return 0;
        }
        const data = await response.json() as PaginatedResponse<T>;
        return data.count || 0;
    } catch (error) {
        console.error(`Terjadi kesalahan jaringan saat fetching dari ${endpoint}:`, error);
        return 0;
    }
}

// Fungsi getDashboardStats yang sudah ada...
export async function getDashboardStats() {
    try {
        const [gejalaCount, penyakitCount, pakarCount] = await Promise.all([
            fetchCount<unknown>('gejala'),
            fetchCount<unknown>('penyakit'),
            fetchCount<unknown>('pakar')
        ]);
        return { gejalaCount, penyakitCount, pakarCount };
    } catch (error) {
        console.error("Gagal mengambil data statistik dashboard:", error);
        return { gejalaCount: 0, penyakitCount: 0, pakarCount: 0 };
    }
}


// --- FUNGSI UNTUK DIAGNOSA ---

export async function getAllGejala(): Promise<Gejala[]> {
    try {
        const response = await fetch(`${CATDOC_API_BASE_URL}/gejala?page=1&size=100`, { cache: 'no-store' });
        if (!response.ok) {
            throw new Error('Gagal mengambil data gejala');
        }
        const data: PaginatedResponse<Gejala> = await response.json();
        return data.items || [];
    } catch (error) {
        console.error(error);
        return [];
    }
}

/**
 * @returns Array dari objek Pakar.
 */
export async function getAllPakar(): Promise<Pakar[]> {
    try {
        const response = await fetch(`${CATDOC_API_BASE_URL}/pakar`, { cache: 'no-store' });
        if (!response.ok) {
            throw new Error('Gagal mengambil data pakar');
        }
        const data: PaginatedResponse<Pakar> = await response.json();
        return data.items || [];
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getCFTerms(): Promise<CFTerm[]> {
    try {
        const response = await fetch(`${CATDOC_API_BASE_URL}/cf-terms`, { cache: 'no-store' });
        if (!response.ok) {
            throw new Error('Gagal mengambil data istilah CF');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

/**
 * Kini menerima ID pakar opsional.
 * @param payload - Data gejala yang akan dikirim.
 * @param pakarId - ID opsional dari pakar yang dipilih.
 * @returns Hasil diagnosis dari API.
 */
export async function postDiagnosis(payload: DiagnosisPayload, pakarId: string | null): Promise<DiagnosisResponse | null> {
    try {
        const endpoint = pakarId ? `/diagnosis/${pakarId}` : '/diagnosis';
        const url = `${CATDOC_API_BASE_URL}${endpoint}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Gagal melakukan diagnosis: ${response.statusText} - ${errorBody}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Diagnosis error:", error);
        return null;
    }
}
