export type PdfFontSupport = {
  family: string;
  unicodeSupported: boolean;
};

export const PDF_FONT_FAMILY = "NotoSans";

const PDF_EMOJI_REPLACEMENTS: Readonly<Record<string, string>> = {
  "👉": ">>",
  "🚢": "",
  "📍": "",
};

const BROKEN_TEXT_PATTERNS = [
  /\u0005/g,
  /Ø=Ü/g,
  /\ufffd/g,
  /&{3,}/g,
];

export function scanPdfForBrokenCharacters(pdfBinary: string): string[] {
  const warnings: string[] = [];
  const visibleText = extractPdfTextStreams(pdfBinary).join(" ");

  for (const pattern of BROKEN_TEXT_PATTERNS) {
    if (pattern.test(visibleText)) {
      warnings.push(`Broken PDF text detected: ${pattern}`);
    }
  }

  if (patternIncludesReplacementGlyph(visibleText)) {
    warnings.push("PDF replacement glyph detected");
  }

  return warnings;
}

function patternIncludesReplacementGlyph(text: string): boolean {
  return text.includes("\uFFFD");
}

export function logPdfSafetyWarnings(pdfBinary: string, context = "PDF"): void {
  const warnings = [
    ...scanPdfForBrokenCharacters(pdfBinary),
    ...assertPdfDocumentTextIsSafe(pdfBinary),
  ];

  if (warnings.length === 0) return;

  console.warn(`[${context}] PDF safety warnings:`);
  for (const warning of warnings) {
    console.warn(`  - ${warning}`);
  }
}

export function renderPlainRating(score: number, total = 5): string {
  const safeScore = Math.max(0, Math.min(total, Math.round(score)));
  return `${safeScore}/${total}`;
}

export function renderPlainRatingWithLabel(stars: number, label: string): string {
  return `${renderPlainRating(stars, 5)} ${label}`;
}

export function formatPdfReturnConfidenceDisplay(input: {
  stars: number;
  label: string;
}): { headline: string; ratingLine: string } {
  const headline =
    input.stars >= 5
      ? "Very High Confidence"
      : input.stars >= 4
        ? "High Confidence"
        : input.stars >= 3
          ? "Moderate Confidence"
          : "Check Carefully";

  return {
    headline,
    ratingLine: `Confidence Rating: ${renderPlainRating(input.stars, 5)}`,
  };
}

/** @deprecated Use formatPdfReturnConfidenceDisplay */
export function formatPdfReturnConfidenceLines(input: {
  stars: number;
  label: string;
}): { label: string; score: string } {
  const display = formatPdfReturnConfidenceDisplay(input);
  return { label: display.headline, score: display.ratingLine };
}

export function renderRating(
  score: number,
  total = 5,
  fonts?: PdfFontSupport,
): string {
  const safeScore = Math.max(0, Math.min(total, Math.round(score)));

  if (fonts?.unicodeSupported !== false) {
    return `${"★".repeat(safeScore)}${"☆".repeat(total - safeScore)}`;
  }

  return `${safeScore}/${total}`;
}

export function renderRatingWithLabel(
  stars: number,
  label: string,
  fonts?: PdfFontSupport,
): string {
  if (fonts?.unicodeSupported !== false) {
    return `${renderRating(stars, 5, fonts)} ${label}`;
  }

  return `${stars}/5 ${label}`;
}

export function pdfSafeText(text: string, fonts?: PdfFontSupport): string {
  let output = text;

  if (fonts?.unicodeSupported === false) {
    for (const [emoji, replacement] of Object.entries(PDF_EMOJI_REPLACEMENTS)) {
      output = output.split(emoji).join(replacement);
    }
    output = output.replace(/★/g, "*").replace(/☆/g, "*");
  } else {
    for (const [emoji, replacement] of Object.entries(PDF_EMOJI_REPLACEMENTS)) {
      output = output.split(emoji).join(replacement);
    }
  }

  return output.replace(/\s+/g, " ").trim();
}

function decodeHexPdfText(hex: string): string {
  const normalized = hex.replace(/\s+/g, "");
  let output = "";

  if (normalized.length >= 4) {
    for (let i = 0; i < normalized.length; i += 4) {
      const chunk = normalized.slice(i, i + 4);
      if (chunk.length < 4) break;
      const codePoint = Number.parseInt(chunk, 16);
      if (Number.isFinite(codePoint) && codePoint > 0) {
        output += String.fromCharCode(codePoint);
      }
    }
    if (output) return output;
  }

  for (let i = 0; i < normalized.length; i += 2) {
    const chunk = normalized.slice(i, i + 2);
    if (chunk.length < 2) break;
    const codePoint = Number.parseInt(chunk, 16);
    if (Number.isFinite(codePoint) && codePoint > 0) {
      output += String.fromCharCode(codePoint);
    }
  }

  return output;
}

function rot13PdfText(text: string): string {
  return text.replace(/[A-Za-z]/g, (char) => {
    const base = char <= "Z" ? 65 : 97;
    return String.fromCharCode(((char.charCodeAt(0) - base + 13) % 26) + base);
  });
}

