const fs = require('fs');
const { PDFDocument, StandardFonts } = require('pdf-lib');
const path = require('path');

async function generatePdfFromPngs(pngDirectoryPath, outputFilePath) {
  const pngFiles = fs.readdirSync(pngDirectoryPath).filter(file => file.endsWith('.png'));

  const pdfDoc = await PDFDocument.create();

  for (const pngFile of pngFiles) {
    const pngData = fs.readFileSync(path.join(pngDirectoryPath, pngFile));
    const pngImage = await pdfDoc.embedPng(pngData);
    const page = pdfDoc.addPage();
    page.drawImage(pngImage, {
      x: 0,
      y: 0,
      width: page.getWidth(),
      height: page.getHeight(),
    });
  }

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputFilePath, pdfBytes);

  console.log(`Combined PDF created at ${outputFilePath}`);
}

// Example usage
filename = 'Combinedfile'+ `_${Date.now()}` + '..pdf';
const pngDirectoryPath = './result'; 
const outputFilePath = './pdffs/'+filename;

generatePdfFromPngs(pngDirectoryPath, outputFilePath)
  .catch(error => {
    console.error('An error occurred:', error);
  });