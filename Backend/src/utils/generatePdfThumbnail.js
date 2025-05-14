
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
import fs from "fs";
import { fromPath } from "pdf2pic";

export const generatePdfThumbnail = async (pdfPath) => {
  const outputDir = path.dirname(pdfPath);
  const outputFile = path.join(outputDir, "thumbnail");

  // Create the pdf2pic converter instance
  const convert = fromPath(pdfPath, {
    density: 100,
    saveFilename: "thumbnail",
    savePath: outputDir,
    format: "jpg", // Or "png"
    width: 300, // Width of the thumbnail
    height: 300, // Height of the thumbnail
  });

  // Convert the first page of the PDF to an image
  const resolve = await convert(1);
  
  const generatedPath = `${outputFile}-1.jpg`;
  if (!fs.existsSync(generatedPath)) throw new Error("Thumbnail not generated");

  return generatedPath;
}; 
