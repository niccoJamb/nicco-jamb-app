import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Users, ArrowLeft, RefreshCw, Mail, Phone, Calendar, ShieldAlert, Loader2, ChevronRight, ShieldCheck, CheckCircle2, Download, Ban, Unlock, Flame, MailCheck } from 'lucide-react';
import UserDetailDrawer from '@/components/UserDetailDrawer';
import EmailLogsPanel from '@/components/EmailLogsPanel';

interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  name: string | null;
  phone: string | null;
  target_score: number | null;
  current_streak: number;
  longest_streak: number;
  is_banned: boolean;
  quiz_count: number;
}

const formatDate = (iso: string | null) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
};

// "LastName F." mask used for CSV.
const maskName = (name: string | null) => {
  if (!name || !name.trim()) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[parts.length - 1]} ${parts[0].charAt(0).toUpperCase()}.`;
};

const csvCell = (v: any) => {
  const s = v == null ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const Admin: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [banningId, setBanningId] = useState<string | null>(null);
  const [tab, setTab] = useState<'users' | 'emails'>('users');

  const handleVerifyUser = async (target: AdminUser, e: React.MouseEvent) => {
    e.stopPropagation();
    setVerifyingId(target.id);
    try {
      const { data, error } = await supabase.functions.invoke('admin-verify-user', { body: { userId: target.id } });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      const confirmedAt = data.email_confirmed_at || new Date().toISOString();
      setUsers(prev => prev.map(u => (u.id === target.id ? { ...u, email_confirmed_at: confirmedAt } : u)));
      data.alreadyConfirmed ? toast.info(`${target.email} was already verified.`) : toast.success(`${target.email} is now verified.`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to verify user');
    } finally {
      setVerifyingId(null);
    }
  };

  const handleToggleBan = async (target: AdminUser, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !target.is_banned;
    if (next && !window.confirm(`Block ${target.email}? They will not be able to log in or take quizzes.`)) return;
    setBanningId(target.id);
    try {
      const { data, error } = await supabase.functions.invoke('admin-ban-user', { body: { userId: target.id, banned: next } });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setUsers(prev => prev.map(u => (u.id === target.id ? { ...u, is_banned: next } : u)));
      toast.success(next ? `${target.email} has been blocked.` : `${target.email} has been unblocked.`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update user');
    } finally {
      setBanningId(null);
    }
  };

  const exportCsv = () => {
    const headers = ['Last Name + Initial', 'Email', 'Streak', 'Signup Date', 'Last Active', 'Verification'];
    const rows = users.map(u => [
      maskName(u.name),
      u.email,
      u.current_streak,
      u.created_at ? new Date(u.created_at).toISOString().slice(0, 10) : '',
      u.last_sign_in_at ? new Date(u.last_sign_in_at).toISOString().slice(0, 10) : '',
      u.email_confirmed_at ? 'Verified' : 'Pending',
    ]);
    const csv = [headers, ...rows].map(r => r.map(csvCell).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `niccojamb-users-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('CSV downloaded');
  };

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke('list-users');
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setUsers(data.users || []);
    } catch (e: any) {
      setError(e.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) load();
    else if (!authLoading && !user) setLoading(false);
  }, [authLoading, user]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md w-full bg-white rounded-xl shadow p-8 text-center">
          <ShieldAlert className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Admin Login Required</h1>
          <p className="text-slate-600 mb-6">You must be signed in as an admin to view this page.</p>
          <Link to="/"><Button className="bg-indigo-600 hover:bg-indigo-700">Go to Home & Sign In</Button></Link>
        </div>
      </div>
    );
  }

  const filtered = users.filter(u => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (u.email || '').toLowerCase().includes(q) || (u.name || '').toLowerCase().includes(q) || (u.phone || '').toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-slate-500 hover:text-slate-900"><ArrowLeft className="h-5 w-5" /></Link>
            <div className="h-10 w-10 rounded-lg bg-indigo-600 flex items-center justify-center"><Users className="h-5 w-5 text-white" /></div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Admin · Users</h1>
              <p className="text-xs text-slate-500">Signed in as {user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={exportCsv} variant="outline" disabled={loading || users.length === 0}>
              <Download className="h-4 w-4 mr-2" /> Export CSV
            </Button>
            <Button onClick={load} variant="outline" disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </Button>
          </div>
        </div>
      </header>
      {/* Tab navigation */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 flex gap-1">
          <button
            onClick={() => setTab('users')}
            className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors inline-flex items-center gap-2 ${
              tab === 'users' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="h-4 w-4" /> Users
          </button>
          <button
            onClick={() => setTab('emails')}
            className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors inline-flex items-center gap-2 ${
              tab === 'emails' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MailCheck className="h-4 w-4" /> Email Logs
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-6">
        {error && tab === 'users' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {tab === 'emails' && <EmailLogsPanel />}

        {tab === 'users' && !error && (
          <>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                <div className="text-sm text-slate-500">Total Accounts</div>
                <div className="text-3xl font-bold text-slate-900 mt-1">{users.length}</div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                <div className="text-sm text-slate-500">Confirmed Emails</div>
                <div className="text-3xl font-bold text-emerald-600 mt-1">{users.filter(u => u.email_confirmed_at).length}</div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                <div className="text-sm text-slate-500">Blocked Users</div>
                <div className="text-3xl font-bold text-red-600 mt-1">{users.filter(u => u.is_banned).length}</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-3 flex-wrap">
                <h2 className="font-semibold text-slate-900">Registered Users</h2>
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-sm w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {loading ? (
                <div className="p-12 text-center"><Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto" /><p className="text-slate-500 mt-3">Loading users...</p></div>
              ) : filtered.length === 0 ? (
                <div className="p-12 text-center text-slate-500">{users.length === 0 ? 'No users have signed up yet.' : 'No users match your search.'}</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
                      <tr>
                        <th className="text-left px-4 py-3 font-medium">Name</th>
                        <th className="text-left px-4 py-3 font-medium">Email</th>
                        <th className="text-left px-4 py-3 font-medium">Streak</th>
                        <th className="text-left px-4 py-3 font-medium">Signed Up</th>
                        <th className="text-left px-4 py-3 font-medium">Last Login</th>
                        <th className="text-left px-4 py-3 font-medium">Verification</th>
                        <th className="text-left px-4 py-3 font-medium">Access</th>
                        <th className="px-2 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filtered.map(u => (
                        <tr key={u.id} className={`hover:bg-indigo-50/40 cursor-pointer transition-colors ${u.is_banned ? 'bg-red-50/40' : ''}`} onClick={() => setSelectedUser(u)}>
                          <td className="px-4 py-3 font-medium text-slate-900">{u.name || '—'}</td>
                          <td className="px-4 py-3 text-slate-700">
                            <a href={`mailto:${u.email}`} onClick={(e) => e.stopPropagation()} className="hover:text-indigo-600 inline-flex items-center gap-1">
                              <Mail className="h-3 w-3" /> {u.email}
                            </a>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1 text-orange-600 font-semibold">
                              <Flame className="h-3.5 w-3.5" /> {u.current_streak}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(u.created_at)}</span>
                          </td>
                          <td className="px-4 py-3 text-slate-600">{formatDate(u.last_sign_in_at)}</td>
                          <td className="px-4 py-3">
                            {u.email_confirmed_at ? (
                              <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium"><CheckCircle2 className="h-4 w-4" /> Verified</span>
                            ) : (
                              <Button size="sm" variant="outline" disabled={verifyingId === u.id} onClick={(e) => handleVerifyUser(u, e)} className="h-8 border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                                {verifyingId === u.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <><ShieldCheck className="h-3.5 w-3.5 mr-1" /> Mark verified</>}
                              </Button>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={banningId === u.id}
                              onClick={(e) => handleToggleBan(u, e)}
                              className={`h-8 ${u.is_banned ? 'border-emerald-200 text-emerald-700 hover:bg-emerald-50' : 'border-red-200 text-red-700 hover:bg-red-50'}`}
                            >
                              {banningId === u.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : u.is_banned ? (
                                <><Unlock className="h-3.5 w-3.5 mr-1" /> Unblock</>
                              ) : (
                                <><Ban className="h-3.5 w-3.5 mr-1" /> Block</>
                              )}
                            </Button>
                          </td>
                          <td className="px-2 py-3 text-slate-400"><ChevronRight className="h-4 w-4" /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-3">Tip: click any row to view that student's full quiz history. Use Export CSV to download all users.</p>
          </>
        )}
      </main>

      <UserDetailDrawer user={selectedUser} onClose={() => setSelectedUser(null)} />
    </div>
  );
};

export default Admin;
