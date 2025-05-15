
// import path from "path";
// import { convert } from "pdf-poppler";
// import fs from "fs";

// export const generatePdfThumbnail = async (pdfPath) => {
//   const outputDir = path.dirname(pdfPath);
//   const outputFile = path.join(outputDir, "thumbnail");

//   const options = {
//     format: "jpeg",
//     out_dir: outputDir,
//     out_prefix: "thumbnail",
//     page: 1,
//   };

//   await convert(pdfPath, options);

//   const generatedPath = `${outputFile}-1.jpg`;
//   if (!fs.existsSync(generatedPath)) throw new Error("Thumbnail not generated");

//   return generatedPath;
// };


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
