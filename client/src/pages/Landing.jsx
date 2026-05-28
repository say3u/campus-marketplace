import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Tag, MessageCircle, Laptop, BookOpen, Sofa, Shirt, Wrench, Package } from 'lucide-react';

const CATEGORIES = [
  { name: 'Electronics', Icon: Laptop,    bg: '#F0FDF4', color: '#16A34A' },
  { name: 'Textbooks',   Icon: BookOpen,  bg: '#FFFBEB', color: '#D97706' },
  { name: 'Furniture',   Icon: Sofa,      bg: '#FEF9EE', color: '#B45309' },
  { name: 'Clothing',    Icon: Shirt,     bg: '#FDF4FF', color: '#A21CAF' },
  { name: 'Services',    Icon: Wrench,    bg: '#F5F3FF', color: '#7C3AED' },
  { name: 'Other',       Icon: Package,   bg: '#FFF7ED', color: '#EA580C' },
];

export default function Landing() {
  return (
    <div style={{ backgroundColor: 'var(--bg)' }}>

      {/* ── Hero ─────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <h1 className="text-6xl font-extrabold leading-tight mb-5 tracking-tight" style={{ color: 'var(--text)' }}>
          Your campus.<br />
          <span style={{ color: '#16A34A' }}>Your marketplace.</span>
        </h1>
        <p className="text-xl leading-relaxed max-w-xl mx-auto mb-10" style={{ color: 'var(--text3)' }}>
          Buy and sell textbooks, furniture, electronics and more &mdash; only with verified students at your school.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/register"
            className="inline-flex items-center gap-2 font-semibold text-white px-8 py-3.5 rounded-xl text-base transition-opacity hover:opacity-85"
            style={{ backgroundColor: '#16A34A' }}>
            Start for free <ArrowRight size={16} />
          </Link>
          <Link to="/login"
            className="inline-flex items-center gap-2 font-medium px-8 py-3.5 rounded-xl text-base border transition-colors hover:bg-slate-50"
            style={{ borderColor: 'var(--border)', color: 'var(--text2)' }}>
            Sign in
          </Link>
        </div>
      </div>

      {/* ── Categories ───────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        <p className="text-xs font-semibold uppercase tracking-widest mb-5 text-center" style={{ color: 'var(--muted)' }}>
          Browse by category
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {CATEGORIES.map(({ name, Icon, bg, color }) => (
            <Link key={name} to="/register"
              className="flex flex-col items-center gap-3 py-5 px-3 rounded-2xl border text-center transition-all hover:scale-105 hover:shadow-md"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: bg }}>
                <Icon size={22} style={{ color }} strokeWidth={1.75} />
              </div>
              <span className="text-xs font-semibold" style={{ color: 'var(--text2)' }}>{name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Trust bar ────────────────────────────────────── */}
      <div className="border-y py-10" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            { icon: Tag,           title: 'Always free',   desc: 'Zero fees for buyers and sellers, ever.' },
            { icon: ShieldCheck,   title: '.edu verified', desc: 'Every account requires a school email.' },
            { icon: MessageCircle, title: 'Direct chat',   desc: 'Message sellers instantly inside the app.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-1"
                style={{ backgroundColor: '#F0FDF4' }}>
                <Icon size={18} style={{ color: '#16A34A' }} />
              </div>
              <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>{title}</p>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── How it works ─────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-bold mb-12 text-center" style={{ color: 'var(--text)' }}>
          How it works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { n: '1', title: 'Sign up',        desc: 'Create an account with your .edu email — takes 30 seconds.' },
            { n: '2', title: 'Post or browse', desc: 'List something you want to sell, or find a deal near you.' },
            { n: '3', title: 'Meet on campus', desc: 'Chat with the buyer or seller and meet up safely.' },
          ].map(({ n, title, desc }) => (
            <div key={n} className="rounded-2xl border p-6"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white mb-4"
                style={{ backgroundColor: '#16A34A' }}>
                {n}
              </div>
              <h3 className="font-bold mb-1.5" style={{ color: 'var(--text)' }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA banner ───────────────────────────────────── */}
      <div className="mx-6 mb-20 rounded-3xl overflow-hidden" style={{ backgroundColor: '#16A34A' }}>
        <div className="max-w-3xl mx-auto px-8 py-16 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-3">
            Ready to find a deal?
          </h2>
          <p className="text-green-100 mb-8 text-base">
            Join thousands of students already buying and selling on doormly.
          </p>
          <Link to="/register"
            className="inline-flex items-center gap-2 font-semibold bg-white px-8 py-3 rounded-xl text-sm transition-opacity hover:opacity-90"
            style={{ color: '#15803D' }}>
            Create a free account <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────── */}
      <div className="border-t px-6 py-5" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-sm font-bold" style={{ color: '#16A34A' }}>doormly</span>
          <span className="text-xs" style={{ color: 'var(--very-muted)' }}>&copy; 2025 doormly. Built for students.</span>
        </div>
      </div>

    </div>
  );
}
