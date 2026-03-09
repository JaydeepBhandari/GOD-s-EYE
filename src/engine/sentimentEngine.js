// Sentiment Engine — keyword-weighting urgency analysis
// Analyses social feed text to determine urgency levels

const URGENT_KEYWORDS = [
    'trapped', 'flooding', 'flood', 'sos', 'medical', 'emergency',
    'urgent', 'critical', 'stranded', 'help', 'rescue', 'danger',
    'dangerous', 'risk', 'stuck', 'drowning', 'collapse', 'dying',
    'evacuat', 'submerged', 'snapped', 'leak', 'failing', 'worsening',
];

const STABLE_KEYWORDS = [
    'safe', 'restored', 'arrived', 'distributed', 'stabiliz',
    'improving', 'cleared', 'under control', 'all clear', 'completed',
    'operational', 'evacuated', 'good news', 'no danger', 'no immediate',
    'thank you', 'setting up', 'dispatched', 'deployed',
];

/**
 * Analyse a single post's text to determine urgency score and level
 * @param {string} text — The post text
 * @returns {{ score: number, urgency: 'critical'|'high'|'medium'|'stable' }}
 */
export function analysePost(text) {
    const lower = text.toLowerCase();
    let score = 0;

    for (const keyword of URGENT_KEYWORDS) {
        if (lower.includes(keyword)) {
            score += 3;
        }
    }

    for (const keyword of STABLE_KEYWORDS) {
        if (lower.includes(keyword)) {
            score -= 2;
        }
    }

    let urgency;
    if (score >= 7) urgency = 'critical';
    else if (score >= 4) urgency = 'high';
    else if (score >= 1) urgency = 'medium';
    else urgency = 'stable';

    return { score, urgency };
}

/**
 * Analyse all posts for a given zone
 * @param {Array} posts — Posts belonging to a single zone
 * @returns {{ avgScore: number, urgencyLevel: string, postCount: number }}
 */
export function analyseZone(posts) {
    if (!posts.length) return { avgScore: 0, urgencyLevel: 'stable', postCount: 0 };

    const total = posts.reduce((sum, p) => {
        const { score } = analysePost(p.text);
        return sum + score;
    }, 0);

    const avgScore = total / posts.length;

    let urgencyLevel;
    if (avgScore >= 6) urgencyLevel = 'critical';
    else if (avgScore >= 3) urgencyLevel = 'high';
    else if (avgScore >= 1) urgencyLevel = 'medium';
    else urgencyLevel = 'stable';

    return { avgScore: Math.round(avgScore * 10) / 10, urgencyLevel, postCount: posts.length };
}

/**
 * Compute the Global Urgency Index (1-100) from all posts
 * @param {Array} allPosts — All social feed posts
 * @returns {number} Index 1-100
 */
export function computeGlobalUrgency(allPosts) {
    if (!allPosts.length) return 1;

    const zones = {};
    for (const post of allPosts) {
        if (!zones[post.zone]) zones[post.zone] = [];
        zones[post.zone].push(post);
    }

    const zoneScores = Object.values(zones).map(posts => analyseZone(posts).avgScore);
    const maxPossible = 15; // rough max avg score per zone
    const avg = zoneScores.reduce((a, b) => a + b, 0) / zoneScores.length;
    const index = Math.min(100, Math.max(1, Math.round((avg / maxPossible) * 100)));

    return index;
}

/**
 * Compute resource fulfillment percentage for a zone (inverse of urgency)
 * @param {Array} posts — Posts belonging to a zone
 * @returns {number} Percentage 0-100
 */
export function computeFulfillment(posts) {
    const { avgScore } = analyseZone(posts);
    const maxScore = 15;
    const fulfillment = Math.max(0, Math.min(100, Math.round(100 - (avgScore / maxScore) * 100)));
    return fulfillment;
}