/**
 * Decode jsPDF NotoSans literal strings (custom ASCII offset +29, digits 0x12–0x1f).
 * Falls back to ROT13 for legacy streams.
 */
export function decodePdfTextStream(text: string): string {
  const hasCustomFontEncoding = /[\u0012-\u001f]/.test(text) || text.includes("\u0003");

  if (!hasCustomFontEncoding) {
    return rot13PdfText(text.replace(/\u0003/g, " "));
  }

  let output = "";
  for (const char of text) {
    const code = char.charCodeAt(0);
    if (code === 0x03) {
      output += " ";
    } else if (code === 0x09) {
      output += "&";
    } else if (code === 0x10) {
      output += "-";
    } else if (code >= 0x12 && code <= 0x1f) {
      output += String.fromCharCode(0x30 + (code - 0x13));
    } else if (code >= 0x21 && code <= 0x7e) {
      output += String.fromCharCode(code + 29);
    } else {
      output += char;
    }
  }
  return output;
}

export function extractDecodedPdfVisibleText(pdfBinary: string): string {
  return extractPdfTextStreams(pdfBinary).map(decodePdfTextStream).join(" ");
}

export function extractPdfTextStreams(pdfBinary: string): string[] {
  const streams: string[] = [];

  const literalMatches = pdfBinary.matchAll(/\((?:\\.|[^\\)])*\)\s*Tj/g);
  for (const match of literalMatches) {
    const raw = match[0].replace(/\)\s*Tj$/, "").slice(1);
    streams.push(
      raw
        .replace(/\\n/g, "\n")
        .replace(/\\r/g, "\r")
        .replace(/\\t/g, "\t")
        .replace(/\\\(/g, "(")
        .replace(/\\\)/g, ")")
        .replace(/\\\\/g, "\\"),
    );
  }

  const hexMatches = pdfBinary.matchAll(/<([0-9A-Fa-f\s]+)>\s*Tj/g);
  for (const match of hexMatches) {
    streams.push(decodeHexPdfText(match[1]));
  }

  return streams;
}

export function assertPdfTextIsSafe(text: string): string[] {
  const issues: string[] = [];

  for (const pattern of BROKEN_TEXT_PATTERNS) {
    if (pattern.test(text)) {
      issues.push(`Broken text pattern detected: ${pattern}`);
    }
  }

  if (/&{3,}/.test(text)) {
    issues.push("Repeated ampersand encoding artifact detected");
  }

  return issues;
}

export function assertPdfDocumentTextIsSafe(pdfBinary: string): string[] {
  const visibleText = extractPdfTextStreams(pdfBinary).join(" ");
  return assertPdfTextIsSafe(visibleText);
}

export type CruiseGuidePdfQualityInput = {
  personalSummary: string;
  expectedLinkCount: number;
};

export function validateCruiseGuidePdfQuality(
  pdfBinary: string,
  input: CruiseGuidePdfQualityInput,
): string[] {
  const issues: string[] = [
    ...scanPdfForBrokenCharacters(pdfBinary),
    ...assertPdfDocumentTextIsSafe(pdfBinary),
  ];
  const visibleText = extractDecodedPdfVisibleText(pdfBinary);

  if (/\d+\/100\s*\d+\/5/.test(visibleText) || /\d+\/100\d+\/5/.test(visibleText)) {
    issues.push("Merged score values detected (e.g. 93/1005/5)");
  }

  if (input.personalSummary.length > 40) {
    const summaryMarker = "strongest overall match";
    if (!visibleText.toLowerCase().includes(summaryMarker)) {
      issues.push("Personal summary may be truncated in PDF output");
    }
  }

  const duplicatePhrase = input.personalSummary.match(/\b(.{10,}?)\b.*\1\b/i);
  if (duplicatePhrase) {
    issues.push("Duplicate wording detected in personal summary source");
  }

  const linkCount = (pdfBinary.match(/\/URI \(/g) ?? []).length;
  if (linkCount < input.expectedLinkCount) {
    issues.push(
      `Expected at least ${input.expectedLinkCount} PDF links, found ${linkCount}`,
    );
  }

  return [...new Set(issues)];
}

export function logCruiseGuidePdfQualityIssues(
  pdfBinary: string,
  input: CruiseGuidePdfQualityInput,
  context = "cruise-plan-pdf",
): string[] {
  const issues = validateCruiseGuidePdfQuality(pdfBinary, input);
  if (issues.length === 0) return issues;

  console.warn(`[${context}] PDF quality warnings:`);
  for (const issue of issues) {
    console.warn(`  - ${issue}`);
  }
  return issues;
}

export function setPdfFont(
  pdf: {
    setFont: (family: string, style?: string) => void;
  },
  style: "normal" | "bold",
  fonts: PdfFontSupport,
): void {
  if (fonts.unicodeSupported) {
    pdf.setFont(fonts.family, style);
    return;
  }

  pdf.setFont("helvetica", style);
}
