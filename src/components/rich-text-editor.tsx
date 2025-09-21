"use client"

import { Textarea } from "@/components/ui/textarea"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  return (
    <div className="rich-text-editor">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[200px] resize-none"
        rows={8}
      />
      <div className="text-sm text-muted-foreground mt-2">
        Write your recipe instructions here. You can use line breaks to separate steps.
      </div>
    </div>
  )
}
