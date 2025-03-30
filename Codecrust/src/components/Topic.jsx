"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const TopicProblems = ({ topic }) => {
  const [problems, setProblems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const route=useRouter();

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://127.0.0.1:3001/api/topic/${topic}`);
        const data = await response.json();
        setProblems(data.problems);
      } catch (err) {
        setError(err.response?.data?.error || 'An error occurred while fetching problems.');
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, [topic]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-500 hover:bg-green-600';
      case 'medium':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'hard':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const handleSolve = (problemId) => {
    route.push(`${topic}/${problemId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Loading problems...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        <AlertCircle className="w-6 h-6 mr-2" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {problems.map((problem) => (
        <Card key={problem.id} className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg line-clamp-1">{problem.title}</h3>
              <Badge className={`${getDifficultyColor(problem.difficulty)}`}>
                {problem.difficulty}
              </Badge>
            </div>
            <p className="text-sm text-gray-500">Problem ID: {problem.id}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center text-sm text-gray-600">
              <BookOpen className="w-4 h-4 mr-2" />
              <span>View problem description</span>
            </div>
            <Button 
              className="w-full group"
              onClick={() => handleSolve(problem.id)}
            >
              Solve Problem
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TopicProblems;