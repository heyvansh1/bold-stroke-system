import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Lock, LockOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionLabel } from "@/components/mrvl/section-label";
import { PositionCard } from "@/components/mrvl/position-card";
import { WalletConnectButton } from "@/components/layout/wallet-connect-button";
import { fadeInUp, stagger, viewportOnce } from "@/lib/motion";
import { useDemo } from "@/lib/demo-store";
import { TIER_MULTIPLIER, formatNumber, isEarlyExit, tierForAge } from "@/lib/blockMath";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — your MRVL positions and loyalty tiers" },
      {
        name: "description",
        content:
          "Track each LP position's age, loyalty tier, multiplier and claimable MRVL, with early-exit penalty warnings before you withdraw.",
      },
      { property: "og:title", content: "Your MRVL LP portfolio" },
      {
        property: "og:description",
        content: "Positions, soulbound loyalty NFTs, tier progress and claimable MRVL in one view.",
      },
    ],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  const { connected, positions, currentBlock, claimableMrvl, claim, removeLiquidity } = useDemo();

  const totalLiquidity = positions.reduce((a, p) => a + p.liquidityUsd, 0);
  const anyLocked = positions.some((p) => isEarlyExit(currentBlock - p.startBlock));
  const maxTier = positions.length
    ? positions
        .map((p) => tierForAge(currentBlock - p.startBlock))
        .sort((a, b) => TIER_MULTIPLIER[b] - TIER_MULTIPLIER[a])[0]
    : "Bronze";

  if (!connected) {
    return (
      <div className="mx-auto grid max-w-6xl place-items-center px-5 py-32 text-center">
        <SectionLabel>Portfolio</SectionLabel>
        <h1 className="mt-6 max-w-xl text-4xl leading-[1.1] lg:text-5xl">
          Connect to see your <span className="text-gradient">loyalty tiers</span>
        </h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          Positions, soulbound NFTs, tier progress and claimable MRVL load straight from the hook.
        </p>
        <div className="mt-8">
          <WalletConnectButton size="default" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 lg:py-24">
      <motion.div initial="hidden" animate="visible" variants={stagger}>
        <motion.div variants={fadeInUp}>
          <SectionLabel pulse>My positions</SectionLabel>
        </motion.div>
        <motion.h1 variants={fadeInUp} className="mt-6 text-4xl leading-[1.1] lg:text-6xl">
          Loyalty, <span className="text-gradient">compounded</span>
        </motion.h1>
      </motion.div>

      <div className="mt-14 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={stagger}
          className="space-y-5"
        >
          {positions.length === 0 ? (
            <motion.p variants={fadeInUp} className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
              No open positions. Add liquidity to mint your Bronze NFT.
            </motion.p>
          ) : (
            positions.map((p) => (
              <PositionCard
                key={p.id}
                position={p}
                currentBlock={currentBlock}
                onRemove={removeLiquidity}
              />
            ))
          )}
        </motion.div>

        <motion.aside
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={stagger}
          className="h-fit space-y-5 lg:sticky lg:top-24"
        >
          <motion.div variants={fadeInUp} className="gradient-border shadow-brand-lg rounded-2xl">
            <div className="rounded-[calc(1rem-2px)] bg-card p-6">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                  Claimable MRVL
                </span>
                {anyLocked ? (
                  <Lock className="size-4 text-warning" aria-label="Penalty window active" />
                ) : (
                  <LockOpen className="size-4 text-success" aria-label="Unlocked" />
                )}
              </div>
              <div className="mt-3 font-display text-5xl text-gradient">
                {formatNumber(claimableMrvl)}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {anyLocked
                  ? "A position is still inside its 7-day window — exiting early burns 50% of this balance."
                  : "All positions are mature. Claim or exit with no penalty."}
              </p>
              <Button className="mt-6 w-full" size="lg" onClick={claim}>
                <Sparkles />
                Claim MRVL
              </Button>
            </div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="rounded-2xl border border-border bg-card p-6 shadow-md"
          >
            <h2 className="text-lg font-semibold tracking-[-0.01em]">Summary</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <SummaryRow label="Current liquidity value" value={`$${totalLiquidity.toLocaleString("en-US")}`} />
              <SummaryRow label="Open positions" value={positions.length.toString()} />
              <SummaryRow label="Highest tier" value={`${maxTier} · ${TIER_MULTIPLIER[maxTier]}x`} />
              <SummaryRow label="Current block" value={currentBlock.toLocaleString()} />
            </dl>
          </motion.div>
        </motion.aside>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
