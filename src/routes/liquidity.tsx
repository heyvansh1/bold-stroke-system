import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Lock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionLabel } from "@/components/mrvl/section-label";
import { TokenInput } from "@/components/mrvl/token-input";
import { fadeInUp, stagger, viewportOnce } from "@/lib/motion";
import { useDemo } from "@/lib/demo-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/liquidity")({
  head: () => ({
    meta: [
      { title: "Liquidity — MRVL hooked pools" },
      {
        name: "description",
        content:
          "Add liquidity to MRVL-hooked Uniswap v4 pools, earn MEV surcharge revenue as MRVL, and level up Bronze to Gold loyalty tiers.",
      },
      { property: "og:title", content: "Provide liquidity to MRVL hooked pools" },
      {
        property: "og:description",
        content: "Earn base fees plus MRVL minted from taxed MEV. Hold 7 days to clear the penalty.",
      },
    ],
  }),
  component: LiquidityPage,
});

const pools = [
  { name: "ETH / USDC", tvl: "$96.2M", baseApy: "6.1%", mrvlApy: "12.3%", featured: true },
  { name: "wstETH / ETH", tvl: "$21.7M", baseApy: "3.4%", mrvlApy: "7.8%", featured: false },
  { name: "USDC / USDT", tvl: "$10.5M", baseApy: "1.9%", mrvlApy: "4.2%", featured: false },
];

function LiquidityPage() {
  const { addLiquidity } = useDemo();
  const [pool, setPool] = React.useState(pools[0].name);
  const [amount, setAmount] = React.useState("5.0");

  const usd = (Number(amount) || 0) * 3_142.18 * 2;

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 lg:py-24">
      <motion.div initial="hidden" animate="visible" variants={stagger}>
        <motion.div variants={fadeInUp}>
          <SectionLabel>Hooked pools</SectionLabel>
        </motion.div>
        <motion.h1 variants={fadeInUp} className="mt-6 max-w-2xl text-4xl leading-[1.1] lg:text-6xl">
          Get paid for the flow that used to <span className="text-gradient">drain you</span>
        </motion.h1>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={stagger}
        className="mt-14 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]"
      >
        <div className="space-y-4">
          {pools.map((p) => {
            const selected = pool === p.name;
            return (
              <motion.button
                key={p.name}
                variants={fadeInUp}
                onClick={() => setPool(p.name)}
                aria-pressed={selected}
                className={cn(
                  "block w-full rounded-2xl border p-6 text-left shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl",
                  selected ? "border-primary/40 bg-card shadow-brand" : "border-border bg-card",
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="font-sans text-xl font-semibold tracking-[-0.01em]">{p.name}</h2>
                      {p.featured ? (
                        <span className="bg-brand-gradient rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-primary-foreground">
                          Highest MEV flow
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 font-mono text-xs text-muted-foreground">TVL {p.tvl}</p>
                  </div>
                  <div className="flex gap-8">
                    <div>
                      <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                        Base
                      </div>
                      <div className="mt-1 font-display text-2xl">{p.baseApy}</div>
                    </div>
                    <div>
                      <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                        + MRVL
                      </div>
                      <div className="mt-1 flex items-center gap-1 font-display text-2xl text-gradient">
                        {p.mrvlApy}
                        <TrendingUp className="size-4 text-primary" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        <motion.div
          variants={fadeInUp}
          className="h-fit rounded-2xl border border-border bg-card p-6 shadow-lg lg:sticky lg:top-24"
        >
          <h2 className="text-lg font-semibold tracking-[-0.01em]">Add liquidity</h2>
          <p className="mt-1 font-mono text-xs text-muted-foreground">{pool}</p>

          <div className="mt-5 space-y-3">
            <TokenInput
              label="Deposit"
              token={pool.split(" / ")[0]}
              balance="4.281"
              value={amount}
              onChange={setAmount}
            />
            <TokenInput
              label="Paired"
              token={pool.split(" / ")[1]}
              readOnly
              value={(Number(amount) * 3142.18 || 0).toFixed(2)}
            />
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-xl border border-warning/40 bg-warning/10 p-4">
            <Lock className="mt-0.5 size-4 text-warning" />
            <p className="text-sm text-muted-foreground">
              Hold for <strong className="text-foreground">7 days</strong> to avoid the 50% early-exit
              penalty on accrued MRVL. Your Bronze NFT mints on deposit.
            </p>
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={() => addLiquidity(pool, Math.round(usd))}
          >
            Add ${usd.toLocaleString("en-US", { maximumFractionDigits: 0 })} liquidity
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
