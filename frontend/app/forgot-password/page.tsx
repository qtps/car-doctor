'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/components/store-provider';
import { cx, ui } from '@/lib/tailwind';
import { FiArrowUpRight } from 'react-icons/fi';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { requestPasswordReset, resetPassword } = useStore();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');
    try {
      if (step === 'request') {
        setMessage(await requestPasswordReset(email));
        setStep('reset');
      } else {
        await resetPassword(email, code, password);
        setMessage('Your password has been updated. You can now sign in.');
        router.replace('/login');
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className={cx(ui.container, 'grid min-h-142.5 place-items-center py-[58px]')}>
      <div className="w-full max-w-125 rounded-xl border border-line bg-white p-[clamp(25px,4vw,42px)] shadow-[0_20px_60px_rgba(27,34,36,.04)]">
        <span className={ui.eyebrow}>Account recovery</span>
        <h1 className="mb-2 mt-2 text-[29px] font-bold tracking-[-.04em]">{step === 'request' ? 'Forgot your password?' : 'Set a new password'}</h1>
        <p className="mb-6 mt-0 text-[12px] text-muted">{step === 'request' ? 'Enter your email and we will send a short-lived reset code if an account matches.' : 'Enter the six-digit code from your email and choose a new password.'}</p>
        <form className="grid gap-[15px] [&_label]:flex [&_label]:flex-col [&_label]:gap-[7px] [&_label]:text-[11px] [&_label]:font-bold [&_input]:min-h-11.75 [&_input]:w-full [&_input]:rounded-md [&_input]:border [&_input]:border-[#e1e4e4] [&_input]:bg-white [&_input]:px-[13px] [&_input]:py-[11px] [&_input]:text-[12px] [&_input]:font-normal [&_input]:outline-none [&_input]:focus:border-brand" onSubmit={submit}>
          <label>Email address<input autoComplete="email" name="email" type="email" required maxLength={254} readOnly={step === 'reset'} value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label>
          {step === 'reset' && <>
            <label>Reset code<input autoComplete="one-time-code" inputMode="numeric" name="code" required pattern="[0-9]{6}" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="6-digit code" /></label>
            <label>New password<input autoComplete="new-password" name="password" type="password" required minLength={8} maxLength={72} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" /></label>
          </>}
          {message && <p className="m-0 text-[11px] text-[#278b5d]" role="status">{message}</p>}
          {error && <p className={ui.formError} role="alert">{error}</p>}
          <button className={cx(ui.button, ui.buttonPrimary, 'w-full disabled:cursor-wait disabled:opacity-70')} type="submit" disabled={busy}>{busy ? 'Please wait…' : step === 'request' ? 'Send reset code' : 'Update password'} <FiArrowUpRight aria-hidden="true" /></button>
        </form>
        <p className="mb-0 mt-5 text-center text-[11px] text-muted"><Link className="font-bold text-brand" href="/login">Back to sign in</Link></p>
      </div>
    </section>
  );
}
