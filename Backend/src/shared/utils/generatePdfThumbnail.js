import path from "path";
import fs from "fs/promises";
import { fromPath } from "pdf2pic";

export const generatePdfThumbnail = async (pdfPath) => {
  const outputDir = path.dirname(pdfPath);
  const outputFile = path.join(outputDir, "thumbnail");

  const convert = fromPath(pdfPath, {
    density: 100,
    saveFilename: "thumbnail",
    savePath: outputDir,
    format: "jpg",
    width: 300,
    height: 300,
  });

  console.log(pdfPath);
  
  try {
    const result = await convert(1); 
    
    

    const generatedPath = `${outputFile}-1.jpg`;

    // Check if file was created
    try {
      await fs.access(generatedPath);
      return generatedPath;
    } catch {
      throw new Error("Thumbnail not generated");
    }

  } catch (err) {
    console.error("Error generating thumbnail:", err);
    throw new Error("Failed to generate PDF thumbnail");
  }
};
