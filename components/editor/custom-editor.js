// components/custom-editor.js

import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "@/vendor/ckeditor5/build/ckeditor";

function CustomEditor(props) {
  return (
    <CKEditor
      editor={Editor}
      data={props.initialData}
      onChange={(event, editor) => {
        const data = editor.getData();
        console.log({ event, editor, data });
        props.onChange(data);
      }}
      config={{
        toolbar: [
          "heading",
          "fontsize",
          "bold",
          "italic",
          "link",
          "numberedList",
          "bulletedList",
          "undo",
          "redo",
          "alignment",
          "outdent",
          "indent",
          "blockQuote",
          "insertTable",
          "codeBlock",
          "sourceEditing",
        ],
      }}
    />
  );
}

export default CustomEditor;
