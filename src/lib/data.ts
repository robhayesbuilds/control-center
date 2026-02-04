// Control Center Data
// This file contains all project and research data for the dashboard

export interface Project {
  id: string;
  name: string;
  description: string;
  status: "active" | "planning" | "paused" | "completed";
  progress: number;
  metrics: {
    label: string;
    value: string;
  }[];
  nextActions: string[];
  links: {
    label: string;
    url: string;
  }[];
  updatedAt: string;
}

export interface ResearchItem {
  id: string;
  title: string;
  score: number;
  validation: string;
  marketSize: string;
  timeToRevenue: string;
  status: "recommended" | "consider" | "parked";
}

export interface AgentActivity {
  id: string;
  agent: string;
  action: string;
  timestamp: string;
  status: "completed" | "in-progress" | "blocked";
}

export interface QuickLink {
  label: string;
  url: string;
  icon: string;
}

// Project Data
export const projects: Project[] = [
  {
    id: "factursimple",
    name: "FacturSimple",
    description: "Simple e-invoicing SaaS for French auto-entrepreneurs. Sept 2026 compliance deadline creates urgency.",
    status: "active",
    progress: 75,
    metrics: [
      { label: "SEO Articles", value: "13" },
      { label: "Content Days Ahead", value: "14" },
      { label: "Free Tools Built", value: "4" },
      { label: "Deployment", value: "Pending" },
    ],
    nextActions: [
      "Deploy to Vercel (need Yassine to import repo)",
      "Start French community engagement",
      "Collect waitlist signups",
      "Build invoice generator MVP",
    ],
    links: [
      { label: "GitHub", url: "https://github.com/robhayesbuilds/factursimple" },
      { label: "Local Dev", url: "http://localhost:3000" },
    ],
    updatedAt: "2026-02-04T20:15:00Z",
  },
  {
    id: "reelfolio",
    name: "ReelFolio",
    description: "Transforms screenshots into animated video reels. Tech: Remotion + AWS Lambda.",
    status: "paused",
    progress: 40,
    metrics: [
      { label: "Signups", value: "60+" },
      { label: "Paid Users", value: "2" },
      { label: "Conversion", value: "~3%" },
    ],
    nextActions: [
      "Analyze conversion problem",
      "Explore AI-powered video generation",
      "Marketing improvements",
    ],
    links: [],
    updatedAt: "2026-02-01T00:00:00Z",
  },
  {
    id: "zaanix",
    name: "Zaanix.studio",
    description: "Agency targeting service companies (accounting firms).",
    status: "paused",
    progress: 20,
    metrics: [
      { label: "Clients in Target", value: "0" },
      { label: "Current Work", value: "Upwork" },
    ],
    nextActions: [
      "Reposition or find new target vertical",
      "Focus on product income instead",
    ],
    links: [],
    updatedAt: "2026-02-01T00:00:00Z",
  },
];

// Research Rankings (from MASTER-RANKING.md)
export const researchRankings: ResearchItem[] = [
  {
    id: "doc-collection",
    title: "Document Collection for Accountants",
    score: 9.5,
    validation: "4 independent agents found this",
    marketSize: "85,000+ US accounting firms",
    timeToRevenue: "2-3 months",
    status: "consider",
  },
  {
    id: "french-einvoicing",
    title: "French E-Invoicing Compliance",
    score: 9.0,
    validation: "Government mandate",
    marketSize: "4M micro-entreprises in France",
    timeToRevenue: "3-4 months",
    status: "recommended",
  },
  {
    id: "client-feedback",
    title: "Client Feedback/Approval for Freelancers",
    score: 8.5,
    validation: "3 agents converged",
    marketSize: "70M+ freelancers in US",
    timeToRevenue: "2-3 months",
    status: "consider",
  },
  {
    id: "church-giving",
    title: "Church Giving Platform (Low Fees)",
    score: 8.0,
    validation: "Clear pain, competitor rev-share exposed",
    marketSize: "300,000+ US churches",
    timeToRevenue: "3-4 months",
    status: "consider",
  },
  {
    id: "ai-humanization",
    title: "AI Content Humanization",
    score: 7.5,
    validation: "Writer lost $42K client",
    marketSize: "Millions of content creators",
    timeToRevenue: "2-3 months",
    status: "parked",
  },
  {
    id: "b2b-leads",
    title: "B2B Lead Research (Pay-Per-Lead)",
    score: 7.5,
    validation: "159K+ Freelancer reviews",
    marketSize: "Huge B2B market",
    timeToRevenue: "3-4 months",
    status: "parked",
  },
];

