import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ListingDetail from './pages/ListingDetail';
import NewListing from './pages/NewListing';
import Messages from './pages/Messages';

const queryClient = new QueryClient();

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/listings/:id" element={<ListingDetail />} />
              <Route path="/listings/new" element={<PrivateRoute><NewListing /></PrivateRoute>} />
              <Route path="/messages" element={<PrivateRoute><Messages /></PrivateRoute>} />
              <Route path="/messages/:id" element={<PrivateRoute><Messages /></PrivateRoute>} />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
