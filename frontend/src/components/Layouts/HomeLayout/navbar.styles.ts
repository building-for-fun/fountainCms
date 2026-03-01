// navbar.styles.ts
export const navbarStyles = {
  desktop: 'hidden items-center gap-3 md:flex',
  mobile: 'flex flex-col gap-3',

  linksRowDesktop: 'flex items-center gap-2',
  linksColMobile: 'flex flex-col gap-2 text-white',

  // ✅ Metallic SKY BLUE pills in LIGHT mode + clean dark mode
  linkBase: [
    'relative rounded-2xl px-4 py-2 text-sm font-semibold',

    // LIGHT MODE base
    'text-sky-900',
    'bg-white/55',
    'shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_4px_12px_rgba(30,120,255,0.18)]',

    // DARK MODE base (no pill bg by default)
    'dark:text-white dark:bg-white/0 dark:shadow-none',
    // animation base
    'transition-all duration-200 transform-gpu',

    // bulge effect
    'hover:-translate-y-[2px] hover:scale-[1.08]',
    'active:translate-y-0 active:scale-[0.99]',

    // hover contrast improvements (readable in BOTH modes)
    'hover:bg-white/70 hover:text-sky-950',
    'dark:hover:bg-white/10 dark:hover:text-white',

    // hover shadows
    'hover:shadow-[0_14px_26px_rgba(30,120,255,0.35)]',
    'dark:hover:shadow-[0_10px_25px_rgba(0,0,0,0.30)]',

    // ✅ metallic shine sweep overlay (LIGHT mode only)
    'before:content-[""] before:absolute before:inset-0 before:rounded-2xl',
    'before:pointer-events-none',
    'before:bg-gradient-to-r before:from-transparent before:via-white/35 before:to-transparent',
    'before:opacity-0 hover:before:opacity-60',
    // ✅ disable shine in dark mode
    'dark:before:opacity-0 dark:hover:before:opacity-0',

    'before:transition-opacity',
    'before:mix-blend-overlay',
    'before:animate-shineSweep',
  ].join(' '),

  // active state (light + dark)
  linkActive:
    'bg-sky-200/70 text-sky-950 ring-1 ring-sky-300/70 dark:bg-white/10 dark:text-white dark:ring-white/15',

  rightDesktop: 'ml-2 flex items-center gap-2',
  rightMobile: 'mt-2 flex items-center justify-between',

  mobileToggleWrap:
    'w-fit max-w-40 [&_button]:rounded-xl [&_button]:px-3 [&_button]:py-1.5 [&_button]:text-sm',

  // CTA wrapper bulge
  ctaWrap:
    'transition-transform hover:-translate-y-[2px] hover:scale-[1.06] active:scale-[0.99] transform-gpu',
};
