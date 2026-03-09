import { useState, useEffect } from 'react';

/**
 * Global Urgency Index — single number (1-100) representing city health
 * Animated count-up with colour gradient
 */
export default function UrgencyIndex({ value }) {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        const start = display;
        const end = value;
        const duration = 800;
        const startTime = performance.now();

        const animate = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(start + (end - start) * eased));
            if (progress < 1) requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }, [value]);

    // Colour: green (low) → amber (mid) → red (high urgency)
    const getColor = (v) => {
        if (v >= 70) return '#FF3131';
        if (v >= 45) return '#FFB300';
        return '#00E676';
    };

    const getLabel = (v) => {
        if (v >= 70) return 'CRITICAL';
        if (v >= 45) return 'ELEVATED';
        if (v >= 25) return 'MODERATE';
        return 'STABLE';
    };

    const color = getColor(display);
    const label = getLabel(display);

    return (
        <div className="glass p-4 flex flex-col items-center justify-center gap-2" id="urgency-index">
            <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
                Global Urgency Index
            </div>

            {/* Circular indicator */}
            <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                        cx="50" cy="50" r="42"
                        fill="none"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="6"
                    />
                    {/* Progress arc */}
                    <circle
                        cx="50" cy="50" r="42"
                        fill="none"
                        stroke={color}
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={`${(display / 100) * 264} 264`}
                        transform="rotate(-90 50 50)"
                        style={{
                            filter: `drop-shadow(0 0 6px ${color})`,
                            transition: 'stroke-dasharray 0.8s ease-out'
                        }}
                    />
                </svg>
                <div className="flex flex-col items-center">
                    <span
                        className="text-4xl font-black tabular-nums count-glow"
                        style={{ color, fontFamily: "'JetBrains Mono', monospace" }}
                    >
                        {display}
                    </span>
                </div>
            </div>

            <div
                className="text-xs font-bold tracking-wider px-3 py-1 rounded-full"
                style={{
                    color,
                    background: `${color}15`,
                    border: `1px solid ${color}30`,
                }}
            >
                {label}
            </div>
        </div>
    );
}
