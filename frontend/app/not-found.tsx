import Image from 'next/image';
import Link from 'next/link';
import { cx, ui } from '@/lib/tailwind';
import { FiArrowUpRight } from 'react-icons/fi';

export default function NotFound() {
  return (
    <section className={cx(ui.container, 'flex min-h-[65vh] flex-col items-center justify-center py-10 text-center [&_h1]:my-[8px] [&_h1]:mb-[10px] [&_h1]:text-[clamp(32px,4vw,48px)] [&_h1]:font-bold [&_h1]:leading-[1.15] [&_h1]:tracking-[-.05em] max-[680px]:[&_h1]:text-[33px] [&_p]:mx-auto [&_p]:mb-5 [&_p]:text-[14px] [&_p]:text-muted [&_.eyebrow]:mt-5')}>
      <Image className="h-auto max-h-[290px] w-[min(460px,90%)] object-contain" src="/404.png" alt="Page not found" width={540} height={360} priority />
      <span className={ui.eyebrow}>Looks like a wrong turn</span>
      <h1>This page is off the map.</h1>
      <p>The page you are looking for may have moved. Let&apos;s get you back on the road.</p>
      <Link className={cx(ui.button, ui.buttonPrimary)} href="/">Back to home <FiArrowUpRight aria-hidden="true" /></Link>
    </section>
  );
}
