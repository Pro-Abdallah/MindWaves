import { useState, useCallback } from 'react';

const API_URL = '/api/messages';

export const useBottleMessages = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        if (response.status === 404) {
          setMessages([]);
          return;
        }
        throw new Error('Failed to fetch messages');
      }
      const data = await response.json();
      
      const parsedMessages = data.map(msg => ({
        id: msg.id,
        text: msg.content,
        createdAt: msg.createdAt,
      }));

      setMessages(parsedMessages);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (text) => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = {
        content: text
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      await fetchMessages();
      return true;
    } catch (err) {
      console.error(err);
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchMessages]);

  return { messages, isLoading, error, fetchMessages, sendMessage };
};
