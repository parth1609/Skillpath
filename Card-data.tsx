// Get Started: https://www.framer.com/developers

import { addPropertyControls, ControlType } from "framer"
import { motion } from "framer-motion"
import { useEffect, useState } from "react";

/**
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */


const API_URL = "https://syncsphere-hiv6.onrender.com/assignment/course-data";

// Dynamically populated during fetch — never hardcoded
export let mangoIds: string[] = [];

// Get a single course object by its mangoId (primary key)
export function getCourseByMangoId(mangoId: string): any | undefined {
    return _coursesByMangoId.get(mangoId);
}

// Internal map keyed by mangoId for O(1) lookup
const _coursesByMangoId: Map<string, any> = new Map();

export default function CardInfo() {
    const [cardData, setCardData] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [attemptCount, setAttemptCount] = useState(1);


    const loadDataWithRetry = async (maxRetries = 8, delayMs = 600) => {
        setLoading(true);
        setError(null);

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                setAttemptCount(attempt);
                const response = await fetch(API_URL);

                if (!response.ok) {
                    throw new Error(`Server returned HTTP ${response.status}`);
                }

                const data = await response.json();

                // Ensure data is valid course list array
                if (Array.isArray(data)) {
                    // Populate exported mangoIds array (dynamically, not hardcoded)
                    mangoIds = data
                        .map((item: any) => item.mangoId)
                        .filter(Boolean);

                    // Index courses by primary key (mangoId)
                    _coursesByMangoId.clear();
                    data.forEach((item: any) => {
                        if (item.mangoId) {
                            _coursesByMangoId.set(item.mangoId, item);
                        }
                    });

                    setCardData(data);
                    setLoading(false);
                    return;
                } else {
                    throw new Error("Received unexpected data format");
                }
            } catch (err: any) {
                console.warn(`Attempt ${attempt} failed: ${err.message}. Retrying...`);
                if (attempt === maxRetries) {
                    setError(`Failed to load after ${maxRetries} attempts: ${err.message}`);
                    setLoading(false);
                } else {
                    await new Promise((resolve) => setTimeout(resolve, delayMs));
                }
            }
        }
    };

    useEffect(() => {
        loadDataWithRetry();
    }, []);

    if (loading) {
        return (
            <div style={{ padding: 20, fontFamily: "sans-serif" }}>
                <p>Loading course data... (Attempt {attemptCount})</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: 20, fontFamily: "sans-serif", color: "red" }}>
                <p>{error}</p>
                <button
                    onClick={() => loadDataWithRetry()}
                    style={{
                        padding: "8px 16px",
                        cursor: "pointer",
                        background: "#0070f3",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                    }}
                >
                    Retry Now
                </button>
            </div>
        );
    }

    return (
        <div >
            <h2>Courses ({cardData?.length || 0})</h2>
            <pre>
                {JSON.stringify(cardData, null, 2)}
            </pre>
            <h2>Mango IDs ({mangoIds.length})</h2>
            <pre>
                {JSON.stringify(mangoIds, null, 2)}
            </pre>
        </div>
    );
}
