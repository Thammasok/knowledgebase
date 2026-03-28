'use client'

/**
 * Editor.js wrapper component.
 *
 * Required packages (run once):
 *   pnpm add @editorjs/editorjs @editorjs/header @editorjs/list \
 *            @editorjs/checklist @editorjs/quote @editorjs/code \
 *            @editorjs/delimiter
 */

import { useEffect, useRef, useCallback } from 'react'

export interface EditorBlock {
  id?: string
  type: string
  data: Record<string, unknown>
}

interface EditorProps {
  /** Initial content blocks */
  initialBlocks?: EditorBlock[]
  /** Called with the full blocks array whenever content changes */
  onChange: (blocks: EditorBlock[]) => void
  /** Whether the editor is read-only */
  readOnly?: boolean
  placeholder?: string
}

export function Editor({ initialBlocks = [], onChange, readOnly = false, placeholder }: EditorProps) {
  const holderRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<any>(null)
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    if (!holderRef.current || editorRef.current) return

    let destroyed = false

    const init = async () => {
      // Dynamic imports to keep server bundle clean
      const [
        EditorJS,
        Header,
        List,
        Checklist,
        Quote,
        Code,
        Delimiter,
      ] = await Promise.all([
        import('@editorjs/editorjs').then((m) => m.default),
        import('@editorjs/header').then((m) => m.default),
        import('@editorjs/list').then((m) => m.default),
        import('@editorjs/checklist').then((m) => m.default),
        import('@editorjs/quote').then((m) => m.default),
        import('@editorjs/code').then((m) => m.default),
        import('@editorjs/delimiter').then((m) => m.default),
      ])

      if (destroyed || !holderRef.current) return

      const editor = new EditorJS({
        holder: holderRef.current,
        readOnly,
        placeholder: placeholder ?? 'Start writing…',
        data: { blocks: initialBlocks },
        tools: {
          header: {
            class: Header,
            config: { levels: [1, 2, 3], defaultLevel: 2 },
          },
          list: {
            class: List,
            inlineToolbar: true,
            config: { defaultStyle: 'unordered' },
          },
          checklist: { class: Checklist, inlineToolbar: true },
          quote: { class: Quote, inlineToolbar: true },
          code: Code,
          delimiter: Delimiter,
        },
        onChange: async () => {
          if (!editorRef.current) return
          const output = await editorRef.current.save()
          onChangeRef.current(output.blocks as EditorBlock[])
        },
      })

      await editor.isReady
      if (!destroyed) editorRef.current = editor
    }

    init()

    return () => {
      destroyed = true
      if (editorRef.current?.destroy) {
        editorRef.current.destroy()
        editorRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={holderRef}
      className="prose prose-neutral dark:prose-invert max-w-none min-h-[400px] focus-within:outline-none"
    />
  )
}
