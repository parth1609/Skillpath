import * as React from "react"
import { useCourseData } from "./api-data"
import { layoutStyles, cardStyles, feedbackStyles } from "./style-css"
import { SkeletonCardGrid } from "./skeleton-loader"

/**
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function CourseCard() {
    const { courses, loading } = useCourseData()

    if (loading) {
        return <SkeletonCardGrid count={6} />
    }

    return (
        <div style={layoutStyles.pageContainer}>
            <div style={layoutStyles.grid}>
                {courses.map((course) => (
                    <div key={course.mangoId} style={cardStyles.card}>
                        {/* Top Tag Area */}
                        <div style={cardStyles.imageArea}>
                            <span style={cardStyles.imageTagText}>{course.shortCourse}</span>
                        </div>

                        {/* Bottom Content Area */}
                        <div style={cardStyles.contentArea}>
                            <h2 style={cardStyles.title}>{course.courseName}</h2>
                            <p style={cardStyles.description}>{course.description}</p>

                            <hr style={cardStyles.divider} />

                            <div style={cardStyles.metaRow}>
                                <span style={cardStyles.category}>{course.mainCategory}</span>
                                <span style={cardStyles.price}>
                                    ₹{(course.pricePaise / 100).toLocaleString("en-IN")}
                                </span>
                            </div>

                            <div style={cardStyles.guaranteeRow}>
                                <span style={course.refundable ? cardStyles.refundableYes : cardStyles.refundableNo}>
                                    {course.refundable ? "✓ 100% Refundable" : "✕ Non-refundable"}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
