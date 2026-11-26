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
    <section className={cx(ui.container, 'py-9 pb-[88px] max-[680px]:py-[25px] max-[680px]:pb-[62px]')}>
      <div className={ui.pageIntro}><span className={ui.eyebrow}>Your cart</span><h1 className={ui.pageIntroHeading}>Cart details</h1><p className={ui.pageIntroCopy}>Your carefully selected Car Doctor essentials.</p></div>
      {!isHydrated ? <p className={ui.emptyNote}>Loading your cart…</p> : items.length ? (
        <div className="grid grid-cols-[minmax(0,1fr)_340px] items-start gap-[34px] max-[900px]:grid-cols-[minmax(0,1fr)_285px] max-[900px]:gap-[18px] max-[680px]:grid-cols-1">
          <div className="min-w-0">
            {items.map(({ product, quantity }) => (
              <article className="grid grid-cols-[36px_100px_minmax(0,1fr)_90px] items-center gap-[17px] border-b border-line px-1 py-[18px] max-[680px]:grid-cols-[26px_72px_minmax(0,1fr)] max-[680px]:gap-[10px] max-[680px]:py-[14px]" key={product._id}>
                <button className="grid h-7 w-7 place-items-center rounded-full bg-[#f0f1f1] text-[#515658] hover:bg-[#ffe9e4] hover:text-brand max-[680px]:h-7 max-[680px]:w-[26px]" type="button" onClick={() => void removeFromCart(product._id)} aria-label={`Remove ${product.name}`}><FiX aria-hidden="true" /></button>
                <Image className="h-[92px] w-[100px] rounded-lg bg-soft object-cover max-[680px]:h-[70px] max-[680px]:w-[72px]" src={product.image} alt={product.name} width={110} height={100} unoptimized />
                <div className="min-w-0 [&_h2]:m-0 [&_h2]:text-base [&_p]:mt-[3px] [&_p]:mb-[10px] [&_p]:text-[11px] [&_p]:text-muted max-[680px]:[&_h2]:text-[13px] max-[680px]:[&_p]:text-[9px]">
                  <h2>{product.name}</h2><p>{product.category} · Quality checked by our team</p>
                  <div className="inline-flex h-[30px] items-center rounded-[5px] border border-line [&_button]:h-7 [&_button]:w-[30px] [&_button]:border-0 [&_button]:bg-transparent [&_button]:text-muted [&_span]:min-w-7 [&_span]:text-center [&_span]:text-[11px] [&_span]:font-bold">
                    <button type="button" onClick={() => void changeQuantity(product._id, quantity + 1)} aria-label={`Add one ${product.name}`}><FiPlus aria-hidden="true" size={14} /></button><span>{quantity}</span><button type="button" onClick={() => quantity === 1 ? void removeFromCart(product._id) : void changeQuantity(product._id, quantity - 1)} aria-label={`Remove one ${product.name}`}><FiMinus aria-hidden="true" size={14} /></button>
                  </div>
                </div>
                <strong className="text-right text-sm max-[680px]:col-start-3 max-[680px]:text-left">${(product.price * quantity).toFixed(2)}</strong>
              </article>
            ))}
            <div className="flex justify-between gap-3 px-1 py-[22px] max-[680px]:flex-wrap [&_a]:text-[12px] [&_a]:text-[#565c5e] [&_a:hover]:text-brand [&_button]:border-0 [&_button]:bg-transparent [&_button]:text-[12px] [&_button]:text-[#565c5e] [&_button:hover]:text-brand">
              <Link className="inline-flex items-center gap-1" href="/#products"><FiArrowLeft aria-hidden="true" />Continue shopping</Link><button className="inline-flex items-center gap-1" type="button" onClick={() => void clearCart()}><FiTrash2 aria-hidden="true" />Clear shopping cart</button>
            </div>
          </div>
          <aside className="sticky top-[105px] rounded-[9px] border border-line bg-white p-[22px] max-[680px]:static [&_h2]:mb-5 [&_h2]:mt-0 [&_h2]:text-[18px] [&>div:not(.summary-total)]:my-[13px] [&>div:not(.summary-total)]:flex [&>div:not(.summary-total)]:justify-between [&>div:not(.summary-total)]:gap-3 [&>div:not(.summary-total)]:text-[12px] [&>div:not(.summary-total)]:text-muted [&>div:not(.summary-total)_strong]:text-right [&>div:not(.summary-total)_strong]:text-ink [&>a]:mt-[9px] [&>a]:w-full [&>p]:mt-3 [&>p]:text-center [&>p]:text-[10px] [&>p]:text-muted">
            <h2>Order summary</h2>
            <div><span>Items ({items.reduce((count, item) => count + item.quantity, 0)})</span><strong>${subtotal.toFixed(2)}</strong></div>
            <div><span>Shipping</span><strong>Calculated at checkout</strong></div>
            <div className="mt-[19px] border-t border-line pt-[17px] text-[14px] text-ink"><span>Subtotal</span><strong className="text-[19px] text-brand">${subtotal.toFixed(2)}</strong></div>
            <Link className={cx(ui.button, ui.buttonPrimary)} href="/checkout">Proceed to checkout <FiArrowUpRight aria-hidden="true" /></Link>
            <p>Secure checkout · No payment is collected in this demo.</p>
          </aside>
        </div>
      ) : (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-[#d9dddd] bg-[#fbfbfb] p-[30px] text-center">
          <span className="grid h-[54px] w-[54px] place-items-center rounded-full bg-[#fff0ed] text-brand"><FiShoppingCart aria-hidden="true" size={24} /></span>
          <h2 className="mt-[15px] mb-1 text-[21px] font-bold">Your cart is waiting for something good</h2>
          <p className="mb-5 mt-0 text-[13px] text-muted">Browse quality-tested parts selected by our automotive experts.</p>
          <Link className={cx(ui.button, ui.buttonPrimary)} href="/#products">Explore products <FiArrowUpRight aria-hidden="true" /></Link>
        </div>
      )}
    </section>
  );
}
