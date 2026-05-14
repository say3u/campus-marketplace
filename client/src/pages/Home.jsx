import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import { useFeed } from '../hooks/useFeed';
import ListingCard from '../components/ListingCard';

const CATEGORIES = ['All', 'Electronics', 'Textbooks', 'Furniture', 'Clothing', 'Services', 'Other'];

export default function Home() {
  const { user } = useAuth();
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');

  useFeed(user?.school);

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['listings', { category, search }],
    queryFn: () => api.get('/listings', { params: { category: category || undefined, search: search || undefined } }).then(r => r.data),
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Search + filter bar */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Search listings..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 flex-1 min-w-0 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat === 'All' ? '' : cat)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                (cat === 'All' && !category) || category === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border text-gray-600 hover:border-indigo-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-gray-400">Loading listings...</div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20 text-gray-400">No listings found.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {listings.map(l => <ListingCard key={l.id} listing={l} />)}
        </div>
      )}
    </div>
  );
}
