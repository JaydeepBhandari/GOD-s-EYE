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
    const posts_raw = useStore(s => s.posts);
    const activeFilter = useStore(s => s.activeFilter);
    const posts = useMemo(() => getFilteredPosts({ posts: posts_raw, activeFilter }), [posts_raw, activeFilter]);
    const selectedNodeId = useStore(s => s.selectedNodeId);
    const feedRef = useRef(null);
    const cardRefs = useRef({});

    // Auto-scroll to highlighted post when a node is clicked on map
    useEffect(() => {
        if (selectedNodeId && cardRefs.current[selectedNodeId]) {
            cardRefs.current[selectedNodeId].scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    }, [selectedNodeId]);

    return (
        <div className="glass p-4 flex flex-col gap-3 flex-1 min-h-0" id="social-feed">
            <div className="flex items-center justify-between">
                <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
                    Social Feed
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

            <div ref={feedRef} className="flex flex-col gap-2 overflow-y-auto flex-1 pr-1">
                {posts.map(post => {
                    // Highlight cards that match the selected zone
                    const isHighlighted = selectedNodeId && post.zone === selectedNodeId;

                    return (
                        <div
                            key={post.id}
                            ref={el => { if (isHighlighted) cardRefs.current[selectedNodeId] = el; }}
                            className={`feed-card rounded-xl p-3 flex flex-col gap-2 ${isHighlighted ? 'highlighted' : ''}`}
                            style={{ background: 'var(--bg-card)' }}
                            id={`feed-${post.id}`}
                        >
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <span className={getBadgeClass(post.urgency)}>
                                        {getBadgeIcon(post.urgency)} {post.urgency}
                                    </span>
                                    <span className="text-[0.6rem]" style={{ color: 'var(--text-muted)' }}>
                                        {getCategoryIcon(post.category)} {post.category}
                                    </span>
                                </div>
                                <span className="text-[0.6rem] tabular-nums" style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
                                    {timeAgo(post.timestamp)}
                                </span>
                            </div>

                            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                                {post.text}
                            </p>

                            <div className="flex items-center justify-between">
                                <span className="text-[0.6rem] font-medium" style={{ color: 'var(--text-secondary)' }}>
                                    📍 {post.zone}
                                </span>
                                <span className="text-[0.6rem]" style={{ color: 'var(--text-muted)' }}>
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
