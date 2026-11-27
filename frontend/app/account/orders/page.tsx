'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiRequest, isDemoMode } from '@/lib/api';
import { demoOrders, Order } from '@/lib/demo-data';
import { useStore } from '@/components/store-provider';
import { useHydrated } from '@/lib/use-hydrated';
import { cx, ui } from '@/lib/tailwind';
import { FiArrowUpRight, FiClock } from 'react-icons/fi';

export default function CustomerOrdersPage() {
  const { user } = useStore();
  const isHydrated = useHydrated();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isHydrated) return;
    void apiRequest<Order[]>('/orders')
      .then((result) => {
        setOrders(result);
        setError('');
      })
      .catch((reason: unknown) => {
        if (isDemoMode && user?.id.startsWith('demo-')) {
          setOrders(demoOrders);
          return;
        }
        setOrders([]);
        setError(reason instanceof Error ? reason.message : 'Could not load your orders.');
      })
      .finally(() => setLoading(false));
  }, [isHydrated, user]);

  return (
    <section className={cx(ui.container, 'py-9 pb-[88px] max-[680px]:py-[25px] max-[680px]:pb-[62px]')}>
      <div className={ui.pageIntro}><span className={ui.eyebrow}>Your account</span><h1 className={ui.pageIntroHeading}>Your orders</h1><p className={ui.pageIntroCopy}>Hi{isHydrated && user?.name ? `, ${user.name}` : ''}. Here is the latest on your Car Doctor visits and purchases.</p></div>
      {!isHydrated || loading ? <p className={ui.emptyNote}>Loading your orders…</p> : error ? (
        <p className={cx(ui.formError, '[&_a]:font-bold [&_a]:text-brand')} role="alert">{error} <Link href="/login">Sign in</Link> or try again later.</p>
      ) : orders.length ? (
        <div className="grid gap-[11px]">
          {orders.map((order) => (
            <article className="grid grid-cols-[82px_minmax(0,1fr)_auto_auto] items-center gap-[17px] rounded-lg border border-line p-[13px] max-[900px]:grid-cols-[70px_minmax(0,1fr)_auto] max-[900px]:gap-[11px] max-[680px]:grid-cols-[57px_minmax(0,1fr)_auto] max-[680px]:gap-[9px]" key={order._id}>
              <Image className="h-18 w-20.5 rounded-md bg-soft object-cover max-[900px]:h-16 max-[900px]:w-17.5 max-[680px]:h-14.25 max-[680px]:w-14.25" src={order.items[0]?.image ?? '/cart_items_1.png'} alt="" width={92} height={78} unoptimized />
              <div className="grid gap-0.5 [&_strong]:text-[12px] [&_span]:text-[10px] [&_span]:text-muted [&_small]:text-[10px] [&_small]:text-muted max-[680px]:[&_span]:text-[9px]"><strong>Order #{order._id.slice(-6).toUpperCase()}</strong><span>{order.items.map((item) => `${item.name} × ${item.quantity}`).join(', ')}</span><small>{new Date(order.createdAt).toLocaleDateString()}</small></div>
              <strong className="text-[13px] max-[680px]:text-[11px]">${order.total.toFixed(2)}</strong>
              <span className={cx('w-fit rounded-full px-[10px] py-[5px] text-[10px] font-extrabold capitalize max-[900px]:col-[2/-1]', {
                pending: 'bg-[#fff5e5] text-[#ba7400]',
                approved: 'bg-[#e9f8ef] text-[#278b5d]',
                completed: 'bg-[#eaf3ff] text-[#236bc2]',
                cancelled: 'bg-[#fff0ed] text-[#d0442f]',
              }[order.status])}>{order.status}</span>
            </article>
          ))}
        </div>
      ) : <div className="flex min-h-75 flex-col items-center justify-center rounded-xl border border-dashed border-[#d9dddd] bg-[#fbfbfb] p-[30px] text-center"><span className="grid h-13.5 w-13.5 place-items-center rounded-full bg-[#fff0ed] text-brand"><FiClock size={23} aria-hidden="true" /></span><h2 className="mt-[15px] mb-1 text-[21px] font-bold">No orders just yet</h2><p className="mb-5 mt-0 text-[13px] text-muted">Your next smooth drive starts with one of our expert services.</p><Link className={cx(ui.button, ui.buttonPrimary)} href="/#contact">Contact us <FiArrowUpRight aria-hidden="true" /></Link></div>}
    </section>
  );
}
