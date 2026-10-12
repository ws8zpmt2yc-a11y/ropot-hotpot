import type { Metadata } from "next";
import { OrderFlow } from "@/components/order/OrderFlow";

export const metadata: Metadata = {
  title: "Build your bowl",
  description:
    "Choose a broth, set the spice, then watch two robotic arms pick your ingredients and drop them into your takeaway hotpot.",
};

export default function OrderPage() {
  return (
    <div className="pt-[var(--nav-h)]">
      <OrderFlow />
    </div>
  );
}
