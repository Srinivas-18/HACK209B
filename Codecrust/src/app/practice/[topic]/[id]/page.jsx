"use client";
import React, { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Camera, Minimize2, Maximize2, Video, VideoOff } from "lucide-react";
import Editor from "@monaco-editor/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const InterviewEnvironment = () => {
  const { id, topic } = useParams();
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [transcription, setTranscription] = useState(null);
  const [questionDetails, setQuestionDetails] = useState(null);
  const [code, setCode] = useState('def two_sum(nums, target):\n    # Your solution here\n    pass');
  const [thoughtProcess, setThoughtProcess] = useState("");
  const [output, setOutput] = useState("");

 

  useEffect(() => {
    const fetchQuestionDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/${topic}/${id}`);
        const data = await response.json();
        console.log(data);
        setQuestionDetails(data);
      } catch (error) {
        console.error("Error fetching question details:", error);
      }
    };

    fetchQuestionDetails();
  }, [id, topic]);

  const problem = {
    title: questionDetails?.title || "Loading...",
    description: questionDetails?.description || "",
    difficulty: questionDetails?.difficulty || "",
    examples: questionDetails?.examples || [],
    constraints: questionDetails?.constraints || [],
  };


  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraStream(stream);
        const options = { mimeType: "video/mp4" };
        const recorder = new MediaRecorder(stream, options);
        setMediaRecorder(recorder);
        setIsCameraOn(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      if (err.name === "NotAllowedError") {
        alert("Please grant camera and microphone access in your browser settings.");
      } else if (err.name === "NotFoundError") {
        alert("No camera or microphone found.");
      } else {
        alert("An error occurred while accessing the camera. Please try again later.");
      }
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setCameraStream(null);
      setIsCameraOn(false);
    }

    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }

    // Clear recorded chunks when stopping the camera
    setRecordedChunks([]);
  };

  const startRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "inactive") {
      setRecordedChunks([]); // Clear previous recordings
      mediaRecorder.start();
      setIsRecording(true);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };

      mediaRecorder.onstop = () => {
        setIsRecording(false);
        const blob = new Blob(recordedChunks, { type: "video/mp4" });
        uploadRecording(blob);
      };
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
    }
  };

  const uploadRecording = async (blob) => {
    const formData = new FormData();
    formData.append("file", blob, "uploaded_video.mp4");

    try {
      const response = await fetch("http://127.0.0.1:5000/extract_audio_video", {
        method: "POST",
        body: formData,
        mode: "cors",
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Response Data:", data);
        alert("Video uploaded and processed successfully!");
      } else {
        const errorData = await response.json();
        console.error("Error Data:", errorData);
        alert(`Failed to upload video: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error uploading video:", error);
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

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const handleRunCode = async () => {
    console.log("Running code:", code);

    try {
      const result = await mockRunPythonCode(code);
      setOutput(result);
    } catch (err) {
      setOutput("Error running code: " + err.message);
    }
  };

  const mockRunPythonCode = (code) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (code.includes("two_sum")) {
          resolve("[0, 1]");
        } else {
          reject(new Error("Code execution error"));
        }
      }, 1000);
    });
  };

  return (
    <div className="h-screen w-full flex flex-col">
      <div className="flex-grow flex">
        {/* Left Side: Problem Details */}
        <div className="w-1/2 p-4 overflow-y-auto bg-gray-50">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{problem.title}</span>
                <span
                  className={`px-2 py-1 rounded-full text-sm font-bold ${
                    problem.difficulty === "Easy"
                      ? "bg-green-200 text-green-800"
                      : problem.difficulty === "Medium"
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {problem.difficulty}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{problem.description}</p>
              <h3 className="text-lg font-semibold mt-4 mb-2">Examples:</h3>
              {problem.examples.map((example, index) => (
                <div key={index} className="bg-gray-100 p-3 rounded mb-2">
                  <p>
                    <strong>Input:</strong> {example.input}
                  </p>
                  <p>
                    <strong>Output:</strong> {example.output}
                  </p>
                  {example.explanation && (
                    <p>
                      <strong>Explanation:</strong> {example.explanation}
                    </p>
                  )}
                </div>
              ))}
              <h3 className="text-lg font-semibold mt-4 mb-2">Constraints:</h3>
              <ul className="list-disc pl-5">
                {problem.constraints.map((constraint, index) => (
                  <li key={index}>{constraint}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Code Editor and Output */}
        <div className="w-1/2 p-4 flex flex-col">
          <div className="flex-grow mb-4 border rounded">
            <Editor
              height="100%"
              language="python"
              theme="vs-dark"
              value={code}
              onChange={handleEditorChange}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
              }}
            />
          </div>
          {output && (
            <div className="mt-6 p-4 border-t bg-gray-50 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Output:</h3>
              <pre className="bg-gray-800 text-white p-3 rounded-md">{output}</pre>
            </div>
          )}
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Thought Process</h3>
            <Textarea
              placeholder="Write down your problem-solving approach, key insights, and reasoning..."
              value={thoughtProcess}
              onChange={(e) => setThoughtProcess(e.target.value)}
              className="w-full min-h-[150px]"
            />
          </div>
        </div>
      </div>

      {/* Camera and Recording Controls */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-black rounded-full shadow-lg overflow-hidden border border-gray-300">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className={!isCameraOn ? "hidden" : "visible w-full h-full"}
        />
      </div>
      <div className="fixed bottom-6 right-6 space-y-2">
        {!isCameraOn ? (
          <Button onClick={startCamera}>
            <Camera className="mr-2 h-4 w-4" /> Start Camera
          </Button>
        ) : (
          <Button variant="destructive" onClick={stopCamera}>
            <Camera className="mr-2 h-4 w-4" /> Stop Camera
          </Button>
        )}
        {!isRecording ? (
          <Button onClick={startRecording}>Start Recording</Button>
        ) : (
          <Button variant="destructive" onClick={stopRecording}>Stop Recording</Button>
        )}
        <Button onClick={toggleFullscreen}>
          {isFullscreen ? (
            <>
              <Minimize2 className="mr-2 h-4 w-4" /> Exit Fullscreen
            </>
          ) : (
            <>
              <Maximize2 className="mr-2 h-4 w-4" /> Fullscreen
            </>
          )}
        </Button>
        <Button onClick={handleRunCode} className="bg-blue-500 text-white">
          Run Code
        </Button>
      </div>
    </div>
  );
};

export default InterviewEnvironment;