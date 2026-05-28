import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Star, Package, Calendar, Pencil, Trash2, Plus } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../hooks/useAuth';

function RateModal({ sellerId, listingId, onClose }) {
  const queryClient = useQueryClient();
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState('');

  const mutation = useMutation({
    mutationFn: () => api.post(`/users/${sellerId}/rate`, { score, listing_id: listingId, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries(['profile', sellerId]);
      onClose();
    },
  });

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-sm rounded-2xl border p-6" style={{ backgroundColor: '#1e293b', borderColor: '#475569' }}>
        <h2 className="text-base font-bold text-white mb-5">Rate this seller</h2>
        <div className="mb-4">
          <p className="text-xs font-medium mb-2" style={{ color: '#94a3b8' }}>Score</p>
          <div className="flex gap-1.5">
            {[1,2,3,4,5].map(n => (
              <button key={n} type="button" onClick={() => setScore(n)}>
                <Star size={26} fill={n <= score ? '#3B82F6' : 'none'} style={{ color: '#3B82F6' }} />
              </button>
            ))}
          </div>
        </div>
        <div className="mb-5">
          <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>Comment (optional)</label>
          <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3}
            placeholder="How was the transaction?"
            className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none resize-none"
            style={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: '#f1f5f9' }} />
        </div>
        {mutation.isError && <p className="text-xs mb-3 text-red-400">Failed to submit.</p>}
        <div className="flex gap-2">
          <button onClick={onClose}
            className="flex-1 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-white/5"
            style={{ borderColor: '#475569', color: '#94a3b8' }}>
            Cancel
          </button>
          <button onClick={() => mutation.mutate()} disabled={!score || mutation.isPending}
            className="flex-1 text-white py-2 rounded-lg text-sm font-semibold disabled:opacity-50 hover:opacity-85"
            style={{ backgroundColor: '#3B82F6' }}>
            {mutation.isPending ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  const { user: me } = useAuth();
  const queryClient = useQueryClient();
  const [rateModal, setRateModal] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['profile', me?.id],
    queryFn: () => api.get(`/users/${me.id}`).then(r => r.data),
    enabled: !!me,
  });

  const deleteListing = useMutation({
    mutationFn: (id) => api.delete(`/listings/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['profile', me?.id]),
  });

  if (!me) return <div className="text-center py-20 text-sm" style={{ color: '#475569' }}>Please log in.</div>;
  if (isLoading) return <div className="text-center py-20 text-sm" style={{ color: '#475569' }}>Loading...</div>;
  if (!data) return null;

  const avgScore = data.ratings.length
    ? (data.ratings.reduce((s, r) => s + r.score, 0) / data.ratings.length).toFixed(1)
    : '—';

  const activeListings = data.listings.filter(l => l.status === 'active');
  const soldListings = data.listings.filter(l => l.status === 'sold');

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {rateModal && <RateModal sellerId={me.id} listingId={rateModal} onClose={() => setRateModal(null)} />}

      {/* Profile header */}
      <div className="rounded-2xl border p-6 mb-8" style={{ backgroundColor: '#1e293b', borderColor: '#475569' }}>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
            style={{ backgroundColor: '#3B82F6' }}>
            {data.username[0].toUpperCase()}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-xl font-bold text-white">{data.username}</h1>
            <p className="text-sm mt-0.5" style={{ color: '#64748b' }}>{data.school}</p>
            <p className="text-xs mt-1 flex items-center gap-1 justify-center sm:justify-start" style={{ color: '#475569' }}>
              <Calendar size={11} /> Joined {new Date(data.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
            <div className="flex gap-6 mt-4 justify-center sm:justify-start">
              {[
                { label: 'Avg Rating', value: avgScore },
                { label: 'Active',     value: activeListings.length },
                { label: 'Sold',       value: soldListings.length },
                { label: 'Reviews',    value: data.ratings.length },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <p className="text-xl font-bold" style={{ color: '#3B82F6' }}>{value}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Listings */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Package size={16} style={{ color: '#3B82F6' }} /> My Listings
          </h2>
          <Link to="/listings/new"
            className="flex items-center gap-1.5 text-xs font-semibold text-white px-3 py-1.5 rounded-lg hover:opacity-85"
            style={{ backgroundColor: '#3B82F6' }}>
            <Plus size={12} /> Post New
          </Link>
        </div>

        {data.listings.length === 0 ? (
          <div className="text-center py-12 rounded-xl border border-dashed" style={{ borderColor: '#475569' }}>
            <p className="text-sm" style={{ color: '#475569' }}>No listings yet.</p>
            <Link to="/listings/new" className="text-xs font-semibold mt-1.5 inline-block" style={{ color: '#3B82F6' }}>
              Post your first item
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.listings.map(l => (
              <div key={l.id} className="rounded-xl border overflow-hidden" style={{ backgroundColor: '#1e293b', borderColor: '#475569' }}>
                <div className="aspect-video relative overflow-hidden" style={{ backgroundColor: '#1e3a5f' }}>
                  {l.image_url
                    ? <img src={l.image_url} alt={l.title} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-2xl font-bold" style={{ color: '#475569' }}>?</div>
                  }
                  <span className={`absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full ${
                    l.status === 'active' ? 'bg-green-500/10 text-green-400' :
                    l.status === 'sold'   ? 'bg-slate-500/20 text-slate-400' : 'bg-red-500/10 text-red-400'
                  }`}>{l.status}</span>
                </div>
                <div className="p-3">
                  <p className="font-semibold text-white truncate text-sm">{l.title}</p>
                  <p className="font-bold text-base mt-0.5" style={{ color: '#3B82F6' }}>${Number(l.price).toFixed(2)}</p>
                  <div className="flex gap-2 mt-3">
                    <Link to={`/listings/${l.id}/edit`}
                      className="flex-1 flex items-center justify-center gap-1 text-xs font-medium py-1.5 rounded-lg border transition-colors hover:bg-white/5"
                      style={{ borderColor: '#475569', color: '#94a3b8' }}>
                      <Pencil size={10} /> Edit
                    </Link>
                    <button onClick={() => deleteListing.mutate(l.id)}
                      className="flex-1 flex items-center justify-center gap-1 text-xs font-medium py-1.5 rounded-lg border transition-colors hover:bg-red-500/10"
                      style={{ borderColor: '#475569', color: '#f87171' }}>
                      <Trash2 size={10} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reviews */}
      <div>
        <h2 className="text-base font-bold text-white flex items-center gap-2 mb-5">
          <Star size={16} style={{ color: '#3B82F6' }} /> Reviews ({data.ratings.length})
        </h2>
        {data.ratings.length === 0 ? (
          <div className="text-center py-12 rounded-xl border border-dashed" style={{ borderColor: '#475569' }}>
            <p className="text-sm" style={{ color: '#475569' }}>No reviews yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.ratings.map(r => (
              <div key={r.id} className="rounded-xl border p-4" style={{ backgroundColor: '#1e293b', borderColor: '#475569' }}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold text-white">{r.rater_username}</span>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(n => (
                      <Star key={n} size={13} fill={n <= r.score ? '#3B82F6' : 'none'} style={{ color: '#3B82F6' }} />
                    ))}
                  </div>
                </div>
                {r.comment && <p className="text-sm" style={{ color: '#94a3b8' }}>{r.comment}</p>}
                <p className="text-xs mt-2" style={{ color: '#475569' }}>{new Date(r.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
