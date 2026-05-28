import { Link } from 'react-router-dom';

const CATEGORY_COLORS = {
  Electronics: { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa' },
  Textbooks:   { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' },
  Furniture:   { bg: 'rgba(34,197,94,0.15)',  color: '#4ade80' },
  Clothing:    { bg: 'rgba(236,72,153,0.15)', color: '#f472b6' },
  Services:    { bg: 'rgba(168,85,247,0.15)', color: '#c084fc' },
  Other:       { bg: 'rgba(100,116,139,0.15)',color: '#94a3b8' },
};

export default function ListingCard({ listing }) {
  const cat = CATEGORY_COLORS[listing.category] || CATEGORY_COLORS.Other;

  return (
    <Link to={`/listings/${listing.id}`}
      className="block rounded-xl border card-hover overflow-hidden"
      style={{ backgroundColor: '#16181f', borderColor: '#2a2d3e' }}>
      <div className="aspect-square overflow-hidden" style={{ backgroundColor: '#1e2130' }}>
        {listing.image_url
          ? <img src={listing.image_url} alt={listing.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
          : <div className="w-full h-full flex items-center justify-center text-4xl" style={{ color: '#2a2d3e' }}>?</div>
        }
      </div>
      <div className="p-3">
        <p className="text-sm font-semibold text-white truncate">{listing.title}</p>
        <p className="text-base font-bold mt-0.5" style={{ color: '#CC0033' }}>
          ${Number(listing.price).toFixed(2)}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs font-medium px-2 py-0.5 rounded"
            style={{ backgroundColor: cat.bg, color: cat.color }}>
            {listing.category}
          </span>
          <span className="text-xs" style={{ color: '#475569' }}>{listing.username}</span>
        </div>
      </div>
    </Link>
  );
}
