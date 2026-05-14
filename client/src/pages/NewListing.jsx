import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { getSocket } from '../lib/socket';

const CATEGORIES = ['Electronics', 'Textbooks', 'Furniture', 'Clothing', 'Services', 'Other'];

export default function NewListing() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', price: '', category: 'Electronics' });
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Post a Listing</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input value={form.title} onChange={set('title')} required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea value={form.description} onChange={set('description')} rows={3}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
            <input type="number" min="0" step="0.01" value={form.price} onChange={set('price')} required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={form.category} onChange={set('category')}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400">
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image (optional)</label>
          <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])}
            className="w-full text-sm text-gray-500" />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" disabled={loading}
          className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50">
          {loading ? 'Posting...' : 'Post Listing'}
        </button>
      </form>
    </div>
  );
}
