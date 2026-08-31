'use client'
import { useRef } from 'react'

export default function RichTextEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const wrap = (before: string, after: string) => {
    const el = textareaRef.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const selected = value.slice(start, end)
    const newValue = value.slice(0, start) + before + selected + after + value.slice(end)
    onChange(newValue)
    setTimeout(() => {
      el.focus()
      el.setSelectionRange(start + before.length, end + before.length)
    }, 0)
  }

  const btnStyle: any = {
    padding: '4px 10px', borderRadius: 6, border: '1px solid #E0E0E0',
    background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600,
    color: '#1A1A1A', fontFamily: 'PretendardVariable, Pretendard, sans-serif',
  }

  return (
    <div style={{ border: '1.5px solid #E8E8E8', borderRadius: 10, overflow: 'hidden' }}>
      {/* 툴바 */}
      <div style={{ display: 'flex', gap: 6, padding: '8px 10px', borderBottom: '1px solid #F0F0F0', background: '#F7F7F7', flexWrap: 'wrap' }}>
        <button type="button" style={{...btnStyle, fontWeight: 900}} onClick={() => wrap('**', '**')}>B</button>
        <button type="button" style={{...btnStyle, fontStyle: 'italic'}} onClick={() => wrap('*', '*')}>I</button>
        <button type="button" style={btnStyle} onClick={() => wrap('\n\n', '')}>↵</button>
        <span style={{ width: 1, background: '#E0E0E0', margin: '0 4px' }} />
        <button type="button" style={btnStyle} onClick={() => wrap('• ', '')}>• List</button>
        <button type="button" style={btnStyle} onClick={() => wrap('### ', '')}>H3</button>
      </div>

      {/* 텍스트 에어리어 */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={8}
        placeholder="Write description here...&#10;&#10;**bold text**&#10;*italic text*&#10;• list item"
        style={{ width: '100%', padding: '12px', border: 'none', outline: 'none', resize: 'vertical', fontSize: 14, fontFamily: 'PretendardVariable, Pretendard, sans-serif', lineHeight: 1.7, boxSizing: 'border-box' as any, minHeight: 200 }}
      />

      {/* 미리보기 */}
      {value && (
        <div style={{ borderTop: '1px solid #F0F0F0', padding: '12px', background: '#FAFAFA' }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: '#9A9A9A', marginBottom: 8, letterSpacing: '0.05em' }}>PREVIEW</p>
          <div style={{ fontSize: 14, lineHeight: 1.7, color: '#1A1A1A', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}
            dangerouslySetInnerHTML={{ __html: value
              .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.+?)\*/g, '<em>$1</em>')
              .replace(/### (.+)/g, '<h3 style="font-size:16px;font-weight:800;margin:8px 0 4px">$1</h3>')
              .replace(/• (.+)/g, '<div style="display:flex;gap:6px;margin:2px 0"><span>•</span><span>$1</span></div>')
              .replace(/\n/g, '<br/>')
            }} />
        </div>
      )}
    </div>
  )
}
