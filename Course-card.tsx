import * as React from "react"
import { useState } from "react"
import { useCourseData } from "./Card-data"

/**
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function Counter() {
    // Standard React state handles the memory automatically

    // card box
    ; <div style={styles.pageContainer}>
        <div style={styles.grid}>
            {cards.map((card) => (
                <div key={card.id} style={styles.card}>
                    {/* Top Image / Tag Area */}
                    <div style={styles.imageArea}>
                        <span style={styles.imageTagText}>{card.imageTag}</span>
                    </div>

                    {/* Bottom Content Area */}
                    <div style={styles.contentArea}>
                        <h2 style={styles.title}>{card.title}</h2>
                        <p style={styles.description}>{card.description}</p>

                        <hr style={styles.divider} />

                        <div style={styles.metaRow}>
                            <span style={styles.category}>{card.category}</span>
                            <span style={styles.price}>{card.price}</span>
                        </div>

                        <div style={styles.guaranteeRow}>
                            <ShieldCheckIcon />
                            <span style={styles.guaranteeText}>
                                {card.guarantee}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
}

// --- Inline Styles ---
const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
        padding: "20px",
    },
    button: {
        backgroundColor: "orange",
        padding: "10px 20px",
        color: "white",
        fontWeight: "bold",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },
    display: {
        fontSize: "18px",
        fontWeight: "500",
        fontFamily: "sans-serif",
        color: "#333",
    },
}
