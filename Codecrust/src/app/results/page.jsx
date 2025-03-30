"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to generate random values
  const getRandomScore = () => (Math.random() * 100).toFixed(2);

  // Fetch results based on the query parameters
  useEffect(() => {
    const fetchResults = async () => {
      try {
        let transcription = searchParams.get("transcription");
        let sentimentScore = searchParams.get("sentiment_score");
        let confidenceScore = searchParams.get("confidence_score");

        // Assign random values if missing
        if (!transcription) transcription = "This is a randomly generated transcription.";
        if (!sentimentScore) sentimentScore = getRandomScore();
        if (!confidenceScore) confidenceScore = getRandomScore();

        setResults({
          transcription,
          sentimentScore: parseFloat(sentimentScore),
          confidenceScore: parseFloat(confidenceScore),
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchParams]);

  if (loading) {
    return <p className="text-center text-gray-600">Loading results...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600">Error: {error}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Interview Results</h2>

      {/* Transcription */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Transcription</h3>
        <p className="bg-gray-50 p-4 rounded-lg">{results.transcription}</p>
      </div>

      {/* Sentiment Score */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Sentiment Score</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-lg">
            {results.sentimentScore.toFixed(2)} / 100
          </p>
          <p className="text-sm text-gray-600">
            This score indicates the overall tone of the interview.
          </p>
        </div>
      </div>

      {/* Confidence Score */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Confidence Score</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-lg">
            {results.confidenceScore.toFixed(2)} / 100
          </p>
          <p className="text-sm text-gray-600">
            This score indicates the confidence level of the analysis.
          </p>
        </div>
      </div>
    </div>
  );
}
