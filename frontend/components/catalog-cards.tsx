'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product, Service } from '@/lib/demo-data';
import { useStore } from './store-provider';
import { FaStar } from 'react-icons/fa';
import { FiArrowRight, FiShoppingBag } from 'react-icons/fi';

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, cart, setNotice } = useStore();
  const quantityInCart = cart.find((item) => item.productId === product._id)?.quantity ?? 0;
  const unavailable = product.stock <= 0 || quantityInCart >= product.stock;
  const add = async () => {
    try {
      await addToCart(product._id);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not add this item to your cart');
    }
  };

  return (
    <article className="group relative rounded-[6px] border border-line bg-white p-2.5 pb-3.5 text-center transition-shadow duration-200 hover:shadow-[0_8px_24px_rgba(26,35,39,.08)]">
      <Link href={`/products/${product.slug}`} className="block aspect-[3/2] overflow-hidden rounded-[5px] bg-[#f3f3f3]">
        <Image className="h-full w-full object-contain p-2 mix-blend-multiply transition-transform duration-300 group-hover:scale-105" src={product.image} alt={product.name} width={420} height={300} unoptimized />
      </Link>
      <div className="mt-2 flex justify-center gap-0.5 text-[11px] leading-none text-[#ff8a2c]" role="img" aria-label={`${product.rating} out of 5 stars`}>{Array.from({ length: 5 }, (_, index) => <FaStar className={index < product.rating ? '' : 'text-line'} key={index} />)}</div>
      <Link href={`/products/${product.slug}`} className="mt-1 block text-xs font-bold leading-tight text-[#3b3b3b]">{product.name}</Link>
      <strong className="mt-1 block text-[11px] font-semibold leading-tight text-brand">${product.price.toFixed(2)}</strong>
      <button
        type="button"
        className="pointer-events-none absolute top-6 right-6 grid size-6 place-items-center rounded-[5px] bg-white text-brand opacity-0 shadow-sm transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 focus-visible:pointer-events-auto focus-visible:opacity-100"
        onClick={add}
        disabled={unavailable}
        aria-label={`Add ${product.name} to cart`}
      >
        <FiShoppingBag aria-hidden="true" size={14} />
      </button>
    </article>
  );
}

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link href={`/services/${service.slug}`} className="group block rounded-[8px] border border-line bg-white p-3.5 transition duration-200 hover:shadow-[0_8px_24px_rgba(26,35,39,.08)] max-[680px]:p-2.5">
      <div className="aspect-[3/2] overflow-hidden rounded-[6px] bg-[#f0f1f1]">
        <Image className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" src={service.image} alt={service.name} width={520} height={320} unoptimized />
      </div>
      <div className="flex items-center justify-between gap-2 pt-3 max-[680px]:pt-2">
        <div>
          <h3 className="mb-1 text-[15px] font-bold leading-tight text-[#3b3b3b] max-[680px]:text-[13px]">{service.name}</h3>
          <span className="text-[12px] font-semibold text-brand max-[680px]:text-[10px]">Price : ${service.price.toFixed(2)}</span>
        </div>
        <FiArrowRight className="shrink-0 text-brand" aria-hidden="true" />
      </div>
    </Link>
  );
}
