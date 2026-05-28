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
    <div style={{ backgroundColor: 'var(--bg)' }}>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-16 flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-8 px-3 py-1.5 rounded-full border"
            style={{ borderColor: '#BAE6FD', color: '#0369A1', backgroundColor: '#F0F9FF' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#3B82F6' }} />
            Live marketplace
          </div>
          <h1 className="text-5xl font-bold leading-tight mb-5" style={{ color: 'var(--text)' }}>
            Buy and sell<br />
            <span style={{ color: '#3B82F6' }}>on your campus.</span>
          </h1>
          <p className="text-lg mb-10 leading-relaxed max-w-md" style={{ color: 'var(--text3)' }}>
            Doormly is the real-time marketplace built for students. Zero fees, verified buyers, instant listings.
          </p>
          <div className="flex items-center gap-3">
            <Link to="/register"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white px-6 py-3 rounded-lg transition-opacity hover:opacity-85"
              style={{ backgroundColor: '#3B82F6' }}>
              Get started free <ArrowRight size={14} />
            </Link>
            <Link to="/login"
              className="text-sm font-medium px-6 py-3 rounded-lg border transition-colors hover:bg-slate-50"
              style={{ borderColor: 'var(--border)', color: 'var(--text3)' }}>
              Log in
            </Link>
          </div>
        </div>

        {/* Hero visual */}
        <div className="flex-1 w-full">
          <div className="relative rounded-2xl overflow-hidden border p-6"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', boxShadow: '0 20px 60px rgba(15,23,42,0.08)' }}>
            {/* Mock listing cards */}
            <div className="space-y-3">
              {[
                { title: 'Calculus Textbook — 8th Ed.', price: '$25', cat: 'Textbooks', catBg: '#FFFBEB', catColor: '#D97706', dot: '#10B981' },
                { title: 'Mini Fridge — barely used',   price: '$80', cat: 'Furniture',  catBg: '#F0FDF4', catColor: '#16A34A', dot: '#3B82F6' },
                { title: 'MacBook Charger 65W',         price: '$18', cat: 'Electronics',catBg: '#EFF6FF', catColor: '#2563EB', dot: '#F59E0B' },
              ].map(item => (
                <div key={item.title} className="flex items-center gap-3 p-3 rounded-xl border" style={{ borderColor: 'var(--surface2)', backgroundColor: 'var(--bg)' }}>
                  <div className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: item.catBg }}>
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.dot }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{item.title}</p>
                    <span className="text-xs font-medium px-1.5 py-0.5 rounded-full" style={{ backgroundColor: item.catBg, color: item.catColor }}>{item.cat}</span>
                  </div>
                  <p className="text-sm font-bold flex-shrink-0" style={{ color: '#14B8A6' }}>{item.price}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t flex items-center justify-between" style={{ borderColor: 'var(--surface2)' }}>
              <p className="text-xs font-medium" style={{ color: 'var(--muted)' }}>3 new listings · just now</p>
              <div className="flex gap-1">
                {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: i === 0 ? '#3B82F6' : 'var(--border)' }} />)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="border-y py-7" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-6 text-center">
          {[['Free', 'No fees, ever'], ['Real-Time', 'Live updates'], ['.edu Only', 'Verified students']].map(([title, sub]) => (
            <div key={title}>
              <p className="text-xl font-bold" style={{ color: 'var(--text)' }}>{title}</p>
              <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>{sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>Everything you need</h2>
        <p className="mb-12" style={{ color: 'var(--muted)' }}>Built specifically for campus buying and selling.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-5 rounded-xl border bg-white card-hover" style={{ borderColor: 'var(--border)' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#EFF6FF' }}>
                <Icon size={18} style={{ color: '#3B82F6' }} />
              </div>
              <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text)' }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="border-t py-20" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>How it works</h2>
          <p className="mb-12" style={{ color: 'var(--muted)' }}>Up and running in under a minute.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create an account', desc: 'Sign up with your .edu email in 30 seconds.' },
              { step: '02', title: 'Browse or post',    desc: 'Find great deals nearby or list your items instantly.' },
              { step: '03', title: 'Meet on campus',    desc: 'Message the seller and arrange a safe meetup.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4">
                <span className="text-2xl font-bold tabular-nums" style={{ color: 'var(--very-muted)' }}>{step}</span>
                <div>
                  <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text)' }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--text)' }}>Ready to get started?</h2>
          <p className="mb-8" style={{ color: 'var(--muted)' }}>Join students already buying and selling on Doormly.</p>
          <Link to="/register"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white px-8 py-3 rounded-lg transition-opacity hover:opacity-85"
            style={{ backgroundColor: '#3B82F6' }}>
            Create your account <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t px-6 py-5" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-sm font-bold" style={{ color: '#3B82F6' }}>Doormly</span>
          <span className="text-xs" style={{ color: 'var(--very-muted)' }}>© 2025 Doormly. Built for students.</span>
        </div>
      </div>
    </div>
  );
}
