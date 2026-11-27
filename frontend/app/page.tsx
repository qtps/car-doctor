'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  FiArrowLeft,
  FiArrowRight,
  FiArrowUpRight,
  FiCheck,
} from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { useState } from 'react';
import { ProductCard, ServiceCard } from '@/components/catalog-cards';
import { useStore } from '@/components/store-provider';
import { demoProducts, demoServices, demoTeam, demoTestimonials } from '@/lib/demo-data';
import { useHydrated } from '@/lib/use-hydrated';
import { cx, ui } from '@/lib/tailwind';

const features = [
  { title: 'Expert Team', image: '/group.svg' },
  { title: 'Timely Delivery', image: '/timer.svg', highlighted: true },
  { title: '24/7 Support', image: '/support.svg' },
  { title: 'Best Equipment', image: '/best_equpment.svg' },
  { title: '100% Guranty', image: '/guranty.svg' },
  { title: 'Timely Delivery', image: '/delivery.svg' },
];

const heroSlides = [
  {
    image: '/hero.png',
    width: 1140,
    height: 600,
    imageAlt: 'Technician servicing a car in the garage',
    eyebrow: 'Affordable, dependable car care',
    title: 'Affordable Price For Car Servicing',
    copy: 'Expert repairs, honest advice and quality parts—without surprises.',
    primaryLabel: 'Discover more',
    primaryHref: '/#about',
    secondaryLabel: 'Helpful reads',
    secondaryHref: '/blog',
  },
  {
    image: '/unique_service.png',
    width: 752,
    height: 400,
    imageAlt: 'Technician polishing a vehicle',
    eyebrow: 'Care that keeps you moving',
    title: 'Reliable car care. No surprises.',
    copy: 'Our experienced team helps you feel confident about every mile.',
    primaryLabel: 'Contact our team',
    primaryHref: '/#contact',
    secondaryLabel: 'Get to know us',
    secondaryHref: '/#about',
  },
  {
    image: '/service_hero.png',
    width: 1140,
    height: 300,
    imageAlt: 'Technician repairing a car engine',
    eyebrow: 'Quality parts and expert service',
    title: 'The right care for every journey.',
    copy: 'Find dependable parts and professional service, all in one place.',
    primaryLabel: 'Shop products',
    primaryHref: '/#products',
    secondaryLabel: 'Contact us',
    secondaryHref: '/#contact',
  },
];

