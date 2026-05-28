import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Search, ArrowRight, ShieldCheck, Tag, MessageCircle,
  Laptop, BookOpen, Sofa, Shirt, Wrench, Package,
} from 'lucide-react';
import api from '../lib/api';

const CATEGORIES = [
  { name: 'Electronics', Icon: Laptop,   bg: '#F0FDF4', color: '#16A34A' },
  { name: 'Textbooks',   Icon: BookOpen, bg: '#FFFBEB', color: '#D97706' },
  { name: 'Furniture',   Icon: Sofa,     bg: '#FEF9EE', color: '#B45309' },
  { name: 'Clothing',    Icon: Shirt,    bg: '#FDF4FF', color: '#A21CAF' },
  { name: 'Services',    Icon: Wrench,   bg: '#F5F3FF', color: '#7C3AED' },
  { name: 'Other',       Icon: Package,  bg: '#FFF7ED', color: '#EA580C' },
];

const CATEGORY_COLORS = {
  Electronics: { bg: '#F0FDF4', color: '#16A34A' },
  Textbooks:   { bg: '#FFFBEB', color: '#D97706' },
  Furniture:   { bg: '#FEF9EE', color: '#B45309' },
  Clothing:    { bg: '#FDF4FF', color: '#A21CAF' },
  Services:    { bg: '#F5F3FF', color: '#7C3AED' },
  Other:       { bg: '#FFF7ED', color: '#EA580C' },
};

