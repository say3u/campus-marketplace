import { Link } from 'react-router-dom';
import { Zap, MessageCircle, ShieldCheck, Star, ArrowRight } from 'lucide-react';

const FEATURES = [
  { icon: Zap,           title: 'Real-time listings',  desc: 'New items appear the moment students post them.' },
  { icon: MessageCircle, title: 'Direct messaging',    desc: 'Chat with buyers and sellers inside the app.' },
  { icon: ShieldCheck,   title: 'Students only',       desc: 'Every account verified with a .edu email.' },
  { icon: Star,          title: 'Seller ratings',      desc: 'Reviews help you buy from trusted sellers.' },
];

export default function Landing() {
  return (
    <div style={{ backgroundColor: '#0f1117' }}>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-20 flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-8 px-3 py-1.5 rounded-full border"
            style={{ borderColor: '#2a2d3e', color: '#CC0033', backgroundColor: 'rgba(204,0,51,0.08)' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#CC0033' }} />
            Live marketplace
          </div>
          <h1 className="text-5xl font-bold text-white leading-tight mb-5">
            Buy and sell<br />
            <span style={{ color: '#CC0033' }}>on your campus.</span>
          </h1>
          <p className="text-lg mb-10 leading-relaxed max-w-md" style={{ color: '#94a3b8' }}>
            Dormly is the real-time marketplace built for students. Zero fees, verified buyers, instant listings.
          </p>
          <div className="flex items-center gap-3">
            <Link to="/register"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white px-6 py-3 rounded-md transition-opacity hover:opacity-80"
              style={{ backgroundColor: '#CC0033' }}>
              Get started free <ArrowRight size={14} />
            </Link>
            <Link to="/login"
              className="text-sm font-medium px-6 py-3 rounded-md border transition-colors hover:bg-white/5"
              style={{ borderColor: '#2a2d3e', color: '#94a3b8' }}>
              Log in
            </Link>
          </div>
        </div>

        <div className="flex-1 w-full relative">
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-2xl blur-3xl opacity-20" style={{ backgroundColor: '#CC0033' }} />
          <img
            src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=700&auto=format&fit=crop&q=80"
            alt="Campus marketplace"
            className="relative w-full rounded-2xl object-cover"
            style={{ maxHeight: '420px', border: '1px solid #2a2d3e' }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="border-y py-8" style={{ borderColor: '#2a2d3e' }}>
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-6 text-center">
          {[['Free', 'No fees, ever'], ['Real-Time', 'Live updates'], ['.edu Only', 'Verified students']].map(([title, sub]) => (
            <div key={title}>
              <p className="text-xl font-bold text-white">{title}</p>
              <p className="text-sm mt-1" style={{ color: '#64748b' }}>{sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-bold text-white mb-2">Everything you need</h2>
        <p className="mb-12" style={{ color: '#64748b' }}>Built specifically for campus buying and selling.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-5 rounded-xl border card-hover"
              style={{ backgroundColor: '#16181f', borderColor: '#2a2d3e' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: 'rgba(204,0,51,0.12)' }}>
                <Icon size={18} style={{ color: '#CC0033' }} />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="border-t py-20" style={{ borderColor: '#2a2d3e' }}>
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-white mb-2">How it works</h2>
          <p className="mb-12" style={{ color: '#64748b' }}>Up and running in under a minute.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create an account', desc: 'Sign up with your .edu email in 30 seconds.' },
              { step: '02', title: 'Browse or post',    desc: 'Find great deals nearby or list your items instantly.' },
              { step: '03', title: 'Meet on campus',    desc: 'Message the seller and arrange a safe meetup.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4">
                <span className="text-2xl font-bold tabular-nums opacity-30 text-white">{step}</span>
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="border-t" style={{ borderColor: '#2a2d3e' }}>
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="mb-8" style={{ color: '#64748b' }}>Join students already buying and selling on Dormly.</p>
          <Link to="/register"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white px-8 py-3 rounded-md transition-opacity hover:opacity-80"
            style={{ backgroundColor: '#CC0033' }}>
            Create your account <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t px-6 py-5" style={{ borderColor: '#2a2d3e' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-sm font-bold" style={{ color: '#CC0033' }}>Dormly</span>
          <span className="text-xs" style={{ color: '#334155' }}>© 2025 Dormly. Built for students.</span>
        </div>
      </div>
    </div>
  );
}
