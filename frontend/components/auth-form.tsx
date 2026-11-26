'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiBaseUrl } from '@/lib/api';
import { useStore } from './store-provider';
import { cx, ui } from '@/lib/tailwind';
import { FiArrowUpRight } from 'react-icons/fi';

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const isSignup = mode === 'signup';
  const router = useRouter();
  const { signIn, signUp } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    if (isSignup && password !== confirmation) {
      setError('Your passwords do not match.');
      return;
    }
    setBusy(true);
    try {
      const user = isSignup
        ? await signUp(name, email, password)
        : await signIn(email, password);
      router.push(user.role === 'admin' ? '/admin' : '/account/orders');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Something went wrong. Please try again.');
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
          <span className={ui.eyebrow}>{isSignup ? 'Join the Car Doctor family' : 'Welcome back'}</span>
          <h1>{isSignup ? 'Create your account' : 'Sign in to your account'}</h1>
          <p>{isSignup ? 'A better car care experience starts here.' : 'Access your appointments and order history.'}</p>
        </div>
        <form className="grid gap-[15px] [&_label]:flex [&_label]:flex-col [&_label]:gap-[7px] [&_label]:text-[11px] [&_label]:font-bold [&_label]:text-[#414648] [&_input]:min-h-[47px] [&_input]:w-full [&_input]:rounded-md [&_input]:border [&_input]:border-[#e1e4e4] [&_input]:bg-white [&_input]:px-[13px] [&_input]:py-[11px] [&_input]:text-[12px] [&_input]:font-normal [&_input]:outline-none [&_input]:transition [&_input]:focus:border-brand [&_input]:focus:shadow-[0_0_0_3px_rgba(255,61,34,.1)]" onSubmit={submit}>
          {isSignup && <label>Full name<input autoComplete="name" name="name" placeholder="Your name" required minLength={2} value={name} onChange={(event) => setName(event.target.value)} /></label>}
          <label>Email address<input autoComplete="email" name="email" type="email" placeholder="you@example.com" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
          <label>Password<input autoComplete={isSignup ? 'new-password' : 'current-password'} name="password" type="password" placeholder="At least 8 characters" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} /></label>
          {isSignup && <label>Confirm password<input autoComplete="new-password" name="confirmation" type="password" placeholder="Enter your password again" required minLength={8} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} /></label>}
          {error && <p className={ui.formError} role="alert">{error}</p>}
          <button className={cx(ui.button, ui.buttonPrimary, 'mt-[3px] w-full disabled:cursor-wait disabled:opacity-70')} type="submit" disabled={busy}>{busy ? 'Please wait…' : isSignup ? 'Create account' : 'Sign in'} <FiArrowUpRight aria-hidden="true" /></button>
        </form>
        <div className="my-[21px] mb-[15px] flex items-center gap-3 text-[10px] text-muted"><span className="h-px flex-1 bg-line" />or continue with<span className="h-px flex-1 bg-line" /></div>
        <div className="grid grid-cols-2 gap-[11px] [&_a]:flex [&_a]:min-h-[43px] [&_a]:items-center [&_a]:justify-center [&_a]:gap-[9px] [&_a]:rounded-md [&_a]:border [&_a]:border-line [&_a]:text-[11px] [&_a]:font-bold [&_a:hover]:border-brand">
          <a href={`${apiBaseUrl}/auth/google`} aria-label="Continue with Google"><Image src="/google.svg" alt="" width={18} height={18} />Google</a>
          <a href={`${apiBaseUrl}/auth/facebook`} aria-label="Continue with Facebook"><Image src="/facebook.svg" alt="" width={18} height={18} />Facebook</a>
        </div>
        <p className="my-3 text-center text-[9px] leading-[1.5] text-[#8a9092]">Social sign-in activates after Google and Facebook credentials are added to the backend environment.</p>
        <p className="mt-5 text-center text-[11px] text-muted">
          {isSignup ? 'Already have an account?' : 'New to Car Doctor?'}
          {' '}<Link className="font-bold text-brand" href={isSignup ? '/login' : '/signup'}>{isSignup ? 'Sign in' : 'Create an account'}</Link>
        </p>
        {!isSignup && process.env.NODE_ENV !== 'production' && <div className="mt-[17px] flex flex-wrap justify-center gap-x-3 gap-y-[6px] rounded-md bg-[#f7f8f8] p-[10px] text-[9px] text-muted"><strong className="text-ink">Preview admin</strong><span>admin@cardoctor.demo</span><span>Admin123!</span></div>}
      </div>
    </section>
  );
}
