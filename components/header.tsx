import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-12 sm:h-14 items-center justify-between px-3 sm:px-4">
        {/* Logo */}
        <a href="/" className="flex-shrink-0">
          <Image
            src="/logo_mb.svg"
            alt="Mixedbread"
            className="size-6 sm:size-7 lg:size-8"
            width={32}
            height={32}
          />
        </a>

        {/* Links */}
        <nav className="flex items-center gap-2 sm:gap-4 lg:gap-6">
          <Link
            href="https://www.nga.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] sm:text-xs lg:text-sm text-foreground/70 transition-colors hover:text-foreground whitespace-nowrap"
          >
            <span className="hidden sm:inline">National Gallery of Art</span>
            <span className="sm:hidden">Nation Gallery of Art</span>
          </Link>
          <Link
            href="https://www.mixedbread.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] sm:text-xs lg:text-sm text-foreground/70 transition-colors hover:text-foreground whitespace-nowrap"
          >
            Mixedbread
          </Link>
          <Link
            href="https://github.com/mixedbread-ai/nga-art-search"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] sm:text-xs lg:text-sm text-foreground/70 transition-colors hover:text-foreground whitespace-nowrap"
          >
            Github
          </Link>
        </nav>
      </div>
    </header>
  );
}
