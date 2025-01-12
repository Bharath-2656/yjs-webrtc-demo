import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import { useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import edjsHTML from "editorjs-html";
import { exportHtmlToWord } from "./util";


const EditorComponent = () => {
  const DEFAULT_INITIAL_DATA = {
    time: new Date().getTime(),
    blocks: [
      {
        type: "header",
        data: {
          text: "This is my awesome editor!",
          level: 1,
        },
      },
    ],
  };
  const [content, setContent] = useState(DEFAULT_INITIAL_DATA);
  const [doc] = useState(() => new Y.Doc()); // Yjs document (singleton for component)
  const [remoteValue, setRemoteValue] = useState("");
  const [htmlContent, setHtmlContent] = useState("");

  const ejInstance = useRef();
  const initEditor = () => {
    const editor = new EditorJS({
      holder: "editorjs",
      onReady: () => {
        ejInstance.current = editor;
      },
      data: content,
      autofocus: true,
      onChange: async (e) => {
        console.log("Content changed", e);
        console.log(
          editor.blocks.getCurrentBlockIndex(),
          "Block index changed"
        );
        let content2 = await editor.saver.save();
        console.log(content2);
        const edjsParser = edjsHTML();
        let html = edjsParser.parse(content2);
        setHtmlContent(html);
        console.log(html, "HTML Content");
        // Update the shared Yjs document
        if (remoteValue != content2) {
          const ymap = doc.getMap("shared-map");
          ymap.set("key", content2);
        }
      },
      tools: {
        header: Header,
        list: List,
      },
    });
  };

  // useEffect(() => {
  //   if (ejInstance.current && remoteValue) {
  //     ejInstance.current.render(remoteValue);
  //   }
  // }, [remoteValue]);

  useEffect(() => {
    if (ejInstance.current === null) {
      initEditor();
    }

    return () => {
      ejInstance?.current?.destroy();
      ejInstance.current = null;
    };
  }, []);

  useEffect(() => {
    // Step 1: Connect to a WebRTC room
    const provider = new WebrtcProvider("my-room-name", doc);

    // Step 2: Get a shared Yjs Map
    const ymap = doc.getMap("shared-map");

    // Step 3: Observe changes to the shared map
    const handleChange = () => {
      const sharedValue = ymap.get("key");
      setRemoteValue(sharedValue || "");
      setContent(sharedValue);
    };

    ymap.observe(handleChange);

    setRemoteValue(ymap.get("key") || "");
    setContent(ymap.get("key"));

    // Step 4: Clean up when the component unmounts
    return () => {
      ymap.unobserve(handleChange);
      provider.destroy();
      doc.destroy();
    };
  }, [doc]);

  async function downloadDocx(params) {
    exportHtmlToWord(htmlContent, "example.docx");

  }

  return (
    <>
      <div id="editorjs"></div>
      {/* <div>
        <p>
          <strong>Remote Value (from WebRTC):</strong>{" "}
          {JSON.stringify(remoteValue)}
        </p>
      </div> */}
      <button onClick={downloadDocx}>Download DOCX</button>
    </>
  );
};

export default EditorComponent;
