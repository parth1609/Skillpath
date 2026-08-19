import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
import { useCourseData, formatCoursePrice } from "./api-data"
import { SkeletonCardGrid } from "./skeleton-loader"
import { useCourseSortFilter, SortFilterControls } from "./course-filters"

interface CourseCardProps {
    accentColor: string
    borderRadius: number
    showRefundBadge: boolean
    refundableText: string
    nonRefundableText: string
    minCardWidth: number
    skeletonCount: number
    columns: number
    // Sizing Customization (px)
    cardWidth: number
    cardHeight: number
    imageHeight: number
    // Expanded styling & visibility props
    showControls: boolean
    showCategory: boolean
    cardBg: string
    borderColor: string
    titleColor: string
    titleSize: number
    descColor: string
    descSize: number
    descLines: number
    categoryColor: string
    // Skeleton Color Overrides
    skeletonBg: string
    skeletonHighlight: string
}

/**
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function CourseCard(props: CourseCardProps) {
    const {
        accentColor = "#4f46e5",
        borderRadius = 12,
        showRefundBadge = true,
        refundableText = "✓ 100% Refundable",
        nonRefundableText = "✕ Non-refundable",
        minCardWidth = 280,
        skeletonCount = 6,
        columns = 0, // 0 = Auto-fill responsive layout
        cardWidth = 0, // 0 = 100% of column width
        cardHeight = 0, // 0 = Automatic content-based height
        imageHeight = 100,
        showControls = true,
        showCategory = true,
        cardBg = "#ffffff",
        borderColor = "#e5e7eb",
        titleColor = "#111827",
        titleSize = 16,
        descColor = "#4b5563",
        descSize = 13,
        descLines = 2,
        categoryColor = "#6b7280",
        skeletonBg = "#f0f0f0",
        skeletonHighlight = "#e0e0e0",
    } = props

    const { courses, countryCode, loading } = useCourseData()
    const {
        displayed,
        sortPrice, setSortPrice,
        filterRefundable, setFilterRefundable,
    } = useCourseSortFilter(courses, countryCode)

    // Dynamic style customisations based on Framer canvas inputs
    const gridStyle = React.useMemo(() => {
        // If columns is set (greater than 0), use that number of columns.
        // Otherwise (0), fall back to auto-fill responsive grid.
        const gridTemplate = columns > 0 
            ? `repeat(${columns}, 1fr)` 
            : `repeat(auto-fill, minmax(${minCardWidth}px, 1fr))`;
        
        return {
            ...localStyles.grid,
            gridTemplateColumns: gridTemplate,
        };
    }, [columns, minCardWidth])

    const cardStyle = React.useMemo(() => ({
        ...localStyles.card,
        borderRadius: `${borderRadius}px`,
        backgroundColor: cardBg,
        borderColor: borderColor,
        width: cardWidth > 0 ? `${cardWidth}px` : "100%",
        maxWidth: "100%",
        height: cardHeight > 0 ? `${cardHeight}px` : "auto",
        margin: cardWidth > 0 ? "0 auto" : "0", // Center card horizontally so width adjusts symmetrically from both sides
        boxSizing: "border-box" as const,
        display: cardHeight > 0 ? "flex" : "block",
        flexDirection: "column" as const,
    }), [borderRadius, cardBg, borderColor, cardWidth, cardHeight])

    const imageStyle = React.useMemo(() => ({
        ...localStyles.imageArea,
        height: `${imageHeight}px`,
    }), [imageHeight])

    const contentAreaStyle = React.useMemo(() => ({
        ...localStyles.contentArea,
        flex: cardHeight > 0 ? 1 : undefined,
        display: cardHeight > 0 ? "flex" : "block",
        flexDirection: "column" as const,
        justifyContent: cardHeight > 0 ? "space-between" : undefined,
    }), [cardHeight])

    const tagStyle = React.useMemo(() => ({
        ...localStyles.imageTagText,
        color: accentColor,
        backgroundColor: `${accentColor}1A`, // 10% opacity dynamic background color
    }), [accentColor])

    const titleStyle = React.useMemo(() => ({
        ...localStyles.title,
        color: titleColor,
        fontSize: `${titleSize}px`,
    }), [titleColor, titleSize])

    const descStyle = React.useMemo(() => ({
        ...localStyles.description,
        color: descColor,
        fontSize: `${descSize}px`,
        WebkitLineClamp: descLines,
    }), [descColor, descSize, descLines])

    const categoryStyle = React.useMemo(() => ({
        ...localStyles.category,
        color: categoryColor,
    }), [categoryColor])

    if (loading) {
        return (
            <SkeletonCardGrid 
                count={skeletonCount} 
                columns={columns}
                minCardWidth={minCardWidth}
                borderRadius={borderRadius}
                cardBg={cardBg}
                borderColor={borderColor}
                loaderBg={skeletonBg}
                loaderHighlight={skeletonHighlight}
                cardWidth={cardWidth}
                cardHeight={cardHeight}
                imageHeight={imageHeight}
            />
        )
    }

    return (
        <div style={localStyles.pageContainer}>
            {/* Sort & Filter Controls (Toggled via Canvas control) */}
            {showControls && (
                <SortFilterControls
                    sortPrice={sortPrice}
                    setSortPrice={setSortPrice}
                    filterRefundable={filterRefundable}
                    setFilterRefundable={setFilterRefundable}
                />
            )}

            <div style={gridStyle}>
                {displayed.length === 0 && (
                    <p style={{ color: "#6b7280", gridColumn: "1 / -1", textAlign: "center", padding: "40px 0" }}>
                        No courses match the selected filters.
                    </p>
                )}
                {displayed.map((course) => (
                    <div key={course.mangoId} style={cardStyle}>
                        {/* Top Tag Area */}
                        <div style={imageStyle}>
                            <span style={tagStyle}>{course.shortCourse}</span>
                        </div>

                        {/* Bottom Content Area */}
                        <div style={contentAreaStyle}>
                            <div>
                                <h2 style={titleStyle}>{course.courseName}</h2>
                                <p style={descStyle}>{course.description}</p>
                            </div>

                            <div>
                                <hr style={localStyles.divider} />

                                <div style={localStyles.metaRow}>
                                    {showCategory && (
                                        <span style={categoryStyle}>{course.mainCategory}</span>
                                    )}
                                    <span style={localStyles.price}>
                                        {formatCoursePrice(course, countryCode)}
                                    </span>
                                </div>

                                {showRefundBadge && (
                                    <div style={localStyles.guaranteeRow}>
                                        <span style={course.refundable ? localStyles.refundableYes : localStyles.refundableNo}>
                                            {course.refundable ? refundableText : nonRefundableText}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

// ─── Local Styles ───────────────────────────────────────────
// Fully self-contained CSS styles using React.CSSProperties
const localStyles: { [key: string]: React.CSSProperties } = {
    pageContainer: {
        padding: "24px",
        fontFamily: "system-ui, -apple-system, sans-serif",
    },
    grid: {
        display: "grid",
        gap: "20px",
    },
    card: {
        borderWidth: "1px",
        borderStyle: "solid",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        transition: "box-shadow 0.2s ease-in-out",
    },
    imageArea: {
        background: "#f3f4f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    imageTagText: {
        fontSize: "13px",
        fontWeight: 600,
        padding: "4px 10px",
        borderRadius: "20px",
    },
    contentArea: {
        padding: "16px",
    },
    title: {
        fontWeight: 700,
        margin: "0 0 8px 0",
        lineHeight: 1.4,
    },
    description: {
        lineHeight: 1.5,
        margin: "0 0 12px 0",
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
    },
    divider: {
        border: "none",
        borderTop: "1px solid #f3f4f6",
        margin: "12px 0",
    },
    metaRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "10px",
    },
    category: {
        fontSize: "12px",
        fontWeight: 500,
    },
    price: {
        fontSize: "16px",
        fontWeight: 700,
        color: "#111827",
    },
    guaranteeRow: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
    },
    refundableYes: {
        fontSize: "12px",
        color: "#16a34a",
        fontWeight: 500,
    },
    refundableNo: {
        fontSize: "12px",
        color: "#9ca3af",
        fontWeight: 500,
    },
}

CourseCard.defaultProps = {
    accentColor: "#4f46e5",
    borderRadius: 12,
    showRefundBadge: true,
    refundableText: "✓ 100% Refundable",
    nonRefundableText: "✕ Non-refundable",
    minCardWidth: 280,
    skeletonCount: 6,
    columns: 0,
    cardWidth: 0,
    cardHeight: 0,
    imageHeight: 100,
    showControls: true,
    showCategory: true,
    cardBg: "#ffffff",
    borderColor: "#e5e7eb",
    titleColor: "#111827",
    titleSize: 16,
    descColor: "#4b5563",
    descSize: 13,
    descLines: 2,
    categoryColor: "#6b7280",
    skeletonBg: "#f0f0f0",
    skeletonHighlight: "#e0e0e0",
}

addPropertyControls(CourseCard, {
    // Layout Controls Group
    showControls: {
        type: ControlType.Boolean,
        title: "Show Controls",
    },
    columns: {
        type: ControlType.Number,
        title: "Columns",
        min: 0,
        max: 8,
        step: 1,
        description: "Set to 0 for automatic responsive grid",
    },
    minCardWidth: {
        type: ControlType.Number,
        title: "Min Card Width",
        min: 150,
        max: 600,
        step: 10,
        hidden(props) {
            return props.columns > 0
        },
    },

    // Card Sizing Group (px)
    cardWidth: {
        type: ControlType.Number,
        title: "Card Width (px)",
        min: 0,
        max: 1000,
        step: 10,
        description: "Set to 0 for 100% width. Resizes symmetrically from both sides.",
    },
    cardHeight: {
        type: ControlType.Number,
        title: "Card Height (px)",
        min: 0,
        max: 1000,
        step: 10,
        description: "Set to 0 for automatic content-based height",
    },
    imageHeight: {
        type: ControlType.Number,
        title: "Image Height (px)",
        min: 40,
        max: 500,
        step: 5,
    },

    skeletonCount: {
        type: ControlType.Number,
        title: "Skeleton Count",
        min: 1,
        max: 20,
        step: 1,
    },

    // Card Customization Group
    cardBg: {
        type: ControlType.Color,
        title: "Card Bg",
    },
    borderColor: {
        type: ControlType.Color,
        title: "Border Color",
    },
    borderRadius: {
        type: ControlType.Number,
        title: "Corner Radius",
        min: 0,
        max: 40,
        step: 1,
    },
    accentColor: {
        type: ControlType.Color,
        title: "Accent Color",
    },

    // Course Title Customization
    titleColor: {
        type: ControlType.Color,
        title: "Title Color",
    },
    titleSize: {
        type: ControlType.Number,
        title: "Title Size",
        min: 10,
        max: 36,
        step: 1,
    },

    // Course Description Customization
    descColor: {
        type: ControlType.Color,
        title: "Desc Color",
    },
    descSize: {
        type: ControlType.Number,
        title: "Desc Size",
        min: 10,
        max: 24,
        step: 1,
    },
    descLines: {
        type: ControlType.Number,
        title: "Max Desc Lines",
        min: 1,
        max: 6,
        step: 1,
    },

    // Category Customization
    showCategory: {
        type: ControlType.Boolean,
        title: "Show Category",
    },
    categoryColor: {
        type: ControlType.Color,
        title: "Category Color",
        hidden(props) {
            return !props.showCategory
        },
    },

    // Refund Badge Customization
    showRefundBadge: {
        type: ControlType.Boolean,
        title: "Show Refund",
    },
    refundableText: {
        type: ControlType.String,
        title: "Refund Text",
        hidden(props) {
            return !props.showRefundBadge
        },
    },
    nonRefundableText: {
        type: ControlType.String,
        title: "No-Refund Text",
        hidden(props) {
            return !props.showRefundBadge
        },
    },

    // Skeleton Loader Customization
    skeletonBg: {
        type: ControlType.Color,
        title: "Skeleton Base Color",
    },
    skeletonHighlight: {
        type: ControlType.Color,
        title: "Skeleton Shimmer Color",
    },
})
