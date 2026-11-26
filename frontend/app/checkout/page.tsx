'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { FormEvent, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import { useStore } from '@/components/store-provider';
import { useHydrated } from '@/lib/use-hydrated';
import { cx, ui } from '@/lib/tailwind';
import { FiArrowUpRight, FiCheck } from 'react-icons/fi';

export default function CheckoutPage() {
  return <Suspense fallback={<section className={ui.statusPage}><h1 className={ui.statusHeading}>Loading checkout…</h1></section>}><CheckoutContent /></Suspense>;
}

function CheckoutContent() {
  const isHydrated = useHydrated();
  if (!isHydrated) {
    return <section className={ui.statusPage}><h1 className={ui.statusHeading}>Loading checkout…</h1></section>;
  }
  return <CheckoutFormContent />;
}

function CheckoutFormContent() {
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('service');
  const { cart, products, services, user, clearCart, setNotice } = useStore();
  const service = services.find((item) => item._id === serviceId || item.slug === serviceId);
  const cartItems = useMemo(() => cart.flatMap((line) => {
    const product = products.find((entry) => entry._id === line.productId);
    return product ? [{ product, quantity: line.quantity }] : [];
  }), [cart, products]);
  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0) + (service?.price ?? 0);
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [firstName, setFirstName] = useState(user?.name.split(' ')[0] ?? '');
  const [lastName, setLastName] = useState(user?.name.split(' ').slice(1).join(' ') ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!service && cartItems.length === 0) {
      setError('Your cart is empty. Add a product or choose a service first.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          message,
          items: [
            ...(service ? [{ serviceId: service._id, quantity: 1 }] : []),
            ...cartItems.map(({ product, quantity }) => ({ productId: product._id, quantity })),
          ],
        }),
      });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'We could not submit your order. Please try again.');
      setBusy(false);
      return;
    }

    setSubmitted(true);
    try {
      await clearCart();
    } catch (reason) {
      const detail = reason instanceof Error ? ` ${reason.message}` : '';
      setNotice(`Your request was received, but the saved cart could not be cleared.${detail}`);
    }
    setBusy(false);
  }

  if (submitted) {
    return <section className={ui.statusPage}><span className="grid h-[65px] w-[65px] place-items-center rounded-full bg-[#e8f7ef] text-success"><FiCheck size={27} aria-hidden="true" /></span><span className={cx(ui.eyebrow, 'mt-[18px]')}>Request received</span><h1 className={ui.statusHeading}>Thanks, {firstName || 'we have it'}!</h1><p className={ui.statusCopy}>Your request is in. Our team will be in touch to confirm the details and next steps.</p><Link className={cx(ui.button, ui.buttonPrimary)} href="/account/orders">View your orders <FiArrowUpRight aria-hidden="true" /></Link></section>;
  }

  return (
    <section className={cx(ui.container, 'py-9 pb-[88px] max-[680px]:py-[25px] max-[680px]:pb-[62px]')}>
      <div className="relative flex min-h-[230px] items-center overflow-hidden rounded-[10px] bg-[#232627] text-white max-[680px]:min-h-[190px] [&>img]:absolute [&>img]:inset-0 [&>img]:block [&>img]:h-full [&>img]:w-full [&>img]:object-cover [&:after]:absolute [&:after]:inset-0 [&:after]:bg-[linear-gradient(90deg,rgba(17,19,20,.86),rgba(17,19,20,.24))] [&:after]:content-[''] [&>div]:relative [&>div]:z-[1] [&>div]:px-[clamp(25px,7vw,84px)] [&>div]:py-[30px] [&_h1]:my-[8px] [&_h1]:mb-[3px] [&_h1]:text-[clamp(32px,4vw,44px)] [&_h1]:font-bold [&_h1]:leading-[1.2] [&_h1]:tracking-[-.04em] [&_p]:m-0 [&_p]:text-[12px] [&_p]:text-[#f2c5bc] [&_p_span]:px-2">
        <Image src="/checkout_hero.png" alt="" width={1140} height={300} sizes="100vw" priority />
        <div><span className={cx(ui.eyebrow, ui.eyebrowLight)}>Almost there</span><h1>Checkout</h1><p>Home <span>/</span> Checkout</p></div>
      </div>
      <div className="mt-9 grid grid-cols-[minmax(0,1fr)_350px] items-start gap-[30px] max-[900px]:grid-cols-[minmax(0,1fr)_285px] max-[900px]:gap-[18px] max-[680px]:mt-[22px] max-[680px]:grid-cols-1">
        <form className="rounded-[10px] border border-line p-[clamp(22px,4vw,38px)] max-[680px]:p-[19px] [&_label]:flex [&_label]:flex-col [&_label]:gap-[7px] [&_label]:text-[11px] [&_label]:font-bold [&_label]:text-[#414648] [&_input]:min-h-[45px] [&_input]:w-full [&_input]:rounded-md [&_input]:border [&_input]:border-[#e1e4e4] [&_input]:bg-white [&_input]:px-[13px] [&_input]:py-[11px] [&_input]:text-[12px] [&_input]:font-normal [&_input]:outline-none [&_input]:transition [&_input]:focus:border-brand [&_input]:focus:shadow-[0_0_0_3px_rgba(255,61,34,.1)] [&_textarea]:min-h-[110px] [&_textarea]:resize-y [&_textarea]:rounded-md [&_textarea]:border [&_textarea]:border-[#e1e4e4] [&_textarea]:bg-white [&_textarea]:px-[13px] [&_textarea]:py-[11px] [&_textarea]:text-[12px] [&_textarea]:font-normal [&_textarea]:outline-none [&_textarea]:focus:border-brand [&_textarea]:focus:shadow-[0_0_0_3px_rgba(255,61,34,.1)]" onSubmit={submit}>
          <div className="mb-[25px] flex items-center gap-[13px]"><span className="grid h-[43px] w-[43px] place-items-center rounded-full bg-[#fff0ed] text-[13px] font-extrabold text-brand">01</span><div><h2 className="m-0 text-[19px] font-bold">Your details</h2><p className="mt-px mb-0 text-[11px] text-muted">How can we reach you about your order?</p></div></div>
          <div className="grid grid-cols-2 gap-x-[14px] gap-y-[18px] max-[680px]:grid-cols-1 max-[680px]:gap-[13px]">
            <label>First name<input name="firstName" required autoComplete="given-name" value={firstName} onChange={(event) => setFirstName(event.target.value)} placeholder="First name" /></label>
            <label>Last name<input name="lastName" required autoComplete="family-name" value={lastName} onChange={(event) => setLastName(event.target.value)} placeholder="Last name" /></label>
            <label>Phone number<input name="phone" type="tel" required autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+1 (555) 000-0000" /></label>
            <label>Email address<input name="email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label>
            <label className="col-span-full max-[680px]:col-auto">Anything we should know? <span className="text-[10px] font-normal text-[#a3a8a9]">Optional</span><textarea name="message" rows={4} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Tell us about your car or what you need…" /></label>
          </div>
          {error && <p className={ui.formError} role="alert">{error}</p>}
          <button type="submit" className={cx(ui.button, ui.buttonPrimary, 'mt-[22px] w-full')} disabled={busy}>{busy ? 'Sending request…' : 'Confirm order'} <FiArrowUpRight aria-hidden="true" /></button>
          <p className="mt-[13px] text-center text-[10px] text-muted">No payment is collected online. Our team will confirm your booking and pricing before any work begins.</p>
        </form>
        <aside className="sticky top-[105px] rounded-[9px] border border-line bg-white p-[23px] max-[680px]:static [&_h2]:mt-0 [&_h2]:mb-5 [&_h2]:text-[18px]">
          <h2>Your order</h2>
          {service && <div className="flex items-center gap-[10px] border-b border-line py-3 [&_img]:h-[52px] [&_img]:w-[54px] [&_img]:rounded-md [&_img]:bg-soft [&_img]:object-cover [&_span]:grid [&_span]:flex-1 [&_span]:gap-0.5 [&_strong]:text-[11px] [&_small]:text-[10px] [&_small]:text-muted [&_b]:text-[11px]"><Image src={service.image} alt="" width={60} height={56} unoptimized /><span><strong>{service.name}</strong><small>Service booking</small></span><b>${service.price.toFixed(2)}</b></div>}
          {cartItems.map(({ product, quantity }) => <div className="flex items-center gap-[10px] border-b border-line py-3 [&_img]:h-[52px] [&_img]:w-[54px] [&_img]:rounded-md [&_img]:bg-soft [&_img]:object-cover [&_span]:grid [&_span]:flex-1 [&_span]:gap-0.5 [&_strong]:text-[11px] [&_small]:text-[10px] [&_small]:text-muted [&_b]:text-[11px]" key={product._id}><Image src={product.image} alt="" width={60} height={56} unoptimized /><span><strong>{product.name}</strong><small>Qty: {quantity}</small></span><b>${(product.price * quantity).toFixed(2)}</b></div>)}
          <div className="mt-[19px] border-t border-line pt-[17px] text-[14px] text-ink [&_strong]:text-[19px] [&_strong]:text-brand"><span>Total</span><strong>${total.toFixed(2)}</strong></div>
          {!service && cartItems.length === 0 && <p className="text-[12px] text-muted">Your cart is empty. <Link className="font-bold text-brand" href="/#products">Browse products</Link></p>}
          <div className="mt-[18px] flex items-start gap-2.5 rounded-md bg-[#f1f8f4] p-[13px] [&>span]:text-success [&_p]:m-0 [&_p]:text-[10px] [&_p]:text-[#646d68] [&_strong]:text-[#2b7653]"><span><FiCheck aria-hidden="true" /></span><p><strong>Clear, honest service</strong><br />We will confirm your request before work begins.</p></div>
        </aside>
      </div>
    </section>
  );
}
