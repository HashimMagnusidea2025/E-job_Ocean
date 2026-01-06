import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

const RichTextEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML()); // HTML save hoga
    },
  });

  // jab edit mode me data aaye
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="border rounded-lg p-2">
      {/* Toolbar */}
      <div className="flex gap-2 mb-2 flex-wrap">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className="btn">B</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className="btn">I</button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="btn">• List</button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className="btn">1. List</button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} className="min-h-[120px] focus:outline-none" />
    </div>
  );
};

export default RichTextEditor;
