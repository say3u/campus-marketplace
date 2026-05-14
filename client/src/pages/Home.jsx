import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Laptop, BookOpen, Sofa, Shirt, Wrench, Package, LayoutGrid, SlidersHorizontal, X } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import { useFeed } from '../hooks/useFeed';
import ListingCard from '../components/ListingCard';

const CATEGORIES = [
  { label: 'All',         Icon: LayoutGrid },
  { label: 'Electronics', Icon: Laptop },
  { label: 'Textbooks',   Icon: BookOpen },
  { label: 'Furniture',   Icon: Sofa },
  { label: 'Clothing',    Icon: Shirt },
  { label: 'Services',    Icon: Wrench },
  { label: 'Other',       Icon: Package },
];

function EmptyState({ search, category }) {
  return (
    <div className="text-center py-20">
      <img
        src="https://images.unsplash.com/photo-1584907797015-7554cd315667?w=400&auto=format&fit=crop&q=60"
        alt="Empty"
        className="w-40 h-40 object-cover rounded-full mx-auto mb-6 opacity-40 grayscale"
      />
      <p className="text-gray-700 font-black text-2xl">No listings found</p>
      <p className="text-gray-400 mt-2">
        {search || category ? 'Try a different search or category.' : 'Be the first to post something!'}
      </p>
    </div>
  );
}

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
    queryFn: () => api.get('/listings', { params: { category: category || undefined, search: search || undefined, minPrice: minPrice || undefined, maxPrice: maxPrice || undefined } }).then(r => r.data),
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Search */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Search listings..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border-2 border-gray-200 rounded-2xl px-4 py-3.5 text-base focus:outline-none bg-white shadow-sm font-medium"
          onFocus={e => e.target.style.borderColor = '#CC0033'}
          onBlur={e => e.target.style.borderColor = '#e5e7eb'}
        />
        <button onClick={() => setShowFilters(f => !f)}
          className="flex items-center gap-2 px-4 py-3 rounded-2xl border-2 font-bold text-sm transition-all"
          style={{ borderColor: showFilters ? '#CC0033' : '#e5e7eb', color: showFilters ? '#CC0033' : '#6b7280', backgroundColor: showFilters ? '#fff0f3' : 'white' }}>
          <SlidersHorizontal size={16} /> Filters
        </button>
      </div>

      {/* Price filters */}
      {showFilters && (
        <div className="bg-white border-2 border-gray-100 rounded-2xl p-4 mb-4 flex flex-wrap items-center gap-3">
          <span className="text-sm font-bold text-gray-700">Price:</span>
          <div className="flex items-center gap-2">
            <input type="number" placeholder="Min $" value={minPrice} onChange={e => setMinPrice(e.target.value)}
              className="w-24 border-2 border-gray-100 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none"
              onFocus={e => e.target.style.borderColor = '#CC0033'}
              onBlur={e => e.target.style.borderColor = '#f3f4f6'} />
            <span className="text-gray-400">—</span>
            <input type="number" placeholder="Max $" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
              className="w-24 border-2 border-gray-100 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none"
              onFocus={e => e.target.style.borderColor = '#CC0033'}
              onBlur={e => e.target.style.borderColor = '#f3f4f6'} />
          </div>
          {(minPrice || maxPrice) && (
            <button onClick={() => { setMinPrice(''); setMaxPrice(''); }}
              className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-gray-600">
              <X size={12} /> Clear
            </button>
          )}
        </div>
      )}


      {/* Category pills */}
      <div className="flex gap-2 flex-wrap mb-8">
        {CATEGORIES.map(({ label, Icon }) => {
          const active = (label === 'All' && !category) || category === label;
          return (
            <button
              key={label}
              onClick={() => setCategory(label === 'All' ? '' : label)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all border-2"
              style={{
                backgroundColor: active ? '#CC0033' : 'white',
                color: active ? 'white' : '#4b5563',
                borderColor: active ? '#CC0033' : '#e5e7eb',
              }}
            >
              <Icon size={14} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Listings */}
      {isLoading ? (
        <div className="text-center py-20 text-gray-400">Loading listings...</div>
      ) : listings.length === 0 ? (
        <EmptyState search={search} category={category} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {listings.map(l => <ListingCard key={l.id} listing={l} />)}
        </div>
      )}
    </div>
  );
}
