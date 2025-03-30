"use client";

import React, { useState, useRef } from "react";

const VideoRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      const mediaRecorder = new MediaRecorder(stream);
      chunksRef.current = [];
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setVideoBlob(blob);
        setVideoUrl(url);
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  // Upload video to Flask API
  const uploadVideo = async () => {
    if (!videoBlob) {
      alert("No video recorded!");
      return;
    }

    const formData = new FormData();
    formData.append("file", videoBlob, "recorded-video.webm");

    try {
      const response = await fetch("http://127.0.0.1:5000/extract_audio_video", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      setResponseData(result);
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-xl font-semibold">Video Recorder</h2>

      <div className="mt-4 flex gap-4">
        {!recording ? (
          <button
            onClick={startRecording}
            className="px-4 py-2 bg-green-500 text-white rounded-md"
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="px-4 py-2 bg-red-500 text-white rounded-md"
          >
            Stop Recording
          </button>
        )}
      </div>

      {videoUrl && (
        <div className="mt-4">
          <h3 className="font-medium">Preview</h3>
          <video src={videoUrl} controls className="w-80 mt-2" />
          <button
            onClick={uploadVideo}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Upload & Analyze
          </button>
        </div>
      )}

      {responseData && (
        <div className="mt-6 border p-4 rounded-md bg-gray-100">
          <h3 className="font-semibold">Analysis Results</h3>
          <p><strong>Transcription:</strong> {responseData.transcription}</p>
          <p><strong>Sentiment Score:</strong> {responseData.sentiment_score}</p>
          <p><strong>Confidence Score:</strong> {responseData.confidence_score}%</p>
        </div>
      )}
    </div>
  );
};

export default VideoRecorder;
