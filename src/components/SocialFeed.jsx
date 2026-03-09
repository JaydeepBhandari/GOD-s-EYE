import { useEffect, useRef, useMemo } from 'react';
import useStore, { getFilteredPosts } from '../store/useStore';

function getBadgeClass(urgency) {
    switch (urgency) {
        case 'critical': return 'badge badge-critical';
        case 'high': return 'badge badge-high';
        case 'medium': return 'badge badge-medium';
        default: return 'badge badge-stable';
    }
}

function getBadgeIcon(urgency) {
    switch (urgency) {
        case 'critical': return '🔴';
        case 'high': return '🟠';
        case 'medium': return '🟡';
        default: return '🟢';
    }
}

function getCategoryIcon(category) {
    switch (category) {
        case 'water': return '💧';
        case 'medical': return '🏥';
        case 'power': return '⚡';
        default: return '📌';
    }
}

function timeAgo(timestamp) {
    const now = new Date();
    const then = new Date(timestamp);
    const diff = Math.floor((now - then) / 60000);
    if (diff < 1) return 'just now';
    if (diff < 60) return `${diff}m ago`;
    return `${Math.floor(diff / 60)}h ago`;
}

export default function SocialFeed() {
    const postsRaw = useStore(s => s.posts);
    const activeFilter = useStore(s => s.activeFilter);
    const posts = useMemo(() => getFilteredPosts({ posts: postsRaw, activeFilter }), [postsRaw, activeFilter]);
    const selectedNodeId = useStore(s => s.selectedNodeId);
    const selectNode = useStore(s => s.selectNode);
    const feedRef = useRef(null);
    const cardRefs = useRef({});

    // Count by zone for insights
    const zoneInsights = useMemo(() => {
        const zones = {};
        posts.forEach(p => {
            if (!zones[p.zone]) zones[p.zone] = { total: 0, critical: 0, high: 0, medium: 0, stable: 0 };
            zones[p.zone].total++;
            zones[p.zone][p.urgency]++;
        });
        return zones;
    }, [posts]);

    // Auto-scroll to highlighted post
    useEffect(() => {
        if (selectedNodeId && cardRefs.current[selectedNodeId]) {
            cardRefs.current[selectedNodeId].scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    }, [selectedNodeId]);

    return (
        <div className="h-full flex flex-col p-3 gap-2" id="social-feed">
            {/* Header */}
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold tracking-wider" style={{ color: 'var(--text-primary)' }}>
                        📡 LIVE FEED
                    </span>
                </div>
                <div
                    className="text-[0.6rem] font-semibold px-2 py-0.5 rounded-full"
                    style={{
                        color: 'var(--cyan)',
                        background: 'rgba(0,212,255,0.1)',
                        border: '1px solid rgba(0,212,255,0.2)',
                    }}
                >
                    {posts.length} reports
                </div>
            </div>

            {/* Zone insights bar */}
            <div className="flex gap-1 flex-wrap px-1">
                {Object.entries(zoneInsights).map(([zone, data]) => (
                    <button
                        key={zone}
                        onClick={() => selectNode(zone)}
                        className="text-[0.55rem] px-2 py-1 rounded-lg font-medium transition-all cursor-pointer border"
                        style={{
                            background: selectedNodeId === zone ? 'rgba(255,49,49,0.12)' : 'var(--bg-card)',
                            color: selectedNodeId === zone ? 'var(--pulse-red)' : 'var(--text-secondary)',
                            borderColor: selectedNodeId === zone ? 'rgba(255,49,49,0.3)' : 'var(--border-glass)',
                        }}
                    >
                        {zone} ({data.total})
                    </button>
                ))}
            </div>

            {/* Feed cards */}
            <div ref={feedRef} className="flex flex-col gap-2 overflow-y-auto flex-1 pr-1">
                {posts.map((post, idx) => {
                    const isHighlighted = selectedNodeId && post.zone === selectedNodeId;
                    const isNew = idx === 0;

                    return (
                        <div
                            key={post.id}
                            ref={el => { if (isHighlighted) cardRefs.current[selectedNodeId] = el; }}
                            className={`feed-card rounded-xl p-3 flex flex-col gap-1.5 cursor-pointer ${isHighlighted ? 'highlighted' : ''}`}
                            style={{
                                background: 'var(--bg-card)',
                                animation: isNew ? 'fadeIn 0.4s ease-out' : 'none',
                            }}
                            onClick={() => selectNode(post.zone)}
                        >
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5">
                                    <span className={getBadgeClass(post.urgency)}>
                                        {getBadgeIcon(post.urgency)} {post.urgency}
                                    </span>
                                    <span className="text-[0.55rem]" style={{ color: 'var(--text-muted)' }}>
                                        {getCategoryIcon(post.category)}
                                    </span>
                                </div>
                                <span className="text-[0.55rem] tabular-nums" style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
                                    {timeAgo(post.timestamp)}
                                </span>
                            </div>

                            <p className="text-[0.7rem] leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                                {post.text}
                            </p>

                            <div className="flex items-center justify-between">
                                <span className="text-[0.55rem] font-medium" style={{ color: 'var(--text-secondary)' }}>
                                    📍 {post.zone}
                                </span>
                                <span className="text-[0.55rem]" style={{ color: 'var(--text-muted)' }}>
                                    @{post.author}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
