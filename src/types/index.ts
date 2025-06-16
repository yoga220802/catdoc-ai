/**
 * Tipe generik untuk struktur respons API yang memiliki paginasi.
 */
export interface PaginatedResponse<T> {
    count: number;
    items: T[];
    curr_page: number;
    total_page: number;
    next_page: string | null;
    previous_page: string | null;
}

/**
 * Model untuk data Kelompok Gejala yang berada di dalam Gejala.
 */
export interface KelompokGejala {
    id: number;
    nama: string;
}

/**
 * Model untuk data Gejala.
 */
export interface Gejala {
    id: string;
    create_at: string;
    update_at: string;
    nama: string;
    image_url: string | null;
    deskripsi: string;
    pertanyaan: string;
    kelompoks: KelompokGejala[];
}

/**
 * Model untuk data Penyakit.
 */
export interface Penyakit {
    id: string;
    create_at: string;
    update_at: string;
    nama: string;
    solusi: string;
    deskripsi: string;
    pencegahan: string;
    image_url: string | null;
}

/**
 * Model untuk data Pakar (digunakan untuk Pengetahuan).
 */
export interface Pakar {
    id: string;
    nama: string;
}

// ---- TIPE UNTUK DIAGNOSA ----

export interface CFTerm {
    term: string;
    value: number;
}

export interface GejalaUserInput {
    id_gejala: string;
    cf_user: number;
}

export interface DiagnosisPayload {
    gejala_user: GejalaUserInput[];
}

/**
 * Model untuk detail bukti pada hasil diagnosis.
 */
export interface EvidenceDetail {
    gejala: Gejala;
    cf_user: number;
    cf_pakar_avg: number;
    cf_evidence: number;
}

/**
 * Model untuk satu hasil penyakit yang sudah dirangking.
 */
export interface RankedResult {
    penyakit: Penyakit;
    certainty_score: number;
    matching_gejala_count: number;
    matching_gejala_ids: string[];
    evidence_details: EvidenceDetail[];
}

/**
 * Model untuk respons lengkap dari endpoint diagnosis.
 */
export interface DiagnosisResponse {
    ranked_results: RankedResult[];
}
