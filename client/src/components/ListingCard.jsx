import { Link } from 'react-router-dom';

const CATEGORY_COLORS = {
  Electronics: 'bg-blue-50 text-blue-600',
  Textbooks:   'bg-amber-50 text-amber-600',
  Furniture:   'bg-green-50 text-green-600',
  Clothing:    'bg-pink-50 text-pink-600',
  Services:    'bg-purple-50 text-purple-600',
  Other:       'bg-gray-100 text-gray-500',
};

export default function ListingCard({ listing }) {
  const categoryStyle = CATEGORY_COLORS[listing.category] || CATEGORY_COLORS.Other;

  return (
    <Link to={`/listings/${listing.id}`} className="block bg-white rounded-lg border border-gray-200 card-hover overflow-hidden">
      <div className="aspect-square bg-gray-50 relative overflow-hidden">
        {listing.image_url
          ? <img src={listing.image_url} alt={listing.title} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-gray-200 text-5xl">?</div>
        }
      </div>
      <div className="p-3">
        <p className="text-sm font-semibold text-gray-900 truncate">{listing.title}</p>
        <p className="text-base font-bold mt-0.5" style={{ color: '#CC0033' }}>
          ${Number(listing.price).toFixed(2)}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded ${categoryStyle}`}>
            {listing.category}
          </span>
          <span className="text-xs text-gray-400">{listing.username}</span>
        </div>
      </div>
    </Link>
  );
}
