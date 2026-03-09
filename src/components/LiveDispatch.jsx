import dispatchTeams from '../data/dispatchTeams';

function getStatusStyle(status) {
    switch (status) {
        case 'en-route':
            return { color: 'var(--amber)', bg: 'rgba(255,179,0,0.1)', label: 'En Route' };
        case 'on-site':
            return { color: 'var(--green)', bg: 'rgba(0,230,118,0.1)', label: 'On-Site' };
        case 'returning':
            return { color: 'var(--text-secondary)', bg: 'rgba(138,138,138,0.1)', label: 'Returning' };
        default:
            return { color: 'var(--text-secondary)', bg: 'transparent', label: status };
    }
}

function getTypeIcon(type) {
    switch (type) {
        case 'rescue': return '🚨';
        case 'medical': return '🏥';
        case 'supply': return '📦';
        case 'utility': return '⚡';
        default: return '🔹';
    }
}

export default function LiveDispatch() {
    return (
        <div className="glass p-4 flex flex-col gap-3" id="live-dispatch">
            <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
                Live Dispatch
            </div>

            <div className="flex flex-col gap-2 overflow-y-auto max-h-52 pr-1">
                {dispatchTeams.map(team => {
                    const { color, bg, label } = getStatusStyle(team.status);
                    const progress = team.status === 'on-site'
                        ? 100
                        : Math.round(((team.totalDistanceKm - team.distanceKm) / team.totalDistanceKm) * 100);

                    return (
                        <div
                            key={team.id}
                            className="glass-hover rounded-xl p-3 flex flex-col gap-2 cursor-default"
                            style={{ background: 'var(--bg-card)' }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">{getTypeIcon(team.type)}</span>
                                    <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                                        {team.name}
                                    </span>
                                </div>
                                <span
                                    className="text-[0.6rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                                    style={{ color, background: bg, border: `1px solid ${color}30` }}
                                >
                                    {label}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-[0.65rem]" style={{ color: 'var(--text-secondary)' }}>
                                    → {team.targetZone}
                                </span>
                                <span
                                    className="text-[0.65rem] font-semibold tabular-nums"
                                    style={{ color, fontFamily: "'JetBrains Mono', monospace" }}
                                >
                                    {team.status === 'on-site' ? 'Arrived' : `${team.distanceKm}km away`}
                                </span>
                            </div>

                            <div className="progress-bar">
                                <div
                                    className="fill"
                                    style={{
                                        width: `${progress}%`,
                                        background: `linear-gradient(90deg, ${color}80, ${color})`,
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
