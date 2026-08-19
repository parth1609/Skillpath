// ============================================================
// skeleton-loader.tsx — Skeleton loading placeholders
// ============================================================
//
// Provides shimmer-animated skeleton cards that match the
// layout of CourseCard, so the page feels instant while data loads.
//
// ============================================================

import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

// ─── Shimmer keyframes injected once ────────────────────────
let _injected = false;
function injectShimmer() {
    if (_injected || typeof document === "undefined") return;
    const style = document.createElement("style");
    style.textContent = `
        @keyframes shimmer {
            0%   { background-position: -400px 0; }
            100% { background-position: 400px 0; }
        }
    `;
    document.head.appendChild(style);
    _injected = true;
}

interface SkeletonCardProps {
    borderRadius?: number
    cardBg?: string
    borderColor?: string
    loaderBg?: string
    loaderHighlight?: string
    cardWidth?: number
    cardHeight?: number
    imageHeight?: number
}

// ─── Single Skeleton Card ───────────────────────────────────
export function SkeletonCard(props: SkeletonCardProps) {
    const { 
        borderRadius = 12, 
        cardBg = "#ffffff", 
        borderColor = "#e5e7eb",
        loaderBg = "#f0f0f0",
        loaderHighlight = "#e0e0e0",
        cardWidth = 0,
        cardHeight = 0,
        imageHeight = 100,
    } = props;
    
    injectShimmer();

    const customCardStyle = React.useMemo(() => ({
        ...styles.card,
        borderRadius: `${borderRadius}px`,
        backgroundColor: cardBg,
        borderColor: borderColor,
        width: cardWidth > 0 ? `${cardWidth}px` : "100%",
        maxWidth: "100%",
        height: cardHeight > 0 ? `${cardHeight}px` : "auto",
        margin: cardWidth > 0 ? "0 auto" : "0", // Center card horizontally within its grid cell
        boxSizing: "border-box" as const,
        display: cardHeight > 0 ? "flex" : "block",
        flexDirection: "column" as const,
    }), [borderRadius, cardBg, borderColor, cardWidth, cardHeight])

    const shimmerStyle = React.useMemo(() => ({
        background: `linear-gradient(90deg, ${loaderBg} 25%, ${loaderHighlight} 50%, ${loaderBg} 75%)`,
        backgroundSize: "800px 100%",
        animation: "shimmer 1.5s infinite ease-in-out",
        borderRadius: "6px",
    }), [loaderBg, loaderHighlight])

    const imageStyle = React.useMemo(() => ({
        ...styles.imageArea,
        height: `${imageHeight}px`,
        ...shimmerStyle,
    }), [imageHeight, shimmerStyle])

    const contentAreaStyle = React.useMemo(() => ({
        ...styles.contentArea,
        flex: cardHeight > 0 ? 1 : undefined,
        display: cardHeight > 0 ? "flex" : "block",
        flexDirection: "column" as const,
        justifyContent: cardHeight > 0 ? "space-between" : undefined,
    }), [cardHeight])

    return (
        <div style={customCardStyle}>
            {/* Image area placeholder */}
            <div style={imageStyle} />

            {/* Content area */}
            <div style={contentAreaStyle}>
                <div>
                    {/* Title line */}
                    <div style={{ ...shimmerStyle, width: "70%", height: "18px", marginBottom: "10px" }} />
                    {/* Description line 1 */}
                    <div style={{ ...shimmerStyle, width: "100%", height: "12px", marginBottom: "6px" }} />
                    {/* Description line 2 */}
                    <div style={{ ...shimmerStyle, width: "85%", height: "12px", marginBottom: "16px" }} />
                </div>

                <div>
                    {/* Divider */}
                    <hr style={styles.divider} />

                    {/* Meta row */}
                    <div style={styles.metaRow}>
                        <div style={{ ...shimmerStyle, width: "80px", height: "12px" }} />
                        <div style={{ ...shimmerStyle, width: "60px", height: "16px" }} />
                    </div>

                    {/* Guarantee row */}
                    <div style={{ ...shimmerStyle, width: "120px", height: "12px", marginTop: "10px" }} />
                </div>
            </div>
        </div>
    )
}

