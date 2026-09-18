import React, { useRef, useEffect } from 'react'

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export function normalizeRichTextContent(input = '') {
  if (input === null || input === undefined) return ''

  const value = String(input).trim()
  if (!value) return ''

  if (/<[a-z][\s\S]*>/i.test(value)) {
    return value
  }

  const blocks = value.split(/\r?\n\s*\r?\n+/).filter(Boolean)
  if (blocks.length > 0) {
    return blocks
      .map(block => `<p>${escapeHtml(block).replace(/\r?\n/g, '<br />')}</p>`)
      .join('')
  }

  return `<p>${escapeHtml(value).replace(/\r?\n/g, '<br />')}</p>`
}

export function sanitizeRichText(input = '') {
  if (!input || typeof input !== 'string') return ''

  const normalized = normalizeRichTextContent(input)
  const doc = new DOMParser().parseFromString(normalized, 'text/html')
  const allowedTags = new Set([
    'p', 'br', 'span', 'div', 'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'ul', 'ol', 'li',
    'h1', 'h2', 'h3', 'h4', 'blockquote', 'a', 'img', 'hr', 'pre', 'code', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'mark', 'font'
  ])
  const allowedStyles = new Set([
    'text-align', 'padding-left', 'margin-left', 'margin-right', 'margin-top', 'margin-bottom', 'line-height',
    'font-family', 'font-size', 'font-style', 'font-weight', 'text-decoration'
  ])

  const sanitizeNode = (node) => {
    if (!node || node.nodeType !== 1) return

    const tag = node.tagName.toLowerCase()

    if (!allowedTags.has(tag)) {
      const fragment = document.createDocumentFragment()
      while (node.firstChild) {
        fragment.appendChild(node.firstChild)
      }
      node.replaceWith(fragment)
      return
    }

    Array.from(node.attributes).forEach((attr) => {
      const name = attr.name.toLowerCase()

      if (name === 'href') {
        const value = attr.value.trim()
        const safe = /^https?:\/\//i.test(value) || /^mailto:/i.test(value) || /^\//.test(value) || /^#/.test(value)
        if (!safe) {
          node.removeAttribute(attr.name)
          return
        }

        if (value.startsWith('http')) {
          node.setAttribute('target', '_blank')
          node.setAttribute('rel', 'noopener noreferrer')
        }
        return
      }

      if (name === 'face' || name === 'size') {
        return
      }

      if (name === 'style') {
        const styles = attr.value
          .split(';')
          .map(part => part.trim())
          .filter(Boolean)
          .map((part) => {
            const [prop, ...rest] = part.split(':')
            const trimmedProp = (prop || '').trim().toLowerCase()
            if (!allowedStyles.has(trimmedProp)) return null
            return `${trimmedProp}: ${rest.join(':').trim()}`
          })
          .filter(Boolean)

        if (styles.length) {
          node.setAttribute('style', styles.join('; '))
        } else {
          node.removeAttribute('style')
        }
        return
      }

      if (name === 'target' || name === 'rel' || name === 'class' || name === 'title') {
        if (name === 'target' || name === 'rel') {
          node.removeAttribute(attr.name)
        }
        return
      }

      if (name !== 'style') {
        node.removeAttribute(attr.name)
      }
    })

    Array.from(node.childNodes).forEach(sanitizeNode)
  }

  Array.from(doc.body.childNodes).forEach(sanitizeNode)
  return doc.body.innerHTML
}

export function hasRichTextContent(value = '') {
  return String(value || '').replace(/<[^>]*>/g, '').replace(/&nbsp;/gi, ' ').trim().length > 0
}

