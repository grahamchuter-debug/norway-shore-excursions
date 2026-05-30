export type { CruisePlanPdfAssets, CruisePlanPdfInput } from "@/lib/pdf/build-cruise-guide-pdf";
export {
  buildCruisePlanPdfFilename,
  exportCruisePlanPdf,
  exportCruisePlanPdfToBuffer,
  prepareCruisePlanPdfAssets,
} from "@/lib/pdf/build-cruise-guide-pdf";
export {
  brandConfig,
  defaultNorwayCruiseGuidePdfConfig,
  type CruiseGuidePdfConfig,
} from "@/lib/pdf/cruise-guide-pdf-config";
export {
  assertPdfTextIsSafe,
  assertPdfDocumentTextIsSafe,
  extractPdfTextStreams,
  extractDecodedPdfVisibleText,
  decodePdfTextStream,
  pdfSafeText,
  renderPlainRating,
  renderPlainRatingWithLabel,
  scanPdfForBrokenCharacters,
  logPdfSafetyWarnings,
  logCruiseGuidePdfQualityIssues,
  validateCruiseGuidePdfQuality,
  formatPdfReturnConfidenceDisplay,
  setPdfFont,
  type PdfFontSupport,
} from "@/lib/pdf/pdf-text";
export { registerPdfFonts, verifyPdfFontRegistration } from "@/lib/pdf/pdf-fonts";
