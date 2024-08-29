import React, { ChangeEvent, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { addFile } from '../../slices/uploadSlice'
import { url } from 'inspector'

interface FileUploadProps {
  onUpload: (files: File[]) => void
  editorRef: React.RefObject<any>
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload, editorRef }) => {
  const dispatch = useDispatch()

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        const filesArray = Array.from(event.target.files)
        onUpload(filesArray)
      }
      const files = event.target.files
      if (files) {
        Array.from(files).forEach((file, index) => {
          const fileData = {
            id: Date.now() + index, // Simple unique ID
            file,
            name: file.name,
            url: URL.createObjectURL(file),
            type: file.type,
            size: file.size,
          }
          dispatch(addFile(fileData))

          if (editorRef.current) {
            const quill = editorRef.current.getEditor()
            const cursorPosition = quill.getSelection()?.index || 0
            const fileLink = `<a href="${fileData.url}" download="${fileData.name}"> 📁 ${fileData.name}</a>`
            quill.clipboard.dangerouslyPasteHTML(cursorPosition, fileLink)
          }
        })
      }
    },
    [dispatch, editorRef, onUpload],
  )

  return (
    <div>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="file-upload"
      />
    </div>
  )
}

export default FileUpload
