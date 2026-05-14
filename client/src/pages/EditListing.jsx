import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

const CATEGORIES = ['Electronics', 'Textbooks', 'Furniture', 'Clothing', 'Services', 'Other'];

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', price: '', category: 'Electronics', status: 'active' });
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { data: listing } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => api.get(`/listings/${id}`).then(r => r.data),
  });

  useEffect(() => {
    if (listing) {
      setForm({
        title: listing.title,
        description: listing.description || '',
        price: listing.price,
        category: listing.category,
        status: listing.status,
      });
    }
  }, [listing]);

  function set(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('image', image);
      await api.put(`/listings/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate(`/listings/${id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update listing');
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:outline-none font-medium";

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-black mb-6 text-gray-900">Edit Listing</h1>
      <div className="bg-white rounded-3xl border-2 border-gray-100 p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Title</label>
            <input value={form.title} onChange={set('title')} required className={inputClass}
              onFocus={e => e.target.style.borderColor = '#CC0033'}
              onBlur={e => e.target.style.borderColor = '#f3f4f6'} />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Description</label>
            <textarea value={form.description} onChange={set('description')} rows={3} className={inputClass + ' resize-none'}
              onFocus={e => e.target.style.borderColor = '#CC0033'}
              onBlur={e => e.target.style.borderColor = '#f3f4f6'} />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Price ($)</label>
              <input type="number" min="0" step="0.01" value={form.price} onChange={set('price')} required className={inputClass}
                onFocus={e => e.target.style.borderColor = '#CC0033'}
                onBlur={e => e.target.style.borderColor = '#f3f4f6'} />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Category</label>
              <select value={form.category} onChange={set('category')} className={inputClass}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Status</label>
            <select value={form.status} onChange={set('status')} className={inputClass}>
              <option value="active">Active</option>
              <option value="sold">Sold</option>
              <option value="removed">Removed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Replace Image (optional)</label>
            <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])}
              className="w-full text-sm text-gray-500" />
          </div>
          {error && <p className="text-sm font-medium" style={{ color: '#CC0033' }}>{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate(-1)}
              className="flex-1 border-2 border-gray-200 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 text-white py-3 rounded-xl font-black disabled:opacity-50"
              style={{ backgroundColor: '#CC0033' }}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
