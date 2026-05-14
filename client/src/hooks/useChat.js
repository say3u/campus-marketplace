import { useState, useEffect } from 'react';
import { getSocket } from '../lib/socket';
import api from '../lib/api';

export function useChat(conversationId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!conversationId) return;
    setLoading(true);
    api.get(`/conversations/${conversationId}/messages`)
      .then(r => setMessages(r.data))
      .finally(() => setLoading(false));

    const socket = getSocket();
    socket.emit('join:conversation', conversationId);

    function onMessage(msg) {
      setMessages(prev => [...prev, msg]);
    }
    socket.on('message:new', onMessage);

    return () => {
      socket.emit('leave:conversation', conversationId);
      socket.off('message:new', onMessage);
    };
  }, [conversationId]);

  function sendMessage(body) {
    if (!body.trim()) return;
    getSocket().emit('message:send', { conversationId, body });
  }

  return { messages, loading, sendMessage };
}
