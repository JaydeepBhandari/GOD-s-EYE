import { useMemo } from 'react';
import useStore, { getPostsByZone } from '../store/useStore';
import { computeFulfillment } from '../engine/sentimentEngine';

const ZONES = ['Adajan', 'Varachha', 'Katargam', 'Athwalines', 'Udhna', 'Rander', 'Vesu', 'Piplod'];

function getBarColor(pct) {
    if (pct >= 70) return 'var(--green)';
    if (pct >= 40) return 'var(--amber)';
    return 'var(--danger)';
}

export default function SectorRatios() {
    const posts = useStore(s => s.posts);
    const postsByZone = useMemo(() => getPostsByZone({ posts }), [posts]);

    return (
        <div className="glass p-4 flex flex-col gap-3" id="sector-ratios">
            <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
                Sector Resource Fulfillment
            </div>

            <div className="flex flex-col gap-2 overflow-y-auto max-h-56 pr-1">
                {ZONES.map(zone => {
                    const posts = postsByZone[zone] || [];
                    const pct = posts.length > 0 ? computeFulfillment(posts) : 85;
                    const barColor = getBarColor(pct);

                    return (
                        <div key={zone} className="flex flex-col gap-1">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                                    {zone}
                                </span>
                                <span
                                    className="text-xs font-bold tabular-nums"
                                    style={{ color: barColor, fontFamily: "'JetBrains Mono', monospace" }}
                                >
                                    {pct}%
                                </span>
                            </div>
                            <div className="progress-bar">
                                <div
                                    className="fill"
                                    style={{ width: `${pct}%`, background: barColor }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
