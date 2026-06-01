import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import api from '../lib/api';

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    api.get(`/auth/verify/${token}`)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        {status === 'loading' && <p style={{ color: 'var(--muted)' }}>Verifying...</p>}
        {status === 'success' && (
          <>
            <CheckCircle size={48} className="mx-auto mb-4" style={{ color: 'var(--brand)' }} />
            <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>Email verified!</h1>
            <p className="text-sm mb-5" style={{ color: 'var(--muted)' }}>Your account is now verified. You're good to go.</p>
            <Link to="/browse" className="text-sm font-semibold text-white px-6 py-2.5 rounded-lg"
              style={{ backgroundColor: 'var(--brand)' }}>Go to marketplace</Link>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle size={48} className="mx-auto mb-4" style={{ color: '#DC2626' }} />
            <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>Link invalid or expired</h1>
            <p className="text-sm mb-5" style={{ color: 'var(--muted)' }}>This verification link has already been used or has expired.</p>
            <Link to="/" className="text-sm font-semibold" style={{ color: 'var(--brand)' }}>Go home</Link>
          </>
        )}
      </div>
    </div>
  );
}
