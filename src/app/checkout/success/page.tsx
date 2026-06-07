import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">

        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle size={40} className="text-green-500" />
        </div>

        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-amber-500">
          Order Confirmed
        </p>

        <h1 className="mb-4 text-4xl font-black md:text-5xl">
          Thank You!
        </h1>

        <p className="mb-2 max-w-md text-muted-foreground">
          Your order has been placed successfully. Our team will
          contact you shortly to confirm delivery details.
        </p>

        <p className="mb-10 text-sm text-muted-foreground">
          Payment on delivery — cash or bKash accepted.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/shop"
            className="rounded-full bg-amber-400 px-8 py-3.5 font-semibold text-black transition hover:bg-amber-300"
          >
            Continue Shopping
          </Link>
          <Link
            href="/dashboard/orders"
            className="rounded-full border border-border px-8 py-3.5 font-semibold text-foreground transition hover:bg-accent"
          >
            View My Orders
          </Link>
        </div>
      </div>
    </main>
  );
}