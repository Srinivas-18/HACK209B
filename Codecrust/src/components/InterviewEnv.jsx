
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Maximize2, Minimize2, Video, VideoOff } from "lucide-react";

const InterviewEnvironment = () => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [transcription, setTranscription] = useState(null);  // To store transcription result

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOn(true);
      mediaRecorderRef.current = new MediaRecorder(stream);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
  };

  const startRecording = () => {
    if (!mediaRecorderRef.current) {
      alert("Camera is not started! Please start the camera first.");
      return;
    }

    setRecordedChunks([]);
    mediaRecorderRef.current.start();
    setIsRecording(true);

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedChunks((prev) => [...prev, event.data]);
      }
    };
  };

  const stopRecording = async () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.onstop = async () => {
        if (recordedChunks.length > 0) {
          const blob = new Blob(recordedChunks, { type: "video/mp4" });
          const videoFile = new File([blob], "recorded_video.mp4", { type: "video/mp4" });

          const formData = new FormData();
          formData.append("file", videoFile);

          try {
            const response = await fetch("http://localhost:5000/extract_audio_video", {
              method: "POST",
              body: formData,
            });
            const result = await response.json();

            if (response.ok) {
              setTranscription(result.transcription);  // Store transcription in state
              console.log("Transcription:", result.transcription);
            } else {
              console.error("Error:", result.error);
            }
          } catch (error) {
            console.error("Error uploading video:", error);
          }
        }
      };
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full">
      <video ref={videoRef} autoPlay className="w-full max-w-3xl h-auto rounded-lg shadow-lg" />
      
      <div className="fixed bottom-6 right-6 space-y-2">
        {!isCameraOn ? (
          <Button onClick={startCamera}>
            <Camera className="mr-2 h-4 w-4" /> Start Camera
          </Button>
        ) : (
          <Button variant="destructive" onClick={stopCamera}>
            <VideoOff className="mr-2 h-4 w-4" /> Stop Camera
          </Button>
        )}

        {isCameraOn && !isRecording ? (
          <Button onClick={startRecording}>
            <Video className="mr-2 h-4 w-4" /> Start Recording
          </Button>
        ) : isRecording ? (
          <Button variant="destructive" onClick={stopRecording}>
            <VideoOff className="mr-2 h-4 w-4" /> Stop Recording
          </Button>
        ) : null}

        <Button onClick={toggleFullscreen}>
          {isFullscreen ? <Minimize2 className="mr-2 h-4 w-4" /> : <Maximize2 className="mr-2 h-4 w-4" />}
          {isFullscreen ? "Exit Fullscreen" : "Go Fullscreen"}
        </Button>

        {/* Display transcription result */}
        {transcription && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold">Transcription:</h3>
            <p>{transcription}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewEnvironment;
