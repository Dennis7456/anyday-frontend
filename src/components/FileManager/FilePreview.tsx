import React, { useEffect, useState } from 'react'
import { FaFilePdf, FaImage, FaFile, FaFileAlt } from 'react-icons/fa'
import { FileValue } from 'src/types'

const FilePreview: React.FC<{ fileValue: FileValue }> = ({ fileValue }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [objectUrl, setObjectUrl] = useState<string | null>(null)
  const { file } = fileValue // Destructure file from fileValue

  useEffect(() => {
    let isMounted = true

    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (isMounted) {
          setImageSrc(reader.result as string)
        }
      }
      reader.readAsDataURL(file)
    } else if (
      file.type.startsWith('video/') ||
      file.type.startsWith('audio/')
    ) {
      const url = URL.createObjectURL(file)
      setObjectUrl(url)

      return () => {
        URL.revokeObjectURL(url) // Clean up URL object
      }
    }

    return () => {
      isMounted = false
    }
  }, [file])

  const fileType = file.type.split('/')[0]

  switch (fileType) {
    case 'image':
      return imageSrc ? (
        <img
          src={imageSrc}
          alt={file.name}
          style={{ width: 100, height: 100, objectFit: 'cover' }}
        />
      ) : null

    case 'application':
      if (file.type.includes('pdf')) {
        return <FaFilePdf size={35} />
      }
      return <FaFileAlt size={35} />

    case 'video':
      return objectUrl ? (
        <video controls width={35} height={35} src={objectUrl} />
      ) : null

    case 'audio':
      return objectUrl ? <audio controls src={objectUrl} /> : null

    default:
      return <FaFile size={35} />
  }
}

export default FilePreview
