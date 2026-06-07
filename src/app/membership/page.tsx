"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  Loader2,
  Star,
  Users,
  Calendar,
  Trophy,
  Flame,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

type Membership = {
  id: string;
  status: "ACTIVE" | "EXPIRED" | "CANCELLED" | "PENDING";
  startDate: string | null;
  endDate: string | null;
  monthlyFee: number;
};

const PERKS = [
  {
    icon: Calendar,
    title: "Training Sessions",
    desc: "Join weekly training sessions at the club ground",
  },
  {
    icon: Trophy,
    title: "Tournaments & Trials",
    desc: "Register for tournaments, trials and club events",
  },
  {
    icon: Users,
    title: "Club Community",
    desc: "Access to the full Savar CF member community",
  },
  {
    icon: Star,
    title: "Member Discounts",
    desc: "Exclusive discounts on official club merchandise",
  },
];

const STATUS_STYLES = {
  ACTIVE: "bg-green-500/10 text-green-500",
  PENDING: "bg-yellow-500/10 text-yellow-500",
  EXPIRED: "bg-red-500/10 text-red-500",
  CANCELLED: "bg-red-500/10 text-red-500",
};

export default function MembershipPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [membership, setMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const user = session?.user as any;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      fetchMembership();
    }
  }, [status]);

  const fetchMembership = async () => {
    try {
      const res = await fetch("/api/membership");
      const data = await res.json();
      setMembership(data);
    } catch {
      // no membership yet
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/membership", {
        method: "POST",
      });
      if (!res.ok) throw new Error();
      toast.success(
        "Membership application submitted! Admin will activate it shortly."
      );
      fetchMembership();
    } catch {
      toast.error("Failed to apply for membership");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">

      {/* HERO */}
      <section className="relative border-b border-border px-6 pb-16 pt-36 md:px-16">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] bg-[size:60px_60px] opacity-40" />
        <div className="relative mx-auto max-w-6xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-amber-500">
            Membership
          </p>
          <h1 className="text-5xl font-black md:text-7xl">
            Join<br />
            <span className="text-amber-400">Savar CF</span>
          </h1>
          <p className="mt-6 max-w-xl text-muted-foreground">
            Become an official member of Savar CF for just ৳200/month.
            Get access to training, events, trials and the full club
            experience.
          </p>
        </div>
      </section>

      <section className="px-6 py-16 md:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2">

            {/* LEFT — PERKS */}
            <div>
              <p className="mb-8 text-xs font-semibold uppercase tracking-widest text-amber-500">
                What you get
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {PERKS.map(({ icon: Icon, title, desc }) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-border bg-card p-5"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10">
                      <Icon size={18} className="text-amber-500" />
                    </div>
                    <p className="mb-1 font-semibold text-foreground">
                      {title}
                    </p>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — MEMBERSHIP CARD */}
            <div>
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 size={32} className="animate-spin text-amber-400" />
                </div>
              ) : membership ? (
                /* EXISTING MEMBERSHIP */
                <div className="rounded-3xl border border-border bg-card p-8">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400">
                        <Flame size={18} className="text-black" />
                      </div>
                      <div>
                        <p className="font-black text-foreground">SAVAR CF</p>
                        <p className="text-xs text-muted-foreground">
                          Member Card
                        </p>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        STATUS_STYLES[membership.status]
                      }`}
                    >
                      {membership.status}
                    </span>
                  </div>

                  <p className="mb-1 text-2xl font-black text-foreground">
                    {user?.name}
                  </p>
                  <p className="mb-6 text-sm text-muted-foreground">
                    {user?.email}
                  </p>

                  <div className="mb-6 grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-accent p-4">
                      <p className="text-xs text-muted-foreground mb-1">
                        Monthly Fee
                      </p>
                      <p className="text-xl font-black text-amber-500">
                        ৳{membership.monthlyFee}
                      </p>
                    </div>
                    <div className="rounded-xl bg-accent p-4">
                      <p className="text-xs text-muted-foreground mb-1">
                        Status
                      </p>
                      <p className="text-xl font-black text-foreground">
                        {membership.status}
                      </p>
                    </div>
                  </div>

                  {membership.startDate && (
                    <div className="mb-6 rounded-xl bg-accent p-4">
                      <p className="text-xs text-muted-foreground mb-1">
                        Active Since
                      </p>
                      <p className="font-semibold text-foreground">
                        {new Date(membership.startDate).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  )}

                  {membership.status === "PENDING" && (
                    <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4">
                      <p className="text-sm font-semibold text-yellow-500">
                        ⏳ Pending Approval
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Your application is under review. Admin will
                        activate your membership shortly.
                      </p>
                    </div>
                  )}

                  {membership.status === "ACTIVE" && (
                    <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        <p className="text-sm font-semibold text-green-500">
                          Active Member
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        You have full access to all member features.
      </p>
                    </div>
                  )}

                  {(membership.status === "EXPIRED" ||
                    membership.status === "CANCELLED") && (
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
                      <p className="text-sm font-semibold text-red-500">
                        Membership {membership.status.toLowerCase()}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Contact us to renew your membership.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* NO MEMBERSHIP — APPLY */
                <div className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-8">
                  <div className="mb-6 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400">
                      <Flame size={28} className="text-black" />
                    </div>
                    <h2 className="text-3xl font-black text-foreground">
                      ৳200
                      <span className="text-lg font-normal text-muted-foreground">
                        /month
                      </span>
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                      Official Savar CF Membership
                    </p>
                  </div>

                  <div className="mb-6 flex flex-col gap-3">
                    {[
                      "Weekly training sessions",
                      "Tournament registration",
                      "Club trials access",
                      "Member community",
                      "Merchandise discounts",
                    ].map((perk) => (
                      <div key={perk} className="flex items-center gap-3">
                        <CheckCircle size={16} className="text-amber-500 shrink-0" />
                        <p className="text-sm text-foreground">{perk}</p>
                      </div>
                    ))}
                  </div>

                  {!session ? (
                    <Link
                      href="/login"
                      className="block w-full rounded-full bg-amber-400 py-3.5 text-center font-semibold text-black transition hover:bg-amber-300"
                    >
                      Login to Apply
                    </Link>
                  ) : (
                    <button
                      onClick={handleApply}
                      disabled={submitting}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-amber-400 py-3.5 font-semibold text-black transition hover:bg-amber-300 disabled:opacity-50"
                    >
                      {submitting ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        "Apply for Membership"
                      )}
                    </button>
                  )}

                  <p className="mt-4 text-center text-xs text-muted-foreground">
                    Admin will review and activate your membership.
                    Payment details will be shared on approval.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}