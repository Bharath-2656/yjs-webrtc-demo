import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import {
  DOCXExporter,
  docxDefaultSchemaMappings,
} from "@blocknote/xl-docx-exporter";
import {
  PDFExporter,
  pdfDefaultSchemaMappings,
} from "@blocknote/xl-pdf-exporter";
import "../src/style.css";
import { PDFViewer } from "@react-pdf/renderer"
import { useEffect, useState } from "react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { BlockNoteEditor } from "@blocknote/core";
import { faker } from '@faker-js/faker';
import DOMPurify from 'dompurify'
import { marked } from 'marked'


const doc = new Y.Doc();
const provider = new WebrtcProvider("my-room-132", doc);

export function Editor() {
  const [pdfDocument, setPDFDocument] = useState<any>();


  // Creates a new editor instance with some initial content.
  const editor: BlockNoteEditor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: doc?.getXmlFragment("document-store"),
      user: {
        name: faker.name.fullName(),
        color: faker.color.rgb(),
      },
    },
  });

  
  const onDownloadClick = async () => {
    const exporter = new DOCXExporter(
      editor.schema as any,
      docxDefaultSchemaMappings as any
    );
    console.log(editor.document);
    // const docxDocument = await exporter.toDocxJsDocument(editor.document);
    // console.log(docxDocument);
    // const blob  = await Packer.toBuffer(docxDocument);

    const blob = await exporter.toBlob(editor.document as any);

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "My Document.docx";
    document.body.appendChild(link);
    link.dispatchEvent(
      new MouseEvent("click", { bubbles: true, cancelable: true, view: window })
    );
    link.remove();
    window.URL.revokeObjectURL(link.href);
  };

  const viewPDF = async () => {
    const exporter = new PDFExporter(editor.schema, pdfDefaultSchemaMappings);
    // Converts the editor's contents from Block objects to HTML and store to state.
    const pdfDocument = await exporter.toReactPDFDocument(editor.document);
    setPDFDocument(pdfDocument);
  }

  // Renders the editor instance, and its contents as HTML below.
  return (
    <div className="wrapper">
      {!pdfDocument &&
      <div>
        <div className={"edit-buttons"}>
          <button className={"edit-button"} onClick={onDownloadClick}>
            Download .docx
          </button>
        </div>
        <div className={"edit-buttons"}>
          <button className={"edit-button"} onClick={viewPDF}>
            View .pdf
          </button>
        </div>
        <div className="item">
          <BlockNoteView editor={editor} />
        </div>
      </div>}
      {pdfDocument && <div className={"edit-buttons"}>
          <button className={"edit-button"} onClick={()=>setPDFDocument(null)}>
           Back
          </button>
        </div>}
      {pdfDocument &&<div className="pdf" >
        <PDFViewer width={"100%"} height={"100%"}>{pdfDocument}</PDFViewer>
      </div> }
    </div>
  );
}
