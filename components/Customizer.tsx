"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { useSnapshot } from "valtio"
import state from "@/lib/store"
import { downloadCanvasToImage, reader } from "@/lib/helpers"
import {
  EditorTabs,
  FilterTabs,
  DecalTypes,
  modelTabs,
  IMAGE_LABELS,
} from "@/lib/constants"
import type { ImageLayer } from "@/lib/store"
import { fadeAnimation, slideAnimation } from "@/lib/motion"
import CustomButton from "./customizer/CustomButton"
import Tab from "./customizer/Tab"
import ColorPicker from "./customizer/ColorPicker"
import FilePicker from "./customizer/FilePicker"
import AIPicker from "./customizer/AIPicker"
import MouseMovement from "./customizer/MouseMovement"
import ImageLayerControls from "./customizer/ImageLayerControls"

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
          <FilePicker
            file={file}
            setFile={setFile}
            readFile={readFile}
            onAddImageLayer={handleAddImageLayer}
          />
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
    if (type === "image") {
      // Apply to the last image layer
      const layers = state.imageDecals
      if (layers.length > 0) {
        layers[layers.length - 1].url = result
        layers[layers.length - 1].visible = true
      }
    } else {
      const decalType = DecalTypes[type]
      ;(state as any)[decalType.stateProperty] = result

      if (!activeFilterTab[decalType.filterTab]) {
        handleActiveFilterTab(decalType.filterTab)
      }
    }
  }

  const handleActiveFilterTab = (tabName: string) => {
    switch (tabName) {
      case "stylishShirt":
        state.isFullTexture = !activeFilterTab[tabName]
        break
      default:
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

  const handleToggleImageLayer = (layerId: string) => {
    const layer = state.imageDecals.find((l) => l.id === layerId)
    if (layer) {
      layer.visible = !layer.visible
    }
  }

  const handleAddImageLayer = () => {
    if (typeof file === "string" || !file) return
    const nextIndex = state.imageDecals.length
    const label = `Image ${IMAGE_LABELS[nextIndex] || nextIndex + 1}`
    const id = `image${IMAGE_LABELS[nextIndex] || nextIndex + 1}`

    // Offset new layers slightly from the last layer
    const lastLayer = state.imageDecals[state.imageDecals.length - 1]
    const basePos: [number, number, number] = lastLayer
      ? [lastLayer.position[0] + 0.05, lastLayer.position[1] - 0.05, lastLayer.position[2]]
      : [0, 0, 0.15]

    reader(file).then((res) => {
      state.imageDecals.push({
        id,
        label,
        url: res as string,
        visible: true,
        position: basePos,
        rotation: [0, 0, 0] as [number, number, number],
        scale: lastLayer?.scale ?? 0.15,
      })
      state.selectedLayerId = id
      setActiveEditorTab("")
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
          {/* Left side: Editor tabs + Model tabs */}
          <motion.div
            key="custom"
            className="absolute top-0 left-0 z-10"
            {...slideAnimation("left")}
          >
            <div className="flex items-start min-h-screen gap-0 pt-4">
              {/* Editor tools */}
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
              {/* Model selector docked to the right of editor tabs */}
              <div className="modeltabs-container tabs ml-1">
                <p className="text-[10px] text-gray-500 my-[-5px]">Models</p>
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

          {/* Top right: Go Back button */}
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

          {/* Right side: Image Layer Controls */}
          {snap.selectedLayerId && (
            <motion.div
              key="layercontrols"
              className="absolute top-0 right-0 z-10"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
            >
              <div className="flex items-center min-h-screen pr-1">
                <ImageLayerControls />
              </div>
            </motion.div>
          )}

          {/* Bottom: Filter tabs (Image layers + Texture + Download) */}
          <motion.div className="filtertabs-container" {...slideAnimation("up")}>
            {snap.imageDecals.map((layer) => (
              <Tab
                key={layer.id}
                tab={{ name: layer.id, icon: "/assets/logo-tshirt.png" }}
                isFilterTab
                isActiveTab={layer.visible}
                handleClick={() => {
                  state.selectedLayerId = layer.id
                }}
                helperText={layer.label}
              />
            ))}
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
        </>
      )}
    </AnimatePresence>
  )
}
