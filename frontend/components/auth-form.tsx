'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiBaseUrl, apiRequest } from '@/lib/api';
import { useStore } from './store-provider';
import { cx, ui } from '@/lib/tailwind';
import { FiArrowUpRight } from 'react-icons/fi';

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const isSignup = mode === 'signup';
  const router = useRouter();
  const { signIn, signUp, verifyEmail, resendVerification } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [verificationRequired, setVerificationRequired] = useState(false);
  const [resendAvailable, setResendAvailable] = useState(false);
  const [providers, setProviders] = useState<{ google: boolean; facebook: boolean } | null>(null);

  useEffect(() => {
    let active = true;
    void apiRequest<{ google: boolean; facebook: boolean }>('/auth/providers')
      .then((result) => { if (active) setProviders(result); })
      .catch(() => { if (active) setProviders({ google: false, facebook: false }); });
    return () => { active = false; };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setNotice('');
    setResendAvailable(false);
    if (isSignup && !verificationRequired && password !== confirmation) {
      setError('Your passwords do not match.');
      return;
    }
    setBusy(true);
    try {
      if (verificationRequired) {
        const user = await verifyEmail(email, code);
        router.push(user.role === 'admin' ? '/admin' : '/account');
        return;
      }
      if (isSignup) {
        const needsVerification = await signUp(name, email, password);
        if (needsVerification) {
          setVerificationRequired(true);
          setNotice('We sent a six-digit verification code to your email address.');
          return;
        }
        router.push('/account');
        return;
      }
      const user = await signIn(email, password);
      router.push(user.role === 'admin' ? '/admin' : '/account');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Something went wrong. Please try again.');
      const needsVerification = !isSignup
        && reason instanceof Error
        && reason.message.toLowerCase().includes('verify your email');
      setVerificationRequired(needsVerification);
      setResendAvailable(needsVerification);
    } finally {
      setBusy(false);
    }
  }

  async function resendCode() {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      setNotice(await resendVerification(email));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not send another code.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className={cx(ui.container, 'grid min-h-[670px] grid-cols-[1fr_minmax(0,.86fr)] items-center gap-[clamp(40px,8vw,120px)] py-[58px] pb-[82px] max-[680px]:min-h-0 max-[680px]:grid-cols-1 max-[680px]:gap-5 max-[680px]:py-[35px] max-[680px]:pb-[58px]')}>
      <div className="flex flex-col items-center text-center">
        <Image className="h-auto max-h-none max-w-[min(100%,430px)] object-contain max-[680px]:h-auto max-[680px]:w-auto max-[680px]:max-h-[220px]" src="/sign_up.png" alt="Securely manage your Car Doctor account" width={460} height={502} priority />
        <div className="mt-3 max-w-[390px] max-[680px]:hidden"><span className={ui.eyebrow}>Your car, in good hands</span><h2 className="my-[7px] text-[27px] font-bold tracking-[-.04em]">Service made simple.</h2><p className="m-0 text-[12px] text-muted">Book a visit, track your orders and get expert support whenever you need it.</p></div>
      </div>
      <div className="w-full max-w-[510px] justify-self-center rounded-xl border border-line bg-white p-[clamp(25px,4vw,42px)] shadow-[0_20px_60px_rgba(27,34,36,.04)] max-[680px]:px-5 max-[680px]:py-6">
        <div className="[&_h1]:my-[8px] [&_h1]:mt-2 [&_h1]:mb-[5px] [&_h1]:text-[29px] [&_h1]:font-bold [&_h1]:tracking-[-.04em] max-[680px]:[&_h1]:text-[25px] [&_p]:mt-0 [&_p]:mb-[25px] [&_p]:text-[12px] [&_p]:text-muted">
          <span className={ui.eyebrow}>{verificationRequired ? 'Email verification' : isSignup ? 'Join the Car Doctor family' : 'Welcome back'}</span>
          <h1>{verificationRequired ? 'Verify your email' : isSignup ? 'Create your account' : 'Sign in to your account'}</h1>
          <p>{verificationRequired ? 'Enter the six-digit code sent to your email address.' : isSignup ? 'A better car care experience starts here.' : 'Access your appointments and order history.'}</p>
        </div>
        <form className="grid gap-[15px] [&_label]:flex [&_label]:flex-col [&_label]:gap-[7px] [&_label]:text-[11px] [&_label]:font-bold [&_label]:text-[#414648] [&_input]:min-h-[47px] [&_input]:w-full [&_input]:rounded-md [&_input]:border [&_input]:border-[#e1e4e4] [&_input]:bg-white [&_input]:px-[13px] [&_input]:py-[11px] [&_input]:text-[12px] [&_input]:font-normal [&_input]:outline-none [&_input]:transition [&_input]:focus:border-brand [&_input]:focus:shadow-[0_0_0_3px_rgba(255,61,34,.1)]" onSubmit={submit}>
          {isSignup && !verificationRequired && <label>Full name<input autoComplete="name" name="name" placeholder="Your name" required minLength={2} value={name} onChange={(event) => setName(event.target.value)} /></label>}
          <label>Email address<input autoComplete="email" name="email" type="email" placeholder="you@example.com" required value={email} readOnly={verificationRequired} onChange={(event) => setEmail(event.target.value)} /></label>
          {verificationRequired
            ? <label>Verification code<input autoComplete="one-time-code" inputMode="numeric" name="code" placeholder="6-digit code" required pattern="[0-9]{6}" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} /></label>
            : <label>Password<input autoComplete={isSignup ? 'new-password' : 'current-password'} name="password" type="password" placeholder="At least 8 characters" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} /></label>}
          {isSignup && !verificationRequired && <label>Confirm password<input autoComplete="new-password" name="confirmation" type="password" placeholder="Enter your password again" required minLength={8} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} /></label>}
          {!isSignup && !verificationRequired && <Link className="w-fit text-[11px] font-bold text-brand" href="/forgot-password">Forgot your password?</Link>}
          {error && <p className={ui.formError} role="alert">{error}</p>}
          {notice && <p className="m-0 text-[11px] text-[#278b5d]" role="status">{notice}</p>}
          <button className={cx(ui.button, ui.buttonPrimary, 'mt-[3px] w-full disabled:cursor-wait disabled:opacity-70')} type="submit" disabled={busy}>{busy ? 'Please wait…' : verificationRequired ? 'Verify email' : isSignup ? 'Create account' : 'Sign in'} <FiArrowUpRight aria-hidden="true" /></button>
          {(verificationRequired || resendAvailable) && <button className="w-fit justify-self-center border-0 bg-transparent text-[11px] font-bold text-brand disabled:opacity-60" type="button" onClick={resendCode} disabled={busy}>Resend verification code</button>}
        </form>
        {providers && (providers.google || providers.facebook) && !verificationRequired && <>
          <div className="my-[21px] mb-[15px] flex items-center gap-3 text-[10px] text-muted"><span className="h-px flex-1 bg-line" />or continue with<span className="h-px flex-1 bg-line" /></div>
          <div className="grid grid-cols-2 gap-[11px] [&_a]:flex [&_a]:min-h-[43px] [&_a]:items-center [&_a]:justify-center [&_a]:gap-[9px] [&_a]:rounded-md [&_a]:border [&_a]:border-line [&_a]:text-[11px] [&_a]:font-bold [&_a:hover]:border-brand">
            {providers.google && <a href={`${apiBaseUrl}/auth/google`} aria-label="Continue with Google"><Image className="h-[18px] w-[18px] shrink-0" src="/google.svg" alt="" width={18} height={18} />Google</a>}
            {providers.facebook && <a href={`${apiBaseUrl}/auth/facebook`} aria-label="Continue with Facebook"><Image className="h-[18px] w-[18px] shrink-0" src="/facebook.svg" alt="" width={18} height={18} />Facebook</a>}
          </div>
        </>}
        <p className="mt-5 text-center text-[11px] text-muted">
          {isSignup ? 'Already have an account?' : 'New to Car Doctor?'}
          {' '}<Link className="font-bold text-brand" href={isSignup ? '/login' : '/signup'}>{isSignup ? 'Sign in' : 'Create an account'}</Link>
        </p>
        {!isSignup && process.env.NODE_ENV !== 'production' && <div className="mt-[17px] flex flex-wrap justify-center gap-x-3 gap-y-[6px] rounded-md bg-[#f7f8f8] p-[10px] text-[9px] text-muted"><strong className="text-ink">Preview admin</strong><span>admin@cardoctor.demo</span><span>Admin123!</span></div>}
      </div>
    </section>
  );
}
