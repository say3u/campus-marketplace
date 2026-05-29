import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Star, Package, Calendar, Pencil, Trash2, Plus, Camera, Zap } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../hooks/useAuth';

function RateModal({ sellerId, listingId, onClose }) {
  const queryClient = useQueryClient();
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState('');

  const mutation = useMutation({
    mutationFn: () => api.post(`/users/${sellerId}/rate`, { score, listing_id: listingId, comment }),
    onSuccess: () => { queryClient.invalidateQueries(['profile', sellerId]); onClose(); },
  });

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-sm rounded-2xl border bg-white p-6" style={{ borderColor: 'var(--border)', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
        <h2 className="text-base font-bold mb-5" style={{ color: 'var(--text)' }}>Rate this seller</h2>
        <div className="mb-4">
          <p className="text-xs font-medium mb-2" style={{ color: 'var(--text3)' }}>Score</p>
          <div className="flex gap-1.5">
            {[1,2,3,4,5].map(n => (
              <button key={n} type="button" onClick={() => setScore(n)}>
                <Star size={26} fill={n <= score ? '#16A34A' : 'none'} style={{ color: '#16A34A' }} />
              </button>
            ))}
          </div>
        </div>
        <div className="mb-5">
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text3)' }}>Comment (optional)</label>
          <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3}
            placeholder="How was the transaction?"
            className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none resize-none focus:ring-2 focus:ring-green-400/40"
            style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }} />
        </div>
        {mutation.isError && <p className="text-xs mb-3 text-red-500">Failed to submit.</p>}
        <div className="flex gap-2">
          <button onClick={onClose}
            className="flex-1 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-slate-50"
            style={{ borderColor: 'var(--border)', color: 'var(--text3)' }}>Cancel</button>
          <button onClick={() => mutation.mutate()} disabled={!score || mutation.isPending}
            className="flex-1 text-white py-2 rounded-lg text-sm font-semibold disabled:opacity-50 hover:opacity-85"
            style={{ backgroundColor: '#16A34A' }}>
            {mutation.isPending ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}

