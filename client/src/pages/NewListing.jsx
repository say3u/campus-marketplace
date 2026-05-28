import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { getSocket } from '../lib/socket';
import { ImagePlus } from 'lucide-react';

const CATEGORIES = ['Electronics', 'Textbooks', 'Furniture', 'Clothing', 'Services', 'Other'];

const inputStyle = {
  backgroundColor: '#16181f',
  border: '1px solid #2a2d3e',
  color: '#f1f5f9',
};

export default function NewListing() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', price: '', category: 'Electronics' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      const { data } = await api.post('/listings', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      getSocket().emit('listing:created', data.id);
      navigate(`/listings/${data.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Post a listing</h1>
        <p className="text-sm mt-1" style={{ color: '#64748b' }}>Fill in the details below to list your item.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Image upload */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#94a3b8' }}>Photo (optional)</label>
          <label className="block cursor-pointer">
            <div className="rounded-xl border-2 border-dashed overflow-hidden flex items-center justify-center transition-colors hover:border-indigo-500"
              style={{ borderColor: preview ? '#2a2d3e' : '#2a2d3e', backgroundColor: '#16181f', minHeight: '160px' }}>
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

        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: '#94a3b8' }}>Title</label>
          <input value={form.title} onChange={set('title')} required placeholder="e.g. Calculus textbook"
            className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            style={inputStyle} />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: '#94a3b8' }}>Description</label>
          <textarea value={form.description} onChange={set('description')} rows={3}
            placeholder="Condition, any details buyers should know..."
            className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none"
            style={inputStyle} />
        </div>

        {/* Price + Category */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#94a3b8' }}>Price ($)</label>
            <input type="number" min="0" step="0.01" value={form.price} onChange={set('price')} required placeholder="0.00"
              className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              style={inputStyle} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#94a3b8' }}>Category</label>
            <select value={form.category} onChange={set('category')}
              className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              style={{ ...inputStyle, appearance: 'auto' }}>
              {CATEGORIES.map(c => <option key={c} style={{ backgroundColor: '#16181f' }}>{c}</option>)}
            </select>
          </div>
        </div>

        {error && (
          <p className="text-sm px-3 py-2 rounded-lg" style={{ color: '#fca5a5', backgroundColor: 'rgba(239,68,68,0.1)' }}>
            {error}
          </p>
        )}

        <button type="submit" disabled={loading}
          className="w-full text-white py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 hover:opacity-85 transition-opacity"
          style={{ backgroundColor: '#4F46E5' }}>
          {loading ? 'Posting...' : 'Post listing'}
        </button>
      </form>
    </div>
  );
}
