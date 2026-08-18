// ============================================================
// api-data.tsx — Single source of truth for all API & course data
// ============================================================
//
// This file handles:
//   1. Fetching course data from the API (with retry)
//   2. Storing mangoIds in an exported array (dynamically, never hardcoded)
//   3. Indexing courses by mangoId (primary key) for O(1) lookup
//   4. A shared React hook (useCourseData) so any component can consume the data
//
// Only ONE network request is ever made — all callers share the same promise.
// ============================================================

import { useEffect, useState } from "react";

// ─── API Endpoint ───────────────────────────────────────────
const API_URL = "https://syncsphere-hiv6.onrender.com/assignment/course-data";

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

// Internal Map keyed by mangoId for O(1) lookup
const _coursesByMangoId: Map<string, Course> = new Map();

// The single in-flight (or resolved) promise — reused by every caller
let _fetchPromise: Promise<Course[]> | null = null;

// ─── Core Fetch Function ────────────────────────────────────
/**
 * Fetches all courses from the API with automatic retry.
 * Returns the SAME promise to all callers — the network request
 * is made exactly once. On failure, resets so the next call retries.
 *
 * @param maxRetries  Number of retry attempts (default 8)
 * @param delayMs     Delay between retries in ms (default 600)
 * @returns           Promise resolving to Course[]
 */
export function fetchCourses(maxRetries = 8, delayMs = 600): Promise<Course[]> {
    if (_fetchPromise) return _fetchPromise;

    _fetchPromise = (async () => {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const response = await fetch(API_URL);
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
                console.warn(`Attempt ${attempt} failed: ${err.message}`);
                if (attempt === maxRetries) {
                    _fetchPromise = null; // allow retry on next call
                    throw err;
                }
                await new Promise((r) => setTimeout(r, delayMs));
            }
        }
        return [];
    })();

    return _fetchPromise;
}

// ─── Lookup Helpers ─────────────────────────────────────────

/** Get a single course by its mangoId (primary key). Works after fetchCourses() resolves. */
export function getCourseByMangoId(mangoId: string): Course | undefined {
    return _coursesByMangoId.get(mangoId);
}

/** Reset the fetch cache — used when you want to force a fresh API call. */
export function resetFetchCache(): void {
    _fetchPromise = null;
}

// ─── Shared React Hook ──────────────────────────────────────
/**
 * Hook to consume course data in any React component.
 * Multiple components calling this hook will share the same single fetch.
 *
 * @returns { courses, loading, error, mangoIds }
 */
export function useCourseData() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCourses()
            .then((data) => {
                setCourses(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    return { courses, loading, error, mangoIds };
}
