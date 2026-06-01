import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Navigate } from 'react-router-dom';
import { Trash2, Flag } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../hooks/useAuth';

export default function Admin() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['admin-reports'],
    queryFn: () => api.get('/admin/reports').then(r => r.data),
    enabled: !!user?.is_admin,
  });

  const dismiss = useMutation({
    mutationFn: (id) => api.delete(`/admin/reports/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['admin-reports']),
  });

  const removeListing = useMutation({
    mutationFn: (id) => api.delete(`/admin/listings/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['admin-reports']),
  });

  if (!user?.is_admin) return <Navigate to="/" replace />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-xl font-bold flex items-center gap-2 mb-6" style={{ color: 'var(--text)' }}>
        <Flag size={18} style={{ color: '#DC2626' }} /> Reports ({reports.length})
      </h1>

      {isLoading ? (
        <p style={{ color: 'var(--muted)' }}>Loading...</p>
      ) : reports.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-dashed" style={{ borderColor: 'var(--border)' }}>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>No reports. All clear.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map(r => (
            <div key={r.id} className="rounded-xl border p-4" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                    {r.target_type} — <span style={{ color: 'var(--muted)' }}>{r.target_id}</span>
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text3)' }}>
                    Reported by <strong>{r.reporter_username}</strong> · {new Date(r.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-sm mt-1.5 italic" style={{ color: 'var(--text3)' }}>{r.reason}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {r.target_type === 'listing' && (
                    <button onClick={() => removeListing.mutate(r.target_id)}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors hover:bg-red-50"
                      style={{ borderColor: 'var(--border)', color: '#DC2626' }}>
                      Remove listing
                    </button>
                  )}
                  <button onClick={() => dismiss.mutate(r.id)}
                    className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors hover:bg-slate-50"
                    style={{ borderColor: 'var(--border)', color: 'var(--text3)' }}>
                    <Trash2 size={11} /> Dismiss
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
