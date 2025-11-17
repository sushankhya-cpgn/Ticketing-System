import {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'


interface FileWithPreview extends File {
  preview: string;
}

export default function MyDropzone({className,onFilesChange}: {className?: string,onFilesChange?: (files: FileWithPreview[]) => void}) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const onDrop = useCallback((acceptedFiles:any) => {
    // Do something with the files
    if(acceptedFiles && acceptedFiles.length > 0){
      setFiles(previousFiles => [
        ...previousFiles,
        ...acceptedFiles.map((file: any) => Object.assign(file, {
          preview: URL.createObjectURL(file)
        })) 
      ]);

    }
    if(onFilesChange){
      const newFiles = acceptedFiles.map((file: any) => Object.assign(file, {
        preview: URL.createObjectURL(file) 
      }));
      onFilesChange(newFiles);
    }
    console.log(acceptedFiles);
  }, [onFilesChange])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <>
    <div {...getRootProps()} className={className}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
    <ul className=' flex gap-2'>
      {files.map((file, index) => (
        <li key={index}>
          <img  src={file.preview} style={{width: '100px'}} alt="preview" />
          <p>{file.name}</p>
        </li>
      ))}
    </ul>
</>
  )
}