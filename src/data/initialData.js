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
      active: true
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
      active: true
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
      active: true
    },
    {
      id: "rule-term-01",
      category: "Terminology",
      title: "Approved Product & Partner Naming",
      citation: "Brand Book v2.1 §2.1, Page 10",
      guidelineText: "Refer to clients as 'Enterprise Partners' or 'Customers'. Do not refer to the platform as 'v1 Engine' or 'Database Tool'. Always use official trademark 'Acme Cloud Platform'.",
      bannedTerms: ["v1 Engine", "Database Tool", "cloud thingy", "clients"],
      severity: "warning",
      active: true
    },
    {
      id: "rule-vis-01",
      category: "Visual Consistency",
      title: "Approved Hex Palette & Logo Padding",
      citation: "Brand Book v2.1 §5.1, Page 24",
      guidelineText: "Marketing assets must use approved primary hex #0F172A and accent #059669. Disallowed accents like neon magenta (#FF0055) are strictly prohibited.",
      bannedTerms: ["#FF0055", "#FF0000", "neon green"],
      severity: "error",
      active: true
    },
    {
      id: "rule-a11y-01",
      category: "Accessibility",
      title: "WCAG 2.1 AA Minimum Contrast Ratio",
      citation: "Brand Book v2.1 §5.4, Page 29",
      guidelineText: "All text-on-background graphics must achieve at least 4.5:1 contrast ratio for normal body copy and 3.0:1 for large display headers.",
      severity: "warning",
      active: true
    }
  ]
};

export const INITIAL_DRAFTS = [
  {
    id: "draft-001",
    title: "Q4 Enterprise Launch Social Campaign",
    channel: "Social Post",
    author: "Alex Chen (Content Creator)",
    submittedAt: "2026-11-16T10:30:00Z",
    status: "Draft",
    content: "Our 100% sick cloud engine guarantees 10x faster speeds than every competitor! Acme Cloud completely demolishes old legacy databases with guaranteed 100% uptime and zero latency anywhere in the world. Switch now to the undisputed #1 platform.",
    bannerUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",
    bannerName: "acme-q4-cloud-hero.jpg",
    hasImage: true,
    hasImageContrastIssue: true,
    lastAudit: null,
    history: [
      {
        id: "hist-1",
        timestamp: "2026-11-16T10:15:00Z",
        type: "creation",
        author: "Alex Chen",
        note: "Initial draft composed in Web Studio"
      }
    ],
    comments: [
      {
        id: "comm-1",
        author: "Sarah Jenkins (Leader)",
        role: "Leader",
        timestamp: "2026-11-16T10:45:00Z",
        text: "Alex, looks promising but please check the claims against our Q3 SLA documentation before submitting for sign-off."
      }
    ]
  },
  {
    id: "draft-002",
    title: "Enterprise Whitepaper: Modern Data Pipelines",
    channel: "Document Draft",
    author: "Elena Rostova (Technical Writer)",
    submittedAt: "2026-11-16T09:00:00Z",
    status: "Needs Review",
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
      timestamp: "2026-11-16T09:10:00Z"
    },
    history: [
      {
        id: "hist-201",
        timestamp: "2026-11-16T08:30:00Z",
        type: "creation",
        author: "Elena Rostova",
        note: "Whitepaper summary drafted"
      },
      {
        id: "hist-202",
        timestamp: "2026-11-16T09:00:00Z",
        type: "submission",
        author: "Elena Rostova",
        note: "Submitted draft to Leader queue (Score: 92/100)"
      }
    ],
    comments: [
      {
        id: "comm-201",
        author: "Sarah Jenkins (Leader)",
        role: "Leader",
        timestamp: "2026-11-16T09:30:00Z",
        text: "Clean, authoritative tone. Ready for final publication approval."
      }
    ]
  }
];

export const INITIAL_ANALYTICS = {
  recurringViolations: [
    { category: "Fact & Claim Verification", rule: "Unsupported Superlatives ('Fastest / #1')", count: 48, percentage: 42, severity: "error" },
    { category: "Terminology", rule: "Deprecated Product Naming ('v1 Engine' / 'Clients')", count: 34, percentage: 38, severity: "warning" },
    { category: "Visual Consistency", rule: "Off-Palette Accent Colors (#FF0055 Neon)", count: 26, percentage: 24, severity: "error" },
    { category: "Tone & Voice", rule: "Overly Casual Colloquialisms ('Sick' / 'Demolishes')", count: 21, percentage: 19, severity: "warning" },
    { category: "Accessibility", rule: "Sub-4.5:1 Text Contrast in Social Ads", count: 18, percentage: 16, severity: "warning" }
  ],
  stats: {
    totalAuditsCount: 1420,
    averageTurnaroundHours: 1.8,
    turnaroundReductionPercent: 52,
    offBrandLeaksPrevented: 312,
    activeTeamCreators: 46
  }
};
