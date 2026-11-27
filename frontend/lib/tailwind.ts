export function cx(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

export const ui = {
  container: 'mx-auto w-[min(1180px,calc(100%-48px))] max-[900px]:w-[min(100%-36px,760px)] max-[680px]:w-[calc(100%-32px)]',
  eyebrow: "inline-flex items-center gap-2 text-[12px] font-extrabold uppercase tracking-[.12em] text-brand before:h-0.5 before:w-5 before:bg-current before:content-['']",
  eyebrowLight: 'text-[#ffb09f]',
  button: 'inline-flex min-h-12 items-center justify-center gap-3 rounded-md border border-transparent px-[22px] text-[13px] font-bold transition duration-200 hover:-translate-y-0.5 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-60',
  buttonPrimary: 'bg-brand text-white hover:bg-brand-dark',
  buttonOutline: '!border-brand bg-transparent text-brand hover:bg-brand hover:text-white',
  buttonGlass: 'border-white/55 bg-black/20 text-white',
  buttonWhite: 'bg-white text-ink hover:bg-[#fff0ed]',
  sectionSpace: 'py-24 max-[680px]:py-[66px]',
  pageIntro: 'mx-auto mb-[42px] max-w-185 text-center max-[680px]:mb-[27px]',
  pageIntroHeading: 'my-[8px] text-[clamp(32px,4vw,48px)] font-bold leading-[1.15] tracking-[-.05em] max-[680px]:text-[33px]',
  pageIntroCopy: 'mx-auto my-0 text-[14px] text-muted',
  statusPage: 'mx-auto flex min-h-[55vh] w-[min(1180px,calc(100%-48px))] flex-col items-center justify-center py-[55px] text-center max-[900px]:w-[min(100%-36px,760px)] max-[680px]:w-[calc(100%-32px)]',
  statusHeading: 'my-[8px] max-w-170 text-[clamp(32px,4vw,48px)] font-bold leading-[1.15] tracking-[-.05em] max-[680px]:text-[33px]',
  statusCopy: 'mx-auto mb-6 max-w-135 text-[14px] text-muted',
  formError: 'my-[10px] text-[12px] text-[#c62828]',
  emptyNote: 'px-5 py-[35px] text-center text-[13px] text-muted',
};
