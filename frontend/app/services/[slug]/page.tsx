'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { useStore } from '@/components/store-provider';
import { useHydrated } from '@/lib/use-hydrated';
import { demoServices } from '@/lib/demo-data';
import { cx, ui } from '@/lib/tailwind';
import { FiArrowRight, FiArrowUpRight, FiFileText, FiPlay } from 'react-icons/fi';

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
    return <section className={ui.statusPage}><span className={ui.eyebrow}>Service details</span><h1 className={ui.statusHeading}>We could not find that service</h1><p className={ui.statusCopy}>It may have moved. Contact our team and we will help you find the right care for your car.</p><Link className={cx(ui.button, ui.buttonPrimary)} href="/#contact">Contact us <FiArrowUpRight aria-hidden="true" /></Link></section>;
  }

  const serviceList = visibleServices.slice(0, 5);
  const reasons = [
    ['Careful diagnostics', 'We take the time to find the root cause before recommending a repair.'],
    ['Quality workmanship', 'Our trained technicians use the right tools and proven repair methods.'],
    ['Clear communication', 'You stay informed with straightforward updates at every step.'],
    ['A service you can trust', 'We only proceed after you understand and approve the work.'],
  ];
  const steps = [
    ['01', 'Step One', 'Tell us what your car needs.'],
    ['02', 'Step Two', 'Get a clear estimate from our team.'],
    ['03', 'Step Three', 'Approve the work and leave the rest to us.'],
  ];

  return (
    <section className="mx-auto w-[min(1180px,calc(100%-48px))] pt-2 pb-20 max-[680px]:w-[calc(100%-32px)] max-[680px]:pb-14">
      <header className="relative aspect-[3.8] min-h-35 overflow-hidden rounded-md bg-[#232627] text-white max-[480px]:aspect-[2.4]">
        <Image className="absolute inset-0 h-full w-full object-cover" src="/service_hero.png" alt="" width={1140} height={300} sizes="(max-width: 680px) 100vw, 1180px" priority />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,19,20,.86),rgba(17,19,20,.24))]" />
        <h1 className="absolute top-1/2 left-[clamp(22px,8vw,50px)] m-0 -translate-y-1/2 text-[clamp(20px,3vw,26px)] font-bold">Service Details</h1>
        <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-1.5 bg-brand px-6 pt-1.5 pb-2 text-[10px] font-medium [clip-path:polygon(10%_0,90%_0,100%_100%,0_100%)]">
          <Link href="/">Home</Link><span>/</span><span>Service Details</span>
        </div>
      </header>

      <div className="mt-14 grid grid-cols-[minmax(0,2fr)_minmax(170px,1fr)] items-start gap-3 max-[480px]:grid-cols-1 max-[680px]:mt-10">
        <article className="[&_h2]:mt-5 [&_h2]:mb-3 [&_h2]:text-[17px] [&_h2]:font-bold [&_h2]:leading-tight [&_p]:text-[9px] [&_p]:leading-[1.7] [&_p]:text-muted">
          <Image className="block aspect-[1.88] w-full rounded-md object-cover" src={service.image} alt={service.name} width={760} height={440} unoptimized />
          <h2>{service.name}</h2>
          <p>{service.description} Our team will inspect your vehicle, talk you through what we find and recommend the right next step for your budget and safety.</p>
          <div className="my-3 grid grid-cols-2 gap-2.5 max-[360px]:grid-cols-1">
            {reasons.map(([title, copy]) => <div className="min-h-24 rounded-md border-t-2 border-brand bg-[#f3f3f3] px-4 py-3.5" key={title}><strong className="text-[10px] font-bold">{title}</strong><p className="mt-1 mb-0">{copy}</p></div>)}
          </div>
          <p>Every visit starts with a clear conversation. No confusing jargon, no work without your approval—just reliable service tailored to your car.</p>
          <h2 className="mt-6">3 Simple Steps to Process</h2>
          <p>Our team will guide you through every step, from your first question to getting back on the road.</p>
          <div className="my-3 grid grid-cols-3 gap-2 max-[360px]:grid-cols-1">
            {steps.map(([number, title, copy]) => <div className="min-h-33 rounded-md border border-line bg-white px-2.5 py-3 text-center" key={number}>
              <span className="mx-auto grid size-9 place-items-center rounded-full bg-[#ffebe7]"><span className="grid size-6 place-items-center rounded-full bg-brand text-[10px] font-bold text-white">{number}</span></span>
              <strong className="mt-2 block text-[9px] font-bold uppercase">{title}</strong>
              <p className="mt-2 mb-0">{copy}</p>
            </div>)}
          </div>
          <div className="relative mt-3 aspect-[1.88] overflow-hidden rounded-md">
            <Image className="h-full w-full object-cover" src="/hero.png" alt="Car Doctor mechanic working on a vehicle" width={1140} height={600} sizes="(max-width: 760px) 100vw, 760px" />
            <span className="absolute top-1/2 left-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-brand bg-black/55 text-brand"><FiPlay aria-hidden="true" size={20} /></span>
          </div>
        </article>

        <aside className="grid gap-3">
          <section className="rounded-md bg-[#f3f3f3] p-4 [&_h2]:mt-0 [&_h2]:mb-2.5 [&_h2]:text-[13px] [&>a]:flex [&>a]:items-center [&>a]:justify-between [&>a]:rounded-[3px] [&>a]:px-2.5 [&>a]:py-2 [&>a]:text-[9px] [&>a]:font-medium [&>a:not(.active)]:bg-white [&>a:not(.active)]:text-ink [&>a.active]:bg-brand [&>a.active]:text-white [&>a+a]:mt-2">
            <h2>Services</h2>
            {serviceList.map((item) => <Link className={item._id === service._id ? 'active' : ''} key={item._id} href={`/services/${item.slug}`}>{item.name}<FiArrowRight aria-hidden="true" /></Link>)}
          </section>

          <section className="rounded-md bg-[#191919] p-4 text-white [&_h2]:mt-0 [&_h2]:mb-2.5 [&_h2]:text-[13px]">
            <h2>Download</h2>
            {[
              ['Our Brochure', 'Request our brochure'],
              ['Company Details', 'Request company details'],
            ].map(([label, subject]) => <a className="flex items-center justify-between gap-2 py-1.5 text-[9px] hover:text-[#ff6047]" href={`mailto:hello@cardoctor.example?subject=${encodeURIComponent(subject)}`} key={label}>
              <span className="flex items-center gap-2"><FiFileText aria-hidden="true" /><span>{label}<small className="block text-[8px] text-white/55">Request by email</small></span></span>
              <span className="grid size-7 shrink-0 place-items-center rounded-sm bg-brand"><FiArrowRight aria-hidden="true" /></span>
            </a>)}
          </section>

          <section className="grid justify-items-center gap-3 rounded-md bg-[#191919] px-4 py-5 text-center text-white">
            <Image className="h-auto w-20 brightness-0 invert" src="/logo.svg" alt="Car Doctor" width={107} height={87} />
            <p className="m-0 max-w-36 text-[10px] font-bold leading-relaxed">Need Help? We Are Here To Help You</p>
            <div className="w-full rounded-md bg-white px-2 py-2 text-ink">
              <strong className="block text-[10px]"><span className="text-brand">Car Doctor</span> Special</strong>
              <small className="text-[8px]">Save up to 60% off</small>
            </div>
            <a className="rounded-sm bg-brand px-4 py-2 text-[9px] font-bold text-white transition-colors hover:bg-brand-dark" href="mailto:hello@cardoctor.example?subject=Quote%20request">Get A Quote</a>
          </section>

          <section className="grid gap-2">
            <p className="m-0 text-[16px] font-bold">Price <span>${service.price.toFixed(2)}</span></p>
            <Link className={cx(ui.button, ui.buttonPrimary, 'min-h-8 w-full rounded-sm px-2 text-[9px]')} href={`/checkout?service=${service._id}`}>Proceed Checkout</Link>
          </section>
        </aside>
      </div>
    </section>
  );
}
