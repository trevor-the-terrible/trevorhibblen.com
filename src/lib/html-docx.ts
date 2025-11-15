import { Document, Paragraph, TextRun } from 'docx';
import { JSDOM } from 'jsdom';

export function htmlToDocx(htmlString: string): Document {
  // Parse HTML using JSDOM
  const dom = new JSDOM(htmlString);
  const document = dom.window.document;

  // Create new Word document
  const doc = new Document({
    sections: [{
      properties: {},
      children: []
    }]
  });

  // Helper function to process text nodes
  function processTextNode(node: Text): TextRun {
    return new TextRun({
      text: node.textContent?.trim() || '',
    });
  }

  // Helper function to process element nodes
  function processElement(element: Element): Paragraph[] {
    const paragraphs: Paragraph[] = [];

    // Handle different element types
    switch(element.tagName.toLowerCase()) {
      case 'p':
        paragraphs.push(new Paragraph({
          children: Array.from(element.childNodes)
            .filter(node => node.nodeType === 3) // Text nodes only
            .map(node => processTextNode(node as Text))
        }));
        break;

      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        paragraphs.push(new Paragraph({
          children: [new TextRun({
            text: element.textContent?.trim() || '',
            bold: true,
            size: 32 - (parseInt(element.tagName[1]) * 2) // Decreasing size for h1-h6
          })]
        }));
        break;

      default:
        // For other elements, process their children
        element.childNodes.forEach(child => {
          if (child.nodeType === 1) { // Element node
            paragraphs.push(...processElement(child as Element));
          } else if (child.nodeType === 3) { // Text node
            paragraphs.push(new Paragraph({
              children: [processTextNode(child as Text)]
            }));
          }
        });
    }

    return paragraphs;
  }

  // Process the body element
  const bodyElement = document.body;
  const paragraphs = processElement(bodyElement);

  // Add paragraphs to document
  doc.addSection({
    children: paragraphs
  });

  return doc;
}
