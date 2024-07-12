import React from 'react'
import { Quill } from 'react-quill'

const CustomHeart: React.FC<{ quill?: typeof Quill.prototype }> = ({
  quill,
}) => {
  const insertHeart = () => {
    if (quill) {
      const cursorPosition = quill.getSelection()?.index || 0
      quill.insertText(cursorPosition, '♥')
      quill.setSelection({ index: cursorPosition + 1, length: 0 })
    }
  }

  return (
    <span onClick={insertHeart} style={{ cursor: 'pointer' }}>
      ♥
    </span>
  )
}
