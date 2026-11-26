'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { useStore } from '@/components/store-provider';
import { useHydrated } from '@/lib/use-hydrated';
import { demoProducts } from '@/lib/demo-data';
import { cx, ui } from '@/lib/tailwind';
import { FaStar } from 'react-icons/fa';
import { FiArrowUpRight, FiCheck } from 'react-icons/fi';

export default function ProductDetailPage() {
  return <Suspense fallback={<section className={ui.statusPage}><h1 className={ui.statusHeading}>Loading product details…</h1></section>}><ProductDetailContent /></Suspense>;
}

function ProductDetailContent() {
  const { slug } = useParams<{ slug: string }>();
  const { products, cart, addToCart, setNotice } = useStore();
  const isHydrated = useHydrated();
  const product = (isHydrated ? products : demoProducts)
    .find((item) => item.slug === slug || item._id === slug);

  if (!product) {
    return <section className={ui.statusPage}><span className={ui.eyebrow}>Car Doctor parts</span><h1 className={ui.statusHeading}>We could not find that product</h1><p className={ui.statusCopy}>Browse our quality-tested parts, or call us and we will help find what fits your vehicle.</p><Link className={cx(ui.button, ui.buttonPrimary)} href="/#products">Browse products <FiArrowUpRight aria-hidden="true" /></Link></section>;
  }
  const selectedProduct = product;
  const quantityInCart = isHydrated
    ? cart.find((item) => item.productId === product._id)?.quantity ?? 0
    : 0;
  const unavailable = product.stock <= 0 || quantityInCart >= product.stock;

  async function addItem() {
    try {
      await addToCart(selectedProduct._id);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not add this item to your cart');
    }
  }

  return (
    <section className={cx(ui.container, 'grid grid-cols-2 items-center gap-[clamp(35px,6vw,80px)] py-[70px] max-[680px]:grid-cols-1 max-[680px]:gap-7 max-[680px]:py-[40px]')}>
      <div className="grid min-h-[480px] place-items-center overflow-hidden rounded-xl bg-soft max-[680px]:min-h-[330px]"><Image className="h-full max-h-[540px] w-full object-contain mix-blend-multiply" src={product.image} alt={product.name} width={700} height={600} unoptimized /></div>
      <div className="[&_h1]:my-[9px] [&_h1]:mb-2 [&_h1]:text-[clamp(30px,4vw,46px)] [&_h1]:font-bold [&_h1]:leading-[1.13] [&_h1]:tracking-[-.05em] [&_p]:text-[13px] [&_p]:leading-[1.8] [&_p]:text-muted">
        <span className={ui.eyebrow}>{product.category}</span>
        <div className="mt-4 flex items-center gap-0.5"><span className="flex gap-0.5 text-[#ff9a2c]" role="img" aria-label={`${product.rating} out of 5 stars`}>{Array.from({ length: 5 }, (_, index) => <FaStar className={index < product.rating ? '' : 'text-line'} key={index} />)}</span><span className="ml-1 text-[10px] tracking-normal text-muted">Expert selected</span></div>
        <h1>{product.name}</h1>
        <strong className="text-[27px] font-extrabold text-brand">${product.price.toFixed(2)}</strong>
        <p>{product.description}</p>
        <p>Quality checked by our team and selected to help keep your vehicle dependable. If you are unsure whether this part fits, contact us before ordering.</p>
        <div className={cx('my-[18px] flex items-center gap-2 text-[11px] font-bold text-success [&>span]:h-2 [&>span]:w-2 [&>span]:rounded-full [&>span]:bg-current', unavailable && 'text-[#c62828]')}><span /> {unavailable ? 'Currently unavailable' : `In stock · ${product.stock - quantityInCart} available`}</div>
        <button className={cx(ui.button, ui.buttonPrimary, 'min-w-[180px]')} type="button" onClick={() => void addItem()} disabled={unavailable}>{unavailable ? 'Sold out' : 'Add to cart'} {!unavailable && <FiArrowUpRight aria-hidden="true" />}</button>
        <div className="mt-[21px] flex flex-wrap gap-[13px] border-t border-line pt-[17px] text-[10px] font-bold text-[#656b6d]"><span className="inline-flex items-center gap-1 text-success"><FiCheck aria-hidden="true" /><span className="text-[#656b6d]">Trusted quality</span></span><span className="inline-flex items-center gap-1 text-success"><FiCheck aria-hidden="true" /><span className="text-[#656b6d]">Easy returns</span></span><span className="inline-flex items-center gap-1 text-success"><FiCheck aria-hidden="true" /><span className="text-[#656b6d]">Expert support</span></span></div>
      </div>
    </section>
  );
}
