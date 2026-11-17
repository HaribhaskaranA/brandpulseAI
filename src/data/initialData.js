// Initial demo state for BrandPulse AI
// Grounded in Acme Cloud Brand Book v2.1

export const INITIAL_BRAND_KIT = {
  id: "brand-kit-acme-v2",
  name: "Acme Cloud Brand Book v2.1",
  version: "2.1",
  lastUpdated: "2026-10-15",
  approvedColors: [
    { name: "Primary Deep Navy", hex: "#0F172A", role: "Headers, Primary Text" },
    { name: "Brand Forest Emerald", hex: "#059669", role: "Primary Accents, Positive States" },
    { name: "Slate Canvas", hex: "#F8FAFC", role: "Surface Background" },
    { name: "Border Slate", hex: "#E2E8F0", role: "Dividers, Card Borders" },
    { name: "Accent Blue", hex: "#2563EB", role: "Interactive Links, Informational Focus" }
  ],
  toneProfile: {
    archetype: "Authoritative, Empathetic, Precise",
    targetReadingLevel: "Grade 9-11 (Clear B2B Tech)",
    bannedToneMarkers: ["Aggressive superlatives", "Street colloquialisms", "Fear-mongering (FUD)"],
    preferredVoice: "Calm, evidence-based, customer-focused"
  },
  rules: [
    {
      id: "rule-tone-01",
      category: "Tone & Voice",
      title: "Maintain Calm, Professional Authority",
      citation: "Brand Book v2.1 §1.4, Page 6",
      guidelineText: "Content must sound knowledgeable, objective, and measured. Avoid sensationalized slang or aggressive conversational fillers.",
      bannedTerms: ["100% sick", "crazy fast", "demolishes", "crushes", "kills it", "beast mode"],
      severity: "warning",
      active: true,
      exampleCompliantPost: "Enterprise Whitepaper: Modern Cloud Architecture"
    },
    {
      id: "rule-claim-01",
      category: "Fact & Claim Verification",
      title: "No Absolute Uptime or Latency Superlatives",
      citation: "Brand Book v2.1 §3.2, Page 14",
      guidelineText: "Never promise '100% uptime' or 'zero latency'. Official SLA is 99.95% enterprise uptime with sub-100ms API latency.",
      verifiedFact: "Acme Cloud SLA is 99.95% uptime across multi-region deployments with sub-100ms latency.",
      bannedTerms: ["100% uptime", "zero latency", "zero bugs", "foolproof", "infinite scale"],
      severity: "error",
      active: true,
      exampleCompliantPost: "Enterprise Whitepaper: Modern Cloud Architecture"
    },
    {
      id: "rule-claim-02",
      category: "Fact & Claim Verification",
      title: "Unverified Market Superiority Claims",
      citation: "Brand Book v2.1 §4.2, Page 18",
      guidelineText: "Do not claim 'undisputed #1' or '10x faster than every competitor' without citing audited benchmark studies.",
      verifiedFact: "Acme Cloud serves over 10,000 enterprise customers across 42 countries, audited by G2 Enterprise Cloud Index.",
      bannedTerms: ["undisputed #1", "10x faster than everyone", "10x faster than every competitor", "demolishes competitors", "unbeatable"],
      severity: "error",
      active: true,
      exampleCompliantPost: "Global Partner Ecosystem Announcement"
    },
    {
      id: "rule-term-01",
      category: "Terminology",
      title: "Approved Product & Partner Naming",
      citation: "Brand Book v2.1 §2.1, Page 10",
      guidelineText: "Refer to clients as 'Enterprise Partners' or 'Customers'. Do not refer to the platform as 'v1 Engine' or 'Database Tool'. Always use official trademark 'Acme Cloud Platform'.",
      bannedTerms: ["v1 Engine", "Database Tool", "cloud thingy", "clients"],
      severity: "warning",
      active: true,
      exampleCompliantPost: "Global Partner Ecosystem Announcement"
    },
    {
      id: "rule-vis-01",
      category: "Visual Consistency",
      title: "Approved Hex Palette & Logo Padding",
      citation: "Brand Book v2.1 §5.1, Page 24",
      guidelineText: "Marketing assets must use approved primary hex #0F172A and accent #059669. Disallowed accents like neon magenta (#FF0055) are strictly prohibited.",
      bannedTerms: ["#FF0055", "#FF0000", "neon green"],
      severity: "error",
      active: true,
      exampleCompliantPost: "Enterprise Whitepaper: Modern Cloud Architecture"
    },
    {
      id: "rule-a11y-01",
      category: "Accessibility",
      title: "WCAG 2.1 AA Minimum Contrast Ratio",
      citation: "Brand Book v2.1 §5.4, Page 29",
      guidelineText: "All text-on-background graphics must achieve at least 4.5:1 contrast ratio for normal body copy and 3.0:1 for large display headers.",
      bannedTerms: [],
      severity: "warning",
      active: true,
      exampleCompliantPost: "Enterprise Whitepaper: Modern Cloud Architecture"
    }
  ]
};

