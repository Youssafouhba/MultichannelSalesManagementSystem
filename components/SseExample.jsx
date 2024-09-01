import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { EventSourcePolyfill } from 'event-source-polyfill';
import config from './config';

const SseExample = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const eventSource = new EventSourcePolyfill(`${config.API_BASE_URL}/api/products/subscribe`);

    eventSource.onmessage = (event) => {
      
      setMessage(event.data);
    };

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
    };

    return () => {
    };
  }, []);

  return (
    <View>
      <Text>Server-Sent Events Example</Text>
      <Text>{message}</Text>
    </View>
  );
};

export default SseExample;
