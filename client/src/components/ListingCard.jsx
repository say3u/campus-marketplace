import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

const CATEGORY_COLORS = {
  Electronics: { bg: '#F0FDF4', color: '#0D9488' },
  Textbooks:   { bg: '#FFFBEB', color: '#D97706' },
  Furniture:   { bg: '#F0FDF4', color: '#14B8A6' },
  Clothing:    { bg: '#FDF4FF', color: '#A21CAF' },
  Services:    { bg: '#F5F3FF', color: '#7C3AED' },
  Other:       { bg: 'var(--bg)', color: 'var(--text3)' },
};

export default function ListingCard({ listing }) {
  const cat = CATEGORY_COLORS[listing.category] || CATEGORY_COLORS.Other;
  const isBoosted = listing.boosted && new Date(listing.boosted_until) > new Date();

  return (
    <Link to={`/listings/${listing.id}`}
      className="block rounded-xl border card-hover overflow-hidden bg-white"
      style={{ borderColor: isBoosted ? '#FED7AA' : 'var(--border)' }}>
      <div className="aspect-square overflow-hidden relative" style={{ backgroundColor: 'var(--surface2)' }}>
        {listing.image_url
          ? <img src={listing.image_url} alt={listing.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
          : <div className="w-full h-full flex items-center justify-center text-4xl font-bold" style={{ color: 'var(--very-muted)' }}>?</div>
        }
        {isBoosted && (
          <span className="absolute top-2 left-2 flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full text-white"
            style={{ backgroundColor: '#EA580C' }}>
            <Zap size={10} /> Boosted
          </span>
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
