import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Search, X, ChevronLeft, ChevronRight, Laptop, BookOpen, Sofa, Shirt, Wrench, Package } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import { useFeed } from '../hooks/useFeed';
import ListingCard from '../components/ListingCard';

const CATEGORIES = [
  { name: 'Electronics', Icon: Laptop,   color: '#0D9488', bg: '#F0FDFA' },
  { name: 'Textbooks',   Icon: BookOpen, color: '#D97706', bg: '#FFFBEB' },
  { name: 'Furniture',   Icon: Sofa,     color: '#B45309', bg: '#FEF9EE' },
  { name: 'Clothing',    Icon: Shirt,    color: '#A21CAF', bg: '#FDF4FF' },
  { name: 'Services',    Icon: Wrench,   color: '#7C3AED', bg: '#F5F3FF' },
  { name: 'Other',       Icon: Package,  color: '#EA580C', bg: '#FFF7ED' },
];

export default function Home() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState('');
  const [search, setSearch]     = useState(searchParams.get('search') || '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const q = searchParams.get('search');
    if (q) setSearch(q);
  }, [searchParams]);

  useFeed(user?.school);

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['listings', { category, search, minPrice, maxPrice }],
    queryFn: () => api.get('/listings', {
      params: {
        category:  category  || undefined,
        search:    search    || undefined,
        minPrice:  minPrice  || undefined,
        maxPrice:  maxPrice  || undefined,
      },
    }).then(r => r.data),
  });

  const hasFilters = category || minPrice || maxPrice;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const inputStyle = { backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>

      {/* ── Sidebar ──────────────────────────────────────── */}
      <div className="relative flex-shrink-0">
        {/* Sliding content */}
        <aside
          className="overflow-hidden border-r transition-all duration-300 h-full"
          style={{
            width: sidebarOpen ? '260px' : '0px',
            borderColor: 'var(--border)',
            backgroundColor: 'var(--surface)',
          }}>
          <div style={{ width: '260px' }} className="p-5 pt-6">

            {/* Search */}
            <p className="text-xs font-bold uppercase tracking-widest mb-2.5" style={{ color: 'var(--muted)' }}>Search</p>
            <div className="relative mb-5">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--muted)' }} />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/40"
                style={inputStyle}
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }}>
                  <X size={11} />
                </button>
              )}
            </div>

            {/* Categories */}
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>Category</p>
            <div className="space-y-0.5 mb-5">
              <button
                onClick={() => setCategory('')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor: !category ? '#F0FDFA' : 'transparent',
                  color: !category ? '#0D9488' : 'var(--text3)',
                }}>
                All categories
              </button>
              {CATEGORIES.map(({ name, Icon, color, bg }) => (
                <button key={name}
                  onClick={() => setCategory(category === name ? '' : name)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: category === name ? bg : 'transparent',
                    color: category === name ? color : 'var(--text3)',
                  }}>
                  <Icon size={13} strokeWidth={2} />
                  {name}
                </button>
              ))}
            </div>

            {/* Price range */}
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>Price</p>
            <div className="flex items-center gap-1.5 mb-1">
              <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)}
                className="w-full rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/40"
                style={inputStyle} />
              <span className="text-xs flex-shrink-0" style={{ color: 'var(--muted)' }}>to</span>
              <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
                className="w-full rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/40"
                style={inputStyle} />
            </div>
            {(minPrice || maxPrice) && (
              <button onClick={() => { setMinPrice(''); setMaxPrice(''); }}
                className="flex items-center gap-1 text-xs mt-1" style={{ color: 'var(--muted)' }}>
                <X size={10} /> Clear price
              </button>
            )}
          </div>
        </aside>

        {/* Toggle pill — always visible on sidebar's right edge */}
        <button
          onClick={() => setSidebarOpen(s => !s)}
          className="absolute top-6 -right-4 w-8 h-8 flex items-center justify-center rounded-md border shadow-sm z-10 transition-colors hover:bg-white"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text3)' }}>
          {sidebarOpen ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
        </button>
      </div>

      {/* ── Main ─────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col">

        {/* Header banner */}
        <div className="px-6 pt-8 pb-6"
          style={{
            background: 'linear-gradient(135deg, #F0FDFA 0%, #CCFBF1 50%, #F0FDFA 100%)',
            borderBottom: '1px solid var(--border)',
          }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium" style={{ color: '#0D9488' }}>{user?.school}</p>
              <h1 className="text-lg font-bold leading-tight" style={{ color: '#134E4A' }}>
                {greeting}, {user?.username}.
              </h1>
            </div>
            {hasFilters && (
              <button
                onClick={() => { setCategory(''); setMinPrice(''); setMaxPrice(''); setSearch(''); }}
                className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg border"
                style={{ borderColor: '#99F6E4', backgroundColor: '#F0FDFA', color: '#0D9488' }}>
                <X size={11} /> Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Listings area */}
        <div className="flex-1 p-6">
          {/* Count */}
          {!isLoading && (
            <p className="text-xs mb-4" style={{ color: 'var(--very-muted)' }}>
              {listings.length} {listings.length === 1 ? 'listing' : 'listings'}
              {category ? ` in ${category}` : ''}
              {search ? ` matching "${search}"` : ''}
            </p>
          )}

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="rounded-xl border bg-white animate-pulse" style={{ borderColor: 'var(--border)' }}>
                  <div className="aspect-square rounded-t-xl" style={{ backgroundColor: 'var(--surface2)' }} />
                  <div className="p-3 space-y-2">
                    <div className="h-3 rounded w-3/4" style={{ backgroundColor: 'var(--surface2)' }} />
                    <div className="h-3 rounded w-1/2" style={{ backgroundColor: 'var(--surface2)' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-24 rounded-2xl border bg-white" style={{ borderColor: 'var(--border)', borderStyle: 'dashed' }}>
              <p className="font-semibold mb-1" style={{ color: 'var(--text)' }}>No listings found</p>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>
                {search || category || minPrice || maxPrice ? 'Try adjusting your filters.' : 'Be the first to post something.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3">
              {listings.map(l => <ListingCard key={l.id} listing={l} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
