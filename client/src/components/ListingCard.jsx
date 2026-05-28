import { Link } from 'react-router-dom';

const CATEGORY_COLORS = {
  Electronics: { bg: '#EFF6FF', color: '#2563EB' },
  Textbooks:   { bg: '#FFFBEB', color: '#D97706' },
  Furniture:   { bg: '#F0FDF4', color: '#16A34A' },
  Clothing:    { bg: '#FDF4FF', color: '#A21CAF' },
  Services:    { bg: '#F5F3FF', color: '#7C3AED' },
  Other:       { bg: 'var(--bg)', color: 'var(--text3)' },
};

export default function ListingCard({ listing }) {
  const cat = CATEGORY_COLORS[listing.category] || CATEGORY_COLORS.Other;

  return (
    <Link to={`/listings/${listing.id}`}
      className="block rounded-xl border card-hover overflow-hidden bg-white"
      style={{ borderColor: 'var(--border)' }}>
      <div className="aspect-square overflow-hidden" style={{ backgroundColor: 'var(--surface2)' }}>
        {listing.image_url
          ? <img src={listing.image_url} alt={listing.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
          : <div className="w-full h-full flex items-center justify-center text-4xl font-bold" style={{ color: 'var(--very-muted)' }}>?</div>
        }
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