// Creator Profile & Performance Card
export const INITIAL_CREATOR_PROFILE = {
  id: "creator-001",
  name: "Creative Strategist & Copy Lead",
  role: "Senior Copywriter & Campaign Strategist",
  department: "Enterprise Brand & Growth Marketing",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  overallRating: 4.9,
  totalReviews: 24,
  complianceRate: 95.2,
  approvalSpeed: "1.4h avg",
  totalDraftsAudited: 48,
  totalApproved: 44,
  badges: [
    { id: "b1", title: "Brand Voice Guardian", level: "Gold", description: "Top 5% tone consistency across all social and doc channels" },
    { id: "b2", title: "WCAG Contrast Certified", level: "Platinum", description: "100% compliant text-over-image contrast ratios" },
    { id: "b3", title: "Fact-Check Champion", level: "Silver", description: "Zero unverified superlatives in Q3 & Q4 publications" }
  ],
  ratingsHistory: [
    {
      id: "rate-1",
      reviewer: "Editorial Review Desk",
      role: "Leader",
      rating: 5,
      date: "2026-11-17",
      postTitle: "Enterprise Whitepaper: Modern Cloud Architecture",
      comment: "Exceptional adherence to Acme Cloud SLA specifications (§3.2). Nuanced, measured tone.",
      tag: "Exceeds Standard"
    },
    {
      id: "rate-2",
      reviewer: "Brand Policy Authority",
      role: "Manager",
      rating: 5,
      date: "2026-11-15",
      postTitle: "Global Partner Ecosystem Announcement",
      comment: "Flawless partner terminology usage. Brand hex codes and logo margins fully verified.",
      tag: "Brand-Certified"
    },
    {
      id: "rate-3",
      reviewer: "Editorial Review Desk",
      role: "Leader",
      rating: 4,
      date: "2026-11-12",
      postTitle: "Q3 High-Throughput Engine Launch",
      comment: "Good technical precision; quickly resolved initial superlative flag via Gemini 1-click fix.",
      tag: "Compliant"
    }
  ],
  performanceTrend: [
    { period: "Aug", score: 82, drafts: 7 },
    { period: "Sep", score: 87, drafts: 12 },
    { period: "Oct", score: 92, drafts: 16 },
    { period: "Nov", score: 96, drafts: 19 }
  ]
};

