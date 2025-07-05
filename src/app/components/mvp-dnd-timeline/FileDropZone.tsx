import { on } from 'events'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

interface FileDropZoneProps {
  onFileAccepted: (files: File[]) => void
}

const FileDropZone = ({ onFileAccepted }: FileDropZoneProps) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        onFileAccepted(acceptedFiles)
    }, [onFileAccepted])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop
    })

    return (
        <div
            {...getRootProps()}
            style={{
                border: '2px dashed #cccccc',
                borderRadius: '4px',
                padding: '20px',
                textAlign: 'center',
                backgroundColor: isDragActive ? '#f0f8ff' : '#ffffff'
            }}
        >
            <input {...getInputProps()} />
            {
                isDragActive ? (
                    <p>ここにファイルをドロップしてください...</p>
                ) : (
                    <p>ファイルをここにドラッグ＆ドロップするか、クリックして選択してください</p>
                )
            }
        </div>
    )
}

export default FileDropZone