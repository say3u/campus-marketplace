import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Heart } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../hooks/useAuth';

const CATEGORY_COLORS = {
  Electronics: { bg: '#F0FDFA', color: '#0D9488' },
  Textbooks:   { bg: '#FFFBEB', color: '#D97706' },
  Furniture:   { bg: '#F0FDFA', color: '#14B8A6' },
  Clothing:    { bg: '#FDF4FF', color: '#A21CAF' },
  Services:    { bg: '#F5F3FF', color: '#7C3AED' },
  Other:       { bg: 'var(--bg)', color: 'var(--text3)' },
};

const isNew = (created_at) => Date.now() - new Date(created_at).getTime() < 24 * 60 * 60 * 1000;

export default function ListingCard({ listing, initialFavorited = false }) {
  const { user } = useAuth();
  const cat = CATEGORY_COLORS[listing.category] || CATEGORY_COLORS.Other;
  const isBoosted = listing.boosted && new Date(listing.boosted_until) > new Date();
  const [favorited, setFavorited] = useState(initialFavorited || listing.is_favorited || false);
  const [saving, setSaving] = useState(false);

  async function toggleFavorite(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!user || saving) return;
    setSaving(true);
    try {
      const { data } = await api.post(`/listings/${listing.id}/favorite`);
      setFavorited(data.favorited);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Link to={`/listings/${listing.id}`}
      className="block rounded-xl border card-hover overflow-hidden"
      style={{ borderColor: isBoosted ? '#FED7AA' : 'var(--border)', backgroundColor: 'var(--surface)' }}>
      <div className="aspect-square overflow-hidden relative" style={{ backgroundColor: 'var(--surface2)' }}>
        {listing.image_url
          ? <img src={listing.image_url} alt={listing.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
          : <div className="w-full h-full flex items-center justify-center text-4xl font-bold" style={{ color: 'var(--very-muted)' }}>?</div>
        }
        {/* Badges */}
        {isBoosted && (
          <span className="absolute top-2 left-2 flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full text-white"
            style={{ backgroundColor: '#EA580C' }}>
            <Zap size={10} /> Boosted
          </span>
        )}
        {isNew(listing.created_at) && !isBoosted && (
          <span className="absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full text-white"
            style={{ backgroundColor: '#14B8A6' }}>
            New
          </span>
        )}
        {/* Heart */}
        {user && (
          <button onClick={toggleFavorite}
            className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full transition-all"
            style={{ backgroundColor: 'rgba(255,255,255,0.85)' }}>
            <Heart size={14} fill={favorited ? '#f43f5e' : 'none'} style={{ color: favorited ? '#f43f5e' : '#94a3b8' }} />
          </button>
        )}
      </div>
      <div className="p-3">
        <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{listing.title}</p>
        <p className="text-base font-bold mt-0.5" style={{ color: '#14B8A6' }}>
          ${Number(listing.price).toFixed(2)}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ backgroundColor: cat.bg, color: cat.color }}>
            {listing.category}
          </span>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>{listing.username}</span>
        </div>
      </div>
    </Link>
  );
}
