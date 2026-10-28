import { useState, useEffect, useRef } from 'react';
import { getSocket } from '../lib/socket';
import api from '../lib/api';

export function useChat(conversationId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [otherTyping, setOtherTyping] = useState(false);
  const [otherRead, setOtherRead] = useState(false);
  const typingTimeout = useRef(null);
  const stopTimer = useRef(null);

  useEffect(() => {
    if (!conversationId) return;
    setLoading(true);
    setOtherTyping(false);
    setOtherRead(false);
    api.get(`/conversations/${conversationId}/messages`)
      .then(r => setMessages(r.data))
      .finally(() => setLoading(false));

    const socket = getSocket();
    socket.emit('join:conversation', conversationId);
    socket.emit('message:read', conversationId); // mark as read on open

    function onMessage(msg) {
      setMessages(prev => [...prev, msg]);
      setOtherTyping(false);
      setOtherRead(false);
      // If the incoming message is from the other party, we've read it
      socket.emit('message:read', conversationId);
    }
    function onTypingStart() { setOtherTyping(true); }
    function onTypingStop() { setOtherTyping(false); }
    function onRead() { setOtherRead(true); }

    socket.on('message:new', onMessage);
    socket.on('typing:start', onTypingStart);
    socket.on('typing:stop', onTypingStop);
    socket.on('message:read', onRead);

    return () => {
      socket.emit('leave:conversation', conversationId);
      socket.off('message:new', onMessage);
      socket.off('typing:start', onTypingStart);
      socket.off('typing:stop', onTypingStop);
      socket.off('message:read', onRead);
      clearTimeout(typingTimeout.current);
      clearTimeout(stopTimer.current);
    };
  }, [conversationId]);

  function sendMessage(body) {
    if (!body.trim()) return;
    const socket = getSocket();
    socket.emit('typing:stop', conversationId);
    socket.emit('message:send', { conversationId, body });
    setOtherRead(false);
  }

  // Emit typing:start (throttled), then typing:stop after idle
  function notifyTyping() {
    const socket = getSocket();
    if (!typingTimeout.current) {
      socket.emit('typing:start', conversationId);
      typingTimeout.current = setTimeout(() => { typingTimeout.current = null; }, 1500);
    }
    clearTimeout(stopTimer.current);
    stopTimer.current = setTimeout(() => {
      socket.emit('typing:stop', conversationId);
    }, 1800);
  }

  return { messages, loading, sendMessage, otherTyping, otherRead, notifyTyping };
}
