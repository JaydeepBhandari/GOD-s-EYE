import { useState } from 'react';
import useStore from '../store/useStore';

const ZONES = ['Adajan', 'Varachha', 'Katargam', 'Athwalines', 'Udhna', 'Rander', 'Vesu', 'Piplod'];

const SUPPLY_ITEMS = [
    'Drinking Water (Tanker)',
    'Food Packets',
    'Medical Kit',
    'Rescue Boat',
    'Generator',
    'Tarpaulin Sheets',
    'Blankets',
    'First Aid Kit',
    'Oxygen Cylinder',
    'Fuel Supply',
];

export default function DispatchModal() {
    const closeDispatchModal = useStore(s => s.closeDispatchModal);
    const addDispatchItem = useStore(s => s.addDispatchItem);

    const [zone, setZone] = useState('');
    const [item, setItem] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [priority, setPriority] = useState('high');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!zone || !item) return;
        addDispatchItem({ zone, item, quantity, priority });
    };

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
            <div className="glass w-96 flex flex-col" style={{ borderRadius: '20px', border: '1px solid var(--border-glass-hover)' }}>
                {/* Header */}
                <div className="flex items-center justify-between p-5 pb-3">
                    <div className="flex items-center gap-2">
                        <span className="text-base">🚛</span>
                        <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>New Dispatch</span>
                    </div>
                    <button
                        onClick={closeDispatchModal}
                        className="w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer transition-all"
                        style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border-glass)' }}
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-5 pb-5">
                    {/* Zone selector */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[0.65rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                            Target Zone
                        </label>
                        <select
                            value={zone}
                            onChange={e => setZone(e.target.value)}
                            required
                            className="px-3 py-2 rounded-xl text-xs outline-none transition-all"
                            style={{
                                background: 'var(--bg-card)',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--border-glass)',
                                fontFamily: "'Inter', sans-serif",
                            }}
                        >
                            <option value="">Select zone...</option>
                            {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
                        </select>
                    </div>

                    {/* Supply item */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[0.65rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                            Supply Item
                        </label>
                        <select
                            value={item}
                            onChange={e => setItem(e.target.value)}
                            required
                            className="px-3 py-2 rounded-xl text-xs outline-none transition-all"
                            style={{
                                background: 'var(--bg-card)',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--border-glass)',
                                fontFamily: "'Inter', sans-serif",
                            }}
                        >
                            <option value="">Select item...</option>
                            {SUPPLY_ITEMS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    {/* Quantity + Priority row */}
                    <div className="flex gap-3">
                        <div className="flex-1 flex flex-col gap-1.5">
                            <label className="text-[0.65rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                                Qty
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="100"
                                value={quantity}
                                onChange={e => setQuantity(parseInt(e.target.value) || 1)}
                                className="px-3 py-2 rounded-xl text-xs outline-none"
                                style={{
                                    background: 'var(--bg-card)',
                                    color: 'var(--text-primary)',
                                    border: '1px solid var(--border-glass)',
                                    fontFamily: "'JetBrains Mono', monospace",
                                }}
                            />
                        </div>
                        <div className="flex-1 flex flex-col gap-1.5">
                            <label className="text-[0.65rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                                Priority
                            </label>
                            <select
                                value={priority}
                                onChange={e => setPriority(e.target.value)}
                                className="px-3 py-2 rounded-xl text-xs outline-none"
                                style={{
                                    background: 'var(--bg-card)',
                                    color: 'var(--text-primary)',
                                    border: '1px solid var(--border-glass)',
                                    fontFamily: "'Inter', sans-serif",
                                }}
                            >
                                <option value="critical">🔴 Critical</option>
                                <option value="high">🟠 High</option>
                                <option value="medium">🟡 Medium</option>
                            </select>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all"
                        style={{
                            background: 'linear-gradient(135deg, var(--cyan), #0099CC)',
                            color: '#fff',
                            border: 'none',
                            boxShadow: '0 4px 15px rgba(0,212,255,0.25)',
                        }}
                    >
                        🚀 Dispatch Now
                    </button>
                </form>
            </div>
        </div>
    );
}
