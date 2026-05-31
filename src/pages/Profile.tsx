import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Save, User as UserIcon, Phone, Target, BookOpen, Mail, Check, Award } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { SUBJECTS } from '@/data/questions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import BadgeGrid from '@/components/BadgeGrid';

const ProfilePage: React.FC = () => {
  const { user, profile, badges, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [targetScore, setTargetScore] = useState<string>('');
  const [subjects, setSubjects] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [loadedOnce, setLoadedOnce] = useState(false);

  // Redirect to home if not signed in (once auth has finished loading)
  useEffect(() => {
    if (!loading && !user) navigate('/');
  }, [loading, user, navigate]);

  // Pre-fill from the profile when it arrives
  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setPhone(profile.phone || '');
      setTargetScore(profile.target_score != null ? String(profile.target_score) : '');
      setSubjects(profile.subjects || []);
      setLoadedOnce(true);
    } else if (user && !loading) {
      // Profile not yet created — still mark as loaded so the form renders empty
      setLoadedOnce(true);
    }
  }, [profile, user, loading]);

  const toggleSubject = (id: string) => {
    setSubjects((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const targetScoreNum = useMemo(() => {
    const n = parseInt(targetScore, 10);
    return isNaN(n) ? null : n;
  }, [targetScore]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (targetScore && (targetScoreNum === null || targetScoreNum < 0 || targetScoreNum > 400)) {
      toast({
        title: 'Invalid target score',
        description: 'JAMB target score must be between 0 and 400.',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    const payload = {
      id: user.id,
      name: name.trim() || null,
      phone: phone.trim() || null,
      target_score: targetScoreNum,
      subjects: subjects.length ? subjects : null,
      updated_at: new Date().toISOString(),
    };

    // Use upsert so it works whether or not a profile row already exists
    const { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' });
    setSaving(false);

    if (error) {
      toast({
        title: 'Could not save profile',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Profile updated',
      description: 'Your changes have been saved successfully.',
    });
    await refreshProfile();
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to app
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-blue-600 px-6 py-8 text-white">
            <h1 className="text-2xl sm:text-3xl font-bold">My Profile</h1>
            <p className="text-green-50 text-sm mt-1">
              Update your details and JAMB study preferences
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-white/90">
              <Mail className="h-4 w-4" />
              <span className="truncate">{user.email}</span>
            </div>
          </div>

          {!loadedOnce ? (
            <div className="p-12 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : (
            <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-6">
              {/* Name */}
              <div>
                <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                  <UserIcon className="h-4 w-4 text-gray-400" /> Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Adaeze Okeke"
                  maxLength={100}
                />
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                  <Phone className="h-4 w-4 text-gray-400" /> Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 0803 123 4567"
                  maxLength={20}
                />
              </div>

              {/* Target Score */}
              <div>
                <Label htmlFor="target" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                  <Target className="h-4 w-4 text-gray-400" /> Target JAMB Score
                </Label>
                <Input
                  id="target"
                  type="number"
                  min={0}
                  max={400}
                  value={targetScore}
                  onChange={(e) => setTargetScore(e.target.value)}
                  placeholder="0 – 400"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Set a goal so we can track your progress towards it.
                </p>
              </div>

              {/* Subjects */}
              <div>
                <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <BookOpen className="h-4 w-4 text-gray-400" /> Selected Subjects
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SUBJECTS.map((s) => {
                    const checked = subjects.includes(s.id);
                    return (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => toggleSubject(s.id)}
                        className={`flex items-center justify-between gap-2 px-4 py-3 rounded-lg border text-left transition-colors ${
                          checked
                            ? 'border-green-500 bg-green-50 ring-1 ring-green-500'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div>
                          <div className="text-sm font-medium text-gray-900">{s.name}</div>
                          <div className="text-xs text-gray-500">{s.description}</div>
                        </div>
                        <div
                          className={`flex-shrink-0 w-5 h-5 rounded-md border flex items-center justify-center ${
                            checked ? 'bg-green-500 border-green-500' : 'border-gray-300 bg-white'
                          }`}
                        >
                          {checked && <Check className="h-3.5 w-3.5 text-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {subjects.length === 0
                    ? 'Pick the subjects you plan to take in JAMB.'
                    : `${subjects.length} subject${subjects.length === 1 ? '' : 's'} selected.`}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 flex-1 sm:flex-none"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" /> Save Changes
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/')}
                  disabled={saving}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Earned streak badges */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-orange-500" />
              <h2 className="font-bold text-lg text-gray-900">My Streak Badges</h2>
            </div>
            <span className="text-sm text-gray-500">{badges.length} earned</span>
          </div>
          <div className="p-6">
            <BadgeGrid earned={badges} />
            <p className="text-xs text-gray-500 mt-4">
              Keep practising every day to unlock more milestone badges. Locked badges show the streak length needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