// Initial Demo Posts (Private Drafts + Multi-Review Ready)
export const INITIAL_POSTS = [
  {
    id: "creator-post-001",
    title: "Q4 Launch Campaign Creative",
    channel: "Social Post",
    author: "Content Creator",
    submittedAt: "2026-11-17T10:30:00Z",
    status: "Private Draft",
    visibility: "private",
    content: "Our 100% sick cloud engine guarantees 10x faster speeds than every competitor! Acme Cloud completely demolishes old legacy databases with guaranteed 100% uptime and zero latency anywhere in the world. Switch now to the undisputed #1 platform.",
    bannerUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",
    bannerName: "acme-q4-cloud-hero.jpg",
    hasImage: true,
    hasImageContrastIssue: true,
    lastAudit: null,
    history: [
      {
        id: "hist-1",
        timestamp: "2026-11-17T10:15:00Z",
        type: "creation",
        author: "Content Creator",
        note: "Draft created in Creator Studio (Private Workspace)"
      }
    ],
    comments: []
  },
  {
    id: "review-doc-001",
    title: "Enterprise Whitepaper: Modern Cloud Architecture",
    channel: "Document Draft",
    author: "Content Creator",
    submittedAt: "2026-11-17T09:00:00Z",
    status: "Approved",
    visibility: "leader_review",
    content: "Modern enterprise data platforms require verifiable fault-tolerance and predictable latency. Acme Cloud delivers 99.95% uptime SLA across 42 global regions, enabling teams to scale without operational bottlenecks. Over 10,000 enterprise partners trust our verified cloud infrastructure for mission-critical analytics.",
    bannerUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
    bannerName: "data-pipeline-whitepaper-cover.png",
    hasImage: true,
    hasImageContrastIssue: false,
    lastAudit: {
      overallScore: 92,
      summary: "High brand alignment. Clear authoritative tone with verified 99.95% SLA figures and approved partner terminology.",
      categories: [
        { name: "Tone & Voice", score: 95, status: "good" },
        { name: "Terminology", score: 94, status: "good" },
        { name: "Fact & Claim Verification", score: 96, status: "good" },
        { name: "Visual Consistency", score: 90, status: "good" },
        { name: "Accessibility", score: 88, status: "good" }
      ],
      positives: [
        "Uses official 99.95% uptime SLA directly matching Fact Sheet v2.1 §3.2.",
        "Correctly uses approved term 'enterprise partners' instead of deprecated client terminology.",
        "Calm, evidence-backed tone matches executive whitepaper standards."
      ],
      negatives: [],
      timestamp: "2026-11-17T09:10:00Z"
    },
    history: [
      {
        id: "hist-201",
        timestamp: "2026-11-17T08:30:00Z",
        type: "creation",
        author: "Content Creator",
        note: "Whitepaper drafted"
      },
      {
        id: "hist-202",
        timestamp: "2026-11-17T09:00:00Z",
        type: "submission",
        author: "Content Creator",
        note: "Submitted for peer leadership review (Score: 92/100)"
      },
      {
        id: "hist-203",
        timestamp: "2026-11-17T09:35:00Z",
        type: "approval",
        author: "Editorial Leader",
        note: "Formally approved for publication with 5-star rating (Exceeds Standard)."
      }
    ],
    comments: [
      {
        id: "comm-201",
        author: "Editorial Leader",
        role: "Leader",
        timestamp: "2026-11-17T09:30:00Z",
        text: "Clean, authoritative tone. Ready for publication clearance."
      }
    ],
    reviewRating: 5,
    reviewAssessment: "Exceeds Standard",
    reviewComment: "Exemplary brand book adherence. Official SLA data quoted flawlessly."
  },
  {
    id: "review-both-002",
    title: "Global Partner Ecosystem Announcement",
    channel: "Social Post",
    author: "Content Creator",
    submittedAt: "2026-11-17T11:45:00Z",
    status: "Needs Review",
    visibility: "both", // Sent to BOTH Leader & Manager simultaneously!
    content: "Acme Cloud Platform is proud to welcome over 200 new enterprise partners across APAC and EMEA. Delivering verified 99.95% SLA availability, our infrastructure empowers scalable enterprise transformation. Explore verified customer benchmarks today.",
    bannerUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80",
    bannerName: "partner-ecosystem-2026.png",
    hasImage: true,
    hasImageContrastIssue: false,
    lastAudit: {
      overallScore: 96,
      summary: "Flawless brand compliance. Strict partner terminology, verified uptime metrics, and compliant visual palette.",
      categories: [
        { name: "Tone & Voice", score: 98, status: "good" },
        { name: "Terminology", score: 97, status: "good" },
        { name: "Fact & Claim Verification", score: 95, status: "good" },
        { name: "Visual Consistency", score: 96, status: "good" },
        { name: "Accessibility", score: 94, status: "good" }
      ],
      positives: [
        "Uses official brand trademark 'Acme Cloud Platform' (§2.1).",
        "Adheres strictly to 'Enterprise Partners' terminology.",
        "Verified 99.95% SLA SLA metrics adhere to Fact Sheet v2.1."
      ],
      negatives: [],
      timestamp: "2026-11-17T11:50:00Z"
    },
    history: [
      {
        id: "hist-301",
        timestamp: "2026-11-17T11:40:00Z",
        type: "creation",
        author: "Content Creator",
        note: "Drafted partner announcement"
      },
      {
        id: "hist-302",
        timestamp: "2026-11-17T11:45:00Z",
        type: "submission",
        author: "Content Creator",
        note: "Submitted simultaneously to BOTH Leader & Manager Review Desks"
      }
    ],
    comments: []
  }
];

