import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import {
  Mail, RefreshCw, Loader2, CheckCircle2, AlertTriangle, Clock, ShieldCheck,
  KeyRound, PartyPopper, Bell, MailQuestion,
} from 'lucide-react';

interface EmailLog {
  id: string;
  to: string;
  subject: string;
  category: 'verification' | 'reset' | 'welcome' | 'reminder' | 'other';
  status: string;
  created_at: string | null;
  from: string;
}

const formatDate = (iso: string | null) => {
  if (!iso) return '—';
  const d = new Date(iso.replace(' ', 'T'));
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
};

const categoryMeta: Record<EmailLog['category'], { label: string; icon: React.ReactNode; cls: string }> = {
  verification: { label: 'Verification', icon: <ShieldCheck className="h-3.5 w-3.5" />, cls: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  reset:        { label: 'Password Reset', icon: <KeyRound className="h-3.5 w-3.5" />, cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  welcome:      { label: 'Welcome', icon: <PartyPopper className="h-3.5 w-3.5" />, cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  reminder:     { label: 'Reminder', icon: <Bell className="h-3.5 w-3.5" />, cls: 'bg-sky-50 text-sky-700 border-sky-200' },
  other:        { label: 'Other', icon: <MailQuestion className="h-3.5 w-3.5" />, cls: 'bg-slate-50 text-slate-600 border-slate-200' },
};

const statusMeta = (status: string) => {
  const s = (status || '').toLowerCase();
  if (['delivered', 'sent', 'opened', 'clicked'].includes(s)) {
    return { icon: <CheckCircle2 className="h-3.5 w-3.5" />, cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  }
  if (['bounced', 'failed', 'complained', 'delivery_delayed'].includes(s)) {
    return { icon: <AlertTriangle className="h-3.5 w-3.5" />, cls: 'bg-red-50 text-red-700 border-red-200' };
  }
  return { icon: <Clock className="h-3.5 w-3.5" />, cls: 'bg-slate-50 text-slate-600 border-slate-200' };
};

const FILTERS: { key: 'all' | EmailLog['category']; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'verification', label: 'Verification' },
  { key: 'reset', label: 'Reset' },
  { key: 'welcome', label: 'Welcome' },
  { key: 'reminder', label: 'Reminder' },
];

const EmailLogsPanel: React.FC = () => {
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [configured, setConfigured] = useState(true);
  const [filter, setFilter] = useState<'all' | EmailLog['category']>('all');

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke('list-email-logs');
      if (error) throw error;
      if (data?.error) {
        setError(data.error);
        setConfigured(data.configured !== false);
      }
      setLogs(data?.emails || []);
      setConfigured(data?.configured !== false);
    } catch (e: any) {
      setError(e.message || 'Failed to load email logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = filter === 'all' ? logs : logs.filter(l => l.category === filter);

  const delivered = logs.filter(l => ['delivered', 'sent', 'opened', 'clicked'].includes((l.status || '').toLowerCase())).length;
  const failed = logs.filter(l => ['bounced', 'failed', 'complained'].includes((l.status || '').toLowerCase())).length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Mail className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">Email Delivery Log</h2>
            <p className="text-xs text-slate-500">Recent auth & transactional emails from your provider (Resend)</p>
          </div>
        </div>
        <Button onClick={load} variant="outline" size="sm" disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      {/* Provider health summary */}
      {!loading && !error && (
        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 flex-wrap text-sm">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" /> Provider connected
          </span>
          <span className="text-slate-500">
            {delivered} delivered · {failed} failed · {logs.length} total shown
          </span>
        </div>
      )}

      {/* Category filter chips */}
      {!error && (
        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                filter === f.key
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto" />
          <p className="text-slate-500 mt-3">Loading email logs...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center">
          <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-3" />
          <p className="font-medium text-slate-900 mb-1">
            {configured ? 'Could not load email logs' : 'Email provider not configured'}
          </p>
          <p className="text-sm text-slate-500 max-w-md mx-auto">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-slate-500">No emails found for this filter.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Type</th>
                <th className="text-left px-4 py-3 font-medium">Recipient</th>
                <th className="text-left px-4 py-3 font-medium">Subject</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Sent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(log => {
                const cat = categoryMeta[log.category];
                const st = statusMeta(log.status);
                return (
                  <tr key={log.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${cat.cls}`}>
                        {cat.icon} {cat.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      <a href={`mailto:${log.to}`} className="hover:text-indigo-600">{log.to}</a>
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-xs truncate">{log.subject}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${st.cls}`}>
                        {st.icon} {log.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{formatDate(log.created_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmailLogsPanel;
