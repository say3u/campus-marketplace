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

  const inputStyle = {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    color: '#0F172A',
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Search row */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="Search listings..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/40"
            style={inputStyle}
          />
        </div>
        <button
          onClick={() => setShowFilters(f => !f)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-colors"
          style={{
            backgroundColor: showFilters || hasFilters ? '#EFF6FF' : '#FFFFFF',
            borderColor: showFilters || hasFilters ? '#93C5FD' : '#E2E8F0',
            color: showFilters || hasFilters ? '#2563EB' : '#64748B',
          }}
        >
          <SlidersHorizontal size={14} />
          Filters
          {hasFilters && <span className="w-1.5 h-1.5 rounded-full ml-0.5" style={{ backgroundColor: '#3B82F6' }} />}
        </button>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="rounded-lg p-4 mb-4 flex flex-wrap items-center gap-4 border bg-white"
          style={{ borderColor: '#E2E8F0' }}>
          <span className="text-xs font-medium" style={{ color: '#94A3B8' }}>Price range</span>
          <div className="flex items-center gap-2">
            <input type="number" placeholder="Min $" value={minPrice} onChange={e => setMinPrice(e.target.value)}
              className="w-20 rounded px-2 py-1 text-xs focus:outline-none border"
              style={{ backgroundColor: '#F8FAFC', borderColor: '#E2E8F0', color: '#0F172A' }} />
            <span style={{ color: '#CBD5E1' }} className="text-xs">—</span>
            <input type="number" placeholder="Max $" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
              className="w-20 rounded px-2 py-1 text-xs focus:outline-none border"
              style={{ backgroundColor: '#F8FAFC', borderColor: '#E2E8F0', color: '#0F172A' }} />
          </div>
          {(minPrice || maxPrice) && (
            <button onClick={() => { setMinPrice(''); setMaxPrice(''); }}
              className="flex items-center gap-1 text-xs transition-colors hover:text-slate-500" style={{ color: '#94A3B8' }}>
              <X size={12} /> Clear
            </button>
          )}
        </div>
      )}

      {/* Category tabs */}
      <div className="flex gap-0 flex-wrap mb-6 border-b" style={{ borderColor: '#E2E8F0' }}>
        {CATEGORIES.map(cat => {
          const active = (cat === 'All' && !category) || category === cat;
          return (
            <button key={cat} onClick={() => setCategory(cat === 'All' ? '' : cat)}
              className="px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px"
              style={{
                borderBottomColor: active ? '#3B82F6' : 'transparent',
                color: active ? '#2563EB' : '#94A3B8',
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Count */}
      {!isLoading && (
        <p className="text-xs mb-4" style={{ color: '#CBD5E1' }}>
          {listings.length} {listings.length === 1 ? 'listing' : 'listings'}
          {category ? ` in ${category}` : ''}
          {search ? ` for "${search}"` : ''}
        </p>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-white animate-pulse" style={{ borderColor: '#E2E8F0' }}>
              <div className="aspect-square rounded-t-xl" style={{ backgroundColor: '#F1F5F9' }} />
              <div className="p-3 space-y-2">
                <div className="h-3 rounded w-3/4" style={{ backgroundColor: '#F1F5F9' }} />
                <div className="h-3 rounded w-1/2" style={{ backgroundColor: '#F1F5F9' }} />
              </div>
            </div>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20 rounded-xl border bg-white" style={{ borderColor: '#E2E8F0', borderStyle: 'dashed' }}>
          <p className="font-semibold mb-1" style={{ color: '#0F172A' }}>No listings found</p>
          <p className="text-sm" style={{ color: '#94A3B8' }}>
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
