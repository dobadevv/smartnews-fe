import Image from 'next/image';
import Link from 'next/link';

const PORTFOLIO_URL = 'https://github.com/dobadevv/dobadev-portfolio';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-[rgba(13,13,11,0.72)] backdrop-blur-[10px]">
      <div className="page-container flex items-center justify-between gap-6 py-[14px]">
        <Link href="/" className="flex items-center gap-[10px] text-text-bright hover:text-text-bright">
          <Image
            src="/assets/avatar-96.png"
            width={40}
            height={40}
            alt="Doba"
            className="size-10 rounded-[10px] border border-border object-cover"
          />
          <span className="font-heading text-[18px] font-semibold">
            Doba.<span className="text-accent">news</span>
          </span>
        </Link>
        <nav className="flex gap-[clamp(16px,3vw,28px)] whitespace-nowrap font-mono text-[14px]">
          <Link href="/">feed</Link>
          <a href={PORTFOLIO_URL} target="_blank" rel="noopener noreferrer">
            portfolio ↗
          </a>
        </nav>
      </div>
    </header>
  );
}
