import { useEffect } from 'react';
import MapView from './components/MapView';
import Sidebar from './components/Sidebar';
import FilterBar from './components/FilterBar';
import useStore from './store/useStore';

export default function App() {
  const simulateFeed = useStore(s => s.simulateFeed);
  const isSimulating = useStore(s => s.isSimulating);

  // Start simulated feed on mount
  useEffect(() => {
    simulateFeed();
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col" style={{ background: 'var(--bg-midnight)' }}>
      {/* Top Bar */}
      <header
        className="flex items-center justify-between px-5 py-2.5 shrink-0"
        style={{ borderBottom: '1px solid var(--border-glass)', background: 'rgba(5,5,5,0.8)' }}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#FF3131" strokeWidth="1.5" opacity="0.5" />
              <circle cx="12" cy="12" r="6" stroke="#FF3131" strokeWidth="1.5" opacity="0.8" />
              <circle cx="12" cy="12" r="2.5" fill="#FF3131" />
              <line x1="12" y1="0" x2="12" y2="4" stroke="#FF3131" strokeWidth="1" opacity="0.4" />
              <line x1="12" y1="20" x2="12" y2="24" stroke="#FF3131" strokeWidth="1" opacity="0.4" />
              <line x1="0" y1="12" x2="4" y2="12" stroke="#FF3131" strokeWidth="1" opacity="0.4" />
              <line x1="20" y1="12" x2="24" y2="12" stroke="#FF3131" strokeWidth="1" opacity="0.4" />
            </svg>
            <h1 className="text-sm font-bold tracking-wider" style={{ color: 'var(--text-primary)' }}>
              TAPISYS
            </h1>
          </div>
          <span className="text-[0.6rem] tracking-wider" style={{ color: 'var(--text-muted)' }}>
            SURAT EMERGENCY RESPONSE OS
          </span>
        </div>

        <div className="flex items-center gap-4">
          <FilterBar />
          <div className="flex items-center gap-2">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: isSimulating ? 'var(--green)' : 'var(--text-muted)',
                boxShadow: isSimulating ? '0 0 6px var(--green)' : 'none',
              }}
            />
            <span className="text-[0.6rem] font-medium" style={{ color: isSimulating ? 'var(--green)' : 'var(--text-muted)' }}>
              {isSimulating ? 'LIVE' : 'OFFLINE'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 min-h-0">
        {/* Map Area (70%) */}
        <div className="flex-[7] min-w-0">
          <MapView />
        </div>

        {/* Sidebar (30%) */}
        <div className="flex-[3] min-w-0">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
