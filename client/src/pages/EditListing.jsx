import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { ImagePlus } from 'lucide-react';

const CATEGORIES = ['Electronics', 'Textbooks', 'Furniture', 'Clothing', 'Services', 'Other'];

const inputStyle = {
  backgroundColor: '#16181f',
  border: '1px solid #2a2d3e',
  color: '#f1f5f9',
};

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', price: '', category: 'Electronics', status: 'active' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
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
      if (listing.image_url) setPreview(listing.image_url);
    }
  }, [listing]);

  function set(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }));
  }

  function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
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

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Edit listing</h1>
        <p className="text-sm mt-1" style={{ color: '#64748b' }}>Update your listing details below.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Image upload */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#94a3b8' }}>Photo</label>
          <label className="block cursor-pointer">
            <div className="rounded-xl border-2 border-dashed overflow-hidden flex items-center justify-center transition-colors hover:border-indigo-500"
              style={{ borderColor: '#2a2d3e', backgroundColor: '#16181f', minHeight: '160px' }}>
              {preview
                ? <img src={preview} alt="preview" className="w-full object-cover" style={{ maxHeight: '240px' }} />
                : (
                  <div className="flex flex-col items-center gap-2 py-10" style={{ color: '#475569' }}>
                    <ImagePlus size={28} />
                    <span className="text-sm">Click to upload a photo</span>
                  </div>
                )
              }
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: '#94a3b8' }}>Title</label>
          <input value={form.title} onChange={set('title')} required
            className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/40"
            style={inputStyle} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: '#94a3b8' }}>Description</label>
          <textarea value={form.description} onChange={set('description')} rows={3}
            className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/40 resize-none"
            style={inputStyle} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#94a3b8' }}>Price ($)</label>
            <input type="number" min="0" step="0.01" value={form.price} onChange={set('price')} required
              className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/40"
              style={inputStyle} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#94a3b8' }}>Category</label>
            <select value={form.category} onChange={set('category')}
              className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/40"
              style={{ ...inputStyle, appearance: 'auto' }}>
              {CATEGORIES.map(c => <option key={c} style={{ backgroundColor: '#16181f' }}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: '#94a3b8' }}>Status</label>
          <select value={form.status} onChange={set('status')}
            className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/40"
            style={{ ...inputStyle, appearance: 'auto' }}>
            <option value="active" style={{ backgroundColor: '#16181f' }}>Active</option>
            <option value="sold" style={{ backgroundColor: '#16181f' }}>Sold</option>
            <option value="removed" style={{ backgroundColor: '#16181f' }}>Removed</option>
          </select>
        </div>

        {error && (
          <p className="text-sm px-3 py-2 rounded-lg" style={{ color: '#fca5a5', backgroundColor: 'rgba(239,68,68,0.1)' }}>
            {error}
          </p>
        )}

        <div className="flex gap-3 pt-1">
          <button type="button" onClick={() => navigate(-1)}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors hover:bg-white/5"
            style={{ borderColor: '#2a2d3e', color: '#94a3b8' }}>
            Cancel
          </button>
          <button type="submit" disabled={loading}
            className="flex-1 text-white py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 hover:opacity-85 transition-opacity"
            style={{ backgroundColor: '#F97316' }}>
            {loading ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
