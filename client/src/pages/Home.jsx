import { useState, useEffect, useRef, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Search, X, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Laptop, BookOpen, Sofa, Shirt, Wrench, Package } from 'lucide-react';
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
  const [priceOpen, setPriceOpen] = useState(true);
  const [catOpen, setCatOpen] = useState(true);

  useEffect(() => {
    const q = searchParams.get('search');
    if (q) setSearch(q);
  }, [searchParams]);

  useFeed(user?.school);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['listings', { category, search, minPrice, maxPrice }],
    queryFn: ({ pageParam }) => api.get('/listings', {
      params: {
        category:  category  || undefined,
        search:    search    || undefined,
        minPrice:  minPrice  || undefined,
        maxPrice:  maxPrice  || undefined,
        cursor:    pageParam || undefined,
        limit:     20,
      },
    }).then(r => r.data),
    getNextPageParam: last => last.nextCursor ?? undefined,
    initialPageParam: undefined,
  });

  const listings = data?.pages.flatMap(p => p.items) ?? [];

  // Infinite scroll sentinel
  const sentinelRef = useRef(null);
  const onIntersect = useCallback(entries => {
    if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(onIntersect, { rootMargin: '200px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, [onIntersect]);

  const hasFilters = category || minPrice || maxPrice;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const inputStyle = { backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' };

  return (
    <div className="flex overflow-hidden" style={{ backgroundColor: 'var(--bg)', height: 'calc(100vh - 64px)' }}>

      {/* ── Sidebar ──────────────────────────────────────── */}
      <div className="relative flex-shrink-0">
        {/* Sliding content */}
        <aside
          className="overflow-y-auto border-r transition-all duration-300 h-full"
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

            {/* Price section */}
            <button onClick={() => setPriceOpen(o => !o)}
              className="w-full flex items-center justify-between mb-2 hover:opacity-70 transition-opacity">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--muted)' }}>Price</p>
              {priceOpen ? <ChevronUp size={12} style={{ color: 'var(--muted)' }} /> : <ChevronDown size={12} style={{ color: 'var(--muted)' }} />}
            </button>
            {priceOpen && (
              <>
                {/* Custom range */}
                <div className="flex items-center gap-1.5 mb-2">
                  <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)}
                    className="w-full rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/40"
                    style={inputStyle} />
                  <span className="text-xs flex-shrink-0" style={{ color: 'var(--muted)' }}>–</span>
                  <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
                    className="w-full rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/40"
                    style={inputStyle} />
                </div>
                {/* Budget presets */}
                <div className="grid grid-cols-2 gap-1 mb-1">
                  {[
                    { label: 'Under $25',  min: '',    max: '25'  },
                    { label: 'Under $50',  min: '',    max: '50'  },
                    { label: 'Under $100', min: '',    max: '100' },
                    { label: '$100+',      min: '100', max: ''    },
                  ].map(({ label, min, max }) => {
                    const active = minPrice === min && maxPrice === max;
                    return (
                      <button key={label}
                        onClick={() => { setMinPrice(active ? '' : min); setMaxPrice(active ? '' : max); }}
                        className="text-xs font-medium py-1 px-1.5 rounded border transition-colors"
                        style={{
                          backgroundColor: active ? 'var(--brand-bg)' : 'transparent',
                          borderColor: active ? 'var(--brand)' : 'var(--border)',
                          color: active ? 'var(--brand-dark)' : 'var(--muted)',
                        }}>
                        {label}
                      </button>
                    );
                  })}
                </div>
                {(minPrice || maxPrice) && (
                  <button onClick={() => { setMinPrice(''); setMaxPrice(''); }}
                    className="flex items-center gap-1 text-xs mt-0.5 mb-1" style={{ color: 'var(--muted)' }}>
                    <X size={10} /> Clear
                  </button>
                )}
              </>
            )}

            {/* Categories section */}
            <button onClick={() => setCatOpen(o => !o)}
              className="w-full flex items-center justify-between mt-4 mb-2 hover:opacity-70 transition-opacity">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--muted)' }}>Category</p>
              {catOpen ? <ChevronUp size={12} style={{ color: 'var(--muted)' }} /> : <ChevronDown size={12} style={{ color: 'var(--muted)' }} />}
            </button>
            {catOpen && (
              <div className="space-y-0.5 mb-5">
                <button
                  onClick={() => setCategory('')}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: !category ? 'var(--brand-bg)' : 'transparent',
                    color: !category ? 'var(--brand-dark)' : 'var(--text3)',
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
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">

        {/* Header banner */}
        <div className="px-6 pt-8 pb-6 flex-shrink-0"
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

        {/* Listings area — only this scrolls */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Count */}
          {!isLoading && listings.length > 0 && (
            <p className="text-xs mb-4" style={{ color: 'var(--very-muted)' }}>
              {listings.length}{hasNextPage ? '+' : ''} {listings.length === 1 ? 'listing' : 'listings'}
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
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3">
                {listings.map(l => <ListingCard key={l.id} listing={l} />)}
              </div>
              {/* Infinite scroll sentinel */}
              <div ref={sentinelRef} className="h-12 flex items-center justify-center mt-4">
                {isFetchingNextPage && (
                  <div className="flex gap-1">
                    {[0,1,2].map(i => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce"
                        style={{ backgroundColor: 'var(--brand)', animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
