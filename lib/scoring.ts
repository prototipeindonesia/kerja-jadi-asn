export type Q = {
  id: string;
  subtest: string;
  topic: string;
  scores: number[];
};

export function scoreAttempt(questions: Q[], answers: Record<string, number>) {
  const sub = { TWK: 0, TIU: 0, TKP: 0 };
  const topic: Record<string, { benar: number; total: number }> = {};

  for (const q of questions) {
    const a = answers[q.id];
    const s = a === undefined ? 0 : q.scores[a] ?? 0;
    
    // @ts-ignore
    sub[q.subtest] = (sub[q.subtest] || 0) + s;

    const t = (topic[q.topic] ??= { benar: 0, total: 0 });
    t.total += 1;
    const max = Math.max(...q.scores);
    if (s === max) t.benar += 1;
  }

  return { 
    sub, 
    total: sub.TWK + sub.TIU + sub.TKP, 
    topic 
  };
}