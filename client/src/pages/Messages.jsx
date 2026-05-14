import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import { useChat } from '../hooks/useChat';

function ChatPanel({ conversationId }) {
  const { user } = useAuth();
  const { messages, loading, sendMessage } = useChat(conversationId);
  const [draft, setDraft] = useState('');

  function handleSend(e) {
    e.preventDefault();
    sendMessage(draft);
    setDraft('');
  }

  if (loading) return <div className="flex-1 flex items-center justify-center text-gray-400">Loading...</div>;

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
              m.sender_id === user.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'
            }`}>
              <p>{m.body}</p>
              <p className={`text-xs mt-1 ${m.sender_id === user.id ? 'text-indigo-200' : 'text-gray-400'}`}>
                {new Date(m.sent_at).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <p className="text-center text-gray-400 text-sm">No messages yet. Say hi!</p>
        )}
      </div>
      <form onSubmit={handleSend} className="border-t p-3 flex gap-2">
        <input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button type="submit" disabled={!draft.trim()}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
          Send
        </button>
      </form>
    </div>
  );
}

export default function Messages() {
  const { id: activeId } = useParams();
  const { user } = useAuth();

  const { data: conversations = [] } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => api.get('/conversations').then(r => r.data),
  });

  return (
    <div className="max-w-4xl mx-auto flex h-[calc(100vh-57px)] border-x">
      {/* Sidebar */}
      <div className="w-72 border-r flex flex-col">
        <div className="p-4 border-b font-semibold">Messages</div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 && (
            <p className="text-center text-gray-400 text-sm p-6">No conversations yet.</p>
          )}
          {conversations.map(c => {
            const other = c.buyer_id === user?.id ? c.seller_username : c.buyer_username;
            return (
              <Link key={c.id} to={`/messages/${c.id}`}
                className={`block px-4 py-3 hover:bg-gray-50 border-b transition-colors ${activeId === c.id ? 'bg-indigo-50' : ''}`}>
                <p className="font-medium text-sm">{other}</p>
                <p className="text-xs text-gray-500 truncate">{c.listing_title}</p>
                {c.last_message && <p className="text-xs text-gray-400 truncate mt-0.5">{c.last_message}</p>}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Chat area */}
      {activeId
        ? <ChatPanel key={activeId} conversationId={activeId} />
        : <div className="flex-1 flex items-center justify-center text-gray-400">Select a conversation</div>
      }
    </div>
  );
}
