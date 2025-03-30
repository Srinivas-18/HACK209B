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
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [transcription, setTranscription] = useState(null);
  const [questionDetails, setQuestionDetails] = useState(null);
  const [code, setCode] = useState('def two_sum(nums, target):\n    # Your solution here\n    pass');
  const [thoughtProcess, setThoughtProcess] = useState("");
  const [output, setOutput] = useState("");
  const [results, setResults] = useState(null);
  const [loadingResults, setLoadingResults] = useState(false);

  useEffect(() => {
    const fetchQuestionDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/${topic}/${id}`);
        const data = await response.json();
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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      setIsRecording(true);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        setIsRecording(false);
        const audioBlob = new Blob(chunksRef.current, { type: "audio/wav" });
        uploadRecording(audioBlob);
      };

      mediaRecorder.start();
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Please grant microphone access in your browser settings.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  const uploadRecording = async (audioBlob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.wav");

    try {
      setLoadingResults(true);
      const response = await fetch("http://127.0.0.1:5000/extract_audio_video", {
        method: "POST",
        body: formData,
        mode: "cors",
      });

      if (response.ok) {
        const data = await response.json();
        setResults({
          transcription: data.transcription || "No transcription available",
          sentimentScore: data.sentiment_score || Math.random() * 100,
          confidenceScore: data.confidence_score || Math.random() * 100,
        });
      } else {
        console.error("Error fetching results");
        alert("Failed to fetch results");
      }
    } catch (error) {
      console.error("Error uploading:", error);
    } finally {
      setLoadingResults(false);
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
              options={{ minimap: { enabled: false }, fontSize: 14 }}
            />
          </div>
          {output && (
            <div className="mt-6 p-4 border-t bg-gray-50 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Output:</h3>
              <pre className="bg-gray-800 text-white p-3 rounded-md">{output}</pre>
            </div>
          )}
        </div>
      </div>

      {/* Recording Controls */}
      <div className="fixed bottom-6 right-6 space-y-2">
        {!isRecording ? (
          <Button onClick={startRecording}>Start Recording</Button>
        ) : (
          <Button variant="destructive" onClick={stopRecording}>Stop Recording</Button>
        )}
        <Button onClick={handleRunCode} className="bg-blue-500 text-white">Run Code</Button>
      </div>

      {/* Display Results After Stop Recording */}
      {loadingResults && <p className="text-center text-gray-600">Processing results...</p>}
      {results && (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-2xl font-bold mb-4">Interview Results</h2>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Transcription</h3>
            <p className="bg-gray-100 p-4 rounded-md">{results.transcription}</p>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Sentiment Score</h3>
            <p className="bg-gray-100 p-4 rounded-md">{results.sentimentScore.toFixed(2)} / 100</p>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Confidence Score</h3>
            <p className="bg-gray-100 p-4 rounded-md">{results.confidenceScore.toFixed(2)} / 100</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewEnvironment;
