'use client'

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const domains = [
  { name: 'Web Development', description: 'Test your skills in HTML, CSS, JavaScript, React, and more.', path: '/test/web' },
  { name: 'Machine Learning', description: 'Challenge yourself with ML concepts, algorithms, and models.', path: '/test/ml' },
  { name: 'Artificial Intelligence', description: 'Evaluate your understanding of AI, NLP, and Deep Learning.', path: '/test/ai' },
  { name: 'DevOps', description: 'Assess your DevOps knowledge including CI/CD, Docker, and Kubernetes.', path: '/test/devops' },
  { name: 'Cloud Computing', description: 'Test your cloud expertise in AWS, Azure, and GCP.', path: '/test/cloud' },
];

export default function TestYourKnowledge() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Test Your Knowledge</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {domains.map((domain, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{domain.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{domain.description}</p>
              <Link href={domain.path}>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">Start Test</button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
