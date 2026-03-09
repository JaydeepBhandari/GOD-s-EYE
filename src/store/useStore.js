import { create } from 'zustand';
import mockSocialFeed from '../data/mockSocialFeed';
import dispatchTeamsData, { ZONE_COORDS } from '../data/dispatchTeams';
import { analysePost, computeGlobalUrgency } from '../engine/sentimentEngine';

// Enrich posts with urgency data
const enrichPost = (post) => {
    const { score, urgency } = analysePost(post.text);
    return { ...post, score, urgency };
};

const initialPosts = mockSocialFeed.slice(0, 15).map(enrichPost);
const remainingPosts = mockSocialFeed.slice(15).map(enrichPost);

// Compute interpolated lat/lng for a team based on progress
function computeTeamPosition(team) {
    const target = ZONE_COORDS[team.targetZone];
    if (!target || !team.origin) return target || { lat: 21.17, lng: 72.83 };

    if (team.status === 'on-site') return { lat: target.lat, lng: target.lng };

    const progress = 1 - (team.distanceKm / team.totalDistanceKm);
    return {
        lat: team.origin.lat + (target.lat - team.origin.lat) * progress,
        lng: team.origin.lng + (target.lng - team.origin.lng) * progress,
    };
}

const useStore = create((set, get) => ({
    // ─── State ───
    posts: initialPosts,
    globalUrgencyIndex: computeGlobalUrgency(initialPosts),
    activeFilter: 'all',
    selectedNodeId: null,
    feedQueue: remainingPosts,
    isSimulating: false,
    simulationInterval: null,
    showDispatchModal: false,
    dispatchItems: [],
    // Teams state (centralized for map + sidebar)
    teams: dispatchTeamsData.map(t => ({
        ...t,
        currentPos: computeTeamPosition(t),
    })),
    teamSimInterval: null,

    // ─── Actions ───
    simulateFeed: () => {
        const state = get();
        if (state.isSimulating) return;

        const feedInterval = setInterval(() => {
            const { feedQueue, posts } = get();
            if (feedQueue.length === 0) {
                clearInterval(get().simulationInterval);
                set({ isSimulating: false, simulationInterval: null });
                return;
            }
            const next = feedQueue[0];
            const newPosts = [next, ...posts];
            set({
                posts: newPosts,
                feedQueue: feedQueue.slice(1),
                globalUrgencyIndex: computeGlobalUrgency(newPosts),
            });
        }, 3000);

        // Team movement simulation
        const teamInterval = setInterval(() => {
            set(state => ({
                teams: state.teams.map(team => {
                    if (team.status === 'on-site' || team.status === 'returning') return team;
                    const newDist = Math.max(0, team.distanceKm - (Math.random() * 0.3 + 0.05));
                    const updated = newDist <= 0.1
                        ? { ...team, distanceKm: 0, status: 'on-site' }
                        : { ...team, distanceKm: Math.round(newDist * 10) / 10 };
                    return { ...updated, currentPos: computeTeamPosition(updated) };
                }),
            }));
        }, 2500);

        set({ isSimulating: true, simulationInterval: feedInterval, teamSimInterval: teamInterval });
    },

    stopSimulation: () => {
        const { simulationInterval, teamSimInterval } = get();
        if (simulationInterval) clearInterval(simulationInterval);
        if (teamSimInterval) clearInterval(teamSimInterval);
        set({ isSimulating: false, simulationInterval: null, teamSimInterval: null });
    },

    setFilter: (filter) => set({ activeFilter: filter }),
    selectNode: (id) => set({ selectedNodeId: id }),
    clearSelection: () => set({ selectedNodeId: null }),
    openDispatchModal: () => set({ showDispatchModal: true }),
    closeDispatchModal: () => set({ showDispatchModal: false }),

    addDispatchItem: (item) => set(s => ({
        dispatchItems: [...s.dispatchItems, { ...item, id: `dispatch-${Date.now()}`, timestamp: new Date().toISOString() }],
        showDispatchModal: false,
    })),
}));

// ─── Pure selector functions ───

export function getFilteredPosts(state) {
    const { posts, activeFilter } = state;
    if (activeFilter === 'all') return posts;
    return posts.filter(p => p.category === activeFilter);
}

export function getPostsByZone(state) {
    const { posts } = state;
    const zones = {};
    for (const post of posts) {
        if (!zones[post.zone]) zones[post.zone] = [];
        zones[post.zone].push(post);
    }
    return zones;
}

export function getNeedNodes(state) {
    const { posts, activeFilter } = state;
    const zones = {};
    for (const post of posts) {
        if (activeFilter !== 'all' && post.category !== activeFilter) continue;
        if (!zones[post.zone]) {
            zones[post.zone] = {
                id: post.zone,
                zone: post.zone,
                lat: post.lat,
                lng: post.lng,
                posts: [],
                maxUrgency: 'stable',
                maxScore: 0,
            };
        }
        zones[post.zone].posts.push(post);
        if (post.score > zones[post.zone].maxScore) {
            zones[post.zone].maxScore = post.score;
            zones[post.zone].maxUrgency = post.urgency;
        }
    }
    return Object.values(zones);
}

export default useStore;
