import { motion } from "motion/react";
import { AlertTriangle, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NftArtwork, NftBadge } from "@/components/mrvl/nft-badge";
import {
  EARLY_WITHDRAW_WINDOW,
  formatDuration,
  isEarlyExit,
  nextTier,
  tierForAge,
  tierProgress,
} from "@/lib/blockMath";
import type { Position } from "@/lib/demo-store";
import { fadeInUp } from "@/lib/motion";

export function PositionCard({
  position,
  currentBlock,
  onRemove,
}: {
  position: Position;
  currentBlock: number;
  onRemove: (id: number) => void;
}) {
  const age = currentBlock - position.startBlock;
  const tier = tierForAge(age);
  const upcoming = nextTier(tier);
  const progress = tierProgress(age);
  const early = isEarlyExit(age);

  return (
    <motion.article
      variants={fadeInUp}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-md transition-shadow duration-300 hover:shadow-xl"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.04] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex items-start gap-4">
        <NftArtwork tier={tier} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-sans text-lg font-semibold tracking-[-0.01em]">{position.pool}</h3>
            <NftBadge tier={tier} />
          </div>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            Position #{position.id} · age {formatDuration(age)}
          </p>
        </div>
        <div className="text-right">
          <div className="font-display text-2xl">
            ${position.liquidityUsd.toLocaleString("en-US")}
          </div>
          <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            liquidity
          </div>
        </div>
      </div>

      <div className="relative mt-6">
        <div className="flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
          <span>{upcoming ? `Progress to ${upcoming}` : "Max tier reached"}</span>
          <span className="text-primary">{Math.round(progress * 100)}%</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            className="bg-brand-gradient h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      {early ? (
        <div className="relative mt-5 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-3">
          <AlertTriangle className="mt-0.5 size-4 text-destructive" />
          <p className="text-sm text-muted-foreground">
            Exiting now slashes <strong className="text-destructive">50% of accrued MRVL</strong> —{" "}
            {formatDuration(EARLY_WITHDRAW_WINDOW - age)} left in the penalty window.
          </p>
        </div>
      ) : null}

      <div className="relative mt-6 flex gap-3">
        <Button variant="outline" className="flex-1" onClick={() => onRemove(position.id)}>
          Remove liquidity
        </Button>
        <Button variant="ghost" size="icon" aria-label="View position on explorer">
          <ArrowUpRight />
        </Button>
      </div>
    </motion.article>
  );
}
