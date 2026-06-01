import { useQuery } from '@tanstack/react-query';
import { Heart } from 'lucide-react';
import api from '../lib/api';
import ListingCard from '../components/ListingCard';

export default function Favorites() {
  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => api.get('/listings/favorites').then(r => r.data),
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-xl font-bold flex items-center gap-2 mb-6" style={{ color: 'var(--text)' }}>
        <Heart size={18} style={{ color: '#f43f5e' }} fill="#f43f5e" /> Saved Listings
      </h1>
      {isLoading ? (
        <p className="text-sm" style={{ color: 'var(--muted)' }}>Loading...</p>
      ) : listings.length === 0 ? (
        <div className="text-center py-20 rounded-xl border border-dashed" style={{ borderColor: 'var(--border)' }}>
          <Heart size={32} className="mx-auto mb-3" style={{ color: 'var(--border)' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>No saved listings yet</p>
          <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Tap the heart on any listing to save it here</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {listings.map(l => <ListingCard key={l.id} listing={l} initialFavorited={true} />)}
        </div>
      )}
    </div>
  );
}
