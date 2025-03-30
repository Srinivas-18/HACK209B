import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Camera, Square } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function VideoRecorder() {
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const videoRef = useRef(null)
  const [cameraStream, setCameraStream] = useState(null)
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const [recordedChunks, setRecordedChunks] = useState([])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      videoRef.current.srcObject = stream
      setCameraStream(stream)
      const recorder = new MediaRecorder(stream, { mimeType: "video/webm" })
      setMediaRecorder(recorder)
      setIsCameraOn(true)
    } catch (err) {
      console.error("Error accessing camera:", err)
      alert("Error accessing camera. Please check permissions.")
    }
  }

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop())
      setCameraStream(null)
      setIsCameraOn(false)
    }
    if (mediaRecorder?.state === "recording") {
      mediaRecorder.stop()
    }
    setRecordedChunks([])
  }

  const startRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "inactive") {
      setRecordedChunks([])
      mediaRecorder.start()
      setIsRecording(true)

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data])
        }
      }

      mediaRecorder.onstop = () => {
        setIsRecording(false)
        const blob = new Blob(recordedChunks, { type: "video/webm" })
        uploadRecording(blob)
      }
    }
  }

  const stopRecording = () => {
    if (mediaRecorder?.state === "recording") {
      mediaRecorder.stop()
    }
  }

  const uploadRecording = async (blob) => {
    const formData = new FormData()
    formData.append("file", blob, "recording.webm")

    try {
      const response = await fetch("http://127.0.0.1:5000/extract_audio_video", {
        method: "POST",
        body: formData,
        mode: "cors",
      })

      if (response.ok) {
        alert("Video uploaded and processed successfully!")
      } else {
        const errorData = await response.json()
        alert(`Failed to upload video: ${errorData.error}`)
      }
    } catch (error) {
      console.error("Error uploading video:", error)
    }
  }

  return (
    <>
      <AnimatePresence>
        {isCameraOn && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 left-4 w-48 h-36 bg-black rounded-lg shadow-lg overflow-hidden border border-gray-300"
          >
            <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 left-6 space-y-2">
        <Button
          onClick={isCameraOn ? stopCamera : startCamera}
          className="rounded-full w-12 h-12 flex items-center justify-center"
        >
          <Camera />
        </Button>
        {isCameraOn && (
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            className={`rounded-full w-12 h-12 flex items-center justify-center ${
              isRecording ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {isRecording ? <Square /> : <Camera />}
          </Button>
        )}
      </div>
    </>
  )
}

