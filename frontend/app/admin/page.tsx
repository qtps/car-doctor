'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, ReactNode, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest, isDemoMode } from '@/lib/api';
import { useHydrated } from '@/lib/use-hydrated';
import {
  demoOrders,
  demoProducts,
  demoServices,
  demoTeam,
  demoTestimonials,
  Order,
  Product,
  Service,
  TeamMember,
  Testimonial,
} from '@/lib/demo-data';
import { useStore } from '@/components/store-provider';
import { cx, ui } from '@/lib/tailwind';
import {
  FiArrowLeft,
  FiArrowRight,
  FiArrowUpRight,
  FiClipboard,
  FiHome,
  FiLogOut,
  FiPackage,
  FiPlus,
  FiTool,
  FiTrash2,
  FiUsers,
  FiX,
} from 'react-icons/fi';

type AdminTab = 'overview' | 'orders' | 'inventory' | 'services' | 'content';
type ProductDraft = Omit<Product, '_id'> & { _id?: string };
type ServiceDraft = Omit<Service, '_id'> & { _id?: string };

const blankProduct: ProductDraft = {
  name: '', slug: '', description: '', price: 20, image: '/product_1.png',
  category: 'Parts', stock: 10, rating: 5, featured: true,
};
const blankService: ServiceDraft = {
  name: '', slug: '', description: '', price: 20, image: '/cart_items_1.png', active: true,
};

function errorText(error: unknown) {
  return error instanceof Error ? error.message : 'Something went wrong.';
}

function isDemoAccount(user: { id: string } | null) {
  return isDemoMode && user?.id.startsWith('demo-') === true;
}

const adminPanel = 'min-w-0 rounded-[10px] border border-line bg-white p-5 max-[680px]:p-[15px]';
const adminPanelHeading = 'mb-[18px] flex items-center justify-between gap-3 max-[680px]:flex-wrap [&_h2]:m-0 [&_h2]:text-[16px] [&_p]:mt-1 [&_p]:mb-0 [&_p]:text-[11px] [&_p]:text-muted';
const adminFormGrid = 'my-4 grid grid-cols-2 gap-[13px] max-[680px]:grid-cols-1 [&_label]:flex [&_label]:flex-col [&_label]:gap-[6px] [&_label]:text-[10px] [&_label]:font-bold [&_input]:min-h-10 [&_input]:rounded-[5px] [&_input]:border [&_input]:border-line [&_input]:px-[10px] [&_input]:text-[11px] [&_input]:font-normal [&_textarea]:rounded-[5px] [&_textarea]:border [&_textarea]:border-line [&_textarea]:p-[10px] [&_textarea]:text-[11px] [&_textarea]:font-normal';
const adminFullWidth = 'col-span-full max-[680px]:col-auto';
const adminSecondaryButton = 'rounded-[5px] border border-line bg-white px-[11px] py-[7px] text-[10px] font-bold text-[#4c5355] hover:border-brand hover:text-brand';
const adminDangerButton = 'rounded-[5px] border border-[#f2d6d1] bg-white px-[11px] py-[7px] text-[10px] font-bold text-[#bd3827] hover:bg-[#fff0ed]';

