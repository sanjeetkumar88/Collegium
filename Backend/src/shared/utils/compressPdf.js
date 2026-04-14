import fs from "fs";
import { PDFDocument } from "pdf-lib";

export const compressPdf = async (inputPath, outputPath) => {
  const existingPdfBytes = fs.readFileSync(inputPath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  // Save PDF - pdf-lib doesn't have aggressive compression, but use object streams
  const compressedPdfBytes = await pdfDoc.save({ useObjectStreams: true });

  fs.writeFileSync(outputPath, compressedPdfBytes);

  const stats = fs.statSync(outputPath);
  const fileSizeInMB = stats.size / (1024 * 1024);

  if (fileSizeInMB > 10) {
    throw new Error(`Compressed file is still too large (${fileSizeInMB.toFixed(2)} MB). Please upload a smaller file.`);
  }

  return outputPath;
};
