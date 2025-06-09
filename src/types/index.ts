/**
 * Tipe generik untuk struktur respons API yang memiliki paginasi.
 * Dapat digunakan kembali untuk berbagai jenis data item.
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
    create_at: string; // Tipe data string format ISO date
    update_at: string; // Tipe data string format ISO date
    nama: string;
    image_url: string;
    deskripsi: string;
    pertanyaan: string;
    kelompoks: KelompokGejala[];
}

/**
 * Model untuk data Penyakit.
 */
export interface Penyakit {
    id: string;
    create_at: string; // Tipe data string format ISO date
    update_at: string; // Tipe data string format ISO date
    nama: string;
    solusi: string;
    deskripsi: string;
    pencegahan: string;
}

/**
 * Model untuk data Pakar (digunakan untuk Pengetahuan).
 */
export interface Pakar {
    id: string;
    nama: string;
}

// Membuat tipe spesifik untuk setiap jenis respons paginasi untuk kemudahan penggunaan
export type GejalaResponse = PaginatedResponse<Gejala>;
export type PenyakitResponse = PaginatedResponse<Penyakit>;
export type PakarResponse = PaginatedResponse<Pakar>;