export default function RichTextEditor({ value = '', onChange, placeholder = 'Write here...' }) {
  const editorRef = useRef(null)

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || ''
    }
  }, [value])

  const applyCommand = (command, valueArg = null) => {
    if (!editorRef.current) return

    editorRef.current.focus()
    document.execCommand(command, false, valueArg)
    onChange(sanitizeRichText(editorRef.current.innerHTML))
  }

  const applyInlineStyle = (styleName, styleValue) => {
    if (!editorRef.current) return

    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) {
      return
    }

    editorRef.current.focus()
    const range = selection.getRangeAt(0)
    const wrapper = document.createElement('span')
    wrapper.style[styleName] = styleValue

    if (range.collapsed) {
      const placeholder = document.createTextNode(' ')
      wrapper.appendChild(placeholder)
      range.insertNode(wrapper)
      selection.removeAllRanges()
      selection.addRange(range)
      onChange(sanitizeRichText(editorRef.current.innerHTML))
      return
    }

    const fragment = range.extractContents()
    wrapper.appendChild(fragment)
    range.insertNode(wrapper)
    selection.removeAllRanges()
    selection.addRange(range)
    onChange(sanitizeRichText(editorRef.current.innerHTML))
  }

  const handleLink = () => {
    const url = window.prompt('Enter a URL', 'https://')
    if (!url) return
    applyCommand('createLink', url)
  }

  const handleInput = () => {
    if (!editorRef.current) return
    onChange(sanitizeRichText(editorRef.current.innerHTML))
  }

  const handleFontFamilyChange = (event) => {
    const font = event.target.value
    if (!font || font === 'default') {
      return
    }
    applyInlineStyle('fontFamily', font)
  }

  const handleFontSizeChange = (event) => {
    const size = event.target.value
    if (!size || size === 'default') {
      return
    }
    applyInlineStyle('fontSize', size)
  }

  return (
    <div className="rich-text-editor">
      <div className="rich-text-toolbar">
        <button type="button" className="rich-text-toolbar-button" onMouseDown={(e) => e.preventDefault()} onClick={() => applyCommand('bold')} title="Bold"><strong>B</strong></button>
        <button type="button" className="rich-text-toolbar-button" onMouseDown={(e) => e.preventDefault()} onClick={() => applyCommand('italic')} title="Italic"><em>I</em></button>
        <button type="button" className="rich-text-toolbar-button" onMouseDown={(e) => e.preventDefault()} onClick={() => applyCommand('underline')} title="Underline"><span style={{ textDecoration: 'underline' }}>U</span></button>
        <button type="button" className="rich-text-toolbar-button" onMouseDown={(e) => e.preventDefault()} onClick={() => applyCommand('formatBlock', 'h3')} title="Heading">H</button>
        <button type="button" className="rich-text-toolbar-button" onMouseDown={(e) => e.preventDefault()} onClick={() => applyCommand('insertUnorderedList')} title="Bullet list">• List</button>
        <button type="button" className="rich-text-toolbar-button" onMouseDown={(e) => e.preventDefault()} onClick={() => applyCommand('insertOrderedList')} title="Numbered list">1. List</button>
        <button type="button" className="rich-text-toolbar-button" onMouseDown={(e) => e.preventDefault()} onClick={() => applyCommand('justifyLeft')} title="Align left">Left</button>
        <button type="button" className="rich-text-toolbar-button" onMouseDown={(e) => e.preventDefault()} onClick={() => applyCommand('justifyCenter')} title="Align center">Center</button>
        <button type="button" className="rich-text-toolbar-button" onMouseDown={(e) => e.preventDefault()} onClick={() => applyCommand('justifyRight')} title="Align right">Right</button>
        <button type="button" className="rich-text-toolbar-button" onMouseDown={(e) => e.preventDefault()} onClick={handleLink} title="Insert link">Link</button>
        <select className="rich-text-toolbar-select" onMouseDown={(e) => e.preventDefault()} onChange={handleFontFamilyChange} defaultValue="default" title="Font family">
          <option value="default">Font: Default</option>
          <option value="Arial, sans-serif">Arial</option>
          <option value="Georgia, serif">Georgia</option>
          <option value="'Times New Roman', serif">Times New Roman</option>
          <option value="Verdana, sans-serif">Verdana</option>
        </select>
        <select className="rich-text-toolbar-select" onMouseDown={(e) => e.preventDefault()} onChange={handleFontSizeChange} defaultValue="default" title="Font size">
          <option value="default">Size: Normal</option>
          <option value="12px">12px</option>
          <option value="14px">14px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
          <option value="20px">20px</option>
          <option value="24px">24px</option>
        </select>
      </div>

      <div
        ref={editorRef}
        className="rich-text-content"
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={handleInput}
        onBlur={handleInput}
      />
    </div>
  )
}
