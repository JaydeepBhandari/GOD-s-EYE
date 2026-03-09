import { create } from 'zustand';
import mockSocialFeed from '../data/mockSocialFeed';
import { analysePost, computeGlobalUrgency } from '../engine/sentimentEngine';

// Enrich posts with urgency data on load
const enrichPost = (post) => {
    const { score, urgency } = analysePost(post.text);
    return { ...post, score, urgency };
};

const initialPosts = mockSocialFeed.slice(0, 15).map(enrichPost);
const remainingPosts = mockSocialFeed.slice(15).map(enrichPost);

const useStore = create((set, get) => ({
    // ─── State ───
    posts: initialPosts,
    globalUrgencyIndex: computeGlobalUrgency(initialPosts),
    activeFilter: 'all', // 'all' | 'water' | 'medical' | 'power'
    selectedNodeId: null,
    feedQueue: remainingPosts,
    isSimulating: false,
    simulationInterval: null,

    // ─── Actions ───
    simulateFeed: () => {
        const state = get();
        if (state.isSimulating) return;

        const interval = setInterval(() => {
            const { feedQueue, posts } = get();
            if (feedQueue.length === 0) {
                clearInterval(get().simulationInterval);
                set({ isSimulating: false, simulationInterval: null });
                return;
            }

            const next = feedQueue[0];
            const newPosts = [next, ...posts];
            const newQueue = feedQueue.slice(1);

            set({
                posts: newPosts,
                feedQueue: newQueue,
                globalUrgencyIndex: computeGlobalUrgency(newPosts),
            });
        }, 3000);

        set({ isSimulating: true, simulationInterval: interval });
    },

    stopSimulation: () => {
        const { simulationInterval } = get();
        if (simulationInterval) clearInterval(simulationInterval);
        set({ isSimulating: false, simulationInterval: null });
    },

    setFilter: (filter) => set({ activeFilter: filter }),

    selectNode: (id) => set({ selectedNodeId: id }),

    clearSelection: () => set({ selectedNodeId: null }),
}));

// ─── Pure selector functions (outside store to avoid getSnapshot issues) ───

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
