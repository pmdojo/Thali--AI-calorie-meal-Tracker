'use client';

import { useState } from 'react';
import formStyles from './waitlist-form.module.css';

type State = 'idle' | 'submitting' | 'ok' | 'error';

export function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<State>('idle');
  const [msg, setMsg] = useState<string>('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('submitting');
    setMsg('');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, source: 'landing' }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? `error_${res.status}`);
      setState('ok');
      setMsg("You're on the list. We'll email you when the iOS build is ready.");
      setEmail('');
    } catch (err) {
      setState('error');
      setMsg(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  return (
    <form className={formStyles.form} onSubmit={submit}>
      <input
        type="email"
        required
        placeholder="you@work.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={formStyles.input}
        disabled={state === 'submitting'}
      />
      <button
        type="submit"
        className={formStyles.button}
        disabled={state === 'submitting' || !email}
      >
        {state === 'submitting' ? 'Adding…' : 'Join the waitlist'}
      </button>
      {msg && <p className={state === 'ok' ? formStyles.msgOk : formStyles.msgErr}>{msg}</p>}
    </form>
  );
}
