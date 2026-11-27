'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/components/store-provider';
import { User } from '@/lib/demo-data';
import { useHydrated } from '@/lib/use-hydrated';
import { cx, ui } from '@/lib/tailwind';
import { FiArrowUpRight, FiLogOut, FiUser } from 'react-icons/fi';

export default function AccountPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const { user, loading } = useStore();

  useEffect(() => {
    if (hydrated && !loading && !user) router.replace('/login');
  }, [hydrated, loading, router, user]);

  if (!hydrated || loading || !user) {
    return <section className={cx(ui.container, 'grid min-h-105 place-items-center')}><p className={ui.emptyNote}>Loading your account…</p></section>;
  }

  return <AccountDetails user={user} />;
}

function AccountDetails({ user }: { user: User }) {
  const router = useRouter();
  const { updateProfile, signOut } = useStore();
  const [name, setName] = useState(user.name);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    setError('');
    try {
      await updateProfile(name);
      setMessage('Your profile has been updated.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not update your profile.');
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await signOut();
    router.replace('/login');
  }

  return (
    <section className={cx(ui.container, 'py-9 pb-[88px] max-[680px]:py-[25px] max-[680px]:pb-[62px]')}>
      <div className={ui.pageIntro}><span className={ui.eyebrow}>Your account</span><h1 className={ui.pageIntroHeading}>Hello, {user.name}</h1><p className={ui.pageIntroCopy}>Manage your profile and keep track of your Car Doctor activity.</p></div>
      <div className="grid grid-cols-[minmax(0,1.3fr)_minmax(250px,.7fr)] gap-5 max-[680px]:grid-cols-1">
        <form className="grid content-start gap-4 rounded-lg border border-line bg-white p-6 max-[680px]:p-5" onSubmit={saveProfile}>
          <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#fff0ed] text-brand"><FiUser aria-hidden="true" /></span><div><h2 className="m-0 text-[16px]">Profile details</h2><p className="m-0 mt-1 text-[11px] text-muted">Update the name shown on your account.</p></div></div>
          <label className="grid gap-[7px] text-[11px] font-bold text-[#414648]">Full name<input className="min-h-11.25 rounded-md border border-line px-3 text-[12px] font-normal outline-none focus:border-brand" autoComplete="name" required minLength={2} maxLength={80} value={name} onChange={(event) => setName(event.target.value)} /></label>
          <label className="grid gap-[7px] text-[11px] font-bold text-[#414648]">Email address<input className="min-h-11.25 rounded-md border border-line bg-[#f7f8f8] px-3 text-[12px] font-normal text-muted" value={user.email} readOnly /></label>
          {message && <p className="m-0 text-[11px] text-[#278b5d]" role="status">{message}</p>}
          {error && <p className={ui.formError} role="alert">{error}</p>}
          <button className={cx(ui.button, ui.buttonPrimary, 'w-fit disabled:opacity-60')} type="submit" disabled={busy || name.trim() === user.name}>{busy ? 'Saving…' : 'Save changes'} <FiArrowUpRight aria-hidden="true" /></button>
        </form>
        <aside className="grid content-start gap-3 rounded-lg border border-line bg-white p-6 max-[680px]:p-5">
          <h2 className="m-0 text-[16px]">Your activity</h2>
          <p className="m-0 text-[11px] leading-5 text-muted">Review your parts purchases and service orders whenever you need them.</p>
          <Link className={cx(ui.button, ui.buttonOutline, 'w-fit')} href="/account/orders">View my orders <FiArrowUpRight aria-hidden="true" /></Link>
          <button className="mt-2 flex w-fit items-center gap-2 border-0 bg-transparent p-0 text-[11px] font-bold text-muted hover:text-brand" type="button" onClick={() => void logout()}><FiLogOut aria-hidden="true" /> Sign out</button>
        </aside>
      </div>
    </section>
  );
}
