'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'

export default function HtmlEditor({
  value, onChange,
}: { value: string; onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none min-h-[300px] bg-surface p-4 outline-none',
      },
    },
  })

  if (!editor) return null
  const btn = "px-3 py-1 sub-en text-xs uppercase border border-ink/20 hover:border-primary"

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2 bg-bg p-2 border border-ink/10">
        <button type="button" className={btn} onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
        <button type="button" className={btn} onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
        <button type="button" className={btn} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
        <button type="button" className={btn} onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
        <button type="button" className={btn} onClick={() => {
          const url = prompt('URL')
          if (url) editor.chain().focus().setLink({ href: url }).run()
        }}>Link</button>
        <button type="button" className={btn} onClick={() => {
          const url = prompt('Image URL')
          if (url) editor.chain().focus().setImage({ src: url }).run()
        }}>Img</button>
      </div>
      <EditorContent editor={editor}/>
    </div>
  )
}
