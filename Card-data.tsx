// Get Started: https://www.framer.com/developers

import { addPropertyControls, ControlType } from "framer"
import { motion } from "framer-motion"
import { useCourseData, resetFetchCache } from "./api-data";
import { feedbackStyles, debugStyles } from "./style-css";
import { SkeletonRawData } from "./skeleton-loader";

/**
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */

// Re-export everything from api-data so existing imports from Card-data still work
export { mangoIds, getCourseByMangoId, useCourseData, fetchCourses, fetchCountryCode, formatCoursePrice } from "./api-data";
export type { Course } from "./api-data";

export default function CardInfo() {
    const { courses, loading, error } = useCourseData();

    if (loading) {
        return <SkeletonRawData />;
    }

    if (error) {
        return (
            <div style={feedbackStyles.errorContainer}>
                <p>{error}</p>
                <button
                    onClick={() => { resetFetchCache(); window.location.reload(); }}
                    style={feedbackStyles.retryButton}
                >
                    Retry Now
                </button>
            </div>
        );
    }

    return (
        <div>
            <h2>Courses ({courses.length})</h2>
            <pre style={debugStyles.pre}>
                {JSON.stringify(courses, null, 2)}
            </pre>
        </div>
    );
}
