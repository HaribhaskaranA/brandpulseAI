# BrandPulse AI — Pre-Publication Brand Governance Platform
**Powered by Google Gemini Multimodal AI**  
**Hackathon Entry:** Inkloom AI Brand-Governance Challenge (Round 1: The Plan)  
**Team Name:** Green Coders  
**Team Members:** Haribhaskaran A (Team Lead), Antonio Danish B, Deepadharshan R, Harish N, Barath Kumar K, Jaswanth Kannan K  
**Institution:** Sri Krishna College of Engineering and Technology, Coimbatore, Tamil Nadu  

---

## Overview
BrandPulse AI is an enterprise-grade pre-publication brand governance platform designed to eliminate brand drift across distributed teams, external marketing agencies, and generative AI tools. 

Instead of acting as a rigid blocker or failing silently, BrandPulse AI functions as an **explainable brand copilot** that audits copy, documents, and creative banners against Manager-approved brand guidelines using Google Gemini with strict RAG grounding.

---

## Key Features & Architecture

### 1. Zero Login Wall (Judge-Ready)
- Loads directly into the working workspace without blocking email/password screens.
- **1-Click Role Switcher** at the top:
  - **Content Creator (Alex Chen):** Drafts multi-format copy, attaches creative banners, runs sub-5s Gemini pre-flight checks, and applies 1-click suggested rewrites.
  - **Leader (Sarah Jenkins):** Inspects the shared Brand Evaluation Report, leaves inline comments, tracks revision diffs, and grants formal digital sign-off.
  - **Manager (Marcus Vance):** Uploads & approves new guidelines in the Brand Vault, and analyzes recurring violation heatmaps across teams.

### 2. Live Google Gemini API + Intelligent Local Fallback Engine
- Dedicated `src/services/geminiAudit.js` module.
- Supports live Google Gemini API (`gemini-2.0-flash` / `gemini-1.5-flash`) with structured JSON output.
- Features an intelligent, deterministic local rule-matching engine so the demo operates **100% offline out-of-the-box** without requiring an API key.
- Optional API Key modal allows judges or developers to input their own Gemini key anytime.

### 3. Five Core Audit Categories
1. **Tone & Voice:** Brand archetype matching (Authoritative, Calm, Empathetic).
2. **Terminology:** Approved product trademarks vs. deprecated/banned terms.
3. **Fact & Claim Verification:** Cross-checks performance metrics against verified facts (flags unbacked superlatives like "10x faster" or "100% uptime").
4. **Visual Consistency:** Logo clear-space and official brand hex palettes (`#0F172A`, `#059669`).
5. **Accessibility (WCAG 2.1 AA):** Text-over-image contrast ratio verification (minimum 4.5:1).

### 4. 3-Part Brand Evaluation Report
- **Part 1: Overall Compliance Guide:** High-level readiness index (e.g., `86/100`) and executive summary.
- **Part 2: Positives (Strengths):** Highlights compliant copy and accessible elements to sustain creative morale.
- **Part 3: Negatives & Explainable Fixes:** Flags exact violations, cites the source guideline section (`Brand Book v2.1 §4.2, Page 18`), and provides a **1-Click Apply Fix** button that replaces text in real time.

---

## Quick Start

```bash
# 1. Navigate to project directory
cd "C:\Users\HARIBHASKARAN A\.gemini\antigravity\scratch\brandpulse-ai"

# 2. Install dependencies (already completed)
npm install

# 3. Start development server
npm run dev

# 4. Open in your browser
http://127.0.0.1:5173/
```

---

## Tech Stack
- **Frontend:** React 18 (Vite), Tailwind CSS v4, Lucide React icons
- **State Management:** React Hooks + LocalStorage synchronization
- **AI Engine:** Google Gemini API (`gemini-2.0-flash`) + Local Grounded Rule Engine
- **Design System:** Swiss Minimalist SaaS (`#FAFAFA` / `#F8FAFC` canvas, `#0F172A` navy headers, `#059669` forest emerald accents)
