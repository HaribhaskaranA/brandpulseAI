import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  BorderStyle,
  WidthType,
  Packer
} from "docx";
import { saveAs } from "file-saver";

/**
 * Helper: create a simple bold cell for table headers
 */
function headerCell(text) {
  return new TableCell({
    shading: { fill: "1E293B" },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" },
      left: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" },
      right: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" },
    },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text,
            bold: true,
            color: "FFFFFF",
            size: 18,
          }),
        ],
      }),
    ],
  });
}

/**
 * Helper: create a data cell
 */
function dataCell(text, highlight = false) {
  return new TableCell({
    shading: highlight ? { fill: "FFF3CD" } : { fill: "F8FAFC" },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: "CBD5E1" },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "CBD5E1" },
      left: { style: BorderStyle.SINGLE, size: 1, color: "CBD5E1" },
      right: { style: BorderStyle.SINGLE, size: 1, color: "CBD5E1" },
    },
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: text || "—",
            size: 18,
            color: "1E293B",
          }),
        ],
      }),
    ],
  });
}

/**
 * Build inline annotated paragraphs for draft content.
 * Segments matching violation flaggedText are highlighted in yellow/amber.
 */
function buildAnnotatedContent(content, violations) {
  if (!content) return [];

  const flaggedPhrases = (violations || [])
    .map((v) => (v.flaggedText || v.citedText || "").trim())
    .filter((txt) => txt.length > 0);

  if (!flaggedPhrases.length) {
    return [
      new Paragraph({
        children: [new TextRun({ text: content, size: 20 })],
        spacing: { after: 100 },
      }),
    ];
  }

  // Build a regex that splits on flagged phrases
  const escaped = flaggedPhrases.map((p) =>
    p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );
  const pattern = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = content.split(pattern);

  const runs = parts.map((part) => {
    const isFlagged = flaggedPhrases.some(
      (fp) => fp.toLowerCase() === part.toLowerCase()
    );
    if (isFlagged) {
      return new TextRun({
        text: part,
        highlight: "yellow",
        color: "92400E",
        bold: true,
        size: 20,
      });
    }
    return new TextRun({ text: part, size: 20 });
  });

  return [new Paragraph({ children: runs, spacing: { after: 100 } })];
}

/**
 * Main export function.
 * @param {object} draft - The draft object (title, content, channel, etc.)
 * @param {object} audit - The audit result object
 * @param {string} [leaderComment] - Optional leader review comment
 */
