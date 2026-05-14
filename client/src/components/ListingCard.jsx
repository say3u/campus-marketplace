import { Link } from 'react-router-dom';

export default function ListingCard({ listing }) {
  return (
    <Link to={`/listings/${listing.id}`} className="block bg-white rounded-xl border hover:shadow-md transition-shadow overflow-hidden">
      <div className="aspect-video bg-gray-100">
        {listing.image_url
          ? <img src={listing.image_url} alt={listing.title} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">📦</div>
        }
      </div>
      <div className="p-3">
        <p className="font-semibold text-gray-900 truncate">{listing.title}</p>
        <p className="text-indigo-600 font-bold mt-1">${Number(listing.price).toFixed(2)}</p>
        <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
          <span className="bg-gray-100 px-2 py-0.5 rounded-full">{listing.category}</span>
          <span>{listing.username} · ⭐ {listing.rep_score}</span>
        </div>
      </div>
    </Link>
  );
}
