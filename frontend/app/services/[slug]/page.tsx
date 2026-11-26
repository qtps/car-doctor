'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { useStore } from '@/components/store-provider';
import { useHydrated } from '@/lib/use-hydrated';
import { demoServices } from '@/lib/demo-data';
import { cx, ui } from '@/lib/tailwind';
import { FiArrowRight, FiArrowUpRight, FiCheck, FiPlay } from 'react-icons/fi';

export default function ServiceDetailPage() {
  return <Suspense fallback={<section className={ui.statusPage}><h1 className={ui.statusHeading}>Loading service details…</h1></section>}><ServiceDetailContent /></Suspense>;
}

function ServiceDetailContent() {
  const { slug } = useParams<{ slug: string }>();
  const { services } = useStore();
  const isHydrated = useHydrated();
  const visibleServices = isHydrated ? services : demoServices;
  const service = visibleServices.find((item) => item.slug === slug || item._id === slug);

  if (!service) {
    return <section className={ui.statusPage}><span className={ui.eyebrow}>Service details</span><h1 className={ui.statusHeading}>We could not find that service</h1><p className={ui.statusCopy}>It may have moved. Browse all of our current services to find the right care for your car.</p><Link className={cx(ui.button, ui.buttonPrimary)} href="/#services">Browse services <FiArrowUpRight aria-hidden="true" /></Link></section>;
  }

  const serviceList = visibleServices.slice(0, 5);
  const reasons = [
    ['Careful diagnostics', 'We take the time to find the root cause before recommending a repair.'],
    ['Quality workmanship', 'Our trained technicians use the right tools and proven repair methods.'],
    ['Clear communication', 'You stay informed with straightforward updates at every step.'],
    ['A service you can trust', 'We only proceed after you understand and approve the work.'],
  ];

  return (
    <section className={cx(ui.container, 'py-9 pb-[88px] max-[680px]:py-[25px] max-[680px]:pb-[62px]')}>
      <div className="relative flex min-h-[230px] items-center overflow-hidden rounded-[10px] bg-[#232627] text-white max-[680px]:min-h-[190px] [&>img]:absolute [&>img]:inset-0 [&>img]:block [&>img]:h-full [&>img]:w-full [&>img]:object-cover [&:after]:absolute [&:after]:inset-0 [&:after]:bg-[linear-gradient(90deg,rgba(17,19,20,.86),rgba(17,19,20,.24))] [&:after]:content-[''] [&>div]:relative [&>div]:z-[1] [&>div]:px-[clamp(25px,7vw,84px)] [&>div]:py-[30px] [&_h1]:my-[8px] [&_h1]:mb-[3px] [&_h1]:text-[clamp(32px,4vw,44px)] [&_h1]:font-bold [&_h1]:leading-[1.2] [&_h1]:tracking-[-.04em] [&_p]:m-0 [&_p]:text-[12px] [&_p]:text-[#f2c5bc] [&_p_span]:px-2 [&_p_a:hover]:text-white">
        <Image src="/service_hero.png" alt="" width={1140} height={300} sizes="100vw" priority />
        <div><span className={cx(ui.eyebrow, ui.eyebrowLight)}>Car Doctor services</span><h1>{service.name}</h1><p><Link href="/">Home</Link> <span>/</span> <Link href="/#services">Services</Link> <span>/</span> {service.name}</p></div>
      </div>
      <div className="mt-8 grid grid-cols-[minmax(0,1fr)_300px] items-start gap-[30px] max-[900px]:grid-cols-[minmax(0,1fr)_260px] max-[900px]:gap-[18px] max-[680px]:grid-cols-1">
        <article className="[&_h2]:mt-[13px] [&_h2]:mb-2 [&_h2]:text-[clamp(24px,3vw,34px)] [&_h2]:font-bold [&_h2]:leading-[1.18] [&_h2]:tracking-[-.035em] [&_p]:text-[13px] [&_p]:leading-[1.8] [&_p]:text-muted">
          <Image className="mb-[22px] block h-[360px] w-full rounded-[9px] object-cover max-[680px]:h-[250px]" src={service.image} alt={service.name} width={760} height={440} unoptimized />
          <span className={ui.eyebrow}>Professional vehicle care</span>
          <h2>{service.name} by people who care</h2>
          <p>{service.description} Our team will inspect your vehicle, talk you through what we find and recommend the right next step for your budget and safety.</p>
          <p>Every visit starts with a clear conversation. No confusing jargon, no work without your approval—just reliable service tailored to your car.</p>
          <div className="my-[22px] grid grid-cols-2 gap-3 max-[680px]:grid-cols-1">
            {reasons.map(([title, copy]) => <div className="flex items-start gap-[10px] rounded-md border border-line p-[14px]" key={title}><span className="grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full bg-[#e8f7ef] text-success"><FiCheck size={14} aria-hidden="true" /></span><section><strong className="text-[12px]">{title}</strong><p className="mt-1 mb-0 text-[10px]">{copy}</p></section></div>)}
          </div>
          <h2>Three simple steps</h2>
          <div className="my-4 grid grid-cols-3 gap-2 max-[680px]:grid-cols-1 [&>div]:grid [&>div]:gap-2 [&>div]:rounded-md [&>div]:bg-soft [&>div]:p-[15px] [&>div_span]:text-[11px] [&>div_span]:font-extrabold [&>div_span]:text-brand [&>div_strong]:text-[11px]">{[['01', 'Tell us what you need'], ['02', 'Get a clear estimate'], ['03', 'Leave the rest to us']].map(([number, label]) => <div key={number}><span>{number}</span><strong>{label}</strong></div>)}</div>
          <div className="relative mt-5 overflow-hidden rounded-[9px] [&_img]:block [&_img]:h-[300px] [&_img]:w-full [&_img]:object-cover max-[680px]:[&_img]:h-[220px]"><Image src="/hero.png" alt="Car Doctor team at work" width={1140} height={600} sizes="(max-width: 760px) 100vw, 760px" /><span className="absolute top-1/2 left-1/2 grid h-[58px] w-[58px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-brand text-white"><FiPlay aria-hidden="true" size={22} /></span></div>
        </article>
        <aside className="sticky top-[105px] grid gap-3 max-[680px]:static">
          <div className="rounded-[9px] border border-line bg-white p-[18px] [&_h2]:mt-0 [&_h2]:mb-3 [&_h2]:text-[16px] [&>a]:flex [&>a]:justify-between [&>a]:border-t [&>a]:border-line [&>a]:py-[11px] [&>a]:text-[11px] [&>a:hover]:text-brand [&>a.active]:font-bold [&>a.active]:text-brand"><h2>Our services</h2>{serviceList.map((item) => <Link className={item.slug === service.slug ? 'active' : ''} key={item._id} href={`/services/${item.slug}`}>{item.name}<FiArrowRight aria-hidden="true" /></Link>)}</div>
          <div className="rounded-[9px] bg-ink p-[19px] text-white [&_h2]:mt-0 [&_h2]:mb-2 [&_h2]:text-[17px] [&_p]:text-[11px] [&_p]:text-white/70"><h2>Need a hand?</h2><p>Tell us what your car is doing and our team will help you find the right service.</p><a className={cx(ui.button, ui.buttonPrimary, 'w-full')} href="tel:+25462512658">Call +254 625 12658</a></div>
          <div className="grid gap-[7px] rounded-[9px] border border-line bg-[#fff8f6] p-[19px] [&>span]:text-[11px] [&>span]:text-muted [&>strong]:text-[27px] [&>strong]:font-extrabold [&>strong]:text-brand [&>small]:mb-2 [&>small]:text-[10px] [&>small]:text-muted">
            <span>Service from</span><strong>${service.price.toFixed(2)}</strong><small>Final price confirmed before any work begins.</small><Link className={cx(ui.button, ui.buttonPrimary)} href={`/checkout?service=${service._id}`}>Book this service <FiArrowUpRight aria-hidden="true" /></Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
