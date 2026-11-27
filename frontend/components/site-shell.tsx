'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ReactNode, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useStore } from './store-provider';
import { useHydrated } from '@/lib/use-hydrated';
import { cx, ui } from '@/lib/tailwind';
import { FiX } from 'react-icons/fi';

export function SiteShell({ children }: { children: ReactNode }) {
  const { cart, user, notice, setNotice } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const isHydrated = useHydrated();
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const currentUser = isHydrated ? user : null;
  const cartCount = isHydrated ? cart.reduce((total, item) => total + item.quantity, 0) : 0;

  const navLinks = [
    { href: '/#home', label: 'Home' },
    { href: '/#about', label: 'About' },
    { href: '/#services', label: 'Services' },
    { href: '/#stories', label: 'Blog' },
    { href: '/#contact', label: 'Contact' },
  ];

  return (
    <>
      {!isAdmin && <header className="sticky top-0 z-20 border-b border-ink/5 bg-white">
        <div className={cx(ui.container, 'flex min-h-[82px] items-center justify-between gap-7 min-[681px]:grid min-[681px]:grid-cols-[1fr_auto_1fr] max-[900px]:min-h-[72px] max-[900px]:gap-[14px] max-[680px]:min-h-[68px]')}>
          <Link className="flex w-[150px] shrink-0 items-center max-[900px]:w-[120px] max-[680px]:w-[112px]" href="/" aria-label="Car Doctor home">
            <Image className="h-auto w-[126px] max-[900px]:w-[110px] max-[680px]:w-[104px]" src="/logo.svg" alt="Car Doctor" width={107} height={87} priority />
          </Link>
          <button
            className="hidden border-0 bg-transparent max-[680px]:order-3 max-[680px]:flex max-[680px]:flex-col max-[680px]:gap-[5px] max-[680px]:py-2 max-[680px]:pl-2"
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="block h-0.5 w-[22px] rounded-sm bg-ink" />
            <span className="block h-0.5 w-[22px] rounded-sm bg-ink" />
            <span className="block h-0.5 w-[22px] rounded-sm bg-ink" />
          </button>
          <nav className={cx('hidden items-center gap-[clamp(20px,3vw,42px)] text-[13px] font-semibold text-[#45494b] transition-colors [&_a:hover]:text-brand max-[900px]:gap-[17px] max-[900px]:[&_a]:text-[12px] min-[681px]:flex max-[680px]:absolute max-[680px]:top-[67px] max-[680px]:right-0 max-[680px]:left-0 max-[680px]:flex-col max-[680px]:items-stretch max-[680px]:gap-0 max-[680px]:border-b max-[680px]:border-line max-[680px]:bg-white max-[680px]:px-[22px] max-[680px]:pt-[9px] max-[680px]:pb-[15px] max-[680px]:shadow-[0_12px_18px_#0000000c] [&_a]:transition-colors', menuOpen && 'max-[680px]:flex')} aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link className="max-[680px]:py-2.5" key={link.label} href={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Link
              className="hidden max-[680px]:mt-[5px] max-[680px]:block max-[680px]:border-t max-[680px]:border-line max-[680px]:pt-[14px]"
              href={currentUser?.role === 'admin' ? '/admin' : currentUser ? '/account' : '/login'}
              onClick={() => setMenuOpen(false)}
            >
              {currentUser ? 'My account' : 'Sign in'}
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-[17px] max-[900px]:gap-[10px] max-[680px]:gap-2">
            <Link
              className="relative grid h-8 w-7 place-items-center max-[680px]:hidden"
              href={currentUser?.role === 'admin' ? '/admin' : currentUser ? '/account' : '/login'}
              aria-label={currentUser ? `Account: ${currentUser.name}` : 'Sign in'}
              title={currentUser?.name ?? 'Sign in'}
            >
              <Image className="opacity-80" src="/user.svg" alt="" width={16} height={20} />
            </Link>
            <Link className="relative grid h-8 w-7 place-items-center" href="/cart" aria-label={`Cart, ${cartCount} items`}>
              <Image src="/cart.svg" alt="" width={20} height={20} />
              {cartCount > 0 && <span className="absolute -top-[3px] -right-[7px] grid h-[17px] w-[17px] place-items-center rounded-full bg-brand text-[10px] font-extrabold text-white">{cartCount}</span>}
            </Link>
            <Link className={cx(ui.button, ui.buttonOutline, 'min-h-[42px] px-4 max-[900px]:px-[11px] max-[900px]:text-[11px] max-[680px]:min-h-[37px] max-[680px]:px-[10px] max-[680px]:text-[10px]')} href="/#contact">
              Appointment
            </Link>
          </div>
        </div>
      </header>}
      <main>{children}</main>
      {!isAdmin && <footer className="bg-[#1b1d1e] px-0 pt-[62px] pb-5 text-white max-[680px]:pt-11">
        <div className={cx(ui.container, 'grid grid-cols-[1.7fr_repeat(3,1fr)] gap-12 max-[680px]:grid-cols-2 max-[680px]:gap-x-[22px] max-[680px]:gap-y-[30px]')}>
          <div className="max-[680px]:col-span-full">
            <Link href="/" className="inline-flex rounded-[5px] bg-white px-2 py-1">
              <Image src="/logo.svg" alt="Car Doctor" width={107} height={87} />
            </Link>
            <p className="max-w-[290px] text-[12px] text-[#b2b6b7]">Expert care for every mile. Trusted repairs, quality parts and service you can count on.</p>
            <div className="mt-[17px] flex gap-[8px]" aria-label="Social networks">
              <a className="transition-opacity hover:opacity-80" href="https://twitter.com/" aria-label="Twitter"><Image src="/footer-tweeter.svg" alt="" width={37} height={35} /></a>
              <a className="transition-opacity hover:opacity-80" href="https://www.instagram.com/" aria-label="Instagram"><Image src="/footer_insta.svg" alt="" width={35} height={35} /></a>
              <a className="transition-opacity hover:opacity-80" href="https://www.linkedin.com/" aria-label="LinkedIn"><Image src="/footer_linkedin.svg" alt="" width={35} height={35} /></a>
            </div>
          </div>
          <div className="flex flex-col items-start gap-[11px] [&_h3]:my-[7px] [&_h3]:mb-[10px] [&_h3]:text-[14px] [&_a]:text-[12px] [&_a]:font-normal [&_a]:text-[#b2b6b7] [&_a:hover]:text-brand [&_p]:m-0 [&_p]:text-[12px] [&_p]:font-normal [&_p]:text-[#b2b6b7]">
            <h3>Company</h3><Link href="/#about">About us</Link><Link href="/#services">Our services</Link><Link href="/#team">Meet our team</Link>
          </div>
          <div className="flex flex-col items-start gap-[11px] [&_h3]:my-[7px] [&_h3]:mb-[10px] [&_h3]:text-[14px] [&_a]:text-[12px] [&_a]:font-normal [&_a]:text-[#b2b6b7] [&_a:hover]:text-brand [&_p]:m-0 [&_p]:text-[12px] [&_p]:font-normal [&_p]:text-[#b2b6b7]">
            <h3>Explore</h3><Link href="/#products">Shop products</Link><Link href="/#stories">Latest stories</Link><Link href="/cart">Your cart</Link>
          </div>
          <div className="flex flex-col items-start gap-[11px] [&_h3]:my-[7px] [&_h3]:mb-[10px] [&_h3]:text-[14px] [&_a]:text-[12px] [&_a]:font-normal [&_a]:text-[#b2b6b7] [&_a:hover]:text-brand [&_p]:m-0 [&_p]:text-[12px] [&_p]:font-normal [&_p]:text-[#b2b6b7]" id="contact">
            <h3>Get in touch</h3><a href="tel:+25462512658">+254 625 12658</a><a href="mailto:hello@cardoctor.example">hello@cardoctor.example</a><p>7:00 am – 9:00 pm, Monday–Friday</p>
          </div>
        </div>
        <div className={cx(ui.container, 'mt-[42px] flex justify-between gap-5 border-t border-[#353839] pt-[17px] text-[10px] text-[#9da2a3] max-[680px]:mt-[30px] max-[680px]:text-[9px] [&_a:hover]:text-white')}>
          <span>© Car Doctor. All rights reserved.</span>
          <Link href="/admin">Admin dashboard</Link>
        </div>
      </footer>}
      {notice && (
        <div className="fixed right-[22px] bottom-[22px] z-[50] flex max-w-[min(420px,calc(100%-44px))] items-center gap-[18px] rounded-lg bg-ink px-[18px] py-3 text-[13px] text-white shadow-[0_12px_35px_#0003] [&_button]:border-0 [&_button]:bg-transparent [&_button]:text-white" role="status">
          <span>{notice}</span>
          <button className="grid h-7 w-7 shrink-0 place-items-center" type="button" aria-label="Dismiss notification" onClick={() => setNotice('')}><FiX aria-hidden="true" /></button>
        </div>
      )}
    </>
  );
}