export default function AdminPage() {
  const router = useRouter();
  const { user, loading: authLoading, signOut, setNotice } = useStore();
  const isHydrated = useHydrated();
  const [tab, setTab] = useState<AdminTab>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [productDraft, setProductDraft] = useState<ProductDraft | null>(null);
  const [serviceDraft, setServiceDraft] = useState<ServiceDraft | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isHydrated && !authLoading && user?.role !== 'admin') router.replace('/login');
  }, [authLoading, isHydrated, router, user]);

  useEffect(() => {
    if (!isHydrated || user?.role !== 'admin') return;
    void Promise.all([
      apiRequest<Order[]>('/orders').then(setOrders).catch((error: unknown) => {
        if (isDemoAccount(user)) setOrders(demoOrders);
        else setPageError(errorText(error));
      }),
      apiRequest<Product[]>('/products').then(setProducts).catch((error: unknown) => {
        if (isDemoAccount(user)) setProducts(demoProducts);
        else setPageError(errorText(error));
      }),
      apiRequest<Service[]>('/services').then(setServices).catch((error: unknown) => {
        if (isDemoAccount(user)) setServices(demoServices);
        else setPageError(errorText(error));
      }),
      apiRequest<TeamMember[]>('/content/team').then(setTeam).catch((error: unknown) => {
        if (isDemoAccount(user)) setTeam(demoTeam);
        else setPageError(errorText(error));
      }),
      apiRequest<Testimonial[]>('/content/testimonials').then(setTestimonials).catch((error: unknown) => {
        if (isDemoAccount(user)) setTestimonials(demoTestimonials);
        else setPageError(errorText(error));
      }),
    ]).finally(() => setLoading(false));
  }, [isHydrated, user]);

  const metrics = useMemo(() => ({
    orders: orders.length,
    pending: orders.filter((order) => order.status === 'pending').length,
    revenue: orders.filter((order) => ['approved', 'completed'].includes(order.status)).reduce((sum, order) => sum + order.total, 0),
    products: products.length,
  }), [orders, products]);

  async function updateOrder(orderId: string, status: Order['status']) {
    setPageError('');
    try {
      await apiRequest(`/orders/${orderId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
      setOrders((current) => current.map((order) => order._id === orderId ? { ...order, status } : order));
      setNotice('Order status updated');
    } catch (error) {
      if (isDemoAccount(user)) {
        setOrders((current) => current.map((order) => order._id === orderId ? { ...order, status } : order));
        setNotice('Demo order updated');
      } else setPageError(errorText(error));
    }
  }

  async function deleteOrder(orderId: string) {
    if (!window.confirm('Delete this order? This cannot be undone.')) return;
    try {
      await apiRequest(`/orders/${orderId}`, { method: 'DELETE' });
      setOrders((current) => current.filter((order) => order._id !== orderId));
      setNotice('Order deleted');
    } catch (error) {
      if (!isDemoAccount(user)) {
        setPageError(errorText(error));
        return;
      }
      setOrders((current) => current.filter((order) => order._id !== orderId));
      setNotice('Demo order removed');
    }
  }

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!productDraft) return;
    setBusy(true);
    setPageError('');
    const slug = productDraft.slug || productDraft.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const { _id, ...productData } = productDraft;
    try {
      const saved = await apiRequest<Product>(_id ? `/products/${_id}` : '/products', {
        method: _id ? 'PATCH' : 'POST',
        body: JSON.stringify({ ...productData, slug }),
      });
      setProducts((current) => _id
        ? current.map((item) => item._id === _id ? saved : item)
        : [saved, ...current]);
      setNotice(_id ? 'Product updated' : 'Product created');
      setProductDraft(null);
    } catch (error) {
      if (isDemoAccount(user)) {
        const demoSaved = { ...productData, _id: _id ?? `demo-product-${Date.now()}`, slug } as Product;
        setProducts((current) => _id
          ? current.map((item) => item._id === _id ? demoSaved : item)
          : [demoSaved, ...current]);
        setProductDraft(null);
        setNotice('Demo product saved in this view');
      } else setPageError(errorText(error));
    } finally {
      setBusy(false);
    }
  }

  async function deleteProduct(product: Product) {
    if (!window.confirm(`Delete ${product.name}?`)) return;
    try {
      await apiRequest(`/products/${product._id}`, { method: 'DELETE' });
    } catch (error) {
      if (!isDemoAccount(user)) {
        setPageError(errorText(error));
        return;
      }
    }
    setProducts((current) => current.filter((item) => item._id !== product._id));
    setNotice(isDemoAccount(user) ? 'Demo product removed' : 'Product removed');
  }

  async function saveService(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!serviceDraft) return;
    setBusy(true);
    setPageError('');
    const slug = serviceDraft.slug || serviceDraft.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const { _id, ...serviceData } = serviceDraft;
    try {
      const saved = await apiRequest<Service>(_id ? `/services/${_id}` : '/services', {
        method: _id ? 'PATCH' : 'POST',
        body: JSON.stringify({ ...serviceData, slug }),
      });
      setServices((current) => _id
        ? current.map((item) => item._id === _id ? saved : item)
        : [saved, ...current]);
      setServiceDraft(null);
      setNotice(_id ? 'Service updated' : 'Service created');
    } catch (error) {
      if (isDemoAccount(user)) {
        const demoSaved = { ...serviceData, _id: _id ?? `demo-service-${Date.now()}`, slug } as Service;
        setServices((current) => _id
          ? current.map((item) => item._id === _id ? demoSaved : item)
          : [demoSaved, ...current]);
        setServiceDraft(null);
        setNotice('Demo service saved in this view');
      } else setPageError(errorText(error));
    } finally {
      setBusy(false);
    }
  }

  async function deleteService(service: Service) {
    if (!window.confirm(`Delete ${service.name}?`)) return;
    try {
      await apiRequest(`/services/${service._id}`, { method: 'DELETE' });
    } catch (error) {
      if (!isDemoAccount(user)) {
        setPageError(errorText(error));
        return;
      }
    }
    setServices((current) => current.filter((item) => item._id !== service._id));
    setNotice(isDemoAccount(user) ? 'Demo service removed' : 'Service removed');
  }

  async function removeContentItem(kind: 'team' | 'testimonials', id: string) {
    try {
      await apiRequest(`/content/${kind}/${id}`, { method: 'DELETE' });
    } catch (error) {
      if (!isDemoAccount(user)) {
        setPageError(errorText(error));
        return;
      }
    }
    if (kind === 'team') setTeam((current) => current.filter((item) => item._id !== id));
    else setTestimonials((current) => current.filter((item) => item._id !== id));
    setNotice(isDemoAccount(user) ? 'Demo content removed' : 'Content removed');
  }

  async function editTeamMember(member: TeamMember) {
    const name = window.prompt('Team member name', member.name)?.trim();
    if (!name) return;
    const role = window.prompt('Team member role', member.role)?.trim();
    if (!role) return;
    const image = window.prompt('Image path or URL', member.image)?.trim();
    if (!image) return;
    const updated = { name, role, image };
    try {
      await apiRequest(`/content/team/${member._id}`, { method: 'PATCH', body: JSON.stringify(updated) });
    } catch (error) {
      if (!isDemoAccount(user)) {
        setPageError(errorText(error));
        return;
      }
    }
    setTeam((current) => current.map((item) => item._id === member._id ? { ...item, ...updated } : item));
    setNotice('Team member updated');
  }

  async function editTestimonial(testimonial: Testimonial) {
    const name = window.prompt('Customer name', testimonial.name)?.trim();
    if (!name) return;
    const role = window.prompt('Customer title', testimonial.role)?.trim();
    if (!role) return;
    const quote = window.prompt('Customer review', testimonial.quote)?.trim();
    if (!quote || quote.length > 1200) return;
    const image = window.prompt('Image path or URL', testimonial.image)?.trim();
    if (!image) return;
    const updated = { name, role, quote, image };
    try {
      await apiRequest(`/content/testimonials/${testimonial._id}`, { method: 'PATCH', body: JSON.stringify(updated) });
    } catch (error) {
      if (!isDemoAccount(user)) {
        setPageError(errorText(error));
        return;
      }
    }
    setTestimonials((current) => current.map((item) => item._id === testimonial._id ? { ...item, ...updated } : item));
    setNotice('Customer review updated');
  }

  async function addTeamMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const item = { name: String(form.get('name')), role: String(form.get('role')), image: String(form.get('image')), order: team.length + 1 };
    try {
      const saved = await apiRequest<TeamMember>('/content/team', { method: 'POST', body: JSON.stringify(item) });
      setTeam((current) => [...current, saved]);
    } catch (error) {
      if (isDemoAccount(user)) setTeam((current) => [...current, { ...item, _id: `demo-team-${Date.now()}` }]);
      else { setPageError(errorText(error)); return; }
    }
    formElement.reset();
  }

  async function addReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const item = { name: String(form.get('name')), role: String(form.get('role')), quote: String(form.get('quote')), image: String(form.get('image')), rating: 5 };
    try {
      const saved = await apiRequest<Testimonial>('/content/testimonials', { method: 'POST', body: JSON.stringify(item) });
      setTestimonials((current) => [saved, ...current]);
    } catch (error) {
      if (isDemoAccount(user)) setTestimonials((current) => [{ ...item, _id: `demo-review-${Date.now()}` }, ...current]);
      else { setPageError(errorText(error)); return; }
    }
    formElement.reset();
  }

  async function logout() {
    await signOut();
    router.replace('/');
  }

  if (!isHydrated || authLoading || loading) return <section className={ui.statusPage}><span className={ui.eyebrow}>Car Doctor admin</span><h1 className={ui.statusHeading}>Loading your dashboard…</h1></section>;
  if (user?.role !== 'admin') return <section className={ui.statusPage}><span className={ui.eyebrow}>Admin access</span><h1 className={ui.statusHeading}>Sign in as an administrator</h1><p className={ui.statusCopy}>This area is reserved for Car Doctor administrators.</p><Link className={cx(ui.button, ui.buttonPrimary)} href="/login">Sign in <FiArrowUpRight aria-hidden="true" /></Link></section>;

  const tabs: { id: AdminTab; label: string; icon: ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <FiHome aria-hidden="true" /> },
    { id: 'orders', label: 'Orders', icon: <FiClipboard aria-hidden="true" /> },
    { id: 'inventory', label: 'Inventory', icon: <FiPackage aria-hidden="true" /> },
    { id: 'services', label: 'Services', icon: <FiTool aria-hidden="true" /> },
    { id: 'content', label: 'Team & reviews', icon: <FiUsers aria-hidden="true" /> },
  ];

  return (
    <section className="flex min-h-screen bg-soft max-[760px]:flex-col">
      <aside className="sticky top-0 flex h-screen w-61.25 shrink-0 flex-col bg-[#202426] px-[17px] py-5 text-white max-[760px]:relative max-[760px]:h-auto max-[760px]:w-full max-[760px]:px-4 max-[760px]:py-3">
        <Link href="/" className="mb-[26px] flex items-center justify-center rounded-md bg-white p-[7px] [&_img]:h-auto [&_img]:w-26.25 max-[760px]:mb-3"><Image src="/logo.svg" alt="Car Doctor" width={107} height={87} /></Link>
        <div className="mb-[22px] flex items-center gap-[10px] border-b border-white/10 px-1 pb-[18px] max-[760px]:mb-[11px] max-[760px]:pb-[11px]"><span className="grid h-8.75 w-8.75 shrink-0 place-items-center rounded-full bg-brand text-[13px] font-extrabold">{user.name.slice(0, 1).toUpperCase()}</span><div className="grid min-w-0 gap-0.5"><strong className="truncate text-[11px]">{user.name}</strong><small className="text-[9px] text-white/55">Administrator</small></div></div>
        <nav className="grid gap-1 max-[760px]:flex max-[760px]:flex-wrap" aria-label="Admin navigation">{tabs.map((item) => <button className={cx('flex min-h-10 items-center gap-[11px] rounded-md border-0 bg-transparent px-[11px] text-left text-[11px] font-semibold text-white/65 transition hover:bg-white/5 hover:text-white max-[760px]:min-h-8.5 max-[760px]:px-2', tab === item.id && 'bg-brand text-white hover:bg-brand')} type="button" key={item.id} onClick={() => setTab(item.id)}><span className="grid w-4.5 place-items-center text-[15px]">{item.icon}</span>{item.label}{item.id === 'orders' && metrics.pending > 0 && <b className="ml-auto rounded-full bg-white px-[7px] py-0.5 text-[9px] text-brand">{metrics.pending}</b>}</button>)}</nav>
        <div className="mt-auto grid border-t border-white/10 pt-[15px] max-[760px]:mt-2 max-[760px]:flex max-[760px]:justify-between max-[760px]:pt-2 [&_a]:py-2 [&_a]:text-[10px] [&_a]:text-white/60 [&_button]:border-0 [&_button]:bg-transparent [&_button]:py-2 [&_button]:text-left [&_button]:text-[10px] [&_button]:text-white/60 [&_a:hover]:text-white [&_button:hover]:text-white"><Link className="inline-flex items-center gap-1" href="/"><FiArrowLeft aria-hidden="true" />Back to storefront</Link><button className="inline-flex items-center gap-1" type="button" onClick={() => void logout()}><FiLogOut aria-hidden="true" />Sign out</button></div>
      </aside>
      <main className="min-w-0 flex-1 p-[clamp(20px,4vw,42px)] max-[680px]:p-4">
        <header className="mb-[25px] flex items-center justify-between gap-3 border-b border-line pb-[18px] max-[680px]:flex-wrap"><div><span className={ui.eyebrow}>Car Doctor workspace</span><h1 className="my-1 text-[25px] font-extrabold leading-tight">{tabs.find((item) => item.id === tab)?.label}</h1></div><Link className={cx(ui.button, ui.buttonOutline, 'min-h-9.75 px-[14px] text-[10px]')} href="/">View storefront <FiArrowUpRight aria-hidden="true" /></Link></header>
        {pageError && <p className={cx(ui.formError, 'rounded-md border border-[#f2d6d1] bg-[#fff7f5] p-3')} role="alert">{pageError}</p>}
        {tab === 'overview' && <section className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-[17px]">
          <div className="flex min-h-40 items-center justify-between gap-4 overflow-hidden rounded-[10px] bg-ink px-[clamp(20px,4vw,35px)] py-[22px] text-white max-[680px]:min-h-30 [&_h2]:my-[7px] [&_h2]:mb-[5px] [&_h2]:text-[clamp(20px,3vw,27px)] [&_p]:m-0 [&_p]:text-[11px] [&_p]:text-white/65 [&>img]:h-28.75 [&>img]:w-52.5 [&>img]:object-contain max-[680px]:[&>img]:hidden"><div><span className={cx(ui.eyebrow, ui.eyebrowLight)}>Welcome back</span><h2>Everything is running smoothly.</h2><p>Here is what is happening at your shop today.</p></div><Image src="/manage_all_orders_hero.png" alt="" width={240} height={130} unoptimized /></div>
          <div className="grid grid-cols-4 gap-[11px] max-[900px]:grid-cols-2 max-[400px]:grid-cols-1 [&>article]:grid [&>article]:gap-[5px] [&>article]:rounded-[8px] [&>article]:border [&>article]:border-line [&>article]:bg-white [&>article]:p-[15px] [&>article_span]:text-[10px] [&>article_span]:text-muted [&>article_strong]:text-[25px] [&>article_strong]:leading-tight [&>article_small]:text-[9px] [&>article_small]:text-muted"><article><span>Total orders</span><strong>{metrics.orders}</strong><small>All customer requests</small></article><article><span>Needs attention</span><strong>{metrics.pending}</strong><small>Pending approval</small></article><article><span>Confirmed revenue</span><strong>${metrics.revenue.toFixed(2)}</strong><small>Approved and completed orders</small></article><article><span>Products listed</span><strong>{metrics.products}</strong><small>In your inventory</small></article></div>
          <div className={adminPanel}><div className={adminPanelHeading}><div><h2>Recent orders</h2><p>Latest activity from your customers</p></div><button className={`${adminSecondaryButton} inline-flex items-center gap-1`} type="button" onClick={() => setTab('orders')}>View all <FiArrowRight aria-hidden="true" /></button></div><OrdersTable orders={orders.slice(0, 4)} onStatus={updateOrder} onDelete={deleteOrder} /></div>
        </section>}
        {tab === 'orders' && <section className={adminPanel}><div className={adminPanelHeading}><div><h2>Manage orders</h2><p>Review requests and update their progress.</p></div><span className="rounded-full bg-soft px-3 py-1 text-[10px] font-bold text-muted">{orders.length} orders</span></div><OrdersTable orders={orders} onStatus={updateOrder} onDelete={deleteOrder} /></section>}
        {tab === 'inventory' && <section className={adminPanel}><div className={adminPanelHeading}><div><h2>Product inventory</h2><p>Add new parts, adjust details or remove unavailable items.</p></div><button className={cx(ui.button, ui.buttonPrimary, 'min-h-9.75 px-[14px] text-[10px]')} type="button" onClick={() => setProductDraft({ ...blankProduct })}><FiPlus aria-hidden="true" />Add product</button></div>
          {productDraft && <form className="my-4 rounded-md border border-line bg-soft p-[15px]" onSubmit={(event) => void saveProduct(event)}><div className="flex items-center justify-between"><h3 className="my-1 text-[14px]">{productDraft._id ? 'Edit product' : 'New product'}</h3><button className={adminSecondaryButton} type="button" aria-label="Close product form" onClick={() => setProductDraft(null)}><FiX aria-hidden="true" /></button></div><div className={adminFormGrid}><label>Product name<input required value={productDraft.name} onChange={(event) => setProductDraft({ ...productDraft, name: event.target.value })} /></label><label>Category<input required value={productDraft.category} onChange={(event) => setProductDraft({ ...productDraft, category: event.target.value })} /></label><label>Price (USD)<input type="number" min="0" step="0.01" required value={productDraft.price} onChange={(event) => setProductDraft({ ...productDraft, price: Number(event.target.value) })} /></label><label>Stock<input type="number" min="0" required value={productDraft.stock} onChange={(event) => setProductDraft({ ...productDraft, stock: Number(event.target.value) })} /></label><label className={adminFullWidth}>Image path or URL<input required value={productDraft.image} onChange={(event) => setProductDraft({ ...productDraft, image: event.target.value })} /></label><label className={adminFullWidth}>Description<textarea required rows={3} value={productDraft.description} onChange={(event) => setProductDraft({ ...productDraft, description: event.target.value })} /></label></div><button className={cx(ui.button, ui.buttonPrimary, 'min-h-9.75 px-[14px] text-[10px]')} type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save product'}</button></form>}
          <div className="grid">{products.map((product) => <article className="grid grid-cols-[56px_minmax(0,1fr)_auto_auto_auto] items-center gap-[10px] border-t border-line py-[11px] max-[520px]:grid-cols-[45px_minmax(0,1fr)_auto] [&_img]:h-12.5 [&_img]:w-14 [&_img]:rounded-md [&_img]:bg-soft [&_img]:object-cover [&_div]:grid [&_div]:gap-1 [&_strong]:text-[11px] [&_small]:text-[9px] [&_small]:text-muted [&_b]:text-[11px] [&_button]:rounded-[5px] [&_button]:border [&_button]:border-line [&_button]:bg-white [&_button]:px-[9px] [&_button]:py-[6px] [&_button]:text-[9px] [&_button]:font-bold [&_button]:hover:border-brand [&_button]:hover:text-brand max-[520px]:[&_b]:hidden max-[520px]:[&_button]:px-1" key={product._id}><Image src={product.image} alt="" width={66} height={60} unoptimized /><div><strong>{product.name}</strong><small>{product.category} · {product.stock} in stock</small></div><b>${product.price.toFixed(2)}</b><button type="button" onClick={() => setProductDraft({ ...product })}>Edit</button><button className="text-[#bd3827]" type="button" onClick={() => void deleteProduct(product)}>Delete</button></article>)}</div>
        </section>}
        {tab === 'services' && <section className={adminPanel}><div className={adminPanelHeading}><div><h2>Service catalog</h2><p>Keep service descriptions and pricing up to date.</p></div><button className={cx(ui.button, ui.buttonPrimary, 'min-h-9.75 px-[14px] text-[10px]')} type="button" onClick={() => setServiceDraft({ ...blankService })}><FiPlus aria-hidden="true" />Add service</button></div>
          {serviceDraft && <form className="my-4 rounded-md border border-line bg-soft p-[15px]" onSubmit={(event) => void saveService(event)}><div className="flex items-center justify-between"><h3 className="my-1 text-[14px]">{serviceDraft._id ? 'Edit service' : 'New service'}</h3><button className={adminSecondaryButton} type="button" aria-label="Close service form" onClick={() => setServiceDraft(null)}><FiX aria-hidden="true" /></button></div><div className={adminFormGrid}><label>Service name<input required value={serviceDraft.name} onChange={(event) => setServiceDraft({ ...serviceDraft, name: event.target.value })} /></label><label>Price (USD)<input type="number" min="0" step="0.01" required value={serviceDraft.price} onChange={(event) => setServiceDraft({ ...serviceDraft, price: Number(event.target.value) })} /></label><label className={adminFullWidth}>Image path or URL<input required value={serviceDraft.image} onChange={(event) => setServiceDraft({ ...serviceDraft, image: event.target.value })} /></label><label className={adminFullWidth}>Description<textarea required rows={3} value={serviceDraft.description} onChange={(event) => setServiceDraft({ ...serviceDraft, description: event.target.value })} /></label></div><button className={cx(ui.button, ui.buttonPrimary, 'min-h-9.75 px-[14px] text-[10px]')} type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save service'}</button></form>}
          <div className="grid">{services.map((service) => <article className="grid grid-cols-[56px_minmax(0,1fr)_auto_auto_auto] items-center gap-[10px] border-t border-line py-[11px] max-[520px]:grid-cols-[45px_minmax(0,1fr)_auto] [&_img]:h-12.5 [&_img]:w-14 [&_img]:rounded-md [&_img]:bg-soft [&_img]:object-cover [&_div]:grid [&_div]:gap-1 [&_strong]:text-[11px] [&_small]:text-[9px] [&_small]:text-muted [&_b]:text-[11px] [&_button]:rounded-[5px] [&_button]:border [&_button]:border-line [&_button]:bg-white [&_button]:px-[9px] [&_button]:py-[6px] [&_button]:text-[9px] [&_button]:font-bold [&_button]:hover:border-brand [&_button]:hover:text-brand max-[520px]:[&_b]:hidden max-[520px]:[&_button]:px-1" key={service._id}><Image src={service.image} alt="" width={66} height={60} unoptimized /><div><strong>{service.name}</strong><small>{service.active === false ? 'Inactive' : 'Available to book'}</small></div><b>${service.price.toFixed(2)}</b><button type="button" onClick={() => setServiceDraft({ ...service })}>Edit</button><button className="text-[#bd3827]" type="button" onClick={() => void deleteService(service)}>Delete</button></article>)}</div>
        </section>}
        {tab === 'content' && <div className="grid grid-cols-2 items-start gap-4 max-[900px]:grid-cols-1">
          <section className={adminPanel}><div className={adminPanelHeading}><div><h2>Meet the team</h2><p>Manage the people featured on your storefront.</p></div></div><form className="mb-4 grid grid-cols-2 gap-2 max-[520px]:grid-cols-1 [&_input]:min-w-0 [&_input]:rounded-[5px] [&_input]:border [&_input]:border-line [&_input]:px-[10px] [&_input]:py-[9px] [&_input]:text-[10px] [&_input]:placeholder:text-muted [&_button]:col-span-full [&_button]:min-h-9.5 [&_button]:text-[10px]" onSubmit={(event) => void addTeamMember(event)}><input name="name" required placeholder="Team member name" /><input name="role" required placeholder="Role" /><input className="col-span-full max-[520px]:col-auto" name="image" required placeholder="Image path, e.g. /team_member_1.png" /><button className={cx(ui.button, ui.buttonPrimary)}>Add member</button></form><div className="grid gap-2 [&>article]:grid [&>article]:grid-cols-[40px_minmax(0,1fr)_auto_auto] [&>article]:items-center [&>article]:gap-2 [&>article]:border-t [&>article]:border-line [&>article]:py-2 [&_img]:h-10 [&_img]:w-10 [&_img]:rounded-full [&_img]:object-cover [&_span]:grid [&_span]:gap-1 [&_strong]:text-[10px] [&_small]:line-clamp-2 [&_small]:text-[9px] [&_small]:text-muted"><>{team.map((item) => <article key={item._id}><Image src={item.image} alt="" width={48} height={48} unoptimized /><span><strong>{item.name}</strong><small>{item.role}</small></span><button className={adminSecondaryButton} type="button" onClick={() => void editTeamMember(item)}>Edit</button><button className={adminDangerButton} type="button" onClick={() => void removeContentItem('team', item._id)}>Remove</button></article>)}</></div></section>
          <section className={adminPanel}><div className={adminPanelHeading}><div><h2>Customer reviews</h2><p>Share trusted feedback from your customers.</p></div></div><form className="mb-4 grid grid-cols-2 gap-2 max-[520px]:grid-cols-1 [&_input]:min-w-0 [&_input]:rounded-[5px] [&_input]:border [&_input]:border-line [&_input]:px-[10px] [&_input]:py-[9px] [&_input]:text-[10px] [&_input]:placeholder:text-muted [&_textarea]:col-span-full [&_textarea]:min-h-17.5 [&_textarea]:rounded-[5px] [&_textarea]:border [&_textarea]:border-line [&_textarea]:p-[10px] [&_textarea]:text-[10px] [&_textarea]:placeholder:text-muted [&_button]:col-span-full [&_button]:min-h-9.5 [&_button]:text-[10px]" onSubmit={(event) => void addReview(event)}><input name="name" required placeholder="Customer name" /><input name="role" required placeholder="Customer title" /><input className="col-span-full max-[520px]:col-auto" name="image" required placeholder="Image path, e.g. /awlad.png" /><textarea name="quote" required maxLength={1200} placeholder="Customer review" /><button className={cx(ui.button, ui.buttonPrimary)}>Add review</button></form><div className="grid gap-2 [&>article]:grid [&>article]:grid-cols-[40px_minmax(0,1fr)_auto_auto] [&>article]:items-center [&>article]:gap-2 [&>article]:border-t [&>article]:border-line [&>article]:py-2 [&_img]:h-10 [&_img]:w-10 [&_img]:rounded-full [&_img]:object-cover [&_span]:grid [&_span]:gap-1 [&_strong]:text-[10px] [&_small]:line-clamp-2 [&_small]:text-[9px] [&_small]:text-muted"><>{testimonials.map((item) => <article key={item._id}><Image src={item.image} alt="" width={48} height={48} unoptimized /><span><strong>{item.name}</strong><small>{item.quote}</small></span><button className={adminSecondaryButton} type="button" onClick={() => void editTestimonial(item)}>Edit</button><button className={adminDangerButton} type="button" onClick={() => void removeContentItem('testimonials', item._id)}>Remove</button></article>)}</></div></section>
        </div>}
      </main>
    </section>
  );
}

function OrdersTable({ orders, onStatus, onDelete }: {
  orders: Order[];
  onStatus: (id: string, status: Order['status']) => void;
  onDelete: (id: string) => void;
}) {
  if (!orders.length) return <div className={ui.emptyNote}>No orders yet. New customer requests will appear here.</div>;
  return <div className="max-w-full overflow-x-auto"><table className="w-full min-w-197.5 border-collapse text-left text-[10px] [&_th]:border-b [&_th]:border-line [&_th]:px-2 [&_th]:py-[10px] [&_th]:text-[9px] [&_th]:font-bold [&_th]:uppercase [&_th]:tracking-wide [&_th]:text-muted [&_td]:border-b [&_td]:border-line [&_td]:px-2 [&_td]:py-[11px] [&_td]:align-middle [&_td_strong]:block [&_td_strong]:text-[10px] [&_td_small]:block [&_td_small]:mt-0.5 [&_td_small]:text-[9px] [&_td_small]:text-muted [&_tbody_tr:last-child_td]:border-0"><thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Order date</th><th>Status</th><th aria-label="Actions" /></tr></thead><tbody>{orders.map((order) => <tr key={order._id}><td><strong>#{order._id.slice(-6).toUpperCase()}</strong></td><td><strong>{order.firstName} {order.lastName}</strong><small>{order.email}</small><small>{order.phone}</small></td><td>{order.items.map((item) => `${item.name} × ${item.quantity}`).join(', ')}</td><td><strong>${order.total.toFixed(2)}</strong></td><td>{new Date(order.createdAt).toLocaleDateString()}</td><td><select className={cx('rounded-[5px] border border-line px-2 py-[6px] text-[9px] font-bold capitalize outline-none', {
    pending: 'bg-[#fff5e5] text-[#ba7400]',
    approved: 'bg-[#e9f8ef] text-[#278b5d]',
    completed: 'bg-[#eaf3ff] text-[#236bc2]',
    cancelled: 'bg-[#fff0ed] text-[#d0442f]',
  }[order.status])} value={order.status} onChange={(event) => onStatus(order._id, event.target.value as Order['status'])}><option value="pending">Pending</option><option value="approved">Approved</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></td><td><button className="grid h-6.5 w-6.5 place-items-center rounded-full border border-line bg-white text-muted hover:border-[#d0442f] hover:text-[#d0442f]" type="button" aria-label="Delete order" onClick={() => onDelete(order._id)}><FiTrash2 aria-hidden="true" size={14} /></button></td></tr>)}</tbody></table></div>;
}
