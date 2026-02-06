"use client"

import CustomButton from "./CustomButton"

interface FilePickerProps {
  file: File | string
  setFile: (file: File) => void
  readFile: (type: string) => void
}

export default function FilePicker({ file, setFile, readFile }: FilePickerProps) {
  return (
    <div className="filepicker-container">
      <div className="flex-1 flex flex-col">
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) setFile(e.target.files[0])
          }}
        />
        <label htmlFor="file-upload" className="filepicker-label">
          Upload File
        </label>
        <p className="mt-2 text-gray-500 text-sm truncate ml-1">
          {file === "" ? "No file chosen" : typeof file === "string" ? file : file.name}
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <CustomButton
          type="outline"
          title="Logo"
          handleClick={() => readFile("logo")}
          customStyles="text-xs"
        />
        <CustomButton
          type="filled"
          title="Texture"
          handleClick={() => readFile("full")}
          customStyles="text-xs"
        />
      </div>
    </div>
  )
}
