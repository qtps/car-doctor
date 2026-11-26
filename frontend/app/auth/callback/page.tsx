'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import { User } from '@/lib/demo-data';
import { useStore } from '@/components/store-provider';
import { cx, ui } from '@/lib/tailwind';
import { FiCheck } from 'react-icons/fi';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { setNotice } = useStore();
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    void apiRequest<{ user: User }>('/auth/me')
      .then(({ user }) => {
        if (!active) return;
        localStorage.setItem('car-doctor-user', JSON.stringify(user));
        setNotice(`Welcome, ${user.name}`);
        router.replace(user.role === 'admin' ? '/admin' : '/account/orders');
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : 'Could not complete sign-in.');
      });
    return () => { active = false; };
  }, [router, setNotice]);

  return (
    <section className={ui.statusPage}>
      <span className="grid h-[65px] w-[65px] place-items-center rounded-full bg-[#e8f7ef] text-success"><FiCheck size={27} aria-hidden="true" /></span>
      <h1 className={ui.statusHeading}>{error ? 'Sign-in needs another try' : 'Finishing your sign-in…'}</h1>
      <p className={ui.statusCopy}>{error || 'Your secure session is being prepared.'}</p>
      {error && <Link className={cx(ui.button, ui.buttonPrimary)} href="/login">Back to sign in</Link>}
    </section>
  );
}
