

// apiKey = "8tfoowhi65ml4h4m36yyvqmz5163yblvv2jlh10tsjfagdlz";

import React from "react";
import "./Realtime.css";
import { Editor } from "@tinymce/tinymce-react";

const TinyMceEditor = () => {
  return (
    <div className="editor-container">
      <Editor
        apiKey="8tfoowhi65ml4h4m36yyvqmz5163yblvv2jlh10tsjfagdlz"
        init={{
          height: "90%", // Full height of the container
          plugins: "pagebreak", // Enable the page break plugin
          toolbar: "undo redo | pagebreak", // Add page break button to the toolbar
          content_style: `
            body {
              background: white;
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
              font-size: 12pt;
              line-height: 1.6;
              color: #333;
            }
            .page-break {
              page-break-after: always;
              border-top: 1px dashed #ccc;
              margin: 20px 0;
            }
          `,
        }}
      />
    </div>
  );
};

export default TinyMceEditor;