import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/lib/demo-store";

export function WalletConnectButton({ size = "sm" }: { size?: "sm" | "default" }) {
  const { connected, address, connect, disconnect } = useDemo();

  if (connected) {
    return (
      <Button variant="outline" size={size} onClick={disconnect}>
        <span className="pulse-dot size-1.5 rounded-full bg-primary" />
        <span className="font-mono text-xs">{address}</span>
      </Button>
    );
  }

  return (
    <Button size={size} onClick={connect}>
      <Wallet />
      Connect wallet
    </Button>
  );
}
