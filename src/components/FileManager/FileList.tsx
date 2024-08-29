import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from 'src/store/store'
import { removeFile, clearFiles } from '../../slices/uploadSlice'
import { FileValue } from 'src/types'
import FilePreview from './FilePreview'

interface FileListProps {
  propFiles: FileValue[]
  onRemove: (id: number) => void
  onClearFiles: () => void
}

const FileList: React.FC<FileListProps> = ({
  propFiles,
  onRemove,
  onClearFiles,
}) => {
  const dispatch = useDispatch()
  const files = useSelector((state: RootState) => state.uploads.files)

  const handleRemove = (id: number) => {
    dispatch(removeFile(id))
  }

  const handleClear = () => {
    dispatch(clearFiles())
  }

  return (
    <div>
      <button
        onClick={() => onClearFiles()}
        className="mb-[20px] border rounded-sm px-[10px] py-[5px] bg-on-primary"
      >
        Clear All Files
      </button>
      <ul>
        {propFiles.map((file) => (
          <li
            key={file.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            {/* Display the file preview */}
            <div className="mr-[5px]">
              <FilePreview fileValue={file} />
            </div>
            {/* Display the file name */}
            <span
              style={{ marginLeft: '10px', flexGrow: 1, marginRight: '10px' }}
              className=""
            >
              {file.name}
            </span>
            {/* Remove button */}
            <button
              onClick={() => onRemove(file.id)}
              className="text-error border rounded-sm px-[10px] py-[5px] bg-on-primary"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FileList
