import useStore from '../store/useStore';

const FILTERS = [
    { key: 'all', label: 'All', icon: '🌐' },
    { key: 'water', label: 'Water', icon: '💧' },
    { key: 'medical', label: 'Medical', icon: '🏥' },
    { key: 'power', label: 'Power', icon: '⚡' },
];

export default function FilterBar() {
    const activeFilter = useStore(s => s.activeFilter);
    const setFilter = useStore(s => s.setFilter);

    return (
        <div className="flex items-center gap-2" id="filter-bar">
            {FILTERS.map(f => {
                const isActive = activeFilter === f.key;
                return (
                    <button
                        key={f.key}
                        onClick={() => setFilter(f.key)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer border"
                        style={{
                            background: isActive ? 'rgba(0,212,255,0.12)' : 'var(--bg-card)',
                            color: isActive ? 'var(--cyan)' : 'var(--text-secondary)',
                            borderColor: isActive ? 'rgba(0,212,255,0.3)' : 'var(--border-glass)',
                            boxShadow: isActive ? '0 0 12px rgba(0,212,255,0.15)' : 'none',
                        }}
                    >
                        <span>{f.icon}</span>
                        <span>{f.label}</span>
                    </button>
                );
            })}
        </div>
    );
}
