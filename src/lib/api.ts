import type {
    PaginatedResponse,
    Gejala,
    CFTerm,
    DiagnosisPayload,
    DiagnosisResponse,
    Pakar, Penyakit,
    Rule,
    PenyakitPayload,
    GejalaPayload,
    PakarPayload,
    RuleCreatePayload,
    RuleCFPayload
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

export async function getAdminDashboardStats() {
    try {
        // Mengambil semua data secara paralel
        const [penyakitData, gejalaData, rulesData, pakarData] = await Promise.all([
            getAllPenyakit(1, 1), // Hanya perlu count, jadi size=1
            getAllGejala(1, 1),
            getAllRules(1, 1),
            getAllPakar(1, 1) // Mengasumsikan getAllPakar ada dan mengembalikan paginasi
        ]);

        return {
            penyakitCount: penyakitData.count || 0,
            gejalaCount: gejalaData.count || 0,
            pengetahuanCount: rulesData.count || 0,
            pakarCount: pakarData.count || 0,
        };
    } catch (error) {
        console.error("Gagal mengambil statistik admin:", error);
        return { penyakitCount: 0, gejalaCount: 0, pengetahuanCount: 0, pakarCount: 0 };
    }
}


// --- FUNGSI UNTUK DIAGNOSA ---

export async function getAllPenyakit(page: number = 1, size: number = 10, search: string = ''): Promise<PaginatedResponse<Penyakit>> {
    try {
        const searchQuery = search ? `&search=${encodeURIComponent(search)}` : '';
        const response = await fetch(`${CATDOC_API_BASE_URL}/penyakit?size=${size}&page=${page}${searchQuery}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Gagal mengambil data penyakit');
        return await response.json();
    } catch (error) {
        console.error(error);
        return { count: 0, items: [], curr_page: 1, total_page: 0, next_page: null, previous_page: null };
    }
}

export async function getAllGejala(page: number = 1, size: number = 100, search: string = ''): Promise<PaginatedResponse<Gejala>> {
    try {
        const searchQuery = search ? `&search=${encodeURIComponent(search)}` : '';
        const response = await fetch(`${CATDOC_API_BASE_URL}/gejala?size=${size}&page=${page}${searchQuery}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Gagal mengambil data gejala');
        return await response.json();
    } catch (error) {
        console.error(error);
        return { count: 0, items: [], curr_page: 1, total_page: 0, next_page: null, previous_page: null };
    }
}

/**
 * @returns Array dari objek Pakar.
 */
export async function getAllPakar(page: number = 1, size: number = 10): Promise<PaginatedResponse<Pakar>> {
    try {
        const response = await fetch(`${CATDOC_API_BASE_URL}/pakar?size=${size}&page=${page}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Gagal mengambil data pakar');
        return await response.json();
    } catch (error) {
        console.error(error);
        return { count: 0, items: [], curr_page: 1, total_page: 0, next_page: null, previous_page: null };
    }
}
/**
 * @param page Halaman yang ingin diambil.
 * @param size Jumlah item per halaman.
 * @returns Objek PaginatedResponse yang berisi aturan dan info halaman.
 */
export async function getAllRules(page: number = 1, size: number = 20, search: string = ''): Promise<PaginatedResponse<Rule>> {
    try {
        const searchQuery = search ? `&search=${encodeURIComponent(search)}` : '';
        const response = await fetch(`${CATDOC_API_BASE_URL}/rules?size=${size}&page=${page}${searchQuery}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Gagal mengambil data aturan (rules)');
        return await response.json();
    } catch (error) {
        console.error(error);
        return { count: 0, items: [], curr_page: 1, total_page: 0, next_page: null, previous_page: null };
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



// --- FUNGSI CRUD PENYAKIT ---
export const createPenyakit = async (data: PenyakitPayload) => {
    const response = await fetch(`${CATDOC_API_BASE_URL}/penyakit`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Gagal membuat penyakit');
    return await response.json();
};

export const updatePenyakit = async (id: string, data: Partial<PenyakitPayload>) => {
    const response = await fetch(`${CATDOC_API_BASE_URL}/penyakit/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Gagal memperbarui penyakit');
    return await response.json();
};

export const deletePenyakit = async (id: string) => {
    const response = await fetch(`${CATDOC_API_BASE_URL}/penyakit/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Gagal menghapus penyakit');
    return await response.json();
};

// --- FUNGSI CRUD GEJALA ---
export const createGejala = async (data: GejalaPayload) => {
    const response = await fetch(`${CATDOC_API_BASE_URL}/gejala`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Gagal membuat gejala');
    return await response.json();
};

export const updateGejala = async (id: string, data: Partial<GejalaPayload>) => {
    const response = await fetch(`${CATDOC_API_BASE_URL}/gejala/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Gagal memperbarui gejala');
    return await response.json();
};

export const deleteGejala = async (id: string) => {
    const response = await fetch(`${CATDOC_API_BASE_URL}/gejala/${id}`, { method: 'DELETE' });
    // Endpoint ini mengembalikan string, jadi kita handle secara berbeda
    if (response.status !== 200) throw new Error('Gagal menghapus gejala');
    return await response.text();
};


// --- FUNGSI CRUD PAKAR ---
export const createPakar = async (data: PakarPayload) => {
    const response = await fetch(`${CATDOC_API_BASE_URL}/pakar`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Gagal membuat pakar');
    return await response.json();
};

export const updatePakar = async (id: string, data: Partial<PakarPayload>) => {
    const response = await fetch(`${CATDOC_API_BASE_URL}/pakar/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Gagal memperbarui pakar');
    return await response.json();
};


// --- FUNGSI CRUD BASIS PENGETAHUAN (RULES) ---
export const createRule = async (data: RuleCreatePayload) => {
    const response = await fetch(`${CATDOC_API_BASE_URL}/rules`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Gagal membuat aturan');
    return await response.json();
};

export const deleteRule = async (id: string) => {
    const response = await fetch(`${CATDOC_API_BASE_URL}/rules/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Gagal menghapus aturan');
    return await response.json();
};

export const updateRuleCF = async (ruleId: string, cfData: RuleCFPayload) => {
    const response = await fetch(`${CATDOC_API_BASE_URL}/rules/${ruleId}/cf`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cfData)
    });
    if (!response.ok) throw new Error('Gagal memperbarui nilai CF');
    return await response.json();
}