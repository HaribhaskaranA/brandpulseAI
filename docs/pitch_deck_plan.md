# BrandPulse AI — 14-Slide Presentation Blueprint (Round 1: The Plan)
**Hackathon:** Inkloom AI Brand-Governance Challenge  
**Team Name:** Green Coders  
**Team Lead:** Haribhaskaran A  
**Team Members:** Antonio Danish B, Deepadharshan R, Harish N, Barath Kumar K, Jaswanth Kannan K  
**Institution:** Sri Krishna College of Engineering and Technology, Coimbatore, Tamil Nadu  
**Aesthetic Style:** Human-Crafted Minimalist (Figma / Keynote Style)  
**Palette:** Crisp Off-White Canvas (`#FAFAFA`), Deep Charcoal Ink (`#111827`), Muted Slate Body (`#4B5563`), Forest-Emerald Accent (`#059669`), 1px Structural Dividers (`#E5E7EB`)  
**Format:** 16:9 Widescreen Presentation (14 Slides)

---

## Slide-by-Slide Content & Blueprint

### Slide 1: Minimal Cover Page (Strictly Blank Canvas with Metadata Only)
* **Design:** Pure clean off-white background with zero illustrations, badges, or extra taglines. Generous whitespace and left-aligned typography.
* **Content:**
  - **Category Eyebrow:** `INKLOOM AI BRAND-GOVERNANCE CHALLENGE  •  ROUND 1: THE PLAN`
  - **Product Name:** **BrandPulse AI**
  - **Subtitle:** Pre-Publication Brand Governance Platform Powered by Google Gemini
  - **Thin Divider Line (`#E5E7EB`)**
  - **Team Name:** Green Coders
  - **Team Members:** Haribhaskaran A (Team Lead), Antonio Danish B, Deepadharshan R, Harish N, Barath Kumar K, Jaswanth Kannan K
  - **College:** Sri Krishna College of Engineering and Technology
  - **Location:** Coimbatore, Tamil Nadu

---

### Slide 2: 01 — Understanding of the Problem Statement
* **Headline:** **Scaling Content Without Governance Breaks Brand Trust**
* **Context:** Growing organizations publish daily across internal teams, external agencies, and generative AI tools—leading to rapid brand drift before anyone notices.
* **Three Core Failure Modes:**
  1. **Off-Tone Messaging:** Decentralized writers default to casual colloquialisms or aggressive hyper-promotional jargon (*e.g., "Our sick new AI crushes competitors!"* contradicts a calm, authoritative persona).
  2. **Unsupported Claims:** Drafts incorporate unverified superlatives, outdated pricing, or unbacked performance statistics (*e.g., "Guaranteed #1 fastest app with 100% uptime"* creates severe legal liability).
  3. **Visual/Accessibility Mismatches:** Social creatives apply off-palette hex colors, unapproved logo margins, or illegible text contrast ratios (*e.g., Contrast ratio 2.9:1 fails WCAG 2.1 AA*).
* **What We Solve:** Replaces slow, subjective 48–72 hour manual reviews with an automated, pre-publication brand copilot grounded in official company guidelines.

---

### Slide 3: 02 — Users Affected by the Problem & Research Validation
* **Headline:** **Three Organizational Roles Impacted by Brand Drift**
* **Clean 3-Column Breakdown:**
  - **Manager (Governance Authority):** Struggles to enforce updated brand books across distributed teams and lacks visibility into recurring guideline violations.
  - **Leader (Team Reviewer):** Spends hours manually cross-checking drafts against PDFs across scattered emails and Slack threads; lacks an objective rubric.
  - **Content Creator (Drafter):** Faces unclear, buried guidelines and frustrating late-stage rejections without actionable explanations.
* **Research Evidence Callout ($N = 60+$):**
  > Survey & interviews across college media clubs, student startups, and freelance marketers revealed that **over 70% of revision cycles** stem from ambiguous rules and delayed feedback loops.

---

### Slide 4: 03 — Proposed Solution & Value Proposition
* **Headline:** **An Explainable Brand Copilot—Not a Rigid Blocker**
* **Solution Thesis:** BrandPulse AI (powered by Google Gemini) audits content against Manager-approved rules before publication and generates a transparent Brand Evaluation Report shared across Content Creator, Leader, and Manager.
* **3-Part Report Structure:**
  1. **Overall Compliance Guide:** Readiness score (e.g., `86/100`) and clear action summary.
  2. **Positives (Strengths):** Highlights copy, terminology, and visuals that already meet brand standards, sustaining creator morale.
  3. **Negatives & Explainable Fixes:** Explains *why* an issue was flagged, cites the exact rule/page from the Manager's uploaded document (*e.g., "Brand Book §4.2, p. 18"*), and offers intent-preserving rewrites without auto-overriding human control.

---

