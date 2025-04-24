
import path from "path";
import { convert } from "pdf-poppler";
import fs from "fs";

export const generatePdfThumbnail = async (pdfPath) => {
  const outputDir = path.dirname(pdfPath);
  const outputFile = path.join(outputDir, "thumbnail");

  const options = {
    format: "jpeg",
    out_dir: outputDir,
    out_prefix: "thumbnail",
    page: 1,
  };

  await convert(pdfPath, options);

  const generatedPath = `${outputFile}-1.jpg`;
  if (!fs.existsSync(generatedPath)) throw new Error("Thumbnail not generated");

  return generatedPath;
};
