import React, { useEffect, useRef, useState } from 'react'
import { FaPen } from 'react-icons/fa'
import { FiTrash2 } from 'react-icons/fi'

// Signature Canvas Component
interface SignatureCanvasProps {
  width?: number
  height?: number
  onSave: (signature: string) => void
  existingSignature?: string
}

const SignatureCanvas: React.FC<SignatureCanvasProps> = ({
  width = 300,
  height = 150,
  onSave,
  existingSignature,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas && existingSignature) {
      const ctx = canvas.getContext('2d')
      const img = new Image()
      img.onload = () => {
        ctx?.drawImage(img, 0, 0)
        setHasSignature(true)
      }
      img.src = existingSignature
    }
  }, [existingSignature])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.beginPath()
      ctx.moveTo(x, y)
      setIsDrawing(true)
      setHasSignature(true)
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.lineTo(x, y)
      ctx.strokeStyle = '#000'
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.stroke()
    }
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      setHasSignature(false)
    }
  }

  const saveSignature = () => {
    const canvas = canvasRef.current
    if (!canvas || !hasSignature) return

    const dataURL = canvas.toDataURL()
    onSave(dataURL)
  }

  return (
    <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-gray-300 bg-white cursor-crosshair rounded dark:bg-gray-700 dark:border-gray-600"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      <div className="flex gap-2 mt-2">
        <button
          type="button"
          className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
          onClick={clearCanvas}
        >
          <FiTrash2 className="w-3 h-3" />
          Clear
        </button>
        <button
          type="button"
          disabled={!hasSignature}
          className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={saveSignature}
        >
          <FaPen className="w-3 h-3" />
          Save
        </button>
      </div>
    </div>
  )
}

export default SignatureCanvas
