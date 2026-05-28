import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import { useFeed } from '../hooks/useFeed';
import ListingCard from '../components/ListingCard';

const CATEGORIES = ['All', 'Electronics', 'Textbooks', 'Furniture', 'Clothing', 'Services', 'Other'];

export default function Home() {
  const { user } = useAuth();
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useFeed(user?.school);

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['listings', { category, search, minPrice, maxPrice }],
    queryFn: () => api.get('/listings', {
      params: {
        category: category || undefined,
        search: search || undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
      }
    }).then(r => r.data),
  });

  const hasFilters = category || minPrice || maxPrice;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Search row */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search listings..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowFilters(f => !f)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-md border text-sm font-medium transition-colors ${
            showFilters || hasFilters
              ? 'border-red-300 text-red-600 bg-red-50'
              : 'border-gray-300 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <SlidersHorizontal size={14} />
          Filters
          {hasFilters && <span className="w-1.5 h-1.5 rounded-full bg-red-500 ml-0.5" />}
        </button>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-600">Price range</label>
            <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)}
              className="w-20 border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-red-300" />
            <span className="text-gray-400 text-xs">to</span>
            <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
              className="w-20 border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-red-300" />
          </div>
          {(minPrice || maxPrice) && (
            <button onClick={() => { setMinPrice(''); setMaxPrice(''); }}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600">
              <X size={12} /> Clear price
            </button>
          )}
        </div>
      )}

      {/* Category tabs */}
      <div className="flex gap-1 flex-wrap mb-6 border-b border-gray-200 pb-0">
        {CATEGORIES.map(cat => {
          const active = (cat === 'All' && !category) || category === cat;
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat === 'All' ? '' : cat)}
              className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                active
                  ? 'border-b-2 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              style={active ? { borderBottomColor: '#CC0033', color: '#CC0033' } : {}}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Results count */}
      {!isLoading && (
        <p className="text-xs text-gray-400 mb-4">
          {listings.length} {listings.length === 1 ? 'listing' : 'listings'}
          {category ? ` in ${category}` : ''}
          {search ? ` matching "${search}"` : ''}
        </p>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg animate-pulse">
              <div className="aspect-square rounded-t-lg bg-gray-200" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gray-200 rounded-lg">
          <p className="text-gray-900 font-semibold mb-1">No listings found</p>
          <p className="text-sm text-gray-500">
            {search || category ? 'Try adjusting your filters.' : 'Be the first to post something.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {listings.map(l => <ListingCard key={l.id} listing={l} />)}
        </div>
      )}
    </div>
  );
}
