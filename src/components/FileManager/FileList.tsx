import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from 'src/store/store'
import { removeFile, clearFiles } from '../../slices/uploadSlice'
import { FileValue } from 'src/types'

interface FileListProps {
  propFiles: FileValue[]
  onRemove: (id: number) => void
}

const FileList: React.FC<FileListProps> = ({ propFiles, onRemove }) => {
  const dispatch = useDispatch()
  const files = useSelector((state: RootState) => state.uploads.files)

  const handleRemove = (id: number) => {
    dispatch(removeFile(id))
  }

  const handleClear = () => {
    console.log('Clear button clicked')
    dispatch(clearFiles())
  }

  return (
    <div>
      <button onClick={handleClear}>Clear All Files</button>
      <ul>
        {propFiles.map((file) => (
          <li key={file.id}>
            {file.name}
            {/* <button onClick={() => handleRemove(file.id)}>Remove</button> */}
            <button onClick={() => onRemove(file.id)} className="text-error">
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FileList
