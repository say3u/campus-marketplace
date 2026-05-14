import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Star, Package, Calendar } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import ListingCard from '../components/ListingCard';

function StarPicker({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} type="button" onClick={() => onChange(n)}>
          <Star
            size={24}
            fill={n <= value ? '#CC0033' : 'none'}
            style={{ color: '#CC0033' }}
          />
        </button>
      ))}
    </div>
  );
}

function RateModal({ sellerId, listingId, onClose }) {
  const queryClient = useQueryClient();
  const [score, setScore] = [0, () => {}];
  let scoreVal = 0;
  let commentVal = '';

  const mutation = useMutation({
    mutationFn: ({ score, comment }) =>
      api.post(`/users/${sellerId}/rate`, { score, listing_id: listingId, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries(['profile', sellerId]);
      onClose();
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    mutation.mutate({ score: Number(data.get('score')), comment: data.get('comment') });
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl">
        <h2 className="text-xl font-black mb-6">Rate this seller</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-sm font-bold text-gray-700 mb-2">Score</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(n => (
                <label key={n} className="cursor-pointer">
                  <input type="radio" name="score" value={n} className="sr-only" required />
                  <Star size={28} style={{ color: '#CC0033' }} fill="none"
                    className="hover:fill-current transition-colors peer-checked:fill-current" />
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Comment (optional)</label>
            <textarea name="comment" rows={3} placeholder="How was the transaction?"
              className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:outline-none font-medium resize-none"
              onFocus={e => e.target.style.borderColor = '#CC0033'}
              onBlur={e => e.target.style.borderColor = '#f3f4f6'} />
          </div>
          {mutation.isError && <p className="text-red-500 text-sm">Failed to submit rating.</p>}
          <div className="flex gap-3">
            <button type="button" onClick={onClose}
              className="flex-1 border-2 border-gray-200 text-gray-600 py-2.5 rounded-xl font-bold hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={mutation.isPending}
              className="flex-1 text-white py-2.5 rounded-xl font-bold disabled:opacity-50"
              style={{ backgroundColor: '#CC0033' }}>
              {mutation.isPending ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Profile() {
  const { user: me } = useAuth();
  const queryClient = useQueryClient();
  const [rateModal, setRateModal] = window.React?.useState
    ? window.React.useState(null)
    : [null, () => {}];

  // Use React properly
  const [modal, setModal] = [null, () => {}];

  const { data, isLoading } = useQuery({
    queryKey: ['profile', me?.id],
    queryFn: () => api.get(`/users/${me.id}`).then(r => r.data),
    enabled: !!me,
  });

  const deleteListing = useMutation({
    mutationFn: (id) => api.delete(`/listings/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['profile', me?.id]),
  });

  if (isLoading || !data) return <div className="text-center py-20 text-gray-400">Loading...</div>;

  const avgScore = data.ratings.length
    ? (data.ratings.reduce((s, r) => s + r.score, 0) / data.ratings.length).toFixed(1)
    : '—';

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Profile header */}
      <div className="bg-white rounded-3xl border-2 border-gray-100 p-8 mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black text-white flex-shrink-0"
          style={{ backgroundColor: '#CC0033' }}>
          {data.username[0].toUpperCase()}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-3xl font-black text-gray-900">{data.username}</h1>
          <p className="text-gray-400 mt-1">{data.school}</p>
          <div className="flex gap-6 mt-4 justify-center sm:justify-start">
            <div className="text-center">
              <p className="text-2xl font-black" style={{ color: '#CC0033' }}>{avgScore}</p>
              <p className="text-xs text-gray-400 mt-0.5">Avg Rating</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-gray-900">{data.listings.length}</p>
              <p className="text-xs text-gray-400 mt-0.5">Listings</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-gray-900">{data.ratings.length}</p>
              <p className="text-xs text-gray-400 mt-0.5">Reviews</p>
            </div>
          </div>
        </div>
      </div>

      {/* Listings */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <Package size={20} style={{ color: '#CC0033' }} /> My Listings
          </h2>
          <Link to="/listings/new"
            className="text-sm font-bold text-white px-4 py-2 rounded-full"
            style={{ backgroundColor: '#CC0033' }}>
            + Post New
          </Link>
        </div>
        {data.listings.length === 0 ? (
          <p className="text-gray-400 text-center py-10">No listings yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.listings.map(l => (
              <div key={l.id} className="relative group">
                <ListingCard listing={{ ...l, username: data.username, rep_score: data.rep_score }} />
                <button
                  onClick={() => deleteListing.mutate(l.id)}
                  className="absolute top-2 right-2 bg-white text-red-500 text-xs font-bold px-2 py-1 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity border border-red-100">
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reviews */}
      <div>
        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 mb-4">
          <Star size={20} style={{ color: '#CC0033' }} /> Reviews
        </h2>
        {data.ratings.length === 0 ? (
          <p className="text-gray-400 text-center py-10">No reviews yet.</p>
        ) : (
          <div className="space-y-3">
            {data.ratings.map(r => (
              <div key={r.id} className="bg-white rounded-2xl border-2 border-gray-100 p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-800">{r.rater_username}</span>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(n => (
                      <Star key={n} size={14} fill={n <= r.score ? '#CC0033' : 'none'} style={{ color: '#CC0033' }} />
                    ))}
                  </div>
                </div>
                {r.comment && <p className="text-gray-500 text-sm">{r.comment}</p>}
                <p className="text-xs text-gray-300 mt-2 flex items-center gap-1">
                  <Calendar size={10} /> {new Date(r.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
