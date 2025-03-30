"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

const PracticeCard = () => {
  const [topics, setTopics] = useState([]);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch("http://127.0.0.1:3001/api/problems");
        if (!response.ok) throw new Error("Failed to fetch topics");
        const data = await response.json();
        setTopics(Object.keys(data));
      } catch (err) {
        setError(err.message);
      }
    };
    fetchTopics();
  }, []);

  const handleClick = (topic) => {
    router.push(`/practice/${topic}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Available Topics</h1>
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map((topic, index) => (
          <Card
            key={index}
            onClick={() => handleClick(topic)}
            className="hover:shadow-lg transition-shadow cursor-pointer"
          >
            <CardHeader className="flex flex-row items-center gap-4">
              <BookOpen className="h-6 w-6 text-primary text-blue-400" />
              <CardTitle className="capitalize text-lg">{topic}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PracticeCard;