export const INITIAL_CREATOR_DRAFT = INITIAL_POSTS[0];
export const INITIAL_LEADER_REVIEWS = [INITIAL_POSTS[1], INITIAL_POSTS[2]];

// Manager Governance & Analytics Infographics Data
export const INITIAL_ANALYTICS = {
  stats: {
    totalAuditsCount: 1420,
    averageTurnaroundHours: 1.8,
    turnaroundReductionPercent: 52,
    offBrandLeaksPrevented: 312,
    activeTeamCreators: 46,
    companyBrandHealthScore: 94
  },
  trend30Days: [
    { day: "Day 1", score: 81, leaks: 14 },
    { day: "Day 5", score: 84, leaks: 10 },
    { day: "Day 10", score: 87, leaks: 8 },
    { day: "Day 15", score: 89, leaks: 6 },
    { day: "Day 20", score: 92, leaks: 4 },
    { day: "Day 25", score: 93, leaks: 3 },
    { day: "Day 30", score: 96, leaks: 1 }
  ],
  recurringViolations: [
    { category: "Fact & Claim Verification", rule: "Unsupported Superlatives ('Fastest / #1')", count: 48, percentage: 42, severity: "error" },
    { category: "Terminology", rule: "Deprecated Product Naming ('v1 Engine' / 'Clients')", count: 34, percentage: 38, severity: "warning" },
    { category: "Visual Consistency", rule: "Off-Palette Accent Colors (#FF0055 Neon)", count: 26, percentage: 24, severity: "error" },
    { category: "Tone & Voice", rule: "Overly Casual Colloquialisms ('Sick' / 'Demolishes')", count: 21, percentage: 19, severity: "warning" },
    { category: "Accessibility", rule: "Sub-4.5:1 Text Contrast in Social Ads", count: 18, percentage: 16, severity: "warning" }
  ],
  creatorLeaderboard: [
    { name: "Creator Studio (Active)", role: "Campaign Strategist", score: 95.2, published: 44, rating: 4.9, status: "Top Performer" },
    { name: "Technical Writing Team", role: "Documentation Specialist", score: 93.8, published: 38, rating: 4.8, status: "Certified" },
    { name: "Growth Marketing Pod", role: "Paid Acquisition Lead", score: 88.4, published: 29, rating: 4.6, status: "Active" },
    { name: "Social Content Desk", role: "Community Drafter", score: 84.1, published: 22, rating: 4.4, status: "Coaching Needed" }
  ]
};
