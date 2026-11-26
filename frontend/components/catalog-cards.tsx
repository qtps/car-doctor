'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product, Service } from '@/lib/demo-data';
import { useStore } from './store-provider';
import { FaStar } from 'react-icons/fa';
import { FiArrowUpRight } from 'react-icons/fi';

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
    <article className="group overflow-hidden rounded-[10px] border border-line bg-white transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(26,35,39,.09)]">
      <Link href={`/products/${product.slug}`} className="relative mx-[13px] mt-[13px] block h-[220px] overflow-hidden rounded-[7px] bg-[#f3f4f4] max-[900px]:h-[180px] max-[680px]:mx-2 max-[680px]:mt-2 max-[680px]:h-[145px]">
        <Image className="h-full w-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105" src={product.image} alt={product.name} width={420} height={300} unoptimized />
        <span className="absolute top-3 left-3 rounded-full bg-white px-[10px] py-1 text-[10px] font-bold text-[#555b5d] max-[680px]:top-2 max-[680px]:left-2 max-[680px]:px-[7px] max-[680px]:py-[3px] max-[680px]:text-[9px]">{product.category}</span>
      </Link>
      <div className="px-[18px] pt-[14px] pb-[17px] max-[680px]:p-[11px]">
        <div className="flex gap-0.5 text-[#ff8a2c]" role="img" aria-label={`${product.rating} out of 5 stars`}>{Array.from({ length: 5 }, (_, index) => <FaStar className={index < product.rating ? '' : 'text-line'} key={index} />)}</div>
        <Link href={`/products/${product.slug}`} className="my-[3px] mb-2 inline-block text-[16px] font-bold max-[680px]:text-[13px]">{product.name}</Link>
        <div className="flex items-center justify-between">
          <strong className="text-[15px] text-brand max-[680px]:text-[13px]">${product.price.toFixed(2)}</strong>
          <button type="button" className="inline-flex items-center gap-2 rounded-[5px] border border-line bg-white px-[10px] py-[7px] text-[11px] font-bold text-ink hover:border-brand hover:text-brand max-[680px]:gap-1 max-[680px]:p-[6px] max-[680px]:text-[10px]" onClick={add} disabled={unavailable} aria-label={`Add ${product.name} to cart`}>
            <Image src="/cart.svg" alt="" width={17} height={17} />
            <span className="opacity-75">{unavailable ? 'Sold out' : 'Add'}</span>
          </button>
        </div>
      </div>
    </article>
  );
}

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link href={`/services/${service.slug}`} className="group block overflow-hidden rounded-[10px] border border-line bg-white transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(26,35,39,.09)]">
      <div className="h-[195px] overflow-hidden bg-[#f0f1f1] max-[900px]:h-[160px] max-[680px]:h-[135px]">
        <Image className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" src={service.image} alt={service.name} width={520} height={320} unoptimized />
      </div>
      <div className="flex items-center justify-between gap-3 px-[19px] py-[18px] max-[680px]:p-3">
        <div>
          <h3 className="mb-[5px] text-base font-bold max-[680px]:text-[13px]">{service.name}</h3>
          <span className="text-[12px] font-bold text-brand max-[680px]:text-[10px]">Starting at ${service.price.toFixed(2)}</span>
        </div>
        <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full bg-[#fff0ed] text-brand max-[680px]:h-[29px] max-[680px]:w-[29px]" aria-hidden="true"><FiArrowUpRight /></span>
      </div>
    </Link>
  );
}
