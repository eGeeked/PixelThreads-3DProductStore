"use client"

import CustomButton from "./CustomButton"

interface MouseMovementProps {
  mouseMovement: boolean
  handleMouseSubmit: () => void
}

export default function MouseMovement({
  mouseMovement,
  handleMouseSubmit,
}: MouseMovementProps) {
  return (
    <div className="mousemovement-container">
      <p className="text-sm text-gray-500 my-[-5px]">
        Use your mouse to move the product horizontally
      </p>
      <CustomButton
        type="filled"
        title={mouseMovement ? "Disable" : "Enable"}
        handleClick={handleMouseSubmit}
        customStyles="font-bold text-sm"
      />
    </div>
  )
}
