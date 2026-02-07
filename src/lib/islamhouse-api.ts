// IslamHouse API Service
// This service provides methods to fetch Islamic content from IslamHouse API

const API_BASE = import.meta.env.DEV
    ? 'https://api3.islamhouse.com/v3/paV29H2gm56kvLP' // Direct for dev (may not work due to CORS)
    : '/api/islamhouse'; // Use Vercel API route in production

const IS_PRODUCTION = !import.meta.env.DEV;

// Language codes
export type LanguageCode = 'ku' | 'ar' | 'en' | 'fa' | 'tr';

// Content types
export type ContentType = 'showall' | 'video' | 'audio' | 'book' | 'articles' | 'fatwa' | 'poster';

// Interfaces
export interface IslamHouseItem {
    id: number;
    title: string;
    description?: string;
    full_description?: string;
    type?: string;
    add_date?: string;
    views_count?: number;
    prepared_by?: Array<{
        id: number;
        title: string;
    }>;
    attachments?: Array<{
        description: string;
        size: string;
        extension_type: string;
        url: string;
    }>;
}

export interface IslamHouseCategory {
    id: number;
    title: string;
    description?: string;
    items_count?: number;
    api_url?: string;
}

export interface IslamHouseAuthor {
    id: number;
    title: string;
    description?: string;
    full_description?: string;
}

export interface ApiResponse<T> {
    data: T[];
    links?: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

// Helper function to make API requests
async function fetchApi<T>(endpoint: string): Promise<T> {
    let url: string;

    if (IS_PRODUCTION) {
        // Use Netlify function proxy
        url = `${API_BASE}?endpoint=${encodeURIComponent(endpoint)}`;
    } else {
        // Direct API call (may fail due to CORS in dev)
        url = `${API_BASE}/${endpoint}`;
    }

    console.log('Fetching IslamHouse API:', url);

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

// ============================================
// CATEGORIES
// ============================================

/**
 * Get all categories for a language
 * @param lang Language code (ku, ar, en, etc.)
 * @param page Page number
 * @param limit Items per page (max 50)
 */
export async function getCategories(
    lang: LanguageCode = 'ku',
    page: number = 1,
    limit: number = 50
): Promise<IslamHouseCategory[]> {
    const endpoint = `${lang}/categories/all/${page}/${limit}/json`;
    return fetchApi<IslamHouseCategory[]>(endpoint);
}

/**
 * Get category types available for a language
 */
export async function getCategoryTypes(lang: LanguageCode = 'ku'): Promise<any[]> {
    const endpoint = `main/get-category-types/${lang}/json`;
    return fetchApi<any[]>(endpoint);
}

// ============================================
// ITEMS (Books, Articles, Audio, Video, etc.)
// ============================================

/**
 * Get items by type for a language
 * @param type Content type (showall, book, audio, video, articles, fatwa)
 * @param lang Language code
 * @param slang Source language (showall for all)
 * @param page Page number
 * @param limit Items per page
 */
export async function getItems(
    type: ContentType = 'showall',
    lang: LanguageCode = 'ku',
    slang: string = 'showall',
    page: number = 1,
    limit: number = 25
): Promise<IslamHouseItem[]> {
    const endpoint = `${lang}/main/${type}/${slang}/${page}/${limit}/json`;
    return fetchApi<IslamHouseItem[]>(endpoint);
}

/**
 * Get books in Kurdish
 */
export async function getBooks(
    page: number = 1,
    limit: number = 25
): Promise<IslamHouseItem[]> {
    return getItems('book', 'ku', 'showall', page, limit);
}

/**
 * Get articles in Kurdish
 */
export async function getArticles(
    page: number = 1,
    limit: number = 25
): Promise<IslamHouseItem[]> {
    return getItems('articles', 'ku', 'showall', page, limit);
}

/**
 * Get audio content in Kurdish
 */
export async function getAudio(
    page: number = 1,
    limit: number = 25
): Promise<IslamHouseItem[]> {
    return getItems('audio', 'ku', 'showall', page, limit);
}

/**
 * Get video content in Kurdish
 */
export async function getVideos(
    page: number = 1,
    limit: number = 25
): Promise<IslamHouseItem[]> {
    return getItems('video', 'ku', 'showall', page, limit);
}

/**
 * Get fatwas in Kurdish
 */
export async function getFatwas(
    page: number = 1,
    limit: number = 25
): Promise<IslamHouseItem[]> {
    return getItems('fatwa', 'ku', 'showall', page, limit);
}

/**
 * Get single item details
 * @param id Item ID
 * @param lang Language code
 */
export async function getItemDetails(
    id: number,
    lang: LanguageCode = 'ku'
): Promise<IslamHouseItem> {
    const endpoint = `${lang}/main/get-item/${id}/json`;
    return fetchApi<IslamHouseItem>(endpoint);
}

// ============================================
// AUTHORS
// ============================================

/**
 * Get list of authors/scholars
 * @param lang Language code
 * @param kind Author kind (showall, author, translator, etc.)
 * @param page Page number
 * @param limit Items per page
 */
export async function getAuthors(
    lang: LanguageCode = 'ku',
    kind: string = 'showall',
    page: number = 1,
    limit: number = 25
): Promise<IslamHouseAuthor[]> {
    const endpoint = `${lang}/main/authors/${kind}/${page}/${limit}/json`;
    return fetchApi<IslamHouseAuthor[]>(endpoint);
}

/**
 * Get author details
 */
export async function getAuthorDetails(
    authorId: number,
    lang: LanguageCode = 'ku'
): Promise<IslamHouseAuthor> {
    const endpoint = `main/get-author/${authorId}/${lang}/json`;
    return fetchApi<IslamHouseAuthor>(endpoint);
}

/**
 * Get author's items
 */
export async function getAuthorItems(
    authorId: number,
    type: ContentType = 'showall',
    lang: LanguageCode = 'ku',
    slang: string = 'showall',
    page: number = 1,
    limit: number = 25
): Promise<IslamHouseItem[]> {
    const endpoint = `main/get-author-items/${authorId}/${type}/${lang}/${slang}/${page}/${limit}/json`;
    return fetchApi<IslamHouseItem[]>(endpoint);
}

// ============================================
// SEARCH
// ============================================

/**
 * Search items
 * @param query Search query
 * @param lang Language code
 * @param type Content type
 * @param page Page number
 * @param limit Items per page
 */
export async function searchItems(
    query: string,
    lang: LanguageCode = 'ku',
    type: ContentType = 'showall',
    page: number = 1,
    limit: number = 25
): Promise<IslamHouseItem[]> {
    const endpoint = `${lang}/main/search/${type}/showall/${encodeURIComponent(query)}/${page}/${limit}/json`;
    return fetchApi<IslamHouseItem[]>(endpoint);
}

// ============================================
// STATISTICS
// ============================================

/**
 * Get API statistics and available languages
 */
export async function getStatistics(): Promise<any> {
    const endpoint = `main/home/json`;
    return fetchApi<any>(endpoint);
}

/**
 * Get site content for a language
 */
export async function getSiteContent(lang: LanguageCode = 'ku'): Promise<any> {
    const endpoint = `main/sitecontent/${lang}/${lang}/json`;
    return fetchApi<any>(endpoint);
}

// Export all functions
export const islamhouseApi = {
    getCategories,
    getCategoryTypes,
    getItems,
    getBooks,
    getArticles,
    getAudio,
    getVideos,
    getFatwas,
    getItemDetails,
    getAuthors,
    getAuthorDetails,
    getAuthorItems,
    searchItems,
    getStatistics,
    getSiteContent,
};

export default islamhouseApi;
