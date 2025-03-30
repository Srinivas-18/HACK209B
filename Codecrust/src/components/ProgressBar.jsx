'use client'
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Card, CardContent } from "@/components/ui/card";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ProgressBar() {
  const [solvedData, setSolvedData] = useState(null);

  useEffect(() => {
    async function fetchSolvedData() {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/problems");
        const data = await response.json();

        const easyProblems = data.easy.length;
        const mediumProblems = data.medium.length;
        const hardProblems = data.hard.length;

        const solvedCounts = { easy: 61, medium: 72, hard: 11 }; // Example solved data (replace with dynamic fetch)
        const totalSolved =
          solvedCounts.easy + solvedCounts.medium + solvedCounts.hard;
        const totalProblems = easyProblems + mediumProblems + hardProblems;

        setSolvedData({
          chart: {
            datasets: [
              {
                data: [totalSolved, totalProblems - totalSolved], // Solved vs Unsolved
                backgroundColor: ["#1DB954", "#B3B3B3"], // Green for solved, gray for unsolved
                hoverBackgroundColor: ["#1ED760", "#C7C7C7"],
              },
            ],
            labels: ["Solved", "Unsolved"],
          },
          details: {
            easy: { solved: solvedCounts.easy, total: easyProblems },
            medium: { solved: solvedCounts.medium, total: mediumProblems },
            hard: { solved: solvedCounts.hard, total: hardProblems },
          },
        });
      } catch (error) {
        console.error("Error fetching solved data:", error);
      }
    }

    fetchSolvedData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {/* Main Donut Chart Card */}
      <Card className="w-full md:col-span-2">
        <CardContent className="p-6 flex items-center justify-between">
          {solvedData ? (
            <div className="flex items-center gap-6">
              {/* Donut Chart */}
              <div className="w-1/2">
                <Doughnut
                  data={solvedData.chart}
                  options={{
                    cutout: "70%", // Adjusts the donut hole size
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        callbacks: {
                          label: (context) =>
                            `${context.label}: ${context.raw}`,
                        },
                      },
                    },
                  }}
                />
              </div>
              {/* Solved Summary */}
              <div>
                <h3 className="text-4xl font-bold">
                  {solvedData.details.easy.solved +
                    solvedData.details.medium.solved +
                    solvedData.details.hard.solved}
                  /{solvedData.details.easy.total +
                    solvedData.details.medium.total +
                    solvedData.details.hard.total}
                </h3>
                <p className="text-muted-foreground mt-1">Solved</p>
                <p className="text-sm mt-1">6 Attempting</p>
              </div>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </CardContent>
      </Card>

      {/* Difficulty Breakdown */}
      <div className="grid grid-cols-1 gap-4">
        {solvedData &&
          ["easy", "medium", "hard"].map((level) => (
            <Card
              key={level}
              className={`w-full ${
                level === "easy"
                  ? "text-green-600"
                  : level === "medium"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <h3 className="text-sm font-medium capitalize">{level}</h3>
                <p className="text-lg font-bold">
                  {solvedData.details[level].solved}/
                  {solvedData.details[level].total}
                </p>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}
