// ============================================================
// style-css.jsx — All shared styles in one place
// ============================================================
//
// Every style object is named clearly and exported individually.
// Import what you need in any component:
//
//   import { cardStyles, layoutStyles } from "./style-css"
//
// ============================================================

import React from "react"

// ─── Layout ─────────────────────────────────────────────────
export const layoutStyles = {
    /** Full-page wrapper */
    pageContainer: {
        padding: "24px",
        fontFamily: "system-ui, -apple-system, sans-serif",
    },
    /** Responsive card grid */
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "20px",
    },
}

// ─── Card ───────────────────────────────────────────────────
export const cardStyles = {
    /** Outer card wrapper */
    card: {
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        overflow: "hidden",
        background: "#ffffff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    },
    /** Top image / tag area */
    imageArea: {
        background: "#f3f4f6",
        height: "100px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    /** Tag badge inside image area */
    imageTagText: {
        fontSize: "13px",
        fontWeight: 600,
        color: "#4f46e5",
        background: "#eef2ff",
        padding: "4px 10px",
        borderRadius: "20px",
    },
    /** Bottom content wrapper */
    contentArea: {
        padding: "16px",
    },
    /** Course title */
    title: {
        fontSize: "16px",
        fontWeight: 700,
        color: "#111827",
        margin: "0 0 8px 0",
        lineHeight: 1.4,
    },
    /** Course description text */
    description: {
        fontSize: "13px",
        color: "#4b5563",
        lineHeight: 1.5,
        margin: "0 0 12px 0",
    },
    /** Horizontal divider line */
    divider: {
        border: "none",
        borderTop: "1px solid #f3f4f6",
        margin: "12px 0",
    },
    /** Row containing category + price */
    metaRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "10px",
    },
    /** Category label */
    category: {
        fontSize: "12px",
        color: "#6b7280",
        fontWeight: 500,
    },
    /** Price text */
    price: {
        fontSize: "16px",
        fontWeight: 700,
        color: "#111827",
    },
    /** Guarantee / refund row */
    guaranteeRow: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
    },
    /** Refundable — green */
    refundableYes: {
        fontSize: "12px",
        color: "#16a34a",
        fontWeight: 500,
    },
    /** Non-refundable — grey */
    refundableNo: {
        fontSize: "12px",
        color: "#9ca3af",
        fontWeight: 500,
    },
}

// ─── Loading & Error States ─────────────────────────────────
export const feedbackStyles = {
    /** Centered loading container */
    loadingContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        fontFamily: "sans-serif",
    },
    /** Loading text */
    loadingText: {
        color: "#6b7280",
        fontSize: "16px",
    },
    /** Error container */
    errorContainer: {
        padding: "20px",
        fontFamily: "sans-serif",
        color: "red",
    },
    /** Retry button */
    retryButton: {
        padding: "8px 16px",
        cursor: "pointer",
        background: "#0070f3",
        color: "white",
        border: "none",
        borderRadius: "4px",
        marginTop: "12px",
    },
}

// ─── Raw data debug view ────────────────────────────────────
export const debugStyles = {
    /** Pre block for JSON dumps */
    pre: {
        background: "#f4f4f4",
        padding: 15,
        borderRadius: 8,
    },
}