// Agent Activities (from today's log)
export const agentActivities: AgentActivity[] = [
  {
    id: "1",
    agent: "Content Agent",
    action: "Wrote 13 SEO articles (14 days ahead of schedule)",
    timestamp: "2026-02-04T07:14:00Z",
    status: "completed",
  },
  {
    id: "2",
    agent: "Product Agent",
    action: "Built 4 free tools: invoice, quote, checklist, penalty calculator",
    timestamp: "2026-02-04T20:10:00Z",
    status: "completed",
  },
  {
    id: "3",
    agent: "Research Agent",
    action: "Completed competitor analysis (Pennylane, Tiime, Henrri, etc.)",
    timestamp: "2026-02-04T03:31:00Z",
    status: "completed",
  },
  {
    id: "4",
    agent: "Marketing Agent",
    action: "Identified French communities (Reddit, Discord, Facebook, LinkedIn)",
    timestamp: "2026-02-04T03:30:00Z",
    status: "completed",
  },
  {
    id: "5",
    agent: "Outreach Agent",
    action: "Found podcast opportunities (PAE, La Voix du Freelance)",
    timestamp: "2026-02-04T19:02:00Z",
    status: "completed",
  },
  {
    id: "6",
    agent: "Marketing Agent",
    action: "Community engagement (blocked - need site deployed)",
    timestamp: "2026-02-04T20:00:00Z",
    status: "blocked",
  },
  {
    id: "7",
    agent: "Reddit Agent",
    action: "Warmup comments - 3 posted, rest blocked (need credentials)",
    timestamp: "2026-02-04T17:00:00Z",
    status: "blocked",
  },
];

// Quick Links
export const quickLinks: QuickLink[] = [
  { label: "FacturSimple GitHub", url: "https://github.com/robhayesbuilds/factursimple", icon: "github" },
  { label: "Workspace", url: "/home/openclaw/.openclaw/workspace", icon: "folder" },
  { label: "Memory Files", url: "/home/openclaw/.openclaw/workspace/memory", icon: "brain" },
  { label: "Research Folder", url: "/home/openclaw/.openclaw/workspace/research", icon: "search" },
  { label: "Vercel Dashboard", url: "https://vercel.com", icon: "cloud" },
  { label: "Rob's X Profile", url: "https://x.com/robhayesbuilds", icon: "twitter" },
  { label: "Reddit Profile", url: "https://reddit.com/u/AccordingTart4877", icon: "message" },
];

// FacturSimple specific data
export const factursimpleStatus = {
  seoArticles: [
    "Guide facture électronique 2026",
    "Comparatif logiciels facturation",
    "FAQ facture électronique",
    "PPF vs PDP",
    "Facturation électronique auto-entrepreneur",
    "Réforme facturation 2026",
    "Logiciel facture micro-entreprise",
    "Mentions légales facture auto-entrepreneur",
    "E-Reporting micro-entreprise",
    "TVA Auto-Entrepreneur 2026",
    "Devis Auto-Entrepreneur",
    "Délais de Paiement Facture",
    "Factur-X Format",
  ],
  freeTools: [
    { name: "Invoice Generator", path: "/generateur-facture", status: "ready" },
    { name: "Quote Generator", path: "/generateur-devis", status: "ready" },
    { name: "2026 Compliance Checklist", path: "/checklist-2026", status: "ready" },
    { name: "Penalty Calculator", path: "/calculateur-penalites", status: "ready" },
  ],
  landingPageFeatures: [
    "Trust badges (Conforme 2026, Données chiffrées)",
    "How it works 3-step section",
    "6 testimonials (French freelancers)",
    "Interactive pricing calculator",
    "Working waitlist form",
    "OpenGraph meta tags",
    "JSON-LD structured data",
  ],
  competitors: [
    { name: "Pennylane", price: "€14-199/mo", weakness: "Too complex, expensive" },
    { name: "Tiime", price: "€0-50/mo", weakness: "Fragmented UX (3 apps)" },
    { name: "Henrri", price: "€0-20/mo", weakness: "Limited features" },
    { name: "Freebe", price: "€6.90/mo", weakness: "Auto-entrepreneurs only" },
    { name: "Indy", price: "€9-22/mo", weakness: "New player" },
    { name: "Abby", price: "€9 HT/mo", weakness: "Limited integrations" },
  ],
  blockers: [
    { issue: "Vercel Deployment", resolution: "Need Yassine to import repo", priority: "high" },
    { issue: "Reddit Credentials", resolution: "Need password for u/AccordingTart4877", priority: "medium" },
    { issue: "X Credentials", resolution: "Need password for @robhayesbuilds", priority: "medium" },
  ],
  frenchCommunities: [
    { name: "r/EntreprendreenFrance", type: "Reddit", members: "~50K" },
    { name: "r/vosfinances", type: "Reddit", members: "~200K" },
    { name: "Mon Auto-Entreprise", type: "Facebook", members: "~100K" },
    { name: "Coup de Pouce Auto-Entrepreneur", type: "Facebook", members: "~50K" },
    { name: "Entrepreneurs Francophones", type: "Discord", members: "~5K" },
  ],
};

// Summary stats
export const summaryStats = {
  totalProjects: projects.length,
  activeProjects: projects.filter(p => p.status === "active").length,
  totalResearchIdeas: researchRankings.length,
  topResearchScore: Math.max(...researchRankings.map(r => r.score)),
  agentActivitiesCompleted: agentActivities.filter(a => a.status === "completed").length,
  agentActivitiesBlocked: agentActivities.filter(a => a.status === "blocked").length,
};