### Slide 5: 04 — Complete End-to-End Product Workflow
* **Headline:** **Five-Stage Role-Based Review & Approval Workflow**
* **Horizontal Step Flow:**
  1. **Rule Setup (Manager):** Manager uploads brand guidelines (PDF), verified facts, terminology lists, and brand hex palettes into Supabase Storage & `pgvector`.
  2. **Multi-Format Drafting (Content Creator):** Creator writes copy or uploads `.docx` files and marketing banners in the Web Studio.
  3. **Pre-Flight AI Audit (Google Gemini):** System evaluates 5 categories, generating color-coded health graphs and exact rule citations in sub-5 seconds.
  4. **Collaborative Review (Creator, Leader & Manager):** Creator applies 1-click fixes; Leader & Manager inspect the shared report, add inline comments, and view revision diffs.
  5. **Formal Sign-Off (Leader / Manager):** Authorized reviewer approves the asset for publication, logging a timestamped, brand-certified audit trail.

---

### Slide 6: 05 — Main Features & Visual Content Health Graphs
* **Headline:** **Multi-Format Auditing, Color-Coded Graphs & Governance Insights**
* **Left Column — Core Capabilities:**
  - **5 Specific Audit Categories:** Tone & Voice (archetype match), Terminology (banned/approved terms), Fact & Claim Verification, Visual Consistency (logo/colors via Gemini Vision), and Accessibility (WCAG text contrast).
  - **Multi-Format Support:** Seamlessly scans raw plain text, rich blog drafts, `.docx` documents, and image banners.
  - **Manager Governance Insights:** Tracks repeated mistakes across teams (e.g., *"38% of drafts flagged for outdated product naming"*), highlighting unclear guidelines.
  - **Mandatory AI Disclosure:** Displays an explicit *"Evaluated by Google Gemini AI"* badge on every report.
* **Right Column — Visual Health Chart Mockup:**
  - **Tone & Voice:** `92%` 🟩 **Green (Good)**
  - **Terminology:** `88%` 🟩 **Green (Good)**
  - **Accessibility (WCAG):** `65%` 🟨 **Amber (Needs Fix)**
  - **Claims & Facts:** `40%` 🟥 **Red (Flagged with Rule Citation)**
  - *Citation Snippet:* `[Brand Book §3.4, Page 22]` — *"Claim '10x faster response time than all peers' unsupported in verified fact sheet."*

---

### Slide 7: 06 — Technology Stack & System Architecture
* **Headline:** **Grounded Multimodal Architecture Powered by Google Gemini**
* **Custom AI Architecture Diagram:** Flat-vector architectural block diagram illustrating the full horizontal data flow:
  $$\text{Manager Brand Vault \& Creator Web Studio} \longrightarrow \text{FastAPI Orchestrator} \longrightarrow \begin{matrix} \text{Supabase pgvector (RAG)} \\ \text{Google Gemini Multimodal API} \end{matrix} \longrightarrow \text{Shared Brand Evaluation Report}$$
* **Stack Rationale (3 Tiers):**
  - **Frontend:** React (Vite) + Tailwind CSS + Recharts on Vercel Global Edge for sub-100ms multi-role UI responsiveness.
  - **Backend:** Python (FastAPI) with `pypdf`, `python-docx`, and `Pillow` for deterministic document parsing and pixel-level WCAG contrast calculations.
  - **AI & Database:** Google Gemini API + Supabase PostgreSQL (`pgvector` & Row-Level Security) for strict tenant privacy and zero-hallucination rule retrieval.

---

### Slide 8: 07 — Key Technical Challenge & Architectural Solution
* **Headline:** **Solving AI Hallucinations & Multi-Format Precision**
* **The Challenge:** Preventing LLMs from inventing fake brand rules ("hallucinating") while accurately auditing both nuanced text claims and exact visual pixel metrics across mixed file formats.
* **Our Architectural Solution:**
  1. **Strict Clause-Level RAG:** Brand books are chunked with metadata (Document Title, Section, Page Number) in `pgvector`. Gemini is strictly constrained to cite retrieved chunks verbatim or output *"No Supporting Fact Found."*
  2. **Hybrid Deterministic + Multimodal Pipeline:** Python (`Pillow`) computes exact mathematical WCAG contrast ratios and hex distances, while Gemini Vision evaluates layout hierarchy and logo clear-space.
  3. **Explainable Evidence Linking:** Every negative flag explicitly surfaces the source document quote and suggested rewrite without auto-overriding human authority.

---

### Slide 9: 08 — Responsible Design, Privacy & Human Oversight
* **Headline:** **Enterprise Confidentiality with Transparent Human Control**
* **3 Core Pillars:**
  1. **Confidentiality & Data Isolation:** Workspace-level Row-Level Security (RLS) isolates unpublished drafts and proprietary brand guidelines per organization; encrypted at rest (AES-256) and in transit (TLS 1.3); zero customer training on Gemini enterprise endpoints.
  2. **Human-in-the-Loop Guarantee:** AI never auto-edits or auto-publishes; Creators, Leaders, and Managers retain 100% override and approval authority.
  3. **Explicit AI Transparency:** Every audit card clearly discloses Google Gemini usage and separates AI suggestions from human reviewer comments in the revision history.

