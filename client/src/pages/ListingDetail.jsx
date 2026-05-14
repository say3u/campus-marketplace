import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../lib/api';
import { useAuth } from '../hooks/useAuth';

export default function ListingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: listing, isLoading } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => api.get(`/listings/${id}`).then(r => r.data),
  });

  const startConvo = useMutation({
    mutationFn: () => api.post('/conversations', { listing_id: id }),
    onSuccess: (res) => navigate(`/messages/${res.data.id}`),
  });

  const report = useMutation({
    mutationFn: () => api.post('/reports', { target_type: 'listing', target_id: id, reason: 'Inappropriate listing' }),
    onSuccess: () => alert('Report submitted. Thank you.'),
  });

  if (isLoading) return <div className="text-center py-20 text-gray-400">Loading...</div>;
  if (!listing) return <div className="text-center py-20 text-gray-400">Listing not found.</div>;

  const isSeller = user?.id === listing.seller_id;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl border overflow-hidden">
        {listing.image_url
          ? <img src={listing.image_url} alt={listing.title} className="w-full max-h-80 object-cover" />
          : <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-6xl">📦</div>
        }
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold">{listing.title}</h1>
              <p className="text-3xl font-bold text-indigo-600 mt-1">${Number(listing.price).toFixed(2)}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              listing.status === 'active' ? 'bg-green-100 text-green-700' :
              listing.status === 'sold'   ? 'bg-red-100 text-red-600'   : 'bg-gray-100 text-gray-500'
            }`}>{listing.status}</span>
          </div>

          <p className="mt-4 text-gray-600">{listing.description || 'No description provided.'}</p>

          <div className="mt-4 flex gap-4 text-sm text-gray-400">
            <span className="bg-gray-100 px-2 py-1 rounded-full">{listing.category}</span>
            <span>Seller: <strong>{listing.username}</strong> · ⭐ {listing.rep_score}</span>
            <span>{listing.school}</span>
          </div>

          <div className="mt-6 flex gap-3">
            {!isSeller && user && listing.status === 'active' && (
              <button
                onClick={() => startConvo.mutate()}
                disabled={startConvo.isPending}
                className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50"
              >
                {startConvo.isPending ? 'Opening chat...' : 'Message Seller'}
              </button>
            )}
            {!isSeller && user && (
              <button
                onClick={() => report.mutate()}
                className="px-4 py-2.5 border border-red-300 text-red-500 rounded-xl text-sm hover:bg-red-50"
              >
                Report
              </button>
            )}
            {!user && (
              <p className="text-gray-400 text-sm">Login to contact the seller.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
