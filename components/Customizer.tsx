"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useSnapshot } from "valtio"
import state from "@/lib/store"
import { downloadCanvasToImage, reader } from "@/lib/helpers"
import {
  EditorTabs,
  FilterTabs,
  DecalTypes,
  modelTabs,
} from "@/lib/constants"
import { fadeAnimation, slideAnimation } from "@/lib/motion"
import CustomButton from "./customizer/CustomButton"
import Tab from "./customizer/Tab"
import ColorPicker from "./customizer/ColorPicker"
import FilePicker from "./customizer/FilePicker"
import AIPicker from "./customizer/AIPicker"
import MouseMovement from "./customizer/MouseMovement"

interface CustomizerProps {
  mouseMovement: boolean
  handleMouseMove: () => void
}

export default function Customizer({
  mouseMovement,
  handleMouseMove,
}: CustomizerProps) {
  const snap = useSnapshot(state)
  const [file, setFile] = useState<File | string>("")
  const [prompt, setPrompt] = useState("")
  const [generatingImg, setGeneratingImg] = useState(false)
  const [activeEditorTab, setActiveEditorTab] = useState("")
  const [activeFilterTab, setActiveFilterTab] = useState<
    Record<string, boolean>
  >({
    logoShirt: true,
    stylishShirt: false,
  })
  const [activeModelTab, setActiveModelTab] = useState<
    Record<string, boolean>
  >({
    tshirt: true,
    poloShirt: false,
  })

  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />
      case "filepicker":
        return (
          <FilePicker file={file} setFile={setFile} readFile={readFile} />
        )
      case "aipicker":
        return (
          <AIPicker
            prompt={prompt}
            setPrompt={setPrompt}
            generatingImg={generatingImg}
            handleSubmit={handleSubmit}
          />
        )
      case "mouseMovement":
        return (
          <MouseMovement
            mouseMovement={mouseMovement}
            handleMouseSubmit={handleMouseSubmit}
          />
        )
      default:
        return null
    }
  }

  const handleMouseSubmit = () => {
    handleMouseMove()
    setActiveEditorTab("")
  }

  const handleSubmit = async (type: string) => {
    if (prompt === "") return alert("Please enter a prompt")

    try {
      setGeneratingImg(true)

      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      if (response.ok) {
        const data = await response.json()
        handleDecals(type, `data:image/png;base64,${data.photo}`)
      }
    } catch (error) {
      alert(error)
    } finally {
      setGeneratingImg(false)
      setActiveEditorTab("")
    }
  }

  const handleDecals = (type: string, result: string) => {
    const decalType = DecalTypes[type]
    ;(state as any)[decalType.stateProperty] = result

    if (!activeFilterTab[decalType.filterTab]) {
      handleActiveFilterTab(decalType.filterTab)
    }
  }

  const handleActiveFilterTab = (tabName: string) => {
    switch (tabName) {
      case "logoShirt":
        state.isLogoTexture = !activeFilterTab[tabName]
        break
      case "stylishShirt":
        state.isFullTexture = !activeFilterTab[tabName]
        break
      default:
        state.isLogoTexture = true
        state.isFullTexture = false
        break
    }

    setActiveFilterTab((prevState) => {
      return {
        ...prevState,
        [tabName]: !prevState[tabName],
      }
    })
  }

  const readFile = (type: string) => {
    if (typeof file === "string") return
    reader(file).then((res) => {
      handleDecals(type, res as string)
      setActiveEditorTab("")
    })
  }

  const handleChangeModel = (model: string) => {
    setActiveModelTab({
      ...Object.fromEntries(
        Object.keys(activeModelTab).map((name) => [name, name === model])
      ),
    })
    state.model = model
  }

  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div
            key="custom"
            className="absolute top-0 left-0 z-10"
            {...slideAnimation("left")}
          >
            <div className="flex items-center min-h-screen">
              <div className="editortabs-container tabs">
                {EditorTabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    tab={tab}
                    handleClick={() => {
                      if (activeEditorTab === tab.name)
                        return setActiveEditorTab("")
                      else setActiveEditorTab(tab.name)
                    }}
                    helperText={tab.helperText}
                  />
                ))}
                {generateTabContent()}
              </div>
            </div>
          </motion.div>
          <motion.div
            className="absolute z-10 top-5 right-5"
            {...fadeAnimation}
          >
            <CustomButton
              type="filled"
              title="Go Back"
              handleClick={() => (state.intro = true)}
              customStyles="w-fit px-4 py-2.5 font-bold text-sm"
            />
          </motion.div>
          <motion.div className="filtertabs-container" {...slideAnimation("up")}>
            {FilterTabs.map((tab) => (
              <Tab
                key={tab.name}
                tab={tab}
                isFilterTab
                isActiveTab={activeFilterTab[tab.name]}
                handleClick={() => handleActiveFilterTab(tab.name)}
                helperText={tab.helperText}
              />
            ))}
            <button className="download-btn" onClick={downloadCanvasToImage}>
              <img
                src="/assets/download.png"
                alt="download"
                className="w-3/5 h-3/5 object-contain"
              />
            </button>
          </motion.div>
          <motion.div
            key="modelsAI"
            className="absolute top-0 right-0 z-10"
            {...slideAnimation("right")}
          >
            <div className="flex items-center min-h-screen">
              <div className="modeltabs-container tabs">
                <p className="text-sm text-gray-500 my-[-5px]">Models</p>
                {modelTabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    tab={tab}
                    handleClick={() => handleChangeModel(tab.name)}
                    helperText={tab.helperText}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
