import UrgencyIndex from './UrgencyIndex';
import SectorRatios from './SectorRatios';
import LiveDispatch from './LiveDispatch';
import useStore from '../store/useStore';

export default function Sidebar() {
    const globalUrgencyIndex = useStore(s => s.globalUrgencyIndex);

    return (
        <div
            className="h-full flex flex-col gap-2 p-2.5 overflow-y-auto"
            id="sidebar"
            style={{ background: 'rgba(5, 5, 5, 0.6)', borderLeft: '1px solid var(--border-glass)' }}
        >
            {/* Header */}
            <div className="flex items-center gap-2 px-2 py-1">
                <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: 'var(--pulse-red)', boxShadow: '0 0 8px var(--pulse-red)' }}
                />
                <span className="text-xs font-bold tracking-wide" style={{ color: 'var(--text-primary)' }}>
                    GOD'S EYE
                </span>
                <span className="text-[0.5rem]" style={{ color: 'var(--text-muted)' }}>
                    v1.0
                </span>
            </div>

            {/* Widgets */}
            <UrgencyIndex value={globalUrgencyIndex} />
            <SectorRatios />
            <LiveDispatch />
        </div>
    );
}
