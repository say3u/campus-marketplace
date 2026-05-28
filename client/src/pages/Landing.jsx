import { Link } from 'react-router-dom';
import { Zap, MessageCircle, ShieldCheck, Star } from 'lucide-react';

const FEATURES = [
  { icon: Zap,           title: 'Real-time listings',  desc: 'New items appear the moment students post them.' },
  { icon: MessageCircle, title: 'Direct messaging',    desc: 'Chat with buyers and sellers inside the app.' },
  { icon: ShieldCheck,   title: 'Students only',       desc: 'Every account is verified with a .edu email.' },
  { icon: Star,          title: 'Seller ratings',      desc: 'Reviews help you buy from trusted sellers.' },
];

export default function Landing() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 py-20 flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest mb-6 px-3 py-1 rounded-full border border-gray-200 text-gray-500">
            For students, by students
          </span>
          <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-5">
            The marketplace<br />
            for your campus
          </h1>
          <p className="text-lg text-gray-500 mb-8 leading-relaxed max-w-md">
            Buy and sell with students at your school. Real-time listings, direct messaging, and zero fees.
          </p>
          <div className="flex items-center gap-3">
            <Link
              to="/register"
              className="text-sm font-semibold text-white px-6 py-2.5 rounded-md transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#CC0033' }}
            >
              Get started free
            </Link>
            <Link
              to="/login"
              className="text-sm font-semibold text-gray-700 px-6 py-2.5 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Log in
            </Link>
          </div>
          <p className="text-xs text-gray-400 mt-4">Requires a .edu email address</p>
        </div>

        <div className="flex-1 w-full">
          <img
            src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=700&auto=format&fit=crop&q=80"
            alt="Students on campus"
            className="w-full rounded-xl object-cover shadow-lg"
            style={{ maxHeight: '400px' }}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100" />

      {/* Features */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Everything you need</h2>
          <p className="text-gray-500">Built specifically for campus buying and selling.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#fff0f3' }}>
                <Icon size={18} style={{ color: '#CC0033' }} />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100" />

      {/* How it works */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">How it works</h2>
          <p className="text-gray-500">Up and running in under a minute.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Create an account', desc: 'Sign up with your .edu email. Takes 30 seconds.' },
            { step: '02', title: 'Browse or post',    desc: 'Find great deals or list your items instantly.' },
            { step: '03', title: 'Meet on campus',    desc: 'Message the seller and arrange a safe meetup.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex gap-5">
              <span className="text-sm font-bold tabular-nums mt-0.5" style={{ color: '#CC0033' }}>{step}</span>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Ready to get started?</h2>
            <p className="text-gray-500 text-sm">Join students already buying and selling on Dormly.</p>
          </div>
          <Link
            to="/register"
            className="text-sm font-semibold text-white px-6 py-2.5 rounded-md transition-opacity hover:opacity-90 whitespace-nowrap"
            style={{ backgroundColor: '#CC0033' }}
          >
            Create your account
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 px-6 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-sm font-semibold" style={{ color: '#CC0033' }}>Dormly</span>
          <span className="text-xs text-gray-400">© 2025 Dormly. Built for students.</span>
        </div>
      </div>
    </div>
  );
}
