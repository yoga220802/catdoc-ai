import type {
    PaginatedResponse,
    Gejala,
    CFTerm,
    DiagnosisPayload,
    DiagnosisResponse
} from '@/types';
import { CATDOC_API_BASE_URL } from './constant';

/**
 * Fetches the count of items from a given API endpoint.
 * @param endpoint - API endpoint path.
 * @returns Item count or 0 if failed.
 */
async function fetchCount<T>(endpoint: string): Promise<number> {
    try {
        const response = await fetch(`${CATDOC_API_BASE_URL}/${endpoint}`, { cache: 'no-store' });
        if (!response.ok) {
            console.error(`Error fetching ${endpoint}: ${response.status} ${response.statusText}`);
            return 0;
        }
        const data = await response.json() as PaginatedResponse<T>;
        return data.count || 0;
    } catch (error) {
        console.error(`Network error fetching ${endpoint}:`, error);
        return 0;
    }
}

/**
 * Fetches dashboard statistics for gejala, penyakit, and pakar.
 * @returns Object with counts for each category.
 */
export async function getDashboardStats() {
    try {
        const [gejalaCount, penyakitCount, pakarCount] = await Promise.all([
            fetchCount<unknown>('gejala'),
            fetchCount<unknown>('penyakit'),
            fetchCount<unknown>('pakar')
        ]);
        return { gejalaCount, penyakitCount, pakarCount };
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return { gejalaCount: 0, penyakitCount: 0, pakarCount: 0 };
    }
}

/**
 * Fetches all gejala data.
 * @returns Array of gejala objects.
 */
export async function getAllGejala(): Promise<Gejala[]> {
    try {
        const response = await fetch(`${CATDOC_API_BASE_URL}/gejala?page=1&size=100`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Error fetching gejala data');
        const data: PaginatedResponse<Gejala> = await response.json();
        return data.items || [];
    } catch (error) {
        console.error(error);
        return [];
    }
}

/**
 * Fetches Certainty Factor (CF) terms.
 * @returns Array of CF terms.
 */
export async function getCFTerms(): Promise<CFTerm[]> {
    try {
        const response = await fetch(`${CATDOC_API_BASE_URL}/cf-terms`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Error fetching CF terms');
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

/**
 * Sends selected gejala data for diagnosis.
 * @param payload - Gejala data to send.
 * @returns Diagnosis result or null if failed.
 */
export async function postDiagnosis(payload: DiagnosisPayload): Promise<DiagnosisResponse | null> {
    try {
        const response = await fetch(`${CATDOC_API_BASE_URL}/Diagnosis`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Diagnosis error: ${response.statusText} - ${errorBody}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}
