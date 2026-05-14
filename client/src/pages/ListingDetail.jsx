import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Pencil, Trash2, MessageCircle, Flag, CheckCircle } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../hooks/useAuth';

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

  if (isLoading) return <div className="text-center py-20 text-gray-400">Loading...</div>;
  if (!listing) return <div className="text-center py-20 text-gray-400">Listing not found.</div>;

  const isSeller = user?.id === listing.seller_id;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl border-2 border-gray-100 overflow-hidden shadow-sm">
        {/* Image */}
        {listing.image_url
          ? <img src={listing.image_url} alt={listing.title} className="w-full max-h-96 object-cover" />
          : <div className="w-full h-56 bg-gray-100 flex items-center justify-center text-gray-300 text-6xl font-black">?</div>
        }

        <div className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-black text-gray-900">{listing.title}</h1>
              <p className="text-4xl font-black mt-2" style={{ color: '#CC0033' }}>
                ${Number(listing.price).toFixed(2)}
              </p>
            </div>
            <span className={`px-3 py-1.5 rounded-full text-sm font-bold flex-shrink-0 ${
              listing.status === 'active'  ? 'bg-green-100 text-green-700' :
              listing.status === 'sold'    ? 'bg-gray-200 text-gray-600'   : 'bg-red-100 text-red-600'
            }`}>{listing.status}</span>
          </div>

          {/* Description */}
          {listing.description && (
            <p className="text-gray-600 leading-relaxed mb-6">{listing.description}</p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-gray-100 text-gray-600 text-sm font-bold px-3 py-1.5 rounded-full">{listing.category}</span>
            <span className="bg-gray-100 text-gray-600 text-sm font-bold px-3 py-1.5 rounded-full">{listing.school}</span>
          </div>

          {/* Seller */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl mb-6">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm"
              style={{ backgroundColor: '#CC0033' }}>
              {listing.username[0].toUpperCase()}
            </div>
            <div>
              <p className="font-black text-gray-900">{listing.username}</p>
              <p className="text-sm text-gray-400">{listing.rep_score} reputation</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            {isSeller ? (
              <>
                <Link to={`/listings/${id}/edit`}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold border-2 border-gray-200 text-gray-700 hover:bg-gray-50">
                  <Pencil size={15} /> Edit
                </Link>
                {listing.status === 'active' && (
                  <button onClick={() => markSold.mutate()} disabled={markSold.isPending}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold border-2 border-green-200 text-green-700 hover:bg-green-50">
                    <CheckCircle size={15} /> Mark as Sold
                  </button>
                )}
                <button onClick={() => { if (confirm('Delete this listing?')) deleteListing.mutate(); }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold border-2 border-red-100 hover:bg-red-50"
                  style={{ color: '#CC0033' }}>
                  <Trash2 size={15} /> Delete
                </button>
              </>
            ) : user && listing.status === 'active' ? (
              <>
                <button onClick={() => startConvo.mutate()} disabled={startConvo.isPending}
                  className="flex items-center gap-2 text-white px-6 py-2.5 rounded-xl font-bold disabled:opacity-50"
                  style={{ backgroundColor: '#CC0033' }}>
                  <MessageCircle size={15} />
                  {startConvo.isPending ? 'Opening...' : 'Message Seller'}
                </button>
                <button onClick={() => report.mutate()} disabled={reported}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold border-2 border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                  <Flag size={15} /> {reported ? 'Reported' : 'Report'}
                </button>
              </>
            ) : !user ? (
              <Link to="/login" className="text-white px-6 py-2.5 rounded-xl font-bold" style={{ backgroundColor: '#CC0033' }}>
                Login to Message Seller
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