export default function Landing() {
  const [input, setInput]       = useState('');
  const [query, setQuery]       = useState('');

  const { data: listings = [], isLoading, isFetching } = useQuery({
    queryKey: ['landing-listings', query],
    queryFn: () =>
      api.get('/listings', { params: query ? { search: query, limit: 24 } : { limit: 12 } })
         .then(r => r.data),
    staleTime: 60_000,
  });

  function handleSearch(e) {
    e.preventDefault();
    setQuery(input.trim());
  }

  const searching = isFetching && query;

  return (
    <div style={{ backgroundColor: 'var(--bg)' }}>

      {/* ── Hero ─────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-6 pt-20 pb-12 text-center">
        <h1 className="text-5xl sm:text-6xl font-extrabold leading-[1.1] mb-4 tracking-tight"
          style={{ color: 'var(--text)' }}>
          Buy &amp; sell anything<br />
          <span style={{ color: '#16A34A' }}>on your campus.</span>
        </h1>
        <p className="text-lg leading-relaxed max-w-md mx-auto mb-8"
          style={{ color: 'var(--text3)' }}>
          Textbooks, furniture, electronics and more &mdash; verified students only. Zero fees.
        </p>

        <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--muted)' }} />
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Search for anything..."
              className="w-full rounded-xl pl-10 pr-4 py-3 text-sm border focus:outline-none focus:ring-2 focus:ring-green-400/40"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
            />
          </div>
          <button type="submit"
            className="font-semibold text-white px-5 py-3 rounded-xl text-sm transition-opacity hover:opacity-85 whitespace-nowrap"
            style={{ backgroundColor: '#16A34A' }}>
            Search
          </button>
        </form>
      </div>

      {/* ── Categories ───────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 pb-14">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
          {CATEGORIES.map(({ name, Icon, bg, color }) => (
            <button key={name} onClick={() => { setInput(name); setQuery(name); }}
              className="flex flex-col items-center gap-2 py-4 px-2 rounded-xl border text-center transition-all hover:scale-105 hover:shadow-md"
              style={{ backgroundColor: 'var(--surface)', borderColor: query === name ? '#16A34A' : 'var(--border)' }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: bg }}>
                <Icon size={20} style={{ color }} strokeWidth={1.75} />
              </div>
              <span className="text-xs font-semibold leading-tight" style={{ color: query === name ? '#16A34A' : 'var(--text2)' }}>
                {name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Listings ─────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        {query && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
              {searching ? `Searching "${query}"…` : `${listings.length} result${listings.length !== 1 ? 's' : ''} for "${query}"`}
            </p>
            <button onClick={() => { setInput(''); setQuery(''); }}
              className="text-xs font-medium hover:underline"
              style={{ color: 'var(--muted)' }}>
              Clear
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
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
          <div className="text-center py-20 rounded-2xl border" style={{ borderColor: 'var(--border)', borderStyle: 'dashed' }}>
            <p className="font-semibold mb-1" style={{ color: 'var(--text)' }}>No listings found</p>
            <p className="text-sm mb-5" style={{ color: 'var(--muted)' }}>
              Nothing matching &ldquo;{query}&rdquo; right now.
            </p>
            <Link to="/register"
              className="inline-flex items-center gap-2 font-semibold text-white px-5 py-2.5 rounded-xl text-sm transition-opacity hover:opacity-85"
              style={{ backgroundColor: '#16A34A' }}>
              Be the first to list one <ArrowRight size={13} />
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {listings.map(l => {
                const cat = CATEGORY_COLORS[l.category] || { bg: '#F3F4F6', color: '#6B7280' };
                return (
                  <Link key={l.id} to={`/listings/${l.id}`}
                    className="block rounded-xl border card-hover overflow-hidden bg-white"
                    style={{ borderColor: 'var(--border)' }}>
                    <div className="aspect-square overflow-hidden" style={{ backgroundColor: 'var(--surface2)' }}>
                      {l.image_url
                        ? <img src={l.image_url} alt={l.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                        : <div className="w-full h-full flex items-center justify-center text-3xl font-bold" style={{ color: 'var(--very-muted)' }}>?</div>
                      }
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{l.title}</p>
                      <p className="text-sm font-bold mt-0.5" style={{ color: '#16A34A' }}>
                        ${Number(l.price).toFixed(2)}
                      </p>
                      <span className="inline-block mt-1.5 text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: cat.bg, color: cat.color }}>
                        {l.category}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Fade + sign-up CTA (only shown when not actively searching) */}
            {!query && (
              <>
                <div className="relative -mt-28 h-28 pointer-events-none"
                  style={{ background: 'linear-gradient(to bottom, transparent, var(--bg))' }} />
                <div className="text-center -mt-2 relative z-10">
                  <Link to="/register"
                    className="inline-flex items-center gap-2 font-semibold text-white px-6 py-2.5 rounded-xl text-sm transition-opacity hover:opacity-85"
                    style={{ backgroundColor: '#16A34A' }}>
                    Sign up to see all listings <ArrowRight size={14} />
                  </Link>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* ── Trust bar ────────────────────────────────────── */}
      <div className="border-y py-10" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
        <div className="max-w-3xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            { icon: Tag,           title: 'Always free',   desc: 'Zero fees for buyers and sellers, ever.' },
            { icon: ShieldCheck,   title: '.edu verified', desc: 'Every account requires a school email.' },
            { icon: MessageCircle, title: 'Direct chat',   desc: 'Message sellers instantly inside the app.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-1"
                style={{ backgroundColor: '#F0FDF4' }}>
                <Icon size={18} style={{ color: '#16A34A' }} />
              </div>
              <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>{title}</p>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA banner ───────────────────────────────────── */}
      <div className="mx-6 my-16 rounded-3xl overflow-hidden" style={{ backgroundColor: '#16A34A' }}>
        <div className="max-w-2xl mx-auto px-8 py-14 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-2">Ready to find a deal?</h2>
          <p className="text-green-100 mb-7 text-sm">
            Join thousands of students already buying and selling on doormly.
          </p>
          <Link to="/register"
            className="inline-flex items-center gap-2 font-semibold bg-white px-7 py-2.5 rounded-xl text-sm transition-opacity hover:opacity-90"
            style={{ color: '#15803D' }}>
            Create a free account <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────── */}
      <div className="border-t px-6 py-5" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-sm font-bold" style={{ color: '#16A34A' }}>doormly</span>
          <span className="text-xs" style={{ color: 'var(--very-muted)' }}>&copy; 2025 doormly. Built for students.</span>
        </div>
      </div>

    </div>
  );
}
