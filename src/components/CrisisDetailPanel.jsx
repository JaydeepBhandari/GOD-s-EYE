import { useMemo } from 'react';
import useStore, { getNeedNodes } from '../store/useStore';
import dispatchTeams from '../data/dispatchTeams';

const EMERGENCY_NUMBERS = [
    { label: 'NDRF Helpline', number: '011-24363260' },
    { label: 'Surat Fire', number: '101' },
    { label: 'Ambulance', number: '108' },
    { label: 'Surat Police', number: '100' },
    { label: 'Disaster Mgmt', number: '1070' },
    { label: 'SMC Control Room', number: '0261-2423811' },
];

function getActionItems(urgency, category) {
    const actions = [];
    if (urgency === 'critical' || urgency === 'high') {
        actions.push({ text: 'Immediate evacuation initiated', status: 'done' });
        actions.push({ text: 'NDRF rescue team dispatched', status: 'done' });
    }
    if (category === 'water') {
        actions.push({ text: 'Water pumps deployed', status: urgency === 'critical' ? 'done' : 'pending' });
        actions.push({ text: 'Drinking water tankers en route', status: 'in-progress' });
    } else if (category === 'medical') {
        actions.push({ text: 'Medical team dispatched', status: 'done' });
        actions.push({ text: 'Mobile clinic setup', status: 'in-progress' });
        actions.push({ text: 'Medicine supply restocking', status: 'pending' });
    } else if (category === 'power') {
        actions.push({ text: 'Power restoration crew dispatched', status: 'done' });
        actions.push({ text: 'Generator backup deployed', status: 'in-progress' });
    }
    actions.push({ text: 'Area assessment complete', status: urgency === 'stable' ? 'done' : 'in-progress' });
    return actions;
}

function getStatusIcon(status) {
    switch (status) {
        case 'done': return '✅';
        case 'in-progress': return '🔄';
        case 'pending': return '⏳';
        default: return '⏳';
    }
}

