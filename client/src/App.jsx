import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ThemeProvider } from './hooks/useTheme';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ListingDetail from './pages/ListingDetail';
import NewListing from './pages/NewListing';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import EditListing from './pages/EditListing';
import Favorites from './pages/Favorites';
import VerifyEmail from './pages/VerifyEmail';
import Admin from './pages/Admin';
import { useSchoolTheme } from './hooks/useSchoolTheme';

const queryClient = new QueryClient();

function SchoolThemeLoader() {
  const { user } = useAuth();
  useSchoolTheme(user?.school);
  return null;
}

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
}

function RootRoute() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/browse" replace /> : <Landing />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <SchoolThemeLoader />
          <div className="min-h-screen">
            <Navbar />
            <Routes>
              <Route path="/" element={<RootRoute />} />
              <Route path="/browse" element={<PrivateRoute><Home /></PrivateRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/listings/:id" element={<ListingDetail />} />
              <Route path="/listings/new" element={<PrivateRoute><NewListing /></PrivateRoute>} />
              <Route path="/messages" element={<PrivateRoute><Messages /></PrivateRoute>} />
              <Route path="/messages/:id" element={<PrivateRoute><Messages /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/listings/:id/edit" element={<PrivateRoute><EditListing /></PrivateRoute>} />
              <Route path="/favorites" element={<PrivateRoute><Favorites /></PrivateRoute>} />
              <Route path="/verify/:token" element={<VerifyEmail />} />
              <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
