import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Question } from '@/data/questions';

interface UseQuestionsResult {
  questions: Question[];
  loading: boolean;
  error: string | null;
  approved: number;
  total: number;
  fetchedAt: string | null;
  refresh: () => Promise<void>;
}

// Module-level cache so we don't re-fetch on every component mount.
let cache: {
  questions: Question[];
  approved: number;
  total: number;
  fetchedAt: string | null;
} | null = null;

let inflight: Promise<void> | null = null;

export function useQuestions(): UseQuestionsResult {
  const [questions, setQuestions] = useState<Question[]>(cache?.questions ?? []);
  const [loading, setLoading] = useState<boolean>(!cache);
  const [error, setError] = useState<string | null>(null);
  const [approved, setApproved] = useState<number>(cache?.approved ?? 0);
  const [total, setTotal] = useState<number>(cache?.total ?? 0);
  const [fetchedAt, setFetchedAt] = useState<string | null>(cache?.fetchedAt ?? null);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      if (!inflight) {
        inflight = (async () => {
          const { data, error: fnErr } = await supabase.functions.invoke('fetch-questions', {
            body: { ts: Date.now() },
          });
          if (fnErr) throw new Error(fnErr.message || 'Failed to fetch questions');
          if (!data || !Array.isArray(data.questions)) {
            throw new Error(data?.error || 'Invalid response from question source');
          }
          cache = {
            questions: data.questions as Question[],
            approved: data.approved ?? data.questions.length,
            total: data.total ?? data.questions.length,
            fetchedAt: data.fetchedAt ?? new Date().toISOString(),
          };
        })();
      }
      await inflight;
      inflight = null;
      if (cache) {
        setQuestions(cache.questions);
        setApproved(cache.approved);
        setTotal(cache.total);
        setFetchedAt(cache.fetchedAt);
      }
    } catch (e: any) {
      inflight = null;
      setError(e?.message || 'Failed to load questions');
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    cache = null;
    inflight = null;
    await load();
  }, [load]);

  useEffect(() => {
    if (!cache) {
      load();
    }
  }, [load]);

  return { questions, loading, error, approved, total, fetchedAt, refresh };
}
