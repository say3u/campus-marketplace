import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Pencil, Trash2, MessageCircle, Flag, CheckCircle, ArrowLeft, Share2 } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../hooks/useAuth';

const CATEGORY_COLORS = {
  Electronics: { bg: 'var(--brand-bg)', color: 'var(--brand-dark)' },
  Textbooks:   { bg: '#FFFBEB', color: '#D97706' },
  Furniture:   { bg: 'var(--brand-bg)', color: 'var(--brand)' },
  Clothing:    { bg: '#FDF4FF', color: '#A21CAF' },
  Services:    { bg: '#F5F3FF', color: '#7C3AED' },
  Other:       { bg: 'var(--bg)', color: 'var(--text3)' },
};

export default function ListingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [reported, setReported] = useState(false);

  const { data: listing, isLoading } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => api.get(`/listings/${id}`).then(r => r.data),
  });

  const startConvo = useMutation({
    mutationFn: () => api.post('/conversations', { listing_id: id }),
    onSuccess: (res) => navigate(`/messages/${res.data.id}`),
  });

  const markSold = useMutation({
    mutationFn: () => api.patch(`/listings/${id}/status`, { status: 'sold' }),
    onSuccess: () => queryClient.invalidateQueries(['listing', id]),
  });

  const deleteListing = useMutation({
    mutationFn: () => api.delete(`/listings/${id}`),
    onSuccess: () => navigate('/browse'),
  });

  const report = useMutation({
    mutationFn: () => api.post('/reports', { target_type: 'listing', target_id: id, reason: 'Inappropriate listing' }),
    onSuccess: () => setReported(true),
  });

  if (isLoading) return <div className="text-center py-24 text-sm" style={{ color: 'var(--muted)' }}>Loading...</div>;
  if (!listing) return <div className="text-center py-24 text-sm" style={{ color: 'var(--muted)' }}>Listing not found.</div>;

  const isSeller = user?.id === listing.seller_id;
  const cat = CATEGORY_COLORS[listing.category] || CATEGORY_COLORS.Other;
  const [copied, setCopied] = useState(false);

  function handleShare() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm transition-colors hover:opacity-70"
          style={{ color: 'var(--muted)' }}>
          <ArrowLeft size={14} /> Back
        </button>
        <button onClick={handleShare}
          className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border transition-colors"
          style={{ borderColor: 'var(--border)', color: 'var(--text3)', backgroundColor: 'var(--surface)' }}>
          <Share2 size={13} /> {copied ? 'Copied!' : 'Share'}
        </button>
      </div>

      <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: 'var(--border)', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
        <div className="w-full overflow-hidden" style={{ backgroundColor: 'var(--surface2)', maxHeight: '400px' }}>
          {listing.image_url
            ? <img src={listing.image_url} alt={listing.title} className="w-full object-cover" style={{ maxHeight: '400px' }} />
            : <div className="w-full h-56 flex items-center justify-center text-5xl font-bold" style={{ color: 'var(--border)' }}>?</div>
          }
        </div>

        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              listing.status === 'active' ? 'bg-teal-50 text-teal-700' :
              listing.status === 'sold'   ? 'bg-slate-100 text-slate-500' : 'bg-red-50 text-red-500'
            }`}>{listing.status}</span>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: cat.bg, color: cat.color }}>
              {listing.category}
            </span>
          </div>

          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>{listing.title}</h1>
          <p className="text-3xl font-bold mb-5" style={{ color: 'var(--brand)' }}>${Number(listing.price).toFixed(2)}</p>

          {listing.description && (
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text3)' }}>{listing.description}</p>
          )}

          <div className="flex items-center gap-3 p-4 rounded-xl mb-6" style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--surface2)' }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              style={{ backgroundColor: 'var(--brand)' }}>
              {listing.username[0].toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{listing.username}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{listing.rep_score} reputation &middot; {listing.school}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {isSeller ? (
              <>
                <Link to={`/listings/${id}/edit`}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-slate-50"
                  style={{ borderColor: 'var(--border)', color: 'var(--text3)' }}>
                  <Pencil size={13} /> Edit
                </Link>
                {listing.status === 'active' && (
                  <button onClick={() => markSold.mutate()} disabled={markSold.isPending}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-teal-50 disabled:opacity-50"
                    style={{ borderColor: 'var(--border)', color: 'var(--brand)' }}>
                    <CheckCircle size={13} /> Mark Sold
                  </button>
                )}
                <button onClick={() => { if (confirm('Delete this listing?')) deleteListing.mutate(); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-red-50"
                  style={{ borderColor: 'var(--border)', color: '#DC2626' }}>
                  <Trash2 size={13} /> Delete
                </button>
              </>
            ) : user && listing.status === 'active' ? (
              <>
                <button onClick={() => startConvo.mutate()} disabled={startConvo.isPending}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-50 hover:opacity-85 transition-opacity"
                  style={{ backgroundColor: 'var(--brand)' }}>
                  <MessageCircle size={14} />
                  {startConvo.isPending ? 'Opening...' : 'Message Seller'}
                </button>
                <button onClick={() => report.mutate()} disabled={reported}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-slate-50 disabled:opacity-40"
                  style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>
                  <Flag size={13} /> {reported ? 'Reported' : 'Report'}
                </button>
              </>
            ) : !user ? (
              <div className="w-full rounded-xl border p-4 text-center" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
                <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text)' }}>
                  Want to message this seller?
                </p>
                <p className="text-xs mb-3" style={{ color: 'var(--muted)' }}>
                  Create a free account with your .edu email to get in touch.
                </p>
                <Link to="/register"
                  className="inline-flex items-center gap-2 font-semibold text-white px-5 py-2 rounded-lg text-sm transition-opacity hover:opacity-85"
                  style={{ backgroundColor: 'var(--brand)' }}>
                  Start for free
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
