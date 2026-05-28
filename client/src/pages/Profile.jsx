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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl">
        <h2 className="text-xl font-black mb-6">Rate this seller</h2>
        <div className="mb-4">
          <p className="text-sm font-bold text-gray-700 mb-2">Score</p>
          <div className="flex gap-1">
            {[1,2,3,4,5].map(n => (
              <button key={n} type="button" onClick={() => setScore(n)}>
                <Star size={28} fill={n <= score ? '#4F46E5' : 'none'} style={{ color: '#4F46E5' }} />
              </button>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Comment (optional)</label>
          <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3}
            placeholder="How was the transaction?"
            className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:outline-none font-medium resize-none"
            onFocus={e => e.target.style.borderColor = '#4F46E5'}
            onBlur={e => e.target.style.borderColor = '#f3f4f6'} />
        </div>
        {mutation.isError && <p className="text-sm mb-4" style={{ color: '#4F46E5' }}>Failed to submit.</p>}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 border-2 border-gray-200 text-gray-600 py-2.5 rounded-xl font-bold hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={() => mutation.mutate()} disabled={!score || mutation.isPending}
            className="flex-1 text-white py-2.5 rounded-xl font-bold disabled:opacity-50"
            style={{ backgroundColor: '#4F46E5' }}>
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

  if (!me) return <div className="text-center py-20 text-gray-400">Please log in.</div>;
  if (isLoading) return <div className="text-center py-20 text-gray-400">Loading...</div>;
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
      <div className="bg-white rounded-3xl border-2 border-gray-100 p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black text-white flex-shrink-0"
            style={{ backgroundColor: '#4F46E5' }}>
            {data.username[0].toUpperCase()}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl font-black text-gray-900">{data.username}</h1>
            <p className="text-gray-400 mt-1">{data.school}</p>
            <p className="text-gray-400 text-sm mt-0.5 flex items-center gap-1 justify-center sm:justify-start">
              <Calendar size={12} /> Joined {new Date(data.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
            <div className="flex gap-8 mt-5 justify-center sm:justify-start">
              {[
                { label: 'Avg Rating', value: avgScore },
                { label: 'Active',     value: activeListings.length },
                { label: 'Sold',       value: soldListings.length },
                { label: 'Reviews',    value: data.ratings.length },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <p className="text-2xl font-black" style={{ color: '#4F46E5' }}>{value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Listings */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <Package size={20} style={{ color: '#4F46E5' }} /> My Listings
          </h2>
          <Link to="/listings/new"
            className="flex items-center gap-1.5 text-sm font-bold text-white px-4 py-2 rounded-full"
            style={{ backgroundColor: '#4F46E5' }}>
            <Plus size={14} /> Post New
          </Link>
        </div>

        {data.listings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">No listings yet.</p>
            <Link to="/listings/new" className="text-sm font-bold mt-2 inline-block" style={{ color: '#4F46E5' }}>
              Post your first item
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.listings.map(l => (
              <div key={l.id} className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden shadow-sm">
                <div className="aspect-video bg-gray-100 relative">
                  {l.image_url
                    ? <img src={l.image_url} alt={l.title} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl font-black">?</div>
                  }
                  <span className={`absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full ${
                    l.status === 'active' ? 'bg-green-100 text-green-700' :
                    l.status === 'sold'   ? 'bg-gray-200 text-gray-600' : 'bg-red-100 text-red-600'
                  }`}>{l.status}</span>
                </div>
                <div className="p-3">
                  <p className="font-bold text-gray-900 truncate text-sm">{l.title}</p>
                  <p className="font-black text-lg mt-0.5" style={{ color: '#4F46E5' }}>${Number(l.price).toFixed(2)}</p>
                  <div className="flex gap-2 mt-3">
                    <Link to={`/listings/${l.id}/edit`}
                      className="flex-1 flex items-center justify-center gap-1 text-xs font-bold py-1.5 rounded-lg border-2 border-gray-200 text-gray-600 hover:border-gray-400">
                      <Pencil size={11} /> Edit
                    </Link>
                    <button onClick={() => deleteListing.mutate(l.id)}
                      className="flex-1 flex items-center justify-center gap-1 text-xs font-bold py-1.5 rounded-lg border-2 border-red-100 hover:bg-red-50"
                      style={{ color: '#4F46E5' }}>
                      <Trash2 size={11} /> Delete
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
        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 mb-5">
          <Star size={20} style={{ color: '#4F46E5' }} /> Reviews ({data.ratings.length})
        </h2>
        {data.ratings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">No reviews yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.ratings.map(r => (
              <div key={r.id} className="bg-white rounded-2xl border-2 border-gray-100 p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-800">{r.rater_username}</span>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(n => (
                      <Star key={n} size={14} fill={n <= r.score ? '#4F46E5' : 'none'} style={{ color: '#4F46E5' }} />
                    ))}
                  </div>
                </div>
                {r.comment && <p className="text-gray-500 text-sm">{r.comment}</p>}
                <p className="text-xs text-gray-300 mt-2">{new Date(r.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
