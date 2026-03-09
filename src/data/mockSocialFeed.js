// Mock Social Feed — Surat Emergency Response Data
// Each post simulates a social-media report from a zone in Surat

const mockSocialFeed = [
    // ─── ADAJAN ───
    {
        id: "post-001",
        text: "SOS! Water level rising rapidly near Adajan BRTS stop. Families trapped on rooftops. Need immediate rescue boats! #SuratFloods",
        zone: "Adajan",
        category: "water",
        lat: 21.1860,
        lng: 72.7933,
        timestamp: "2026-03-09T08:12:00+05:30",
        author: "Rajesh_Surat21"
    },
    {
        id: "post-002",
        text: "Medical emergency in Adajan Gam! Elderly person needs oxygen supply urgently. Roads blocked by floodwater. #SuratRelief",
        zone: "Adajan",
        category: "medical",
        lat: 21.1892,
        lng: 72.7910,
        timestamp: "2026-03-09T08:25:00+05:30",
        author: "DrPreethi_Aid"
    },
    {
        id: "post-003",
        text: "Food arrived at Adajan community hall. Distribution underway. 200 packets given out so far. Thank you @SuratMC!",
        zone: "Adajan",
        category: "water",
        lat: 21.1845,
        lng: 72.7960,
        timestamp: "2026-03-09T09:05:00+05:30",
        author: "VolunteerSurat"
    },

    // ─── VARACHHA ───
    {
        id: "post-004",
        text: "URGENT: Flooding in Varachha main road! Power lines down, risk of electrocution. People evacuating on foot. #EmergencySurat",
        zone: "Varachha",
        category: "power",
        lat: 21.2092,
        lng: 72.8630,
        timestamp: "2026-03-09T07:45:00+05:30",
        author: "VarachhaNews"
    },
    {
        id: "post-005",
        text: "Trapped inside our apartment in Varachha Zone 3. Water entering from basement. 15 families stuck. SOS send help now!",
        zone: "Varachha",
        category: "water",
        lat: 21.2041,
        lng: 72.8590,
        timestamp: "2026-03-09T08:02:00+05:30",
        author: "HelpVarachha"
    },
    {
        id: "post-006",
        text: "Water restored in Varachha block D after 36 hours. Tankers supplied by NGO. Situation stabilizing slowly.",
        zone: "Varachha",
        category: "water",
        lat: 21.2070,
        lng: 72.8610,
        timestamp: "2026-03-09T09:30:00+05:30",
        author: "SafeVarachha"
    },

    // ─── KATARGAM ───
    {
        id: "post-007",
        text: "Critical medical situation at Katargam bridge area. Child with high fever, no ambulance available. Need medical team ASAP!",
        zone: "Katargam",
        category: "medical",
        lat: 21.2210,
        lng: 72.8340,
        timestamp: "2026-03-09T07:30:00+05:30",
        author: "KatargamHelp"
    },
    {
        id: "post-008",
        text: "Flooding near Katargam GIDC area. Factory workers stranded, requesting rescue. Estimated 50+ people. #SuratSOS",
        zone: "Katargam",
        category: "water",
        lat: 21.2185,
        lng: 72.8380,
        timestamp: "2026-03-09T08:40:00+05:30",
        author: "IndustrySurat"
    },
    {
        id: "post-009",
        text: "Relief camp set up near Katargam garden. Safe shelter available for 300 people. Food and water available.",
        zone: "Katargam",
        category: "water",
        lat: 21.2230,
        lng: 72.8310,
        timestamp: "2026-03-09T09:15:00+05:30",
        author: "SuratMC_Relief"
    },

    // ─── ATHWALINES ───
    {
        id: "post-010",
        text: "Power outage across entire Athwalines area since last night. Hospitals running on generators. Need power supply urgently!",
        zone: "Athwalines",
        category: "power",
        lat: 21.1785,
        lng: 72.8120,
        timestamp: "2026-03-09T06:50:00+05:30",
        author: "AthwaResident"
    },
    {
        id: "post-011",
        text: "Medical camp at Athwa church providing free medicines and first aid. Walk-ins welcome. Doctors available until 8 PM.",
        zone: "Athwalines",
        category: "medical",
        lat: 21.1770,
        lng: 72.8150,
        timestamp: "2026-03-09T08:00:00+05:30",
        author: "DrSuratAid"
    },
    {
        id: "post-012",
        text: "Situation safe in Athwalines south block. No flooding, power restored. All families accounted for.",
        zone: "Athwalines",
        category: "power",
        lat: 21.1800,
        lng: 72.8100,
        timestamp: "2026-03-09T10:00:00+05:30",
        author: "AthwaUpdate"
    },

    // ─── UDHNA ───
    {
        id: "post-013",
        text: "SOS from Udhna Darwaja! Massive flooding, people trapped in ground floor homes. Water level 5 feet and rising!",
        zone: "Udhna",
        category: "water",
        lat: 21.1625,
        lng: 72.8405,
        timestamp: "2026-03-09T07:15:00+05:30",
        author: "UdhnaSOS"
    },
    {
        id: "post-014",
        text: "Medical emergency at Udhna railway station. Pregnant woman needs immediate hospital transfer. All roads blocked by flooding!",
        zone: "Udhna",
        category: "medical",
        lat: 21.1650,
        lng: 72.8430,
        timestamp: "2026-03-09T08:55:00+05:30",
        author: "RailwayHelp"
    },
    {
        id: "post-015",
        text: "Update from Udhna: NDRF team has arrived. Rescue operations started. 40 people evacuated so far from low-lying areas.",
        zone: "Udhna",
        category: "water",
        lat: 21.1640,
        lng: 72.8415,
        timestamp: "2026-03-09T09:45:00+05:30",
        author: "NDRFSurat"
    },

    // ─── RANDER ───
    {
        id: "post-016",
        text: "Rander bridge submerged! No way to cross Tapi river. Hundreds stranded on both sides. Need urgent airlift or boats! #SuratEmergency",
        zone: "Rander",
        category: "water",
        lat: 21.2015,
        lng: 72.7810,
        timestamp: "2026-03-09T07:00:00+05:30",
        author: "RanderAlert"
    },
    {
        id: "post-017",
        text: "Power lines snapped in Rander area 4. Sparks visible near waterlogged streets. Extremely dangerous! Stay away! #PowerDown",
        zone: "Rander",
        category: "power",
        lat: 21.1990,
        lng: 72.7840,
        timestamp: "2026-03-09T08:10:00+05:30",
        author: "RanderSafety"
    },
    {
        id: "post-018",
        text: "Good news from Rander: Food distribution completed for 500 families. Clean water tanker stationed near mosque. Situation improving.",
        zone: "Rander",
        category: "water",
        lat: 21.2030,
        lng: 72.7825,
        timestamp: "2026-03-09T10:20:00+05:30",
        author: "NGORander"
    },

    // ─── VESU ───
    {
        id: "post-019",
        text: "Medical supplies running critically low at Vesu health centre. Need insulin, bandages, and antibiotics. Can anyone help? #VersuMedical",
        zone: "Vesu",
        category: "medical",
        lat: 21.1520,
        lng: 72.7710,
        timestamp: "2026-03-09T08:35:00+05:30",
        author: "VesuHealth"
    },
    {
        id: "post-020",
        text: "Minor waterlogging in Vesu VIP road area. Municipal pumps active. Expected to clear by noon. No immediate danger.",
        zone: "Vesu",
        category: "water",
        lat: 21.1540,
        lng: 72.7730,
        timestamp: "2026-03-09T09:10:00+05:30",
        author: "VesuMC"
    },

    // ─── PIPLOD ───
    {
        id: "post-021",
        text: "URGENT: Gas leak reported near Piplod VIP road junction. Area being evacuated. Fire brigade en route. Stay indoors!",
        zone: "Piplod",
        category: "power",
        lat: 21.1480,
        lng: 72.7770,
        timestamp: "2026-03-09T07:55:00+05:30",
        author: "PiplodAlert"
    },
    {
        id: "post-022",
        text: "Situation under control in Piplod. Gas leak sealed. Fire brigade confirming area safe. Evacuation order will be lifted soon.",
        zone: "Piplod",
        category: "power",
        lat: 21.1490,
        lng: 72.7760,
        timestamp: "2026-03-09T09:40:00+05:30",
        author: "FireBrigadeSurat"
    },

    // ─── Additional high-urgency posts ───
    {
        id: "post-023",
        text: "HELP! My grandmother is trapped on the second floor in Varachha. Water has reached first floor. She is diabetic. SOS!",
        zone: "Varachha",
        category: "medical",
        lat: 21.2055,
        lng: 72.8575,
        timestamp: "2026-03-09T08:50:00+05:30",
        author: "DesperatePlea"
    },
    {
        id: "post-024",
        text: "Massive power failure in Katargam industrial zone. Backup systems failing. Medical equipment at risk in nearby clinic!",
        zone: "Katargam",
        category: "power",
        lat: 21.2200,
        lng: 72.8360,
        timestamp: "2026-03-09T09:00:00+05:30",
        author: "KatargamIndustry"
    },
    {
        id: "post-025",
        text: "UPDATE: All residents of Adajan Patiya safely evacuated. Red Cross team on ground. Medical check-up ongoing. #SafeNow",
        zone: "Adajan",
        category: "medical",
        lat: 21.1870,
        lng: 72.7945,
        timestamp: "2026-03-09T10:10:00+05:30",
        author: "RedCrossSurat"
    },
    {
        id: "post-026",
        text: "Flooding worsening in Udhna. SOS! Children stuck in school building. Teachers calling for immediate rescue!",
        zone: "Udhna",
        category: "water",
        lat: 21.1635,
        lng: 72.8420,
        timestamp: "2026-03-09T09:20:00+05:30",
        author: "UdhnaTeachers"
    },
    {
        id: "post-027",
        text: "Rander zone 2 completely dark. Need emergency power supply for the community hospital. Critical patients at risk!",
        zone: "Rander",
        category: "power",
        lat: 21.2000,
        lng: 72.7830,
        timestamp: "2026-03-09T08:45:00+05:30",
        author: "RanderHospital"
    },
    {
        id: "post-028",
        text: "Water tankers deployed to Vesu. Clean drinking water available at VIP Circle distribution point. Pass the word!",
        zone: "Vesu",
        category: "water",
        lat: 21.1530,
        lng: 72.7720,
        timestamp: "2026-03-09T09:50:00+05:30",
        author: "SuratRelief"
    },
    {
        id: "post-029",
        text: "Medical team from SMIMER hospital dispatched to Piplod for emergency cases. Mobile clinic setting up near TP-13.",
        zone: "Piplod",
        category: "medical",
        lat: 21.1475,
        lng: 72.7780,
        timestamp: "2026-03-09T10:05:00+05:30",
        author: "SMIMERSurat"
    },
    {
        id: "post-030",
        text: "All clear in Athwalines! Power fully restored, roads draining. Thank you to all volunteers and first responders!",
        zone: "Athwalines",
        category: "power",
        lat: 21.1790,
        lng: 72.8130,
        timestamp: "2026-03-09T10:25:00+05:30",
        author: "AthwaAllClear"
    },
];

export default mockSocialFeed;
