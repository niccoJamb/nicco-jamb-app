import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setStatus('error');
      return;
    }
    setStatus('loading');
    try {
      await fetch('https://famous.ai/api/crm/6a1206c51219c95ac14ee2bb/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: 'footer-signup',
          tags: ['newsletter', 'jamb-students'],
        }),
      });
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 4000);
    } catch {
      setStatus('error');
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-green-500 to-blue-600 p-2 rounded-lg">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-white text-lg">Nicco JAMB</span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Nigeria's smartest JAMB UTME practice platform. Built for students, by people who care about your success.
            </p>
            <div className="flex gap-2">
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700"><Facebook className="h-4 w-4" /></a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700"><Twitter className="h-4 w-4" /></a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700"><Instagram className="h-4 w-4" /></a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Subjects</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Mathematics</a></li>
              <li><a href="#" className="hover:text-white">English Language</a></li>
              <li><a href="#" className="hover:text-white">Physics</a></li>
              <li><a href="#" className="hover:text-white">Chemistry</a></li>
              <li><a href="#" className="hover:text-white">Biology</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@niccojamb.ng</li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href="tel:+2349030000398" className="hover:text-white transition-colors">+234 903 000 0398</a>
              </li>

              <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Lagos, Nigeria</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Get Daily Questions</h4>
            <p className="text-sm mb-3">Join our mailing list for daily JAMB practice questions and study tips.</p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                required
              />
              <Button type="submit" disabled={status === 'loading'} className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                {status === 'loading' ? 'Subscribing...' : status === 'success' ? '✓ Subscribed!' : 'Subscribe'}
              </Button>
              {status === 'error' && <p className="text-xs text-red-400">Please enter a valid email.</p>}
              {status === 'success' && <p className="text-xs text-green-400">Thanks! You will hear from us soon.</p>}

            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm">
          <p>© {new Date().getFullYear()} Nicco JAMB Practice App. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
