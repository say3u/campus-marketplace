import { Link } from 'react-router-dom';
import { Zap, MessageCircle, ShieldCheck, Star } from 'lucide-react';

const FEATURES = [
  { icon: Zap,           title: 'Real-Time Listings',  desc: 'New items appear instantly as students post them — no refresh needed.' },
  { icon: MessageCircle, title: 'Chat with Sellers',   desc: 'Message buyers and sellers directly inside the app.' },
  { icon: ShieldCheck,   title: 'Students Only',       desc: 'Verified .edu emails keep the community trusted and safe.' },
  { icon: Star,          title: 'Reputation System',   desc: 'Ratings and reviews build trust between buyers and sellers.' },
];

export default function Landing() {
  return (
    <div>
      {/* Hero */}
      <div className="text-white" style={{ backgroundColor: '#CC0033' }}>
        <div className="max-w-6xl mx-auto px-6 py-20 flex flex-col lg:flex-row items-center gap-12">
          {/* Left text */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-6xl font-black tracking-tight mb-5 leading-tight">
              Your Campus.<br />Your Marketplace.
            </h1>
            <p className="text-red-100 text-xl max-w-lg mb-10">
              Dormly is the fastest way to buy and sell with students at your school.
              Real-time listings, zero fees, zero strangers.
            </p>
            <div className="flex gap-4 justify-center lg:justify-start">
              <Link
                to="/register"
                className="bg-white font-black text-lg px-10 py-4 rounded-full hover:bg-red-50 transition-colors shadow-xl"
                style={{ color: '#CC0033' }}
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="border-2 border-white text-white font-bold text-lg px-10 py-4 rounded-full hover:bg-white transition-colors"
                onMouseEnter={e => e.currentTarget.style.color = '#CC0033'}
                onMouseLeave={e => e.currentTarget.style.color = 'white'}
              >
                Login
              </Link>
            </div>
          </div>

          {/* Right image */}
          <div className="flex-1 w-full max-w-md lg:max-w-none">
            <img
              src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=700&auto=format&fit=crop&q=80"
              alt="Campus marketplace"
              className="rounded-3xl shadow-2xl w-full object-cover"
              style={{ maxHeight: '380px' }}
            />
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-gray-900 text-white py-6 px-6">
        <div className="max-w-4xl mx-auto flex justify-around text-center">
          {[['Free', 'No fees ever'], ['Real-Time', 'Live updates'], ['.edu Only', 'Verified students']].map(([title, sub]) => (
            <div key={title}>
              <p className="text-2xl font-black" style={{ color: '#CC0033' }}>{title}</p>
              <p className="text-gray-400 text-sm mt-1">{sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-black text-center text-gray-900 mb-12">
          Everything you need to buy and sell on campus
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-red-200 transition-colors card-hover">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#fff0f3' }}>
                <Icon size={24} style={{ color: '#CC0033' }} />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="bg-gray-50 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-center text-gray-900 mb-12">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { step: '1', title: 'Create an account', desc: 'Sign up with your .edu email in seconds.' },
              { step: '2', title: 'Post or browse',    desc: 'List your items or find great deals nearby.' },
              { step: '3', title: 'Chat and meet',     desc: 'Message the seller and arrange a campus meetup.' },
            ].map(({ step, title, desc }) => (
              <div key={step}>
                <div className="w-14 h-14 rounded-full text-white text-2xl font-black flex items-center justify-center mx-auto mb-4 shadow-lg"
                  style={{ backgroundColor: '#CC0033' }}>
                  {step}
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA banner */}
      <div className="bg-gray-900 text-white py-20 px-6 text-center">
        <h2 className="text-4xl font-black mb-4">Ready to declutter your dorm?</h2>
        <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
          Join thousands of students already buying and selling on Dormly.
        </p>
        <Link
          to="/register"
          className="text-white font-black text-lg px-10 py-4 rounded-full transition-colors inline-block shadow-lg hover:opacity-90"
          style={{ backgroundColor: '#CC0033' }}
        >
          Create Your Account
        </Link>
      </div>
    </div>
  );
}
