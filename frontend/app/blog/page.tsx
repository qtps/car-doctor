import Image from 'next/image';
import Link from 'next/link';
import { cx, ui } from '@/lib/tailwind';
import { FiArrowUpRight } from 'react-icons/fi';

const articles = [
  { title: 'Five warning signs your car needs a check-up', category: 'Car care', image: '/unique_service.png', copy: 'A new sound or a dashboard light can be your car asking for a little attention. Here is what to watch for.' },
  { title: 'A simple guide to choosing the right engine oil', category: 'Maintenance', image: '/cart_items_5.png', copy: 'The right oil protects your engine and supports a smoother, longer-lasting drive.' },
  { title: 'How to make your battery last longer', category: 'Expert advice', image: '/battery.png', copy: 'A few small habits can help you avoid a surprise no-start and get more from your battery.' },
];

export default function BlogPage() {
  return (
    <section className={cx(ui.container, 'min-h-[60vh] py-9 pb-[88px] max-[680px]:py-[25px] max-[680px]:pb-[62px]')}>
      <div className={ui.pageIntro}><span className={ui.eyebrow}>From the garage</span><h1 className={ui.pageIntroHeading}>Helpful reads for every driver</h1><p className={ui.pageIntroCopy}>Practical advice from the Car Doctor team to help you feel good about every mile.</p></div>
      <div className="grid grid-cols-3 gap-5 max-[680px]:grid-cols-1">
        {articles.map((article) => <article className="overflow-hidden rounded-[10px] border border-line bg-white" key={article.title}>
          <Image className="block h-47.5 w-full object-cover" src={article.image} alt="" width={500} height={320} unoptimized />
          <div className="p-[18px] [&>span]:text-[10px] [&>span]:font-extrabold [&>span]:uppercase [&>span]:text-brand [&_h3]:my-2 [&_h3]:mb-3 [&_h3]:min-h-13 [&_h3]:text-base [&_h3]:leading-[1.5] [&_p]:text-[11px] [&_p]:text-muted [&_a]:text-[12px] [&_a]:font-bold">
            <span>{article.category}</span><h3>{article.title}</h3><p>{article.copy}</p><Link className="inline-flex items-center gap-1" href="/#contact">Ask us a question <FiArrowUpRight className="text-brand" aria-hidden="true" /></Link>
          </div>
        </article>)}
      </div>
    </section>
  );
}