export default function CrisisDetailPanel() {
    const selectedNodeId = useStore(s => s.selectedNodeId);
    const clearSelection = useStore(s => s.clearSelection);
    const posts = useStore(s => s.posts);
    const activeFilter = useStore(s => s.activeFilter);
    const dispatchItems = useStore(s => s.dispatchItems);

    const needNodes = useMemo(() => getNeedNodes({ posts, activeFilter }), [posts, activeFilter]);
    const node = needNodes.find(n => n.zone === selectedNodeId);

    if (!node) return null;

    const zonePosts = node.posts;
    const uniqueAuthors = new Set(zonePosts.map(p => p.author)).size;
    const categories = {};
    zonePosts.forEach(p => {
        categories[p.category] = (categories[p.category] || 0) + 1;
    });

    // Get dispatched teams for this zone
    const assignedTeams = dispatchTeams.filter(t => t.targetZone === selectedNodeId);
    const userDispatches = dispatchItems.filter(d => d.zone === selectedNodeId);

    // Get primary category for action items
    const primaryCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0]?.[0] || 'water';
    const actions = getActionItems(node.maxUrgency, primaryCategory);

    return (
        <div
            className="absolute top-3 right-3 z-[1000] w-80 max-h-[calc(100%-24px)] overflow-y-auto glass flex flex-col gap-0"
            style={{ borderRadius: '16px' }}
            id="crisis-detail"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 pb-2">
                <div className="flex items-center gap-2">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{
                            background: node.maxUrgency === 'critical' ? 'var(--pulse-red)' : node.maxUrgency === 'high' ? '#FF6B6B' : 'var(--amber)',
                            boxShadow: `0 0 8px ${node.maxUrgency === 'critical' ? 'var(--pulse-red)' : 'var(--amber)'}`,
                        }}
                    />
                    <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                        {selectedNodeId}
                    </span>
                    <span
                        className="text-[0.55rem] font-bold uppercase px-2 py-0.5 rounded-full"
                        style={{
                            color: node.maxUrgency === 'critical' ? 'var(--pulse-red)' : 'var(--amber)',
                            background: node.maxUrgency === 'critical' ? 'rgba(255,49,49,0.12)' : 'rgba(255,179,0,0.12)',
                            border: `1px solid ${node.maxUrgency === 'critical' ? 'rgba(255,49,49,0.3)' : 'rgba(255,179,0,0.3)'}`,
                        }}
                    >
                        {node.maxUrgency}
                    </span>
                </div>
                <button
                    onClick={clearSelection}
                    className="w-6 h-6 flex items-center justify-center rounded-lg cursor-pointer transition-all"
                    style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border-glass)' }}
                >
                    ✕
                </button>
            </div>

            {/* Stats row */}
            <div className="flex gap-2 px-4 pb-3">
                <div className="flex-1 rounded-lg p-2 text-center" style={{ background: 'rgba(255,49,49,0.06)', border: '1px solid rgba(255,49,49,0.15)' }}>
                    <div className="text-lg font-black" style={{ color: 'var(--pulse-red)', fontFamily: "'JetBrains Mono', monospace" }}>{zonePosts.length}</div>
                    <div className="text-[0.55rem]" style={{ color: 'var(--text-muted)' }}>Reports</div>
                </div>
                <div className="flex-1 rounded-lg p-2 text-center" style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)' }}>
                    <div className="text-lg font-black" style={{ color: 'var(--cyan)', fontFamily: "'JetBrains Mono', monospace" }}>{uniqueAuthors}</div>
                    <div className="text-[0.55rem]" style={{ color: 'var(--text-muted)' }}>Reporters</div>
                </div>
                <div className="flex-1 rounded-lg p-2 text-center" style={{ background: 'rgba(0,230,118,0.06)', border: '1px solid rgba(0,230,118,0.15)' }}>
                    <div className="text-lg font-black" style={{ color: 'var(--green)', fontFamily: "'JetBrains Mono', monospace" }}>{assignedTeams.length}</div>
                    <div className="text-[0.55rem]" style={{ color: 'var(--text-muted)' }}>Teams</div>
                </div>
            </div>

            {/* Crisis categories */}
            <div className="px-4 pb-3">
                <div className="text-[0.6rem] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                    Crisis Breakdown
                </div>
                <div className="flex gap-2">
                    {Object.entries(categories).map(([cat, count]) => (
                        <div key={cat} className="flex items-center gap-1 text-[0.6rem] px-2 py-1 rounded-lg" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)' }}>
                            <span>{cat === 'water' ? '💧' : cat === 'medical' ? '🏥' : '⚡'}</span>
                            <span style={{ color: 'var(--text-secondary)' }}>{cat}</span>
                            <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{count}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Actions taken */}
            <div className="px-4 pb-3">
                <div className="text-[0.6rem] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                    Actions Taken
                </div>
                <div className="flex flex-col gap-1.5">
                    {actions.map((action, i) => (
                        <div key={i} className="flex items-start gap-2 text-[0.65rem]" style={{ color: 'var(--text-secondary)' }}>
                            <span className="shrink-0 mt-0.5">{getStatusIcon(action.status)}</span>
                            <span style={{ color: action.status === 'done' ? 'var(--green)' : action.status === 'in-progress' ? 'var(--amber)' : 'var(--text-muted)' }}>
                                {action.text}
                            </span>
                        </div>
                    ))}
                    {userDispatches.map(d => (
                        <div key={d.id} className="flex items-start gap-2 text-[0.65rem]" style={{ color: 'var(--text-secondary)' }}>
                            <span className="shrink-0 mt-0.5">🚛</span>
                            <span style={{ color: 'var(--cyan)' }}>
                                {d.item} × {d.quantity} dispatched
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Dispatched teams */}
            {assignedTeams.length > 0 && (
                <div className="px-4 pb-3">
                    <div className="text-[0.6rem] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                        Dispatched Units
                    </div>
                    <div className="flex flex-col gap-1.5">
                        {assignedTeams.map(team => (
                            <div key={team.id} className="flex items-center justify-between text-[0.65rem] px-2 py-1.5 rounded-lg" style={{ background: 'var(--bg-card)' }}>
                                <span style={{ color: 'var(--text-primary)' }}>{team.name}</span>
                                <span
                                    className="font-semibold"
                                    style={{ color: team.status === 'on-site' ? 'var(--green)' : 'var(--amber)' }}
                                >
                                    {team.status === 'on-site' ? '● On-Site' : `${team.distanceKm}km away`}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Emergency Numbers */}
            <div className="px-4 pb-4">
                <div className="text-[0.6rem] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                    Emergency Contacts
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                    {EMERGENCY_NUMBERS.map(em => (
                        <a
                            key={em.number}
                            href={`tel:${em.number}`}
                            className="flex flex-col px-2 py-1.5 rounded-lg transition-all"
                            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)' }}
                        >
                            <span className="text-[0.55rem]" style={{ color: 'var(--text-muted)' }}>{em.label}</span>
                            <span className="text-[0.65rem] font-bold" style={{ color: 'var(--cyan)', fontFamily: "'JetBrains Mono', monospace" }}>
                                📞 {em.number}
                            </span>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
