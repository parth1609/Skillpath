// ============================================================
// api-data.tsx — Single source of truth for all API & course data
// ============================================================
//
// This file handles:
//   1. Fetching course data from the API (with retry)
//   2. Fetching country code (US or IN) to determine price display
//   3. Storing mangoIds in an exported array (dynamically, never hardcoded)
//   4. Indexing courses by mangoId (primary key) for O(1) lookup
//   5. A shared React hook (useCourseData) so any component can consume the data
//
// Only ONE network request per endpoint is ever made — all callers share the same promise.
// ============================================================

import { useEffect, useState } from "react";

// ─── API Endpoints ──────────────────────────────────────────
const API_BASE = "https://syncsphere-hiv6.onrender.com/assignment";
const COURSES_URL = `${API_BASE}/course-data`;
const COUNTRY_URL = `${API_BASE}/country-code`;

// ─── Course Interface ───────────────────────────────────────
// Describes the shape of each course object returned by the API.
export interface Course {
    mangoId: string;       // Primary Key
    courseName: string;
    courseCode: string;
    description: string;
    mainCategory: string;
    shortCourse: string;
    courseType: string;
    pricePaise: number;
    priceUsdCents: number;
    refundable: boolean;
}

// ─── Exported Data Stores ───────────────────────────────────
// These are populated dynamically during the single fetch — never hardcoded.

/** Array of all mangoIds (primary keys) extracted from fetched courses */
export let mangoIds: string[] = [];

/** The detected country code from the API (e.g. "US" or "IN") */
export let countryCode: string = "";

// Internal Map keyed by mangoId for O(1) lookup
const _coursesByMangoId: Map<string, Course> = new Map();

// Shared promises — each endpoint fires at most once
let _coursesFetchPromise: Promise<Course[]> | null = null;
let _countryFetchPromise: Promise<string> | null = null;

 
export function fetchCourses(maxRetries = 8, delayMs = 600): Promise<Course[]> {
    if (_coursesFetchPromise) return _coursesFetchPromise;

    _coursesFetchPromise = (async () => {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const response = await fetch(COURSES_URL);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);

                const data = await response.json();
                if (!Array.isArray(data)) throw new Error("Unexpected data format");

                // Populate the exported mangoIds array
                mangoIds = data.map((item: Course) => item.mangoId).filter(Boolean);

                // Index every course by its primary key (mangoId)
                _coursesByMangoId.clear();
                data.forEach((item: Course) => {
                    if (item.mangoId) _coursesByMangoId.set(item.mangoId, item);
                });

                return data as Course[];
            } catch (err: any) {
                console.warn(`Courses attempt ${attempt} failed: ${err.message}`);
                if (attempt === maxRetries) {
                    _coursesFetchPromise = null;
                    throw err;
                }
                await new Promise((r) => setTimeout(r, delayMs));
            }
        }
        return [];
    })();

    return _coursesFetchPromise;
}

// ─── Country Code Fetch ─────────────────────────────────────
/**
 * Fetches the country code from the API. Returns "US" or "IN" (or whatever
 * the API sends). Shared promise — only one request is ever made.
 */
export function fetchCountryCode(maxRetries = 3, delayMs = 500): Promise<string> {
    if (_countryFetchPromise) return _countryFetchPromise;

    _countryFetchPromise = (async () => {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const response = await fetch(COUNTRY_URL);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);

                const data = await response.json();
                countryCode = data.country_code || "";
                return countryCode;
            } catch (err: any) {
                console.warn(`Country code attempt ${attempt} failed: ${err.message}`);
                if (attempt === maxRetries) {
                    _countryFetchPromise = null;
                    throw err;
                }
                await new Promise((r) => setTimeout(r, delayMs));
            }
        }
        return "";
    })();

    return _countryFetchPromise;
}

// ─── Lookup Helpers ─────────────────────────────────────────

/** Get a single course by its mangoId (primary key). Works after fetchCourses() resolves. */
export function getCourseByMangoId(mangoId: string): Course | undefined {
    return _coursesByMangoId.get(mangoId);
}

/** Reset all fetch caches — used when you want to force fresh API calls. */
export function resetFetchCache(): void {
    _coursesFetchPromise = null;
    _countryFetchPromise = null;
}

// ─── Price Formatting Helper ────────────────────────────────
/**
 * Formats a course price based on the detected country code.
 * - "IN" → ₹ from pricePaise
 * - "US" (or any other) → $ from priceUsdCents
 *
 * The country is NOT hardcoded — it comes from the API.
 */
export function formatCoursePrice(course: Course, detectedCountry: string): string {
    if (detectedCountry === "IN") {
        return "₹" + (course.pricePaise / 100).toLocaleString("en-IN");
    }
    return "$" + (course.priceUsdCents / 100).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

// ─── Shared React Hook ──────────────────────────────────────
/**
 * Hook to consume course data and country code in any React component.
 * Both fetches run in parallel and share their promises — no duplicate requests.
 *
 * @returns { courses, countryCode, loading, error, mangoIds }
 */
export function useCourseData() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [detectedCountry, setDetectedCountry] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Fetch both in parallel — each uses its own shared promise
        Promise.all([fetchCourses(), fetchCountryCode()])
            .then(([courseData, country]) => {
                setCourses(courseData);
                setDetectedCountry(country);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    return { courses, countryCode: detectedCountry, loading, error, mangoIds };
}
