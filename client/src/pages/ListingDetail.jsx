import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Pencil, Trash2, MessageCircle, Flag, CheckCircle, ArrowLeft } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../hooks/useAuth';

const CATEGORY_COLORS = {
  Electronics: { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa' },
  Textbooks:   { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' },
  Furniture:   { bg: 'rgba(34,197,94,0.15)',  color: '#4ade80' },
  Clothing:    { bg: 'rgba(236,72,153,0.15)', color: '#f472b6' },
  Services:    { bg: 'rgba(168,85,247,0.15)', color: '#c084fc' },
  Other:       { bg: 'rgba(100,116,139,0.15)',color: '#94a3b8' },
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

  if (isLoading) return (
    <div className="text-center py-24 text-sm" style={{ color: '#475569' }}>Loading...</div>
  );
  if (!listing) return (
    <div className="text-center py-24 text-sm" style={{ color: '#475569' }}>Listing not found.</div>
  );

  const isSeller = user?.id === listing.seller_id;
  const cat = CATEGORY_COLORS[listing.category] || CATEGORY_COLORS.Other;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm mb-6 transition-colors hover:text-white"
        style={{ color: '#64748b' }}>
        <ArrowLeft size={14} /> Back
      </button>

      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: '#16181f', borderColor: '#2a2d3e' }}>
        {/* Image */}
        <div className="w-full overflow-hidden" style={{ backgroundColor: '#1e2130', maxHeight: '400px' }}>
          {listing.image_url
            ? <img src={listing.image_url} alt={listing.title} className="w-full object-cover" style={{ maxHeight: '400px' }} />
            : <div className="w-full h-56 flex items-center justify-center text-5xl font-bold" style={{ color: '#2a2d3e' }}>?</div>
          }
        </div>

        <div className="p-6">
          {/* Status badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              listing.status === 'active' ? 'bg-green-500/10 text-green-400' :
              listing.status === 'sold'   ? 'bg-slate-500/20 text-slate-400' : 'bg-red-500/10 text-red-400'
            }`}>{listing.status}</span>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: cat.bg, color: cat.color }}>
              {listing.category}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">{listing.title}</h1>
          <p className="text-3xl font-bold mb-5" style={{ color: '#4F46E5' }}>
            ${Number(listing.price).toFixed(2)}
          </p>

          {listing.description && (
            <p className="text-sm leading-relaxed mb-6" style={{ color: '#94a3b8' }}>{listing.description}</p>
          )}

          {/* Seller */}
          <div className="flex items-center gap-3 p-4 rounded-xl mb-6" style={{ backgroundColor: '#1e2130' }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              style={{ backgroundColor: '#4F46E5' }}>
              {listing.username[0].toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{listing.username}</p>
              <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>{listing.rep_score} reputation · {listing.school}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            {isSeller ? (
              <>
                <Link to={`/listings/${id}/edit`}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-white/5"
                  style={{ borderColor: '#2a2d3e', color: '#94a3b8' }}>
                  <Pencil size={13} /> Edit
                </Link>
                {listing.status === 'active' && (
                  <button onClick={() => markSold.mutate()} disabled={markSold.isPending}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-white/5 disabled:opacity-50"
                    style={{ borderColor: '#2a2d3e', color: '#4ade80' }}>
                    <CheckCircle size={13} /> Mark Sold
                  </button>
                )}
                <button onClick={() => { if (confirm('Delete this listing?')) deleteListing.mutate(); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-red-500/10 disabled:opacity-50"
                  style={{ borderColor: '#2a2d3e', color: '#f87171' }}>
                  <Trash2 size={13} /> Delete
                </button>
              </>
            ) : user && listing.status === 'active' ? (
              <>
                <button onClick={() => startConvo.mutate()} disabled={startConvo.isPending}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-50 hover:opacity-85 transition-opacity"
                  style={{ backgroundColor: '#4F46E5' }}>
                  <MessageCircle size={14} />
                  {startConvo.isPending ? 'Opening...' : 'Message Seller'}
                </button>
                <button onClick={() => report.mutate()} disabled={reported}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-white/5 disabled:opacity-40"
                  style={{ borderColor: '#2a2d3e', color: '#64748b' }}>
                  <Flag size={13} /> {reported ? 'Reported' : 'Report'}
                </button>
              </>
            ) : !user ? (
              <Link to="/login"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white hover:opacity-85 transition-opacity"
                style={{ backgroundColor: '#4F46E5' }}>
                Login to Message Seller
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
