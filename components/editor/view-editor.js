import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "@/vendor/ckeditor5/build/ckeditor";

function ViewEditor(props) {
  return (
    <CKEditor
      editor={Editor}
      data={props.initialData}
      disabled={true}
      config={{
        // toolbar: [],
        isReadOnly: true,
      }}
    />
  );
}

export default ViewEditor;
