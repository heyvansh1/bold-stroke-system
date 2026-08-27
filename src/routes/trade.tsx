import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowDown, Info, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionLabel } from "@/components/mrvl/section-label";
import { TokenInput } from "@/components/mrvl/token-input";
import { WalletConnectButton } from "@/components/layout/wallet-connect-button";
import { fadeInUp, stagger, viewportOnce } from "@/lib/motion";
import { useDemo } from "@/lib/demo-store";

export const Route = createFileRoute("/trade")({
  head: () => ({
    meta: [
      { title: "Trade — MRVL protected ETH/USDC pool" },
      {
        name: "description",
        content:
          "Swap through the MRVL-hooked Uniswap v4 pool. Honest flow pays the 0.05% base fee; the hook surcharges detected MEV.",
      },
      { property: "og:title", content: "Trade on the MRVL protected pool" },
      {
        property: "og:description",
        content: "Preview your dynamic fee before signing — the hook prices MEV, not you.",
      },
    ],
  }),
  component: TradePage,
});

const SLIPPAGE_OPTIONS = [0.1, 0.5, 1];

function TradePage() {
  const { connected, runSwap, mevEventsToday, totalMevCapturedUsd } = useDemo();
  const [amount, setAmount] = React.useState("1.0");
  const [slippage, setSlippage] = React.useState(0.5);

  const parsed = Number(amount) || 0;
  const out = parsed * 3_142.18 * 0.9995;

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 lg:py-24">
      <motion.div initial="hidden" animate="visible" variants={stagger}>
        <motion.div variants={fadeInUp}>
          <SectionLabel pulse>Protected swap</SectionLabel>
        </motion.div>
        <motion.h1 variants={fadeInUp} className="mt-6 text-4xl leading-[1.1] lg:text-6xl">
          Trade without <span className="text-gradient">funding the sandwich</span>
        </motion.h1>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={stagger}
        className="mt-14 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]"
      >
        <motion.div
          variants={fadeInUp}
          className="rounded-2xl border border-border bg-card p-6 shadow-lg"
        >
          <TokenInput label="You pay" token="ETH" balance="4.281" value={amount} onChange={setAmount} />
          <div className="relative -my-2 flex justify-center">
            <span className="bg-brand-gradient shadow-brand relative z-10 grid size-9 place-items-center rounded-xl">
              <ArrowDown className="size-4 text-primary-foreground" />
            </span>
          </div>
          <TokenInput
            label="You receive"
            token="USDC"
            balance="12,904.11"
            readOnly
            value={out ? out.toFixed(2) : ""}
          />

          <div className="mt-5">
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
              Slippage
            </span>
            <div className="mt-2 flex gap-2">
              {SLIPPAGE_OPTIONS.map((s) => (
                <Button
                  key={s}
                  size="sm"
                  variant={slippage === s ? "default" : "outline"}
                  onClick={() => setSlippage(s)}
                >
                  {s}%
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-6 space-y-2 rounded-xl border border-border bg-muted/40 p-4 text-sm">
            <Row label="Rate" value="1 ETH = 3,142.18 USDC" />
            <Row label="Dynamic fee" value="0.05% (base)" accent />
            <Row label="MEV score" value="0 — standard swap" />
            <Row label="Max slippage" value={`${slippage}%`} />
          </div>

          <div className="mt-6">
            {connected ? (
              <Button className="w-full" size="lg" onClick={() => runSwap("standard")}>
                Swap
              </Button>
            ) : (
              <div className="[&>button]:w-full">
                <WalletConnectButton size="default" />
              </div>
            )}
          </div>
        </motion.div>

        <div className="space-y-6">
          <motion.div
            variants={fadeInUp}
            className="rounded-2xl border border-primary/25 bg-primary/[0.04] p-6"
          >
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 size-5 text-primary" />
              <div>
                <h2 className="text-lg font-semibold tracking-[-0.01em]">
                  No MEV detected on this route
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  The hook simulated your swap against the MEVDetector. Your trade scores 0, so you
                  pay the base fee. Searchers attempting a sandwich on this block would be charged up
                  to 0.45%.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="texture-dots relative overflow-hidden rounded-2xl bg-foreground p-8"
          >
            <div className="glow-brand pointer-events-none absolute -right-20 -top-20 size-72 rounded-full" />
            <div className="relative">
              <SectionLabel inverted>Defended today</SectionLabel>
              <div className="mt-6 grid grid-cols-2 gap-6">
                <div>
                  <div className="font-display text-4xl text-background">{mevEventsToday}</div>
                  <p className="mt-1 text-sm text-background/60">Attacks taxed</p>
                </div>
                <div>
                  <div className="font-display text-4xl text-gradient">
                    ${(totalMevCapturedUsd / 1000).toFixed(1)}k
                  </div>
                  <p className="mt-1 text-sm text-background/60">Captured for LPs</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.p
            variants={fadeInUp}
            className="flex items-start gap-2 text-sm text-muted-foreground"
          >
            <Info className="mt-0.5 size-4 shrink-0" />
            Fees quoted here come from a simulated `beforeSwap` call. Final fee is decided on-chain at
            execution.
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={accent ? "font-medium text-primary" : "font-medium"}>{value}</span>
    </div>
  );
}
