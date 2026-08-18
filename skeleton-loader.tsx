// ============================================================
// skeleton-loader.tsx — Skeleton loading placeholders
// ============================================================
//
// Provides shimmer-animated skeleton cards that match the
// layout of CourseCard, so the page feels instant while data loads.
//
// Usage:
//   import { SkeletonCardGrid } from "./skeleton-loader"
//   if (loading) return <SkeletonCardGrid count={6} />
//
// ============================================================

import * as React from "react"

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

// ─── Base shimmer style ─────────────────────────────────────
const shimmer: React.CSSProperties = {
    background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
    backgroundSize: "800px 100%",
    animation: "shimmer 1.5s infinite ease-in-out",
    borderRadius: "6px",
}

// ─── Single Skeleton Card ───────────────────────────────────
export function SkeletonCard() {
    injectShimmer();

    return (
        <div style={styles.card}>
            {/* Image area placeholder */}
            <div style={styles.imageArea} />

            {/* Content area */}
            <div style={styles.contentArea}>
                {/* Title line */}
                <div style={{ ...shimmer, width: "70%", height: "18px", marginBottom: "10px" }} />
                {/* Description line 1 */}
                <div style={{ ...shimmer, width: "100%", height: "12px", marginBottom: "6px" }} />
                {/* Description line 2 */}
                <div style={{ ...shimmer, width: "85%", height: "12px", marginBottom: "16px" }} />

                {/* Divider */}
                <hr style={styles.divider} />

                {/* Meta row */}
                <div style={styles.metaRow}>
                    <div style={{ ...shimmer, width: "80px", height: "12px" }} />
                    <div style={{ ...shimmer, width: "60px", height: "16px" }} />
                </div>

                {/* Guarantee row */}
                <div style={{ ...shimmer, width: "120px", height: "12px", marginTop: "10px" }} />
            </div>
        </div>
    )
}

// ─── Skeleton Card Grid ─────────────────────────────────────
/** Renders a grid of skeleton cards. Defaults to 6 cards. */
export function SkeletonCardGrid({ count = 6 }: { count?: number }) {
    return (
        <div style={styles.pageContainer}>
            <div style={styles.grid}>
                {Array.from({ length: count }).map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        </div>
    )
}

// ─── Skeleton for raw data view (CardInfo) ──────────────────
/** A simple block skeleton for the raw JSON debug view */
export function SkeletonRawData() {
    injectShimmer();

    return (
        <div style={{ padding: "20px" }}>
            <div style={{ ...shimmer, width: "200px", height: "24px", marginBottom: "16px" }} />
            <div style={{ ...shimmer, width: "100%", height: "300px", borderRadius: "8px" }} />
        </div>
    )
}

// ─── Styles ─────────────────────────────────────────────────
const styles: { [key: string]: React.CSSProperties } = {
    pageContainer: {
        padding: "24px",
        fontFamily: "system-ui, -apple-system, sans-serif",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "20px",
    },
    card: {
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        overflow: "hidden",
        background: "#ffffff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    },
    imageArea: {
        ...shimmer,
        height: "100px",
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
