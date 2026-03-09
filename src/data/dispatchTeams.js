// Dispatch Teams — Active NGO / Rescue teams
// Each team has an origin (base) and target zone with coordinates

// Zone center coordinates for computing positions
export const ZONE_COORDS = {
    Adajan: { lat: 21.1860, lng: 72.7933 },
    Varachha: { lat: 21.2070, lng: 72.8610 },
    Katargam: { lat: 21.2210, lng: 72.8340 },
    Athwalines: { lat: 21.1785, lng: 72.8120 },
    Udhna: { lat: 21.1635, lng: 72.8405 },
    Rander: { lat: 21.2015, lng: 72.7810 },
    Vesu: { lat: 21.1530, lng: 72.7720 },
    Piplod: { lat: 21.1480, lng: 72.7770 },
};

// Origin bases (fire stations, hospitals, depots)
const ORIGINS = {
    'NDRF_Base': { lat: 21.1960, lng: 72.8190 },
    'RedCross': { lat: 21.1880, lng: 72.7950 },
    'FireStation': { lat: 21.1950, lng: 72.8100 },
    'SMIMER': { lat: 21.1710, lng: 72.8310 },
    'LionsClub': { lat: 21.1550, lng: 72.7740 },
    'Rotary': { lat: 21.2020, lng: 72.7800 },
    'PowerGrid': { lat: 21.1800, lng: 72.8100 },
};

const dispatchTeams = [
    {
        id: "team-001",
        name: "NDRF Alpha",
        status: "en-route",
        distanceKm: 1.8,
        totalDistanceKm: 5.2,
        targetZone: "Varachha",
        type: "rescue",
        origin: ORIGINS.NDRF_Base,
    },
    {
        id: "team-002",
        name: "Red Cross Bravo",
        status: "on-site",
        distanceKm: 0,
        totalDistanceKm: 3.4,
        targetZone: "Adajan",
        type: "medical",
        origin: ORIGINS.RedCross,
    },
    {
        id: "team-003",
        name: "Fire Squad Charlie",
        status: "en-route",
        distanceKm: 2.1,
        totalDistanceKm: 4.0,
        targetZone: "Rander",
        type: "rescue",
        origin: ORIGINS.FireStation,
    },
    {
        id: "team-004",
        name: "SMIMER Med-Evac",
        status: "en-route",
        distanceKm: 3.5,
        totalDistanceKm: 6.0,
        targetZone: "Udhna",
        type: "medical",
        origin: ORIGINS.SMIMER,
    },
    {
        id: "team-005",
        name: "Lions Relief Delta",
        status: "returning",
        distanceKm: 4.2,
        totalDistanceKm: 4.2,
        targetZone: "Katargam",
        type: "supply",
        origin: ORIGINS.LionsClub,
    },
    {
        id: "team-006",
        name: "Rotary Water Unit",
        status: "on-site",
        distanceKm: 0,
        totalDistanceKm: 2.8,
        targetZone: "Vesu",
        type: "supply",
        origin: ORIGINS.Rotary,
    },
    {
        id: "team-007",
        name: "Power Restore Crew",
        status: "en-route",
        distanceKm: 0.5,
        totalDistanceKm: 1.2,
        targetZone: "Athwalines",
        type: "utility",
        origin: ORIGINS.PowerGrid,
    },
    {
        id: "team-008",
        name: "NDRF Echo",
        status: "en-route",
        distanceKm: 4.0,
        totalDistanceKm: 7.5,
        targetZone: "Piplod",
        type: "rescue",
        origin: ORIGINS.NDRF_Base,
    },
];

export default dispatchTeams;
