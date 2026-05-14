import { Link } from 'react-router-dom';

const CATEGORY_COLORS = {
  Electronics: 'bg-blue-100 text-blue-700',
  Textbooks:   'bg-yellow-100 text-yellow-700',
  Furniture:   'bg-green-100 text-green-700',
  Clothing:    'bg-pink-100 text-pink-700',
  Services:    'bg-purple-100 text-purple-700',
  Other:       'bg-gray-100 text-gray-600',
};

export default function ListingCard({ listing }) {
  const categoryStyle = CATEGORY_COLORS[listing.category] || CATEGORY_COLORS.Other;

  return (
    <Link to={`/listings/${listing.id}`} className="block bg-white rounded-2xl border-2 border-transparent card-hover overflow-hidden shadow-sm"
      onMouseEnter={e => e.currentTarget.style.borderColor = '#CC0033'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
    >
      <div className="aspect-video bg-gray-100 relative">
        {listing.image_url
          ? <img src={listing.image_url} alt={listing.title} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl font-black">?</div>
        }
        <span className={`absolute top-2 left-2 text-xs font-bold px-2.5 py-1 rounded-full ${categoryStyle}`}>
          {listing.category}
        </span>
      </div>
      <div className="p-4">
        <p className="font-bold text-gray-900 truncate text-sm">{listing.title}</p>
        <p className="text-xl font-black mt-1" style={{ color: '#CC0033' }}>
          ${Number(listing.price).toFixed(2)}
        </p>
        <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
          <span className="font-medium">{listing.username}</span>
          <span className="font-bold px-2 py-0.5 rounded-full bg-gray-100">
            {listing.rep_score} rep
          </span>
        </div>
      </div>
    </Link>
  );
}
