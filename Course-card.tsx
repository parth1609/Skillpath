import * as React from "react"
import { useCourseData, formatCoursePrice } from "./api-data"
import { layoutStyles, cardStyles } from "./style-css"
import { SkeletonCardGrid } from "./skeleton-loader"
import { useCourseSortFilter, SortFilterControls } from "./course-filters"

/**
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function CourseCard() {
    const { courses, countryCode, loading } = useCourseData()
    const {
        displayed,
        sortPrice, setSortPrice,
        filterRefundable, setFilterRefundable,
    } = useCourseSortFilter(courses, countryCode)

    if (loading) {
        return <SkeletonCardGrid count={6} />
    }

    return (
        <div style={layoutStyles.pageContainer}>
            {/* Sort & Filter — same row */}
            <SortFilterControls
                sortPrice={sortPrice}
                setSortPrice={setSortPrice}
                filterRefundable={filterRefundable}
                setFilterRefundable={setFilterRefundable}
            />

            <div style={layoutStyles.grid}>
                {displayed.length === 0 && (
                    <p style={{ color: "#6b7280", gridColumn: "1 / -1", textAlign: "center", padding: "40px 0" }}>
                        No courses match the selected filters.
                    </p>
                )}
                {displayed.map((course) => (
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
                                    {formatCoursePrice(course, countryCode)}
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