function BoostModal({ listingId, onClose, onBoost }) {
  const [loading, setLoading] = useState(false);

  async function handleBoost() {
    setLoading(true);
    await onBoost(listingId);
    setLoading(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#FFF7ED' }}>
          <Zap size={22} style={{ color: '#EA580C' }} />
        </div>
        <h2 className="text-lg font-bold mb-1" style={{ color: 'var(--text)' }}>Boost this listing</h2>
        <p className="text-sm mb-2" style={{ color: 'var(--text3)' }}>
          Your listing will appear at the top of search results for 7 days.
        </p>
        <p className="text-2xl font-black mb-5" style={{ color: '#EA580C' }}>$2.99</p>
        <button onClick={handleBoost} disabled={loading}
          className="w-full text-white py-2.5 rounded-xl font-semibold text-sm mb-3 disabled:opacity-50"
          style={{ backgroundColor: '#EA580C' }}>
          {loading ? 'Boosting...' : 'Boost for $2.99'}
        </button>
        <button onClick={onClose} className="text-sm" style={{ color: 'var(--muted)' }}>Cancel</button>
      </div>
    </div>
  );
}

export default function Profile() {
  const { user: me } = useAuth();
  const queryClient = useQueryClient();
  const [rateModal, setRateModal] = useState(null);
  const [boostModal, setBoostModal] = useState(null);
  const avatarInputRef = useRef(null);

  const { data, isLoading } = useQuery({
    queryKey: ['profile', me?.id],
    queryFn: () => api.get(`/users/${me.id}`).then(r => r.data),
    enabled: !!me,
  });

  const deleteListing = useMutation({
    mutationFn: (id) => api.delete(`/listings/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['profile', me?.id]),
  });

  const avatarMutation = useMutation({
    mutationFn: (file) => {
      const fd = new FormData();
      fd.append('avatar', file);
      return api.patch('/users/me/avatar', fd);
    },
    onSuccess: () => queryClient.invalidateQueries(['profile', me?.id]),
  });

  async function boostListing(id) {
    await api.post(`/listings/${id}/boost`);
    queryClient.invalidateQueries(['profile', me?.id]);
    queryClient.invalidateQueries(['listings']);
  }

  if (!me) return <div className="text-center py-20 text-sm" style={{ color: 'var(--muted)' }}>Please log in.</div>;
  if (isLoading) return <div className="text-center py-20 text-sm" style={{ color: 'var(--muted)' }}>Loading...</div>;
  if (!data) return null;

  const avgScore = data.ratings.length
    ? (data.ratings.reduce((s, r) => s + r.score, 0) / data.ratings.length).toFixed(1)
    : '—';
  const activeListings = data.listings.filter(l => l.status === 'active');
  const soldListings   = data.listings.filter(l => l.status === 'sold');

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {rateModal && <RateModal sellerId={me.id} listingId={rateModal} onClose={() => setRateModal(null)} />}
      {boostModal && <BoostModal listingId={boostModal} onClose={() => setBoostModal(null)} onBoost={boostListing} />}

      {/* Hidden avatar input */}
      <input ref={avatarInputRef} type="file" accept="image/*" className="hidden"
        onChange={e => e.target.files[0] && avatarMutation.mutate(e.target.files[0])} />

      {/* Profile header */}
      <div className="rounded-2xl border bg-white p-6 mb-8" style={{ borderColor: 'var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">

          {/* Avatar with upload button */}
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center text-2xl font-bold text-white"
              style={{ backgroundColor: '#16A34A' }}>
              {data.avatar_url
                ? <img src={data.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                : data.username[0].toUpperCase()
              }
            </div>
            <button
              onClick={() => avatarInputRef.current.click()}
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white shadow-md"
              style={{ backgroundColor: '#16A34A' }}
              title="Change profile picture">
              <Camera size={11} />
            </button>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>{data.username}</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text3)' }}>{data.school}</p>
            <p className="text-xs mt-1 flex items-center gap-1 justify-center sm:justify-start" style={{ color: 'var(--muted)' }}>
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
                  <p className="text-xl font-bold" style={{ color: '#16A34A' }}>{value}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Listings */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--text)' }}>
            <Package size={16} style={{ color: '#16A34A' }} /> My Listings
          </h2>
          <Link to="/listings/new"
            className="flex items-center gap-1.5 text-xs font-semibold text-white px-3 py-1.5 rounded-lg hover:opacity-85"
            style={{ backgroundColor: '#16A34A' }}>
            <Plus size={12} /> Post New
          </Link>
        </div>

        {data.listings.length === 0 ? (
          <div className="text-center py-12 rounded-xl border border-dashed bg-white" style={{ borderColor: 'var(--border)' }}>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>No listings yet.</p>
            <Link to="/listings/new" className="text-xs font-semibold mt-1.5 inline-block" style={{ color: '#16A34A' }}>
              Post your first item
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.listings.map(l => {
              const isBoosted = l.boosted && new Date(l.boosted_until) > new Date();
              return (
                <div key={l.id} className="rounded-xl border bg-white overflow-hidden" style={{ borderColor: 'var(--border)' }}>
                  <div className="aspect-video relative overflow-hidden" style={{ backgroundColor: 'var(--surface2)' }}>
                    {l.image_url
                      ? <img src={l.image_url} alt={l.title} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-2xl font-bold" style={{ color: 'var(--border)' }}>?</div>
                    }
                    <span className={`absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full ${
                      l.status === 'active' ? 'bg-green-50 text-green-700' :
                      l.status === 'sold'   ? 'bg-slate-100 text-slate-500' : 'bg-red-50 text-red-500'
                    }`}>{l.status}</span>
                    {isBoosted && (
                      <span className="absolute top-2 right-2 flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: '#EA580C' }}>
                        <Zap size={10} /> Boosted
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-semibold truncate text-sm" style={{ color: 'var(--text)' }}>{l.title}</p>
                    <p className="font-bold text-base mt-0.5" style={{ color: '#16A34A' }}>${Number(l.price).toFixed(2)}</p>
                    <div className="flex gap-2 mt-3">
                      <Link to={`/listings/${l.id}/edit`}
                        className="flex-1 flex items-center justify-center gap-1 text-xs font-medium py-1.5 rounded-lg border transition-colors hover:bg-slate-50"
                        style={{ borderColor: 'var(--border)', color: 'var(--text3)' }}>
                        <Pencil size={10} /> Edit
                      </Link>
                      {!isBoosted && l.status === 'active' && (
                        <button onClick={() => setBoostModal(l.id)}
                          className="flex-1 flex items-center justify-center gap-1 text-xs font-medium py-1.5 rounded-lg border transition-colors"
                          style={{ borderColor: '#FED7AA', color: '#EA580C', backgroundColor: '#FFF7ED' }}>
                          <Zap size={10} /> Boost
                        </button>
                      )}
                      <button onClick={() => deleteListing.mutate(l.id)}
                        className="flex-1 flex items-center justify-center gap-1 text-xs font-medium py-1.5 rounded-lg border transition-colors hover:bg-red-50"
                        style={{ borderColor: 'var(--border)', color: '#DC2626' }}>
                        <Trash2 size={10} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reviews */}
      <div>
        <h2 className="text-base font-bold flex items-center gap-2 mb-5" style={{ color: 'var(--text)' }}>
          <Star size={16} style={{ color: '#16A34A' }} /> Reviews ({data.ratings.length})
        </h2>
        {data.ratings.length === 0 ? (
          <div className="text-center py-12 rounded-xl border border-dashed bg-white" style={{ borderColor: 'var(--border)' }}>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>No reviews yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.ratings.map(r => (
              <div key={r.id} className="rounded-xl border bg-white p-4" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{r.rater_username}</span>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(n => (
                      <Star key={n} size={13} fill={n <= r.score ? '#16A34A' : 'none'} style={{ color: '#16A34A' }} />
                    ))}
                  </div>
                </div>
                {r.comment && <p className="text-sm" style={{ color: 'var(--text3)' }}>{r.comment}</p>}
                <p className="text-xs mt-2" style={{ color: 'var(--very-muted)' }}>{new Date(r.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
