'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/components/store-provider';
import { useHydrated } from '@/lib/use-hydrated';
import { cx, ui } from '@/lib/tailwind';
import {
  FiArrowLeft,
  FiArrowUpRight,
  FiMinus,
  FiPlus,
  FiShoppingCart,
  FiTrash2,
  FiX,
} from 'react-icons/fi';

export default function CartPage() {
  const { cart, products, setCartQuantity, removeFromCart, clearCart, setNotice } = useStore();
  const isHydrated = useHydrated();
  const items = isHydrated ? cart.flatMap((line) => {
    const product = products.find((entry) => entry._id === line.productId);
    return product ? [{ product, quantity: line.quantity }] : [];
  }) : [];
  const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);

  async function changeQuantity(productId: string, quantity: number) {
    try {
      if (quantity > (products.find((item) => item._id === productId)?.stock ?? 0)) {
        setNotice('There is not enough stock for that quantity.');
        return;
      }
      await setCartQuantity(productId, quantity);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update your cart');
    }
  }

  return (
    <section className="mx-auto w-[min(1180px,76%)] pt-4 pb-[88px] max-[680px]:w-[calc(100%-32px)] max-[680px]:py-[18px] max-[680px]:pb-[62px]">
      <header className="relative mb-12 aspect-[3.7] min-h-32 overflow-hidden rounded-md bg-ink text-white max-[680px]:mb-8 max-[480px]:aspect-[2.4]">
        <Image className="absolute inset-0 h-full w-full object-cover" src="/cart_details_hero.png" alt="" width={1140} height={320} sizes="(max-width: 760px) 100vw, 1180px" priority />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,19,20,.82),rgba(17,19,20,.2))]" />
        <div className="absolute top-1/2 left-[clamp(22px,7vw,50px)] -translate-y-1/2">
          <h1 className="m-0 text-[clamp(19px,3vw,26px)] font-bold">Cart Details</h1>
          <p className="mt-1 mb-0 text-[9px] text-[#ff6047]"><Link href="/">Home</Link><span className="px-1">-</span>Product Details</p>
        </div>
      </header>
      {!isHydrated ? <p className={ui.emptyNote}>Loading your cart…</p> : items.length ? (
        <div className="min-w-0">
          <div>
            {items.map(({ product, quantity }) => (
              <article className="grid grid-cols-[30px_80px_minmax(0,1fr)_90px_110px] items-center gap-[15px] border-b border-line px-1 py-3.5 max-[600px]:grid-cols-[26px_64px_minmax(0,1fr)_auto] max-[600px]:gap-2.5 max-[600px]:py-3" key={product._id}>
                <button className="grid size-6 place-items-center rounded-full bg-[#f0f1f1] text-[#515658] hover:bg-[#ffe9e4] hover:text-brand" type="button" onClick={() => void removeFromCart(product._id)} aria-label={`Remove ${product.name}`}><FiX aria-hidden="true" /></button>
                <Image className="size-20 rounded-md bg-soft object-cover max-[600px]:size-16" src={product.image} alt={product.name} width={90} height={90} unoptimized />
                <div className="min-w-0 [&_h2]:m-0 [&_h2]:text-[13px] [&_p]:mt-1 [&_p]:mb-2 [&_p]:text-[9px] [&_p]:text-muted">
                  <h2>{product.name}</h2><p>{product.category} · Quality checked by our team</p>
                  <div className="inline-flex h-7.5 items-center rounded-[5px] border border-line [&_button]:h-7 [&_button]:w-7.5 [&_button]:border-0 [&_button]:bg-transparent [&_button]:text-muted [&_span]:min-w-7 [&_span]:text-center [&_span]:text-[11px] [&_span]:font-bold">
                    <button type="button" onClick={() => void changeQuantity(product._id, quantity + 1)} aria-label={`Add one ${product.name}`}><FiPlus aria-hidden="true" size={14} /></button><span>{quantity}</span><button type="button" onClick={() => quantity === 1 ? void removeFromCart(product._id) : void changeQuantity(product._id, quantity - 1)} aria-label={`Remove one ${product.name}`}><FiMinus aria-hidden="true" size={14} /></button>
                  </div>
                </div>
                <strong className="text-right text-[12px] max-[600px]:text-left">${(product.price * quantity).toFixed(2)}</strong>
                <span className="w-fit rounded-[5px] bg-brand px-3 py-1.5 text-[9px] font-bold text-white max-[600px]:col-start-3 max-[600px]:row-start-2 max-[600px]:ml-0">In stock</span>
              </article>
            ))}
            <div className="flex justify-between gap-3 px-1 py-5 max-[600px]:flex-wrap [&_a]:text-[11px] [&_a]:text-[#565c5e] [&_a:hover]:text-brand [&_button]:border-0 [&_button]:bg-transparent [&_button]:text-[11px] [&_button]:text-[#565c5e] [&_button:hover]:text-brand">
              <Link className="inline-flex items-center gap-1" href="/#products"><FiArrowLeft aria-hidden="true" />Continue shopping</Link><button className="inline-flex items-center gap-1" type="button" onClick={() => void clearCart()}><FiTrash2 aria-hidden="true" />Clear shopping cart</button>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
            <span className="text-[12px] text-muted">Subtotal <strong className="ml-2 text-[16px] text-ink">${subtotal.toFixed(2)}</strong></span>
            <Link className={cx(ui.button, ui.buttonPrimary, 'min-h-10 px-5 text-[11px]')} href="/checkout">Proceed to checkout <FiArrowUpRight aria-hidden="true" /></Link>
          </div>
        </div>
      ) : (
        <div className="flex min-h-75 flex-col items-center justify-center rounded-xl border border-dashed border-[#d9dddd] bg-[#fbfbfb] p-[30px] text-center">
          <span className="grid h-13.5 w-13.5 place-items-center rounded-full bg-[#fff0ed] text-brand"><FiShoppingCart aria-hidden="true" size={24} /></span>
          <h2 className="mt-[15px] mb-1 text-[21px] font-bold">Your cart is waiting for something good</h2>
          <p className="mb-5 mt-0 text-[13px] text-muted">Browse quality-tested parts selected by our automotive experts.</p>
          <Link className={cx(ui.button, ui.buttonPrimary)} href="/#products">Explore products <FiArrowUpRight aria-hidden="true" /></Link>
        </div>
      )}
    </section>
  );
}
