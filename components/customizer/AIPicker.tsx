"use client"

import CustomButton from "./CustomButton"

interface AIPickerProps {
  prompt: string
  setPrompt: (prompt: string) => void
  generatingImg: boolean
  handleSubmit: (type: string) => void
}

export default function AIPicker({
  prompt,
  setPrompt,
  generatingImg,
  handleSubmit,
}: AIPickerProps) {
  return (
    <div className="aipicker-container">
      <textarea
        placeholder="Ask AI to generate an image based on your prompt"
        rows={5}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="aipicker-textarea"
      />
      <div className="flex flex-wrap gap-3">
        {generatingImg ? (
          <CustomButton
            type="outline"
            title="Generating Image..."
            customStyles="text-xs"
          />
        ) : (
          <>
            <CustomButton
              type="outline"
              title="AI Logo"
              handleClick={() => handleSubmit("logo")}
              customStyles="text-xs"
            />
            <CustomButton
              type="filled"
              title="AI Texture"
              handleClick={() => handleSubmit("full")}
              customStyles="text-xs"
            />
          </>
        )}
      </div>
    </div>
  )
}