---

### Slide 10: 09 — Team Responsibilities & Individual Contributions
* **Headline:** **Clear Ownership Across Six Engineering Roles**
* **Team Allocation Table:**
  | Team Member | Role | Individual Responsibilities & Deliverables |
  | :--- | :--- | :--- |
  | **Haribhaskaran A** | **Team Lead & AI/RAG** | System architecture, FastAPI backend orchestration, and Google Gemini RAG citation pipeline. |
  | **Antonio Danish B** | **Frontend Architect** | React (Vite) frontend architecture, role-based portals (Manager, Leader, Creator), and review UI. |
  | **Deepadharshan R** | **Data Viz & Analytics Lead** | Recharts data visualizations, color-coded content health graphs, and Manager governance analytics dashboard. |
  | **Harish N** | **Document & Backend Lead** | Multi-format document ingestion (`pypdf`, `python-docx`), text chunking, and revision diff tracking. |
  | **Barath Kumar K** | **Computer Vision Lead** | Computer vision module (`Pillow` + Gemini Vision) for brand hex palette, logo clear-space, and WCAG contrast checks. |
  | **Jaswanth Kannan K** | **Database & Security Lead** | Supabase authentication, Role-Based Access Control (RBAC), `pgvector` indexing, and RLS security policies. |

---

### Slide 11: 10 — Development Plan Across All Three Rounds
* **Headline:** **Phased Execution Roadmap (Plan → Build → Finish)**
* **3-Stage Timeline:**
  - **Round 1 — The Plan (Current):** Finalize problem research ($N = 60+$ survey), 3-role workflow design, hybrid RAG + Vision architecture, and submission documentation.
  - **Round 2 — The Build (Core MVP):** Implement RBAC login (Manager, Leader, Creator), PDF guideline upload & `pgvector` indexing, Gemini text + image audit with exact citations, color-coded health graphs, and comment/approval workflow.
  - **Round 3 — The Finish (3 Key Improvements & Polish):** Deliver (1) `.docx` tracked-changes export, (2) visual pixel-level contrast/hex heatmap overlay on images, and (3) Manager recurring-mistake analytics dashboard + stress-test benchmarks.

---

### Slide 12: 11 — Expected Impact & Post-Event Future Scope
* **Headline:** **Measurable Organizational Impact & Long-Term Vision**
* **Top Half — Expected Impact:**
  - ⚡ **50%+ Faster Review Cycles:** Cuts brand approval turnaround from 48 hours to under 2 hours via instant pre-flight checks.
  - 🛡️ **Zero Off-Brand Leaks:** Catches unverified promotional claims and visual errors before public release.
  - 🎯 **100% Explainable Governance:** Eliminates subjective feedback with exact rule citations.
* **Bottom Half — Post-Event Future Scope:**
  - **Browser & Design Plugins:** Real-time Chrome extension for Google Docs/CMS editors and a Figma plugin for designers.
  - **ChatOps Approvals:** Slack and Microsoft Teams bots allowing Leaders to review summaries and approve drafts in one click.
  - **Enterprise Integrations:** Multi-language brand voice enforcement and SSO/SAML support for global agencies.

---

### Slide 13: 12 — Complete Team & Participant Details
* **Headline:** **Team Green Coders — Official Roster**
* **Official Roster Table:**
  | S.No | Full Name | Role & Deliverables | Institution & Location |
  | :---: | :--- | :--- | :--- |
  | **01** | **Haribhaskaran A** | Team Lead & Backend / AI Architect | Sri Krishna College of Engg & Tech, Coimbatore |
  | **02** | **Antonio Danish B** | Frontend & Workflow Engineer | Sri Krishna College of Engg & Tech, Coimbatore |
  | **03** | **Deepadharshan R** | Data Visualization & Analytics Lead | Sri Krishna College of Engg & Tech, Coimbatore |
  | **04** | **Harish N** | Document Processing & API Engineer | Sri Krishna College of Engg & Tech, Coimbatore |
  | **05** | **Barath Kumar K** | Computer Vision & Accessibility Engineer | Sri Krishna College of Engg & Tech, Coimbatore |
  | **06** | **Jaswanth Kannan K** | Database, Auth & Security Engineer | Sri Krishna College of Engg & Tech, Coimbatore |

---

### Slide 14: Thank You Page
* **Design:** Minimal closing canvas matching Slide 1 (pure clean off-white canvas `#FAFAFA`).
* **Centered Typographic Block:**
  - **Title:** Thank You
  - **Subtitle:** BrandPulse AI — Team Green Coders
  - **Institution:** Sri Krishna College of Engineering and Technology, Coimbatore
  - **Footer:** Inkloom AI Brand-Governance Challenge • Round 1: The Plan
