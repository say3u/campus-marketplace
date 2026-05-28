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
      params: { category: category || undefined, search: search || undefined, minPrice: minPrice || undefined, maxPrice: maxPrice || undefined }
    }).then(r => r.data),
  });

  const hasFilters = category || minPrice || maxPrice;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6" style={{ backgroundColor: '#0f1117' }}>
      {/* Search row */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#475569' }} />
          <input
            type="text"
            placeholder="Search listings..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/40"
            style={{ backgroundColor: '#16181f', border: '1px solid #2a2d3e', color: '#f1f5f9' }}
          />
        </div>
        <button
          onClick={() => setShowFilters(f => !f)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-md border text-sm font-medium transition-colors"
          style={{
            backgroundColor: showFilters || hasFilters ? 'rgba(79,70,229,0.1)' : '#16181f',
            borderColor: showFilters || hasFilters ? '#F97316' : '#2a2d3e',
            color: showFilters || hasFilters ? '#F97316' : '#94a3b8',
          }}
        >
          <SlidersHorizontal size={14} />
          Filters
          {hasFilters && <span className="w-1.5 h-1.5 rounded-full ml-0.5" style={{ backgroundColor: '#F97316' }} />}
        </button>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="rounded-md p-4 mb-4 flex flex-wrap items-center gap-4 border"
          style={{ backgroundColor: '#16181f', borderColor: '#2a2d3e' }}>
          <span className="text-xs font-medium" style={{ color: '#64748b' }}>Price range</span>
          <div className="flex items-center gap-2">
            <input type="number" placeholder="Min $" value={minPrice} onChange={e => setMinPrice(e.target.value)}
              className="w-20 rounded px-2 py-1 text-xs focus:outline-none"
              style={{ backgroundColor: '#0f1117', border: '1px solid #2a2d3e', color: '#f1f5f9' }} />
            <span style={{ color: '#334155' }} className="text-xs">—</span>
            <input type="number" placeholder="Max $" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
              className="w-20 rounded px-2 py-1 text-xs focus:outline-none"
              style={{ backgroundColor: '#0f1117', border: '1px solid #2a2d3e', color: '#f1f5f9' }} />
          </div>
          {(minPrice || maxPrice) && (
            <button onClick={() => { setMinPrice(''); setMaxPrice(''); }}
              className="flex items-center gap-1 text-xs hover:text-slate-300 transition-colors" style={{ color: '#475569' }}>
              <X size={12} /> Clear
            </button>
          )}
        </div>
      )}

      {/* Category tabs */}
      <div className="flex gap-0 flex-wrap mb-6 border-b" style={{ borderColor: '#2a2d3e' }}>
        {CATEGORIES.map(cat => {
          const active = (cat === 'All' && !category) || category === cat;
          return (
            <button key={cat} onClick={() => setCategory(cat === 'All' ? '' : cat)}
              className="px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px"
              style={{
                borderBottomColor: active ? '#F97316' : 'transparent',
                color: active ? '#F97316' : '#64748b',
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Count */}
      {!isLoading && (
        <p className="text-xs mb-4" style={{ color: '#334155' }}>
          {listings.length} {listings.length === 1 ? 'listing' : 'listings'}
          {category ? ` in ${category}` : ''}
          {search ? ` for "${search}"` : ''}
        </p>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="rounded-xl border animate-pulse" style={{ backgroundColor: '#16181f', borderColor: '#2a2d3e' }}>
              <div className="aspect-square rounded-t-xl" style={{ backgroundColor: '#1e2130' }} />
              <div className="p-3 space-y-2">
                <div className="h-3 rounded w-3/4" style={{ backgroundColor: '#1e2130' }} />
                <div className="h-3 rounded w-1/2" style={{ backgroundColor: '#1e2130' }} />
              </div>
            </div>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20 rounded-xl border" style={{ borderColor: '#2a2d3e', borderStyle: 'dashed' }}>
          <p className="text-white font-semibold mb-1">No listings found</p>
          <p className="text-sm" style={{ color: '#475569' }}>
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
