import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun } from "docx";
import { saveAs } from "file-saver";

// Parse HTML content into Word-compatible elements
const parseHtmlToWordContent = (htmlContent) => {
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(htmlContent, "text/html");
  const elements= [];

  htmlDoc.body.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      // Handle plain text
      elements.push(new Paragraph({ children: [new TextRun(node.textContent || "")] }));
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node;

      if (element.tagName === "P") {
        // Handle paragraphs
        elements.push(new Paragraph({ children: [new TextRun(element.textContent || "")] }));
      } else if (element.tagName === "H1") {
        // Handle heading 1
        elements.push(
          new Paragraph({
            children: [new TextRun({ text: element.textContent || "", bold: true, size: 48 })],
          })
        );
      } else if (element.tagName === "H2") {
        // Handle heading 2
        elements.push(
          new Paragraph({
            children: [new TextRun({ text: element.textContent || "", bold: true, size: 36 })],
          })
        );
      } else if (element.tagName === "H3") {
        // Handle heading 3
        elements.push(
          new Paragraph({
            children: [new TextRun({ text: element.textContent || "", bold: true, size: 30 })],
          })
        );
      } else if (element.tagName === "UL" || element.tagName === "OL") {
        // Handle unordered and ordered lists
        element.querySelectorAll("li").forEach((li) => {
          elements.push(new Paragraph({ text: `• ${li.textContent}` }));
        });
      } else if (element.tagName === "TABLE") {
        // Handle tables
        const rows = Array.from(element.querySelectorAll("tr")).map((row) => {
          const cells = Array.from(row.querySelectorAll("td")).map(
            (cell) =>
              new TableCell({
                children: [new Paragraph(cell.textContent || "")],
              })
          );
          return new TableRow({ children: cells });
        });
        elements.push(new Table({ rows }));
      }
    }
  });

  return elements;
};

// Function to generate and export the Word document
export const exportHtmlToWord = async (htmlContent, fileName = "document.docx") => {
  const elements = parseHtmlToWordContent(htmlContent);

  const doc = new Document({
    sections: [{ properties: {}, children: elements }],
  });

  const buffer = await Packer.toBuffer(doc);
  saveAs(new Blob([buffer]), fileName);
};
