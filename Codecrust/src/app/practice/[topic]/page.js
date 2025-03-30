import React from 'react';
import TopicProblems from '@/components/Topic';

const TopicPage = async ({ params }) => {
  
  const { topic } = await params;

 
  const decodedTopic = decodeURIComponent(topic);

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem',
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
  };

  const formatTopicName = (topicName) => {
    return topicName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formattedTopic = formatTopicName(decodedTopic);

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Problems for Topic: {formattedTopic}</h1>
      <TopicProblems topic={decodedTopic} />
    </div>
  );
};

export default TopicPage;

