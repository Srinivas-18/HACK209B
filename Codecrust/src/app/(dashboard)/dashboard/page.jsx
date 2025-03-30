"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Code2, VideoIcon, BookOpen } from "lucide-react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function DashboardPage() {
  const [progress, setProgress] = useState({
    totalProblems: 0,
    solvedProblems: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
  });

  useEffect(() => {
    async function fetchProgress() {
      try {
        const response = await fetch("http://127.0.0.1:3001/api/user-progress"); // Update with your backend URL
        const data = await response.json();
        setProgress({
          totalProblems: data.total_problems ||0,
          solvedProblems: data.solved_problems || 10,
          easySolved: data.easy_solved || 5,
          mediumSolved: data.medium_solved || 3,
          hardSolved: data.hard_solved || 2,
        });
      } catch (error) {
        console.error("Error fetching progress:", error);
      }
    }

    fetchProgress();
  }, []);

  const chartData = {
    datasets: [
      {
        data: [
          progress.easySolved,
          progress.mediumSolved,
          progress.hardSolved,
          progress.totalProblems - progress.solvedProblems, 
        ],
        backgroundColor: ["#1DB954", "#F7B32B", "#E63946", "#B3B3B3"], // Colors for Easy, Medium, Hard, Unsolved
        hoverBackgroundColor: ["#1ED760", "#FFCB4D", "#FF6B6B", "#C7C7C7"],
      },
    ],
    labels: ["Easy", "Medium", "Hard", "Unsolved"],
  };

  return (
    <div className="h-full">
      {/* First Row - Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        <Card className="w-full">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">DSA Problems Solved</h3>
              <Code2 className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold">{progress.solvedProblems}</div>
              <p className="text-xs text-muted-foreground mt-1">+2 from last week</p>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">Recordings</h3>
              <VideoIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold">7</div>
              <p className="text-xs text-muted-foreground mt-1">+1 from last week</p>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">Study Materials</h3>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold">32</div>
              <p className="text-xs text-muted-foreground mt-1">+5 from last week</p>
            </div>
          </CardContent>
        </Card>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        
        <Card className="w-full md:col-span-2">
          <CardContent className="p-6 min-h-[400px]">
            <h3 className="text-lg font-medium">Progress Overview</h3>
            <div className="flex flex-col items-center justify-center mt-6">
              <div className="w-2/3">
                <Doughnut
                  data={chartData}
                  options={{
                    cutout: "50%",
                    plugins: {
                      legend: {
                        position: "bottom",
                        labels: {
                          boxWidth: 12,
                        },
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            const value = context.raw;
                            return `${context.label}: ${value}`;
                          },
                        },
                      },
                    },
                  }}
                />
              </div>
              <div className="mt-4 text-center">
                <h4 className="text-2xl font-bold">{progress.solvedProblems}/{progress.totalProblems}</h4>
                <p className="text-sm text-muted-foreground">Problems Solved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Motivational Quote */}
        <Card className="w-full md:col-span-1">
          <CardContent className="p-6 min-h-[400px]">
            <h3 className="text-lg font-medium">Motivational Quote</h3>
            <p className="mt-4 text-sm">
              “The only way to learn a new programming language is by writing programs in it.” – Dennis Ritchie
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
