import { useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import useStore, { getNeedNodes } from '../store/useStore';
import supplyNodes from '../data/supplyNodes';

const SURAT_CENTER = [21.1702, 72.8311];
const SURAT_ZOOM = 12;

const DARK_TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const DARK_TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>';

// ─── Pulse marker icon ───
function createPulseIcon(urgency) {
    return L.divIcon({
        className: '',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        html: `<div class="pulse-marker ${urgency}">
      <div class="ring"></div>
      <div class="ring"></div>
      <div class="core"></div>
    </div>`,
    });
}

// ─── Supply marker icon ───
function createSupplyIcon() {
    return L.divIcon({
        className: '',
        iconSize: [14, 14],
        iconAnchor: [7, 7],
        html: `<div class="supply-marker"></div>`,
    });
}

// ─── Team marker icon ───
function createTeamIcon(type, status) {
    const emoji = type === 'rescue' ? '🚨' : type === 'medical' ? '🚑' : type === 'supply' ? '🚛' : '⚡';
    const ringColor = status === 'on-site' ? '#00E676' : '#FFB300';
    return L.divIcon({
        className: '',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        html: `<div class="team-marker" style="
      width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
      background: rgba(10,10,10,0.85); border-radius: 50%;
      border: 2px solid ${ringColor}; box-shadow: 0 0 10px ${ringColor}40;
      font-size: 14px; cursor: pointer; position: relative;
    ">
      ${emoji}
      <div style="
        position: absolute; bottom: -4px; right: -4px;
        width: 10px; height: 10px; border-radius: 50%;
        background: ${ringColor}; border: 2px solid #050505;
      "></div>
    </div>`,
    });
}

// ─── Component that manages all dynamic markers ───
function MapMarkers() {
    const map = useMap();
    const needMarkersRef = useRef(L.layerGroup());
    const supplyMarkersRef = useRef(L.layerGroup());
    const teamMarkersRef = useRef({});  // keyed by team id for smooth updates

    const posts = useStore(s => s.posts);
    const selectNode = useStore(s => s.selectNode);
    const activeFilter = useStore(s => s.activeFilter);
    const teams = useStore(s => s.teams);

    const needNodes = useMemo(() => getNeedNodes({ posts, activeFilter }), [posts, activeFilter]);

    // Supply markers (static, once)
    useEffect(() => {
        const group = supplyMarkersRef.current;
        group.clearLayers();
        supplyNodes.forEach(node => {
            const marker = L.marker([node.lat, node.lng], { icon: createSupplyIcon() });
            marker.bindPopup(`
        <div style="font-family:'Inter',sans-serif;min-width:160px;">
          <div style="font-weight:600;font-size:0.8rem;margin-bottom:4px;color:#00D4FF;">${node.name}</div>
          <div style="font-size:0.7rem;color:#8A8A8A;">Type: ${node.type.replace('_', ' ')}</div>
          <div style="font-size:0.7rem;color:#8A8A8A;">Capacity: ${node.capacity}</div>
          <div style="font-size:0.7rem;color:#00E676;">Status: ${node.status}</div>
        </div>
      `, { className: 'dark-popup' });
            group.addLayer(marker);
        });
        group.addTo(map);
        return () => { group.clearLayers(); };
    }, [map]);

    // Need-node markers (update with posts/filter)
    useEffect(() => {
        const group = needMarkersRef.current;
        group.clearLayers();
        needNodes.forEach(node => {
            const marker = L.marker([node.lat, node.lng], { icon: createPulseIcon(node.maxUrgency) });
            const urgencyColor = node.maxUrgency === 'critical' ? '#FF3131'
                : node.maxUrgency === 'high' ? '#FF6B6B'
                    : node.maxUrgency === 'medium' ? '#FFB300' : '#00D4FF';
            marker.bindPopup(`
        <div style="font-family:'Inter',sans-serif;min-width:160px;">
          <div style="font-weight:700;font-size:0.85rem;margin-bottom:4px;color:#FF3131;">${node.zone}</div>
          <div style="font-size:0.7rem;color:#8A8A8A;">Urgency: <span style="color:${urgencyColor};font-weight:600;">${node.maxUrgency.toUpperCase()}</span></div>
          <div style="font-size:0.7rem;color:#8A8A8A;">Reports: ${node.posts.length}</div>
          <div style="font-size:0.65rem;margin-top:4px;color:#555;">Click to view feed →</div>
        </div>
      `, { className: 'dark-popup' });
            marker.on('click', () => { selectNode(node.zone); });
            group.addLayer(marker);
        });
        group.addTo(map);
        return () => { group.clearLayers(); };
    }, [needNodes, map, selectNode]);

    // Team markers (update positions smoothly)
    useEffect(() => {
        teams.forEach(team => {
            if (!team.currentPos) return;
            const latLng = [team.currentPos.lat, team.currentPos.lng];
            const statusLabel = team.status === 'on-site' ? '● On-Site' : `${team.distanceKm}km away`;
            const statusColor = team.status === 'on-site' ? '#00E676' : '#FFB300';

            if (teamMarkersRef.current[team.id]) {
                // Update existing marker position (smooth)
                teamMarkersRef.current[team.id].setLatLng(latLng);
                teamMarkersRef.current[team.id].setIcon(createTeamIcon(team.type, team.status));
                teamMarkersRef.current[team.id].setPopupContent(`
          <div style="font-family:'Inter',sans-serif;min-width:180px;">
            <div style="font-weight:700;font-size:0.85rem;margin-bottom:4px;color:${statusColor};">${team.name}</div>
            <div style="font-size:0.7rem;color:#8A8A8A;">Type: ${team.type}</div>
            <div style="font-size:0.7rem;color:#8A8A8A;">Target: <span style="color:#F0F0F0;font-weight:500;">${team.targetZone}</span></div>
            <div style="font-size:0.7rem;color:${statusColor};font-weight:600;">${statusLabel}</div>
          </div>
        `);
            } else {
                // Create new marker
                const marker = L.marker(latLng, { icon: createTeamIcon(team.type, team.status), zIndexOffset: 1000 });
                marker.bindPopup(`
          <div style="font-family:'Inter',sans-serif;min-width:180px;">
            <div style="font-weight:700;font-size:0.85rem;margin-bottom:4px;color:${statusColor};">${team.name}</div>
            <div style="font-size:0.7rem;color:#8A8A8A;">Type: ${team.type}</div>
            <div style="font-size:0.7rem;color:#8A8A8A;">Target: <span style="color:#F0F0F0;font-weight:500;">${team.targetZone}</span></div>
            <div style="font-size:0.7rem;color:${statusColor};font-weight:600;">${statusLabel}</div>
          </div>
        `, { className: 'dark-popup' });
                marker.addTo(map);
                teamMarkersRef.current[team.id] = marker;
            }
        });
    }, [teams, map]);

    return null;
}

// ─── Main MapView ───
export default function MapView() {
    return (
        <div className="relative w-full h-full" id="map-container">
            <MapContainer
                center={SURAT_CENTER}
                zoom={SURAT_ZOOM}
                zoomControl={true}
                style={{ width: '100%', height: '100%', background: '#050505' }}
                attributionControl={true}
            >
                <TileLayer url={DARK_TILE_URL} attribution={DARK_TILE_ATTR} />
                <MapMarkers />
            </MapContainer>

            {/* Edge gradient */}
            <div
                className="absolute inset-0 pointer-events-none z-[1000]"
                style={{
                    background: `
            linear-gradient(to right, rgba(5,5,5,0.4) 0%, transparent 6%, transparent 94%, rgba(5,5,5,0.4) 100%),
            linear-gradient(to bottom, rgba(5,5,5,0.3) 0%, transparent 5%, transparent 95%, rgba(5,5,5,0.3) 100%)
          `,
                }}
            />

            {/* Legend */}
            <div
                className="absolute bottom-4 left-4 glass px-4 py-3 flex flex-col gap-2 z-[1000]"
                style={{ borderRadius: '12px' }}
            >
                <div className="text-[0.6rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    Legend
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--pulse-red)', boxShadow: '0 0 6px var(--pulse-red)' }} />
                    <span className="text-[0.65rem]" style={{ color: 'var(--text-secondary)' }}>Need Zone (Urgent)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--amber)', boxShadow: '0 0 6px var(--amber)' }} />
                    <span className="text-[0.65rem]" style={{ color: 'var(--text-secondary)' }}>Need Zone (Medium)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--cyan)', boxShadow: '0 0 6px var(--cyan)' }} />
                    <span className="text-[0.65rem]" style={{ color: 'var(--text-secondary)' }}>Supply Node</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[0.5rem]" style={{ background: 'rgba(10,10,10,0.85)', border: '2px solid var(--amber)', boxShadow: '0 0 6px rgba(255,179,0,0.3)' }}>🚨</div>
                    <span className="text-[0.65rem]" style={{ color: 'var(--text-secondary)' }}>Dispatch Team</span>
                </div>
            </div>
        </div>
    );
}
