import useStore from '../store/useStore';

function getStatusStyle(status) {
    switch (status) {
        case 'en-route':
            return { color: 'var(--amber)', bg: 'rgba(255,179,0,0.1)', label: 'En Route', icon: '🚗' };
        case 'on-site':
            return { color: 'var(--green)', bg: 'rgba(0,230,118,0.1)', label: 'On-Site', icon: '📍' };
        case 'returning':
            return { color: 'var(--text-secondary)', bg: 'rgba(138,138,138,0.1)', label: 'Returning', icon: '↩️' };
        default:
            return { color: 'var(--text-secondary)', bg: 'transparent', label: status, icon: '🔹' };
    }
}

function getTypeIcon(type) {
    switch (type) {
        case 'rescue': return '🚨';
        case 'medical': return '🚑';
        case 'supply': return '🚛';
        case 'utility': return '⚡';
        default: return '🔹';
    }
}

export default function LiveDispatch() {
    const openDispatchModal = useStore(s => s.openDispatchModal);
    const userDispatches = useStore(s => s.dispatchItems);
    const teams = useStore(s => s.teams);

    return (
        <div className="glass p-3 flex flex-col gap-2" id="live-dispatch">
            <div className="flex items-center justify-between">
                <div className="text-[0.65rem] font-semibold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
                    Live Dispatch
                </div>
                <button
                    onClick={openDispatchModal}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-[0.6rem] font-bold cursor-pointer transition-all"
                    style={{
                        background: 'rgba(0,212,255,0.1)',
                        color: 'var(--cyan)',
                        border: '1px solid rgba(0,212,255,0.25)',
                    }}
                    title="Add new dispatch"
                >
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                        <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    ADD
                </button>
            </div>

            <div className="flex flex-col gap-1.5 overflow-y-auto max-h-48 pr-1">
                {teams.map(team => {
                    const { color, bg, label, icon } = getStatusStyle(team.status);
                    const progress = team.status === 'on-site'
                        ? 100
                        : Math.round(((team.totalDistanceKm - team.distanceKm) / team.totalDistanceKm) * 100);

                    return (
                        <div
                            key={team.id}
                            className="rounded-xl p-2.5 flex flex-col gap-1.5 transition-all"
                            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)' }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-xs">{getTypeIcon(team.type)}</span>
                                    <span className="text-[0.65rem] font-semibold" style={{ color: 'var(--text-primary)' }}>
                                        {team.name}
                                    </span>
                                </div>
                                <span
                                    className="text-[0.5rem] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full flex items-center gap-1"
                                    style={{ color, background: bg, border: `1px solid ${color}30` }}
                                >
                                    {icon} {label}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-[0.6rem]" style={{ color: 'var(--text-muted)' }}>
                                    → {team.targetZone}
                                </span>
                                <span
                                    className="text-[0.6rem] font-semibold tabular-nums"
                                    style={{ color, fontFamily: "'JetBrains Mono', monospace" }}
                                >
                                    {team.status === 'on-site' ? '● Arrived' : `${team.distanceKm}km`}
                                </span>
                            </div>

                            <div className="progress-bar">
                                <div
                                    className="fill"
                                    style={{
                                        width: `${progress}%`,
                                        background: `linear-gradient(90deg, ${color}80, ${color})`,
                                        transition: 'width 2.5s linear',
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}

                {/* User-dispatched items */}
                {userDispatches.map(d => (
                    <div
                        key={d.id}
                        className="rounded-xl p-2.5 flex flex-col gap-1 transition-all"
                        style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.15)' }}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs">🚛</span>
                                <span className="text-[0.65rem] font-semibold" style={{ color: 'var(--cyan)' }}>
                                    {d.item}
                                </span>
                            </div>
                            <span className="text-[0.5rem] font-bold uppercase px-1.5 py-0.5 rounded-full"
                                style={{ color: 'var(--amber)', background: 'rgba(255,179,0,0.1)', border: '1px solid rgba(255,179,0,0.2)' }}>
                                Queued
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-[0.6rem]" style={{ color: 'var(--text-muted)' }}>
                            <span>→ {d.zone}</span>
                            <span>×{d.quantity}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