interface SkeletonCardGridProps {
    count?: number
    columns?: number
    minCardWidth?: number
    borderRadius?: number
    cardBg?: string
    borderColor?: string
    loaderBg?: string
    loaderHighlight?: string
    cardWidth?: number
    cardHeight?: number
    imageHeight?: number
}

// ─── Skeleton Card Grid ─────────────────────────────────────
/** Renders a grid of skeleton cards matching CourseCard layout controls. */
export function SkeletonCardGrid(props: SkeletonCardGridProps) {
    const { 
        count = 6, 
        columns = 0,
        minCardWidth = 280, 
        borderRadius = 12, 
        cardBg = "#ffffff", 
        borderColor = "#e5e7eb",
        loaderBg = "#f0f0f0",
        loaderHighlight = "#e0e0e0",
        cardWidth = 0,
        cardHeight = 0,
        imageHeight = 100,
    } = props;

    const customGridStyle = React.useMemo(() => {
        const gridTemplate = columns > 0 
            ? `repeat(${columns}, 1fr)` 
            : `repeat(auto-fill, minmax(${minCardWidth}px, 1fr))`;
        
        return {
            ...styles.grid,
            gridTemplateColumns: gridTemplate,
        };
    }, [columns, minCardWidth])

    return (
        <div style={styles.pageContainer}>
            <div style={customGridStyle}>
                {Array.from({ length: count }).map((_, i) => (
                    <SkeletonCard 
                        key={i} 
                        borderRadius={borderRadius} 
                        cardBg={cardBg} 
                        borderColor={borderColor} 
                        loaderBg={loaderBg}
                        loaderHighlight={loaderHighlight}
                        cardWidth={cardWidth}
                        cardHeight={cardHeight}
                        imageHeight={imageHeight}
                    />
                ))}
            </div>
        </div>
    )
}

// ─── Skeleton for raw data view (CardInfo) ──────────────────
/** A simple block skeleton for the raw JSON debug view */
export function SkeletonRawData() {
    injectShimmer();

    const defaultShimmer: React.CSSProperties = {
        background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
        backgroundSize: "800px 100%",
        animation: "shimmer 1.5s infinite ease-in-out",
        borderRadius: "6px",
    }

    return (
        <div style={{ padding: "20px" }}>
            <div style={{ ...defaultShimmer, width: "200px", height: "24px", marginBottom: "16px" }} />
            <div style={{ ...defaultShimmer, width: "100%", height: "300px", borderRadius: "8px" }} />
        </div>
    )
}

// ─── Component default settings for Canvas preview ──────────
SkeletonCardGrid.defaultProps = {
    count: 6,
    columns: 0, // 0 = Auto-fill responsive layout
    minCardWidth: 280,
    cardWidth: 0,
    cardHeight: 0,
    imageHeight: 100,
    borderRadius: 12,
    cardBg: "#ffffff",
    borderColor: "#e5e7eb",
    loaderBg: "#f0f0f0",
    loaderHighlight: "#e0e0e0",
}

// ─── Expose Property Controls ───────────────────────────────
addPropertyControls(SkeletonCardGrid, {
    count: {
        type: ControlType.Number,
        title: "Card Count",
        min: 1,
        max: 24,
        step: 1,
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

    // Card Sizing (in px)
    cardWidth: {
        type: ControlType.Number,
        title: "Card Width (px)",
        min: 0,
        max: 1000,
        step: 10,
        description: "Set to 0 for 100% column width. Centered horizontally.",
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
        max: 400,
        step: 5,
    },

    borderRadius: {
        type: ControlType.Number,
        title: "Corner Radius",
        min: 0,
        max: 40,
        step: 1,
    },
    cardBg: {
        type: ControlType.Color,
        title: "Card Bg",
    },
    borderColor: {
        type: ControlType.Color,
        title: "Border Color",
    },
    loaderBg: {
        type: ControlType.Color,
        title: "Base Color",
    },
    loaderHighlight: {
        type: ControlType.Color,
        title: "Shimmer Color",
    },
})

// ─── Styles ─────────────────────────────────────────────────
const styles: { [key: string]: React.CSSProperties } = {
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
    },
    imageArea: {
        borderRadius: "0",
    },
    contentArea: {
        padding: "16px",
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
    },
}
