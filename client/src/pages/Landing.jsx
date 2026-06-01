import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight, ShieldCheck, Tag, MessageCircle,
  Laptop, BookOpen, Sofa, Shirt, Wrench, Package, X,
} from 'lucide-react';
import api from '../lib/api';

const CATEGORIES = [
  { name: 'Electronics', Icon: Laptop,   bg: '#F0FDFA', color: '#14B8A6' },
  { name: 'Textbooks',   Icon: BookOpen, bg: '#FFFBEB', color: '#D97706' },
  { name: 'Furniture',   Icon: Sofa,     bg: '#FEF9EE', color: '#B45309' },
  { name: 'Clothing',    Icon: Shirt,    bg: '#FDF4FF', color: '#A21CAF' },
  { name: 'Services',    Icon: Wrench,   bg: '#F5F3FF', color: '#7C3AED' },
  { name: 'Other',       Icon: Package,  bg: '#FFF7ED', color: '#EA580C' },
];

const CATEGORY_COLORS = {
  Electronics: { bg: '#F0FDFA', color: '#14B8A6' },
  Textbooks:   { bg: '#FFFBEB', color: '#D97706' },
  Furniture:   { bg: '#FEF9EE', color: '#B45309' },
  Clothing:    { bg: '#FDF4FF', color: '#A21CAF' },
  Services:    { bg: '#F5F3FF', color: '#7C3AED' },
  Other:       { bg: '#FFF7ED', color: '#EA580C' },
};

export default function Landing() {
  const [showModal, setShowModal] = useState(false);
  const [activeCategory, setActive] = useState(null);

  const activeMeta = CATEGORIES.find(c => c.name === activeCategory);

  // Hero preview listings
  const { data: previewListings = [] } = useQuery({
    queryKey: ['hero-preview'],
    queryFn: () => api.get('/listings', { params: { limit: 10 } }).then(r => r.data),
    staleTime: 60_000,
  });

  // Modal listings
  const { data: listings = [] } = useQuery({
    queryKey: ['modal-listings', activeCategory],
    queryFn: () =>
      api.get('/listings', {
        params: { ...(activeCategory && { category: activeCategory }), limit: 18 },
      }).then(r => r.data),
    enabled: !!activeCategory,
    staleTime: 60_000,
  });

  function openCategory(name) {
    setActive(name);
    setShowModal(true);
  }

  return (
    <div style={{ backgroundColor: 'var(--bg)' }}>

      {/* ── Category sub-bar ─────────────────────────────── */}
      <div className="sticky top-16 z-40 border-b" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="flex w-max">
          {CATEGORIES.map(({ name }) => (
            <button key={name} onClick={() => openCategory(name)}
              className="px-6 py-3 text-base font-bold text-center transition-colors hover:opacity-70 whitespace-nowrap"
              style={{ backgroundColor: 'var(--surface)', color: 'var(--text3)' }}>
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* ── Hero ─────────────────────────────────────────── */}
      <div className="pt-44 pb-10 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h1 className="text-5xl sm:text-6xl font-extrabold leading-[1.1] mb-4 tracking-tight"
            style={{ color: 'var(--text)' }}>
            Buy &amp; sell anything<br />
            <span style={{ color: '#14B8A6' }}>on your campus.</span>
          </h1>
          <p className="text-lg leading-relaxed max-w-md mx-auto mb-8"
            style={{ color: 'var(--text3)' }}>
            Zero Fees. Students Only.
          </p>
        </div>

        {/* ── Live listing marquee ── */}
        {previewListings.length > 0 && (
          <div className="mt-40">
            <div className="marquee-container overflow-hidden cursor-pointer">
              {/* Duplicate cards for seamless loop */}
              <div className="marquee-track flex gap-3 w-max">
                {[...previewListings, ...previewListings].map((l, i) => {
                  const cat = CATEGORY_COLORS[l.category] || { bg: '#F3F4F6', color: '#6B7280' };
                  return (
                    <Link to="/login" key={`${l.id}-${i}`}
                      className="flex-shrink-0 w-64 rounded-lg border overflow-hidden transition-shadow hover:shadow-lg"
                      style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                      <div className="w-full h-36 overflow-hidden" style={{ backgroundColor: 'var(--surface2)' }}>
                        {l.image_url
                          ? <img src={l.image_url} alt={l.title} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-2xl font-bold"
                              style={{ color: 'var(--border)' }}>?</div>
                        }
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{l.title}</p>
                        <p className="text-base font-bold mt-0.5" style={{ color: '#14B8A6' }}>${Number(l.price).toFixed(2)}</p>
                        <span className="inline-block px-2 py-0.5 rounded mt-1.5 text-xs font-semibold"
                          style={{ backgroundColor: cat.bg, color: cat.color }}>
                          {l.category}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
            <p className="text-xs mt-8" style={{ color: 'var(--muted)' }}>
              Sign up to see all listings from students at your school
            </p>
          </div>
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
                style={{ backgroundColor: '#F0FDFA' }}>
                <Icon size={18} style={{ color: '#14B8A6' }} />
              </div>
              <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>{title}</p>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA banner ───────────────────────────────────── */}
      <div className="mx-6 my-16 rounded-3xl overflow-hidden" style={{ backgroundColor: '#14B8A6' }}>
        <div className="max-w-2xl mx-auto px-8 py-14 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-2">Ready to find a deal?</h2>
          <p className="text-teal-100 mb-7 text-sm">
            Buy and sell with verified students at your school.
          </p>
          <Link to="/register"
            className="inline-flex items-center gap-2 font-semibold bg-white px-7 py-2.5 rounded-xl text-sm transition-opacity hover:opacity-90"
            style={{ color: '#0D9488' }}>
            Create a free account <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────── */}
      <div className="border-t px-6 py-5" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-sm font-bold" style={{ color: '#14B8A6' }}>doormly</span>
          <span className="text-xs" style={{ color: 'var(--very-muted)' }}>&copy; 2025 doormly. Built for students.</span>
        </div>
      </div>

      {/* ── Category modal ───────────────────────────────── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
          onClick={() => setShowModal(false)}>

          <div
            className="relative bg-white rounded-2xl p-8 max-w-xs w-full text-center shadow-2xl"
            onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full transition-colors"
              style={{ color: 'var(--muted)', backgroundColor: 'var(--surface2)' }}>
              <X size={14} />
            </button>
            {activeMeta && (
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: activeMeta.bg }}>
                <activeMeta.Icon size={28} style={{ color: activeMeta.color }} strokeWidth={1.75} />
              </div>
            )}
            <h2 className="text-lg font-bold mb-1" style={{ color: '#111111' }}>
              Browse {activeCategory}
            </h2>
            <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
              Create a free account to see listings from students at your school.
            </p>
            <Link to="/register"
              className="flex items-center justify-center gap-2 w-full font-semibold text-white py-2.5 rounded-xl text-sm transition-opacity hover:opacity-85 mb-3"
              style={{ backgroundColor: '#14B8A6' }}>
              Create free account <ArrowRight size={14} />
            </Link>
            <Link to="/login"
              className="block text-sm font-medium hover:underline"
              style={{ color: '#6B7280' }}>
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
