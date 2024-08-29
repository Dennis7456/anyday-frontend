import React, { ChangeEvent, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { addFile } from '../../slices/uploadSlice'
import { url } from 'inspector'

interface FileUploadProps {
  onUpload: (files: File[]) => void
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload }) => {
  const dispatch = useDispatch()

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        onUpload(Array.from(event.target.files))
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
        })
      }
    },
    [dispatch],
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
