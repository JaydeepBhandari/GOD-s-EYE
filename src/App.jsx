import { useEffect } from 'react';
import MapView from './components/MapView';
import Sidebar from './components/Sidebar';
import SocialFeed from './components/SocialFeed';
import FilterBar from './components/FilterBar';
import CrisisDetailPanel from './components/CrisisDetailPanel';
import DispatchModal from './components/DispatchModal';
import useStore from './store/useStore';
import { useState } from 'react';

export default function App() {
  const simulateFeed = useStore(s => s.simulateFeed);
  const isSimulating = useStore(s => s.isSimulating);
  const selectedNodeId = useStore(s => s.selectedNodeId);
  const showDispatchModal = useStore(s => s.showDispatchModal);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Start simulated feed on mount
  useEffect(() => {
    simulateFeed();
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col" style={{ background: 'var(--bg-midnight)' }}>
      {/* Top Bar */}
      <header
        className="flex items-center justify-between px-5 py-2 shrink-0"
        style={{ borderBottom: '1px solid var(--border-glass)', background: 'rgba(5,5,5,0.8)' }}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
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

      {/* Main Content: 3-column layout */}
      <div className="flex flex-1 min-h-0 relative">
        {/* LEFT: Social Feed Panel */}
        <div className="w-80 shrink-0 border-r" style={{ borderColor: 'var(--border-glass)', background: 'rgba(5,5,5,0.5)' }}>
          <SocialFeed />
        </div>

        {/* CENTER: Map */}
        <div className="flex-1 min-w-0 relative">
          <MapView />
          {/* Crisis Detail Panel overlay */}
          {selectedNodeId && <CrisisDetailPanel />}
        </div>

        {/* RIGHT: Sliding Curtain Sidebar */}
        <div
          className="absolute top-0 right-0 h-full z-[1100] flex transition-transform duration-300 ease-in-out"
          style={{
            transform: sidebarOpen ? 'translateX(0)' : 'translateX(calc(100% - 28px))',
          }}
        >
          {/* Toggle tab */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="self-center -ml-0 shrink-0 w-7 h-20 flex items-center justify-center cursor-pointer transition-all z-10"
            style={{
              background: 'rgba(10,10,10,0.9)',
              backdropFilter: 'blur(12px)',
              border: '1px solid var(--border-glass)',
              borderRight: 'none',
              borderRadius: '8px 0 0 8px',
              color: 'var(--text-secondary)',
            }}
            title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            <svg
              width="14" height="14" viewBox="0 0 16 16" fill="none"
              style={{
                transform: sidebarOpen ? 'rotate(0deg)' : 'rotate(180deg)',
                transition: 'transform 0.3s ease',
              }}
            >
              <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Sidebar content */}
          <div className="w-80 h-full shrink-0">
            <Sidebar />
          </div>
        </div>
      </div>

      {/* Dispatch Modal */}
      {showDispatchModal && <DispatchModal />}
    </div>
  );
}
