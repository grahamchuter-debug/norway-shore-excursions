import type { jsPDF } from "jspdf";

import {
  PDF_FONT_FAMILY,
  type PdfFontSupport,
} from "@/lib/pdf/pdf-text";

const REGULAR_FILE = "NotoSans-Regular.ttf";
const BOLD_FILE = "NotoSans-Bold.ttf";

function toBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }

  if (typeof btoa === "function") {
    return btoa(binary);
  }

  return Buffer.from(buffer).toString("base64");
}

async function loadFontBase64(path: string): Promise<string> {
  if (typeof window === "undefined") {
    const fs = await import("node:fs/promises");
    const nodePath = await import("node:path");
    const absolutePath = nodePath.isAbsolute(path)
      ? path
      : nodePath.join(process.cwd(), path);
    const buffer = await fs.readFile(absolutePath);
    return buffer.toString("base64");
  }

  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load PDF font: ${path}`);
  }

  return toBase64(await response.arrayBuffer());
}

export async function registerPdfFonts(pdf: jsPDF): Promise<PdfFontSupport> {
  try {
    const regularBase64 = await loadFontBase64(
      typeof window === "undefined"
        ? "assets/fonts/NotoSans-Regular.ttf"
        : "/fonts/NotoSans-Regular.ttf",
    );
    const boldBase64 = await loadFontBase64(
      typeof window === "undefined"
        ? "assets/fonts/NotoSans-Bold.ttf"
        : "/fonts/NotoSans-Bold.ttf",
    );

    pdf.addFileToVFS(REGULAR_FILE, regularBase64);
    pdf.addFileToVFS(BOLD_FILE, boldBase64);
    pdf.addFont(REGULAR_FILE, PDF_FONT_FAMILY, "normal");
    pdf.addFont(BOLD_FILE, PDF_FONT_FAMILY, "bold");
    pdf.setFont(PDF_FONT_FAMILY, "normal");

    return {
      family: PDF_FONT_FAMILY,
      unicodeSupported: true,
    };
  } catch {
    pdf.setFont("helvetica", "normal");
    return {
      family: "helvetica",
      unicodeSupported: false,
    };
  }
}

export function verifyPdfFontRegistration(pdfText: string): string[] {
  const issues: string[] = [];

  if (!pdfText.includes("/NotoSans")) {
    issues.push("NotoSans font not embedded in PDF");
  }

  return issues;
}