export default function HomePage() {
  const { products, services, team, testimonials } = useStore();
  const isHydrated = useHydrated();
  const [reviewIndex, setReviewIndex] = useState(0);
  const [heroIndex, setHeroIndex] = useState(0);
  const visibleProducts = isHydrated ? products : demoProducts;
  const visibleServices = isHydrated ? services : demoServices;
  const visibleTeam = isHydrated ? team : demoTeam;
  const visibleTestimonials = isHydrated ? testimonials : demoTestimonials;
  const displayedReviews = visibleTestimonials.length > 1
    ? [
      visibleTestimonials[reviewIndex % visibleTestimonials.length],
      visibleTestimonials[(reviewIndex + 1) % visibleTestimonials.length],
    ]
    : visibleTestimonials;
  const activeHero = heroSlides[heroIndex];

  function changeHeroSlide(direction: number) {
    setHeroIndex((index) => (index + heroSlides.length + direction) % heroSlides.length);
  }

  return (
    <>
      <section className={cx(ui.container, 'pt-6 max-[680px]:pt-[14px]')} id="home">
        <div className="relative min-h-125 overflow-hidden rounded-[14px] bg-[#272a2c] text-white max-[900px]:min-h-107.5 max-[680px]:min-h-118.75 max-[680px]:rounded-[10px]" role="region" aria-roledescription="carousel" aria-label="Featured car services">
          <Image className="absolute inset-0 h-full w-full object-cover" src={activeHero.image} alt={activeHero.imageAlt} width={activeHero.width} height={activeHero.height} priority={heroIndex === 0} sizes="(max-width: 760px) 100vw, 1180px" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,15,16,.91)_0%,rgba(13,15,16,.72)_36%,rgba(13,15,16,.08)_100%)] max-[680px]:bg-[linear-gradient(90deg,rgba(13,15,16,.87),rgba(13,15,16,.37))]" />
          <div key={heroIndex} className="absolute top-1/2 left-[clamp(28px,7vw,92px)] w-[min(570px,70%)] -translate-y-1/2 max-[680px]:left-6 max-[680px]:w-[calc(100%-48px)] [&_h1]:m-0 [&_h1]:text-[clamp(40px,5.3vw,66px)] [&_h1]:font-extrabold [&_h1]:leading-[1.06] [&_h1]:tracking-[-.055em] max-[680px]:[&_h1]:text-[clamp(39px,12vw,55px)] [&_p]:mt-5 [&_p]:mb-[26px] [&_p]:max-w-105 [&_p]:text-base [&_p]:text-white/80 max-[680px]:[&_p]:max-w-82.5 max-[680px]:[&_p]:text-sm [&_.eyebrow]:mb-4" aria-live="polite">
            <span className={cx(ui.eyebrow, ui.eyebrowLight)}>{activeHero.eyebrow}</span>
            <h1>{activeHero.title}</h1>
            <p>{activeHero.copy}</p>
            <div className="flex flex-wrap gap-3">
              <Link className={cx(ui.button, ui.buttonPrimary)} href={activeHero.primaryHref}>{activeHero.primaryLabel}</Link>
              <Link className={cx(ui.button, ui.buttonGlass)} href={activeHero.secondaryHref}>{activeHero.secondaryLabel}</Link>
            </div>
          </div>
          <div className="absolute right-7 bottom-[23px] z-[1] flex items-center gap-[10px] max-[680px]:right-[17px] max-[680px]:bottom-[17px]" aria-label="Carousel controls">
            <button className="grid h-10.5 w-10.5 place-items-center rounded-full border border-white/10 bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/35" type="button" aria-label="Previous slide" onClick={() => changeHeroSlide(-1)}><FiArrowLeft aria-hidden="true" size={19} /></button>
            <button className="grid h-10.5 w-10.5 place-items-center rounded-full border border-brand bg-brand text-white transition hover:bg-brand-dark" type="button" aria-label="Next slide" onClick={() => changeHeroSlide(1)}><FiArrowRight aria-hidden="true" size={19} /></button>
          </div>
        </div>
      </section>

      <section className={cx(ui.container, ui.sectionSpace, 'grid grid-cols-[minmax(0,.94fr)_minmax(0,1fr)] items-center gap-[clamp(50px,8vw,115px)] max-[900px]:gap-[38px] max-[680px]:grid-cols-1 max-[680px]:gap-7')} id="about">
        <div className="relative min-h-120 w-[min(100%,495px)] max-[900px]:min-h-97.5 max-[680px]:min-h-90">
          <Image className="block h-110 w-[83%] rounded-xl object-cover max-[900px]:h-92.5 max-[680px]:h-85 max-[680px]:w-[84%]" src="/hero-about.png" alt="A Car Doctor mechanic ready to help" width={521} height={557} />
          <div className="absolute top-8 right-0 flex min-h-23.75 w-36.25 items-center justify-center gap-2.5 rounded-[10px] bg-brand text-white shadow-[0_16px_35px_rgba(255,61,34,.23)] max-[680px]:top-[23px] max-[680px]:w-30 max-[680px]:min-h-19.5"><strong className="text-[37px] leading-none max-[680px]:text-[30px]">12+</strong><span className="text-[11px] font-bold leading-[1.35]">years of<br />trusted care</span></div>
          <div className="absolute right-[2%] bottom-5 flex items-center gap-3 rounded-[9px] bg-white px-5 py-4 shadow-[0_12px_35px_rgba(18,27,30,.12)] max-[680px]:bottom-[7px] max-[680px]:p-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#fff0ed] text-brand"><FiCheck aria-hidden="true" size={18} /></span><span><strong className="block text-[12px]">Quality you can trust</strong><small className="block text-[10px] text-muted">Every repair, every time</small></span></div>
        </div>
        <div className="[&_h2]:my-[11px] [&_h2]:mb-[15px] [&_h2]:text-[clamp(29px,3.2vw,43px)] [&_h2]:font-bold [&_h2]:leading-[1.15] [&_h2]:tracking-[-.045em] max-[680px]:[&_h2]:text-[34px] [&_p]:mb-[14px] [&_p]:max-w-135 [&_p]:text-[14px] [&_p]:text-muted">
          <span className={ui.eyebrow}>About Car Doctor</span>
          <h2>We take the worry<br className="max-[680px]:hidden" /> out of car care.</h2>
          <p>Good service starts with listening. Our experienced team takes time to understand your vehicle, explain what it needs and get the work done right.</p>
          <p>From routine maintenance to complex diagnostics, expect quality work, clear communication and a team that treats your car like its own.</p>
          <div className="my-[26px] flex flex-wrap gap-6 border-t border-line pt-5 max-[680px]:justify-between max-[680px]:gap-[18px] [&_div]:grid [&_div]:gap-0 [&_strong]:text-[22px] [&_strong]:leading-[1.3] [&_strong]:text-brand [&_span]:text-[11px] [&_span]:text-muted max-[680px]:[&_strong]:text-[19px] max-[680px]:[&_span]:text-[9px]">
            <div><strong>2.5k+</strong><span>Happy customers</span></div>
            <div><strong>12+</strong><span>Years of experience</span></div>
            <div><strong>4.9/5</strong><span>Customer rating</span></div>
          </div>
          <Link className={cx(ui.button, ui.buttonPrimary)} href="/#team">Meet our team <FiArrowUpRight aria-hidden="true" /></Link>
        </div>
      </section>

      <section className={cx(ui.container, 'pt-0 pb-24 max-[680px]:pb-[66px]')} id="services">
        <div className="mx-auto mb-8 max-w-172.5 text-center [&_h2]:mt-[11px] [&_h2]:mb-[10px] [&_h2]:text-[clamp(29px,3.2vw,43px)] [&_h2]:font-bold [&_h2]:leading-[1.15] [&_h2]:tracking-[-.045em] max-[680px]:mb-6 max-[680px]:[&_h2]:text-[30px] [&_p]:mx-auto [&_p]:my-0 [&_p]:max-w-135 [&_p]:text-[14px] [&_p]:text-muted max-[680px]:[&_p]:text-[12px] [&_.eyebrow]:justify-center">
          <span className="text-[12px] font-bold text-brand">Service</span>
          <h2>Our Service Area</h2>
          <p>Expert repairs and maintenance to keep you safely on the road.</p>
        </div>
        <div className="grid grid-cols-3 gap-4 max-[680px]:grid-cols-2 max-[420px]:grid-cols-1">
          {visibleServices.slice(0, 6).map((service) => <ServiceCard key={service._id} service={service} />)}
        </div>
        <div className="mt-7 flex justify-center">
          <Link className="inline-flex min-h-9 items-center justify-center rounded border border-brand px-3 text-xs font-semibold text-brand transition-colors hover:bg-brand hover:text-white" href="/#services">More Services</Link>
        </div>
      </section>

      <section className={cx(ui.container, 'relative z-[1] mt-[-1px] grid grid-cols-3 gap-[18px] rounded-xl bg-ink px-[clamp(22px,4vw,52px)] py-[29px] text-white max-[680px]:mt-0 max-[680px]:grid-cols-1 max-[680px]:gap-[19px] max-[680px]:rounded-none max-[680px]:px-6 max-[680px]:py-[25px]')}>
        <div className="flex items-center gap-[15px]">
          <span className="grid h-10.75 w-10.75 shrink-0 place-items-center"><Image src="/calender.svg" alt="" width={41} height={41} /></span>
          <span><small className="block text-[10px] text-[#a9afb1]">We are open Monday–Friday</small><strong className="mt-0.5 block text-[14px] max-[680px]:text-[13px]">7:00 am – 9:00 pm</strong></span>
        </div>
        <a className="flex items-center gap-[15px]" href="tel:+25462512658">
          <span className="grid h-10.75 w-10.75 shrink-0 place-items-center"><Image src="/call.svg" alt="" width={43} height={38} /></span>
          <span><small className="block text-[10px] text-[#a9afb1]">Have a question?</small><strong className="mt-0.5 block text-[14px] max-[680px]:text-[13px]">+254 625 12658</strong></span>
        </a>
        <a className="flex items-center gap-[15px]" href="https://maps.google.com/?q=Liza+Street+New+York">
          <span className="grid h-10.75 w-10.75 shrink-0 place-items-center"><Image src="/location.svg" alt="" width={39} height={43} /></span>
          <span><small className="block text-[10px] text-[#a9afb1]">Need a repair? Visit us</small><strong className="mt-0.5 block text-[14px] max-[680px]:text-[13px]">Liza Street, New York</strong></span>
        </a>
      </section>

      <section className={cx(ui.container, 'pt-3 pb-8 max-[680px]:max-w-135')} id="products">
        <div className="mx-auto mb-5 max-w-135 text-center [&_h2]:mt-1 [&_h2]:mb-2 [&_h2]:text-[22px] [&_h2]:font-bold [&_h2]:leading-tight [&_p]:mx-auto [&_p]:my-0 [&_p]:max-w-135 [&_p]:text-[10px] [&_p]:leading-relaxed [&_p]:text-muted">
          <span className="text-[10px] font-semibold text-brand">Popular Products</span>
          <h2>Browse Our Products</h2>
          <p>The majority have suffered alteration in some form, by injected humour, or randomised words which don&apos;t look even slightly believable.</p>
        </div>
        <div className="grid grid-cols-3 gap-3 max-[600px]:grid-cols-2">
          {visibleProducts.slice(0, 6).map((product) => <ProductCard key={product._id} product={product} />)}
        </div>
        <div className="mt-6 flex justify-center">
          <Link className="inline-flex min-h-7 items-center justify-center rounded border border-brand px-3 py-1 text-[10px] font-semibold text-brand transition-colors hover:bg-brand hover:text-white" href="/#products">More Products</Link>
        </div>
      </section>

      <section className={cx(ui.sectionSpace, 'bg-soft')} id="team">
        <div className={ui.container}>
          <div className="mx-auto mb-[42px] max-w-172.5 text-center max-[680px]:mb-7 [&_h2]:mt-[11px] [&_h2]:mb-[10px] [&_h2]:text-[clamp(29px,3.2vw,43px)] [&_h2]:font-bold [&_h2]:leading-[1.15] [&_h2]:tracking-[-.045em] max-[680px]:[&_h2]:text-[30px] [&_p]:mx-auto [&_p]:my-0 [&_p]:max-w-135 [&_p]:text-[14px] [&_p]:text-muted max-[680px]:[&_p]:text-[12px] [&_.eyebrow]:justify-center">
            <span className={ui.eyebrow}>The people behind the work</span>
            <h2>Meet your neighborhood experts</h2>
            <p>Friendly faces, skilled hands and a shared love for keeping you on the road.</p>
          </div>
          <div className="grid grid-cols-3 gap-[22px] max-[680px]:grid-cols-1 max-[680px]:gap-[14px]">
            {visibleTeam.slice(0, 3).map((member) => (
              <article className="group rounded-[10px] border border-line bg-white px-[14px] pt-[14px] pb-[19px] text-center transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(26,35,39,.09)] max-[680px]:px-[10px] max-[680px]:pt-[10px] max-[680px]:pb-4" key={member._id}>
                <div className="h-71.25 overflow-hidden rounded-[7px] bg-[#eef0f0] max-[900px]:h-55 max-[680px]:h-75"><Image className="h-full w-full object-cover" src={member.image} alt={member.name} width={420} height={420} unoptimized /></div>
                <h3 className="mt-[15px] mb-px text-base font-bold">{member.name}</h3><p className="m-0 text-[12px] text-muted">{member.role}</p>
                <div className="mt-[13px] flex justify-center gap-1.5">
                  <a className="transition-opacity hover:opacity-75" href="https://www.facebook.com/" aria-label={`${member.name} on Facebook`}><Image src="/facebook.svg" alt="" width={26} height={26} /></a>
                  <a className="transition-opacity hover:opacity-75" href="https://twitter.com/" aria-label={`${member.name} on Twitter`}><Image src="/tweeter.svg" alt="" width={26} height={26} /></a>
                  <a className="transition-opacity hover:opacity-75" href="https://www.linkedin.com/" aria-label={`${member.name} on LinkedIn`}><Image src="/linkedin.svg" alt="" width={26} height={26} /></a>
                  <a className="transition-opacity hover:opacity-75" href="https://www.instagram.com/" aria-label={`${member.name} on Instagram`}><Image src="/instagram.svg" alt="" width={26} height={26} /></a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={cx(ui.container, 'py-[80px] max-[680px]:py-[54px]')}>
        <div className="mx-auto mb-[32px] max-w-172.5 text-center max-[680px]:mb-6 [&_h2]:mt-[9px] [&_h2]:mb-[9px] [&_h2]:text-[30px] [&_h2]:font-bold [&_h2]:leading-[1.15] [&_h2]:tracking-[-.045em] [&_p]:mx-auto [&_p]:my-0 [&_p]:max-w-135 [&_p]:text-[11px] [&_p]:text-muted [&_.eyebrow]:justify-center">
          <span className={ui.eyebrow}>Core Features</span>
          <h2>Why Choose Us</h2>
          <p>The majority have suffered alteration in some form, by injected humour, or randomised words which don&apos;t look even slightly believable.</p>
        </div>
        <div className="grid grid-cols-6 gap-[14px] max-[680px]:grid-cols-3 max-[680px]:gap-[10px] max-[360px]:gap-2">
          {features.map((feature) => (
            <div className={cx(
              'flex min-h-24.5 flex-col items-center justify-center gap-[9px] rounded-[7px] border px-2 py-[10px] text-center transition-colors',
              feature.highlighted ? 'border-brand bg-brand text-white' : 'border-line bg-white text-ink',
            )} key={feature.image}>
              <Image className="h-10.5 w-11.5 object-contain max-[680px]:h-9 max-[680px]:w-10" src={feature.image} alt="" width={46} height={42} />
              <h3 className="m-0 text-[12px] font-bold leading-tight max-[680px]:text-[10px]">{feature.title}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white pt-[20px] pb-[88px] max-[680px]:pt-[44px] max-[680px]:pb-[58px]">
        <div className={ui.container}>
          <div className="mx-auto mb-[35px] max-w-172.5 text-center max-[680px]:mb-6 [&_h2]:mt-[14px] [&_h2]:mb-[14px] [&_h2]:text-[clamp(30px,3.2vw,43px)] [&_h2]:font-bold [&_h2]:leading-[1.15] [&_h2]:tracking-[-.045em] max-[680px]:[&_h2]:text-[30px] [&_p]:mx-auto [&_p]:my-0 [&_p]:max-w-135 [&_p]:text-[11px] [&_p]:leading-[1.8] [&_p]:text-muted [&_.eyebrow]:justify-center">
            <span className={ui.eyebrow}>Testimonial</span>
            <h2>What Customer Says</h2>
            <p>The Majority Have Suffered Alteration In Some Form, By Injected Humour, Or Randomised Words Which Don&apos;t Look Even Slightly Believable.</p>
          </div>
          <div className="relative mx-auto max-w-215">
            {visibleTestimonials.length > 1 && <button className="absolute top-1/2 left-[-20px] z-[1] grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-[#f3f3f3] text-ink transition hover:bg-[#e8e8e8] max-[680px]:left-[-10px]" type="button" aria-label="Previous reviews" onClick={() => setReviewIndex((index) => (index + visibleTestimonials.length - 1) % visibleTestimonials.length)}><FiArrowLeft aria-hidden="true" /></button>}
            <div className="grid grid-cols-2 gap-4 max-[680px]:grid-cols-1">
              {displayedReviews.map((review, index) => (
              <article className={cx('min-h-59.5 rounded-[6px] border border-line bg-white px-[34px] py-[30px] max-[680px]:min-h-0 max-[680px]:px-8 max-[680px]:py-[22px]', index === 1 && 'max-[680px]:hidden')} key={review._id}>
                <div className="flex items-center gap-[13px] [&_strong]:block [&_strong]:text-[15px] [&_small]:block [&_small]:text-[11px] [&_small]:text-muted">
                  <Image className="h-10.5 w-10.5 rounded-full object-cover" src={review.image} alt={review.name} width={42} height={42} unoptimized />
                  <span><strong>{review.name}</strong><small>{review.role}</small></span>
                  <Image className="ml-auto h-10 w-10 opacity-55" src="/quate.svg" alt="" width={40} height={40} />
                </div>
                <p className="my-[17px] mb-[12px] text-[12px] leading-[1.75] text-[#737779]">{review.quote}</p>
                <div className="flex gap-0.5 text-[14px] text-[#ff8a2c]" role="img" aria-label={`${review.rating} out of 5 stars`}>{Array.from({ length: 5 }, (_, starIndex) => <FaStar className={starIndex < review.rating ? '' : 'text-line'} key={starIndex} />)}</div>
              </article>
              ))}
            </div>
            {visibleTestimonials.length > 1 && <button className="absolute top-1/2 right-[-20px] z-[1] grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-brand text-white transition hover:bg-brand-dark max-[680px]:right-[-10px]" type="button" aria-label="Next reviews" onClick={() => setReviewIndex((index) => (index + 1) % visibleTestimonials.length)}><FiArrowRight aria-hidden="true" /></button>}
          </div>
        </div>
      </section>

      <section className={cx(ui.container, 'mb-[90px] flex items-center justify-between gap-[30px] rounded-xl bg-brand px-12 py-9 text-white max-[680px]:mb-[62px] max-[680px]:flex-col max-[680px]:items-start max-[680px]:px-6 max-[680px]:py-[27px] [&_h2]:my-2 [&_h2]:text-[clamp(25px,3vw,36px)] [&_h2]:font-bold max-[680px]:[&_h2]:text-[29px] [&_p]:m-0 [&_p]:text-[13px] [&_p]:text-white/80')}>
        <div><span className={cx(ui.eyebrow, ui.eyebrowLight)}>Ready when you are</span><h2>Let&apos;s get you back on the road.</h2><p>Tell us what your car needs. Our team will take it from here.</p></div>
        <Link className={cx(ui.button, ui.buttonWhite)} href="/#contact">Book an appointment <FiArrowUpRight aria-hidden="true" /></Link>
      </section>
    </>
  );
}
