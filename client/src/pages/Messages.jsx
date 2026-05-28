import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Send, MessageSquare } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import { useChat } from '../hooks/useChat';

function ChatPanel({ conversationId, other }) {
  const { user } = useAuth();
  const { messages, loading, sendMessage } = useChat(conversationId);
  const [draft, setDraft] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSend(e) {
    e.preventDefault();
    if (!draft.trim()) return;
    sendMessage(draft);
    setDraft('');
  }

  if (loading) return (
    <div className="flex-1 flex items-center justify-center text-sm" style={{ color: 'var(--muted)' }}>Loading...</div>
  );

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="px-5 py-3.5 border-b flex items-center gap-3 bg-white" style={{ borderColor: 'var(--border)' }}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
          style={{ backgroundColor: '#16A34A' }}>
          {other?.[0]?.toUpperCase() || '?'}
        </div>
        <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{other}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ backgroundColor: 'var(--bg)' }}>
        {messages.length === 0 && (
          <p className="text-center text-sm py-8" style={{ color: 'var(--muted)' }}>No messages yet. Say hi!</p>
        )}
        {messages.map(m => {
          const mine = m.sender_id === user.id;
          return (
            <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-xs lg:max-w-sm">
                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${mine ? 'rounded-br-sm' : 'rounded-bl-sm'}`}
                  style={{ backgroundColor: mine ? '#16A34A' : 'var(--surface)', color: mine ? '#fff' : '#0F172A', border: mine ? 'none' : '1px solid var(--border)' }}>
                  {m.body}
                </div>
                <p className="text-xs mt-1 px-1" style={{ color: 'var(--very-muted)', textAlign: mine ? 'right' : 'left' }}>
                  {new Date(m.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 border-t flex gap-2 bg-white" style={{ borderColor: 'var(--border)' }}>
        <input value={draft} onChange={e => setDraft(e.target.value)} placeholder="Type a message..."
          className="flex-1 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400/40"
          style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }} />
        <button type="submit" disabled={!draft.trim()}
          className="flex items-center justify-center w-10 h-10 rounded-xl disabled:opacity-40 transition-opacity hover:opacity-80"
          style={{ backgroundColor: '#16A34A' }}>
          <Send size={15} className="text-white" />
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

  const active = conversations.find(c => c.id === activeId);
  const otherUser = active ? (active.buyer_id === user?.id ? active.seller_username : active.buyer_username) : null;

  return (
    <div className="max-w-4xl mx-auto flex border-x" style={{ borderColor: 'var(--border)', height: 'calc(100vh - 56px)' }}>
      {/* Sidebar */}
      <div className="w-64 flex flex-col border-r flex-shrink-0 bg-white" style={{ borderColor: 'var(--border)' }}>
        <div className="px-4 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <MessageSquare size={28} style={{ color: 'var(--border)' }} className="mb-2" />
              <p className="text-xs" style={{ color: 'var(--muted)' }}>No conversations yet</p>
            </div>
          ) : conversations.map(c => {
            const other = c.buyer_id === user?.id ? c.seller_username : c.buyer_username;
            const isActive = activeId === c.id;
            return (
              <Link key={c.id} to={`/messages/${c.id}`}
                className="block px-4 py-3 border-b transition-colors hover:bg-slate-50"
                style={{ borderColor: 'var(--surface2)', backgroundColor: isActive ? '#F0FDF4' : 'transparent' }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: isActive ? '#16A34A' : '#CBD5E1' }}>
                    {other[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: isActive ? '#15803D' : '#0F172A' }}>{other}</p>
                    <p className="text-xs truncate" style={{ color: 'var(--muted)' }}>{c.listing_title}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col min-h-0" style={{ backgroundColor: 'var(--bg)' }}>
        {activeId
          ? <ChatPanel key={activeId} conversationId={activeId} other={otherUser} />
          : (
            <div className="flex-1 flex flex-col items-center justify-center gap-2">
              <MessageSquare size={36} style={{ color: 'var(--border)' }} />
              <p className="text-sm font-medium" style={{ color: 'var(--muted)' }}>Select a conversation</p>
            </div>
          )
        }
      </div>
    </div>
  );
}