export async function exportAuditDocx(draft, audit, leaderComment) {
  const title = draft?.title || "Untitled Draft";
  const score = audit?.overallScore ?? "N/A";
  const scoreColor = score >= 80 ? "065F46" : score >= 60 ? "92400E" : "991B1B";
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const rawViolations = audit?.negatives || audit?.violations || [];
  const violations = Array.isArray(rawViolations) ? rawViolations : [];

  // ── SECTION 1: Title & Score Header ──────────────────────────────────
  const titleParagraph = new Paragraph({
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: "BrandPulse AI — Audit Report",
        bold: true,
        size: 36,
        color: "0F172A",
      }),
    ],
    spacing: { after: 120 },
  });

  const docTitleParagraph = new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: title,
        bold: true,
        size: 28,
        color: "1E293B",
        italics: true,
      }),
    ],
    spacing: { after: 100 },
  });

  const scoreBadge = new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: `Brand Compliance Score: ${score}/100`,
        bold: true,
        size: 26,
        color: scoreColor,
      }),
    ],
    spacing: { after: 80 },
  });

  const disclosureParagraph = new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: "Evaluated by Google Gemini AI  •  For internal brand governance use only  •  Human review required before publication",
        size: 16,
        color: "64748B",
        italics: true,
      }),
    ],
    spacing: { after: 240 },
  });

  // ── SECTION 2: Draft Metadata ─────────────────────────────────────────
  const metaHeading = new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text: "Draft Metadata", bold: true, size: 24, color: "0F172A" })],
    spacing: { before: 200, after: 100 },
  });

  const metaLines = [
    `Channel: ${draft?.channel || "N/A"}`,
    `Author: ${draft?.author || "Creator"}`,
    `Audit Date: ${dateStr}`,
    `Audit Model: ${audit?.model || "Google Gemini AI"}`,
    ...(leaderComment ? [`Leader Comment: ${leaderComment}`] : []),
  ];

  const metaParagraphs = metaLines.map(
    (line) =>
      new Paragraph({
        children: [new TextRun({ text: line, size: 18, color: "475569" })],
        spacing: { after: 60 },
      })
  );

  // ── SECTION 3: Draft Content (Annotated) ─────────────────────────────
  const contentHeading = new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [
      new TextRun({ text: "Draft Content (Annotated)", bold: true, size: 24, color: "0F172A" }),
    ],
    spacing: { before: 200, after: 100 },
  });

  const contentNote = new Paragraph({
    children: [
      new TextRun({
        text: "Flagged segments are highlighted in yellow. Review each highlighted phrase against the cited brand book rule.",
        size: 16,
        color: "92400E",
        italics: true,
      }),
    ],
    spacing: { after: 120 },
  });

  const annotatedParagraphs = buildAnnotatedContent(draft?.content, violations);

  // ── SECTION 4: Violations Table ───────────────────────────────────────
  const violationsHeading = new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [
      new TextRun({
        text: `Violations & Explainable Feedback (${violations.length})`,
        bold: true,
        size: 24,
        color: "0F172A",
      }),
    ],
    spacing: { before: 200, after: 100 },
  });

  let tableChildren = [];
  if (violations.length > 0) {
    const headerRow = new TableRow({
      tableHeader: true,
      children: [
        headerCell("Category"),
        headerCell("Cited Rule / Page"),
        headerCell("Why Flagged"),
        headerCell("Suggested Rewrite"),
        headerCell("Reviewer Assessment"),
      ],
    });

    const dataRows = violations.map(
      (v) =>
        new TableRow({
          children: [
            dataCell(v.category || "Brand Governance"),
            dataCell(v.citation || v.rule || "Brand Book v2.1"),
            dataCell(v.reason || v.message || "Flagged against corporate style guidelines"),
            dataCell(v.suggestedRewrite || v.suggestedFix || v.fix || "—", true),
            dataCell(leaderComment || draft?.reviewComment || "Pending Review"),
          ],
        })
    );

    tableChildren = [
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [headerRow, ...dataRows],
      }),
    ];
  } else {
    tableChildren = [
      new Paragraph({
        children: [
          new TextRun({
            text: "✓ No critical violations detected. All brand guidelines passed.",
            size: 20,
            color: "065F46",
            bold: true,
          }),
        ],
        spacing: { after: 100 },
      }),
    ];
  }

  // ── SECTION 5: Footer ─────────────────────────────────────────────────
  const footerDivider = new Paragraph({
    children: [new TextRun({ text: "─".repeat(80), size: 14, color: "CBD5E1" })],
    spacing: { before: 300, after: 100 },
  });

  const footerParagraph = new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: `Generated by BrandPulse AI  •  ${dateStr}  •  Powered by Google Gemini`,
        size: 14,
        color: "94A3B8",
        italics: true,
      }),
    ],
  });

  // ── Assemble Document ─────────────────────────────────────────────────
  const doc = new Document({
    creator: "BrandPulse AI",
    title: `BrandPulse Audit – ${title}`,
    description: "AI-generated brand compliance audit report",
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: [
          titleParagraph,
          docTitleParagraph,
          scoreBadge,
          disclosureParagraph,
          metaHeading,
          ...metaParagraphs,
          contentHeading,
          contentNote,
          ...annotatedParagraphs,
          violationsHeading,
          ...tableChildren,
          footerDivider,
          footerParagraph,
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const safeName = title.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 40);
  const dateTag = new Date().toISOString().slice(0, 10);
  saveAs(blob, `BrandPulse-Review-${safeName}-${dateTag}.docx`);
}
