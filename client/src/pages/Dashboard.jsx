import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Eye, Heart, Tag, CheckCircle, Star, TrendingUp, DollarSign } from 'lucide-react';
import api from '../lib/api';

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="rounded-2xl border p-5" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: accent || 'var(--brand-bg)' }}>
          <Icon size={15} style={{ color: 'var(--brand)' }} />
        </div>
        <span className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--muted)' }}>{label}</span>
      </div>
      <p className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/users/me/dashboard').then(r => r.data),
  });

  if (isLoading) return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <p className="text-sm" style={{ color: 'var(--muted)' }}>Loading...</p>
    </div>
  );

  const d = data || {};
  const fmt = n => Number(n || 0).toLocaleString();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-xl font-bold flex items-center gap-2 mb-1" style={{ color: 'var(--text)' }}>
        <TrendingUp size={18} style={{ color: 'var(--brand)' }} /> Seller Dashboard
      </h1>
      <p className="text-sm mb-7" style={{ color: 'var(--muted)' }}>How your listings are performing.</p>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard icon={Eye}         label="Total views"    value={fmt(d.total_views)} />
        <StatCard icon={Heart}       label="Saves"          value={fmt(d.total_favorites)} accent="#FEE2E2" />
        <StatCard icon={Tag}         label="Active"         value={fmt(d.active_listings)} />
        <StatCard icon={CheckCircle} label="Sold"           value={fmt(d.sold_listings)} />
        <StatCard icon={DollarSign}  label="Sold value"     value={`$${fmt(d.revenue_sold)}`} accent="#DCFCE7" />
        <StatCard icon={Tag}         label="Listings"       value={fmt(d.total_listings)} />
        <StatCard icon={Star}        label="Rating"         value={d.rating_count ? `${d.avg_rating}★` : '—'} accent="#FEF9C3" />
        <StatCard icon={Star}        label="Reviews"        value={fmt(d.rating_count)} accent="#FEF9C3" />
      </div>

      {/* Top listings */}
      <h2 className="text-sm font-bold mb-3" style={{ color: 'var(--text)' }}>Top listings by views</h2>
      {(!d.top_listings || d.top_listings.length === 0) ? (
        <div className="text-center py-16 rounded-xl border border-dashed" style={{ borderColor: 'var(--border)' }}>
          <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>No listings yet</p>
          <Link to="/listings/new" className="text-xs font-semibold mt-2 inline-block" style={{ color: 'var(--brand)' }}>
            Post your first listing →
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          {d.top_listings.map((l, i) => (
            <Link key={l.id} to={`/listings/${l.id}`}
              className="flex items-center gap-4 p-3 transition-colors hover:opacity-80"
              style={{ backgroundColor: 'var(--surface)', borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0" style={{ backgroundColor: 'var(--surface2)' }}>
                {l.image_url
                  ? <img src={l.image_url} alt={l.title} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-lg font-bold" style={{ color: 'var(--border)' }}>?</div>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{l.title}</p>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>
                  ${Number(l.price).toFixed(2)} · {l.status}
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs flex-shrink-0" style={{ color: 'var(--text3)' }}>
                <span className="flex items-center gap-1"><Eye size={12} /> {fmt(l.view_count)}</span>
                <span className="flex items-center gap-1"><Heart size={12} /> {fmt(l.favorites)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
