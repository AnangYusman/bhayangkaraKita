import "@ckeditor/ckeditor5-core";

declare module "@ckeditor/ckeditor5-core" {
  interface EditorConfig {
    image?: {
      toolbar?: Array<string>;
    };
    table?: {
      contentToolbar?: Array<string>;
    };
  }
}
