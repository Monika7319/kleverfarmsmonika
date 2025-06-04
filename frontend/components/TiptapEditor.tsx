// components/TiptapEditor.tsx
"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import "./editor.css"

export default function TiptapEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Enter your comment here...",
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  return (
    <div className="border rounded p-2">
      <EditorContent editor={editor} />
    </div>
  )
}
