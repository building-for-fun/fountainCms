// header.styles.ts
export const headerStyles = {
  // header.styles.ts
  header: [
    'sticky top-0 z-50 relative',

    // ✅ STRIPE-STYLE SKY BLUE METALLIC
    'bg-gradient-to-r from-[#3b82f6] via-[#38bdf8] to-[#6366f1]',

    // subtle vertical polish layer
    'before:content-[""] before:absolute before:inset-0',
    'before:bg-gradient-to-b before:from-white/30 before:via-white/10 before:to-transparent',

    'border-b border-white/30 dark:border-white/10',

    'shadow-[0_10px_30px_rgba(59,130,246,0.35)]',

    'backdrop-blur-xl',
  ].join(' '),

  inner: 'mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6',

  logoWrap: 'relative inline-flex items-center gap-2 select-none',

  logo: [
    'text-xl md:text-2xl font-extrabold tracking-tight',

    // dark readable on bright metallic bg
    'text-slate-900 dark:text-transparent dark:bg-clip-text',

    'dark:bg-gradient-to-r dark:from-white dark:via-white/70 dark:to-white',
    'dark:bg-[length:200%_200%] dark:animate-shimmer',
  ].join(' '),
  spark: 'h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_14px_rgba(56,189,248,0.9)] animate-glowPulse',

  logoHover: 'hover:-translate-y-[1px] transition-transform duration-200',

  mobileBtn:
    'inline-flex items-center justify-center rounded-xl p-2 text-sky-800 hover:bg-white/50 md:hidden transition dark:text-white',

  overlay: 'fixed inset-0 z-50 cursor-default bg-black/55 backdrop-blur-[1px]',

  drawer: [
    'fixed left-0 top-0 z-[60] h-full w-[85%] max-w-sm',
    'border-r border-white/10',
    'bg-gradient-to-b from-[#0b1020]/95 via-[#0b1020]/92 to-[#0b1020]/88',
    'backdrop-blur-xl',
    'shadow-[12px_0_30px_rgba(0,0,0,0.35)]',
    'transform transition-transform duration-200',
  ].join(' '),

  drawerOpen: 'translate-x-0',
  drawerClosed: '-translate-x-full',

  drawerHeader: 'flex items-center justify-between border-b border-white/10 px-4 py-3',

  drawerTitle: 'text-sm font-bold text-white/90',

  drawerClose: 'rounded-xl p-2 text-white/80 hover:bg-white/10 hover:text-white transition',

  drawerBody: 'p-4',
};
