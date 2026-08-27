import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { WalletConnectButton } from "@/components/layout/wallet-connect-button";
import { useDemo } from "@/lib/demo-store";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/trade", label: "Trade" },
  { to: "/liquidity", label: "Liquidity" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/playground", label: "Playground" },
] as const;

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const { currentBlock } = useDemo();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-5">
        <Link to="/" className="flex items-center gap-2.5" aria-label="MRVL home">
          <span className="bg-brand-gradient shadow-brand size-7 rounded-lg" />
          <span className="font-display text-lg tracking-[-0.02em]">MRVL</span>
        </Link>

        <ul className="hidden flex-1 items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                activeProps={{ className: "text-foreground font-medium bg-muted" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-3">
          <span className="hidden items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground lg:flex">
            <span className="pulse-dot size-1.5 rounded-full bg-primary" />
            block {currentBlock.toLocaleString()}
          </span>
          <WalletConnectButton />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </nav>

      <div className={cn("border-t border-border md:hidden", open ? "block" : "hidden")}>
        <ul className="mx-auto max-w-6xl px-5 py-3">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-3 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                activeProps={{ className: "text-foreground font-medium" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
