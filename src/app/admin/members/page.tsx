"use client";

import { useEffect, useState } from "react";
import { Loader2, Users, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

type MembershipStatus = "ACTIVE" | "EXPIRED" | "CANCELLED" | "PENDING";

type Membership = {
  id: string;
  status: MembershipStatus;
  startDate: string | null;
  endDate: string | null;
  monthlyFee: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  payments: {
    id: string;
    amount: number;
    paidAt: string;
    method: string | null;
  }[];
};

const STATUS_STYLES: Record<MembershipStatus, string> = {
  ACTIVE: "bg-green-500/10 text-green-500",
  PENDING: "bg-yellow-500/10 text-yellow-500",
  EXPIRED: "bg-red-500/10 text-red-500",
  CANCELLED: "bg-red-500/10 text-red-500",
};

export default function AdminMembersPage() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanding, setExpanding] = useState<string | null>(null);
  const [paymentForm, setPaymentForm] = useState<{
    membershipId: string;
    amount: string;
    method: string;
    reference: string;
  } | null>(null);

  const fetchMemberships = async () => {
    const res = await fetch("/api/admin/members");
    const data = await res.json();
    setMemberships(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMemberships();
  }, []);

  const handleStatusChange = async (
    id: string,
    status: MembershipStatus
  ) => {
    try {
      // get start and end dates
      const startDate =
        status === "ACTIVE" ? new Date().toISOString() : undefined;
      const endDate =
        status === "ACTIVE"
          ? new Date(
              new Date().setMonth(new Date().getMonth() + 1)
            ).toISOString()
          : undefined;

      const res = await fetch(`/api/admin/members/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, startDate, endDate }),
      });
      if (!res.ok) throw new Error();
      toast.success("Membership updated!");
      fetchMemberships();
    } catch {
      toast.error("Failed to update membership");
    }
  };

  const handleRecordPayment = async () => {
    if (!paymentForm) return;
    try {
      const now = new Date();
      const nextMonth = new Date(
        now.setMonth(now.getMonth() + 1)
      );

      const res = await fetch(
        `/api/admin/members/${paymentForm.membershipId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: parseFloat(paymentForm.amount),
            method: paymentForm.method,
            reference: paymentForm.reference,
            periodStart: new Date().toISOString(),
            periodEnd: nextMonth.toISOString(),
          }),
        }
      );
      if (!res.ok) throw new Error();
      toast.success("Payment recorded!");
      setPaymentForm(null);
      fetchMemberships();
    } catch {
      toast.error("Failed to record payment");
    }
  };

  return (
    <div className="p-6 md:p-10">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-foreground">Members</h1>
        <p className="text-muted-foreground">
          Manage memberships and payments
        </p>
      </div>

      {/* STATS */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          {
            label: "Total",
            value: memberships.length,
            color: "text-foreground",
          },
          {
            label: "Active",
            value: memberships.filter((m) => m.status === "ACTIVE").length,
            color: "text-green-500",
          },
          {
            label: "Pending",
            value: memberships.filter((m) => m.status === "PENDING").length,
            color: "text-yellow-500",
          },
          {
            label: "Expired",
            value: memberships.filter(
              (m) =>
                m.status === "EXPIRED" || m.status === "CANCELLED"
            ).length,
            color: "text-red-500",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className={`text-3xl font-black ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* MEMBERSHIPS LIST */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-amber-400" />
        </div>
      ) : memberships.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Users size={48} className="mb-4 text-muted-foreground/20" />
          <p className="font-semibold text-foreground">No members yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Members will appear here when they apply
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {memberships.map((m) => (
            <div
              key={m.id}
              className="rounded-2xl border border-border bg-card overflow-hidden"
            >
              {/* MEMBER ROW */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-foreground">
                      {m.user.name}
                    </p>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        STATUS_STYLES[m.status]
                      }`}
                    >
                      {m.status}
                    </span>
                    <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs text-muted-foreground">
                      {m.user.role}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {m.user.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Applied:{" "}
                    {new Date(m.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  {m.startDate && (
                    <p className="text-xs text-muted-foreground">
                      Active since:{" "}
                      {new Date(m.startDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-lg font-black text-amber-500">
                    ৳{m.monthlyFee}/mo
                  </p>

                  {/* QUICK ACTIONS */}
                  {m.status === "PENDING" && (
                    <button
                      onClick={() => handleStatusChange(m.id, "ACTIVE")}
                      className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1.5 text-xs font-semibold text-green-500 transition hover:bg-green-500/20"
                    >
                      <CheckCircle size={12} />
                      Approve
                    </button>
                  )}

                  {m.status === "ACTIVE" && (
                    <>
                      <button
                        onClick={() =>
                          setPaymentForm({
                            membershipId: m.id,
                            amount: m.monthlyFee.toString(),
                            method: "bKash",
                            reference: "",
                          })
                        }
                        className="rounded-full bg-amber-400/10 px-3 py-1.5 text-xs font-semibold text-amber-500 transition hover:bg-amber-400/20"
                      >
                        Record Payment
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(m.id, "CANCELLED")
                        }
                        className="flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-500/20"
                      >
                        <XCircle size={12} />
                        Cancel
                      </button>
                    </>
                  )}

                  {(m.status === "EXPIRED" ||
                    m.status === "CANCELLED") && (
                    <button
                      onClick={() => handleStatusChange(m.id, "ACTIVE")}
                      className="rounded-full bg-green-500/10 px-3 py-1.5 text-xs font-semibold text-green-500 transition hover:bg-green-500/20"
                    >
                      Reactivate
                    </button>
                  )}

                  {/* EXPAND */}
                  <button
                    onClick={() =>
                      setExpanding(expanding === m.id ? null : m.id)
                    }
                    className="rounded-xl border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-accent"
                  >
                    {expanding === m.id ? "Hide" : "Details"}
                  </button>
                </div>
              </div>

              {/* EXPANDED DETAILS */}
              {expanding === m.id && (
                <div className="border-t border-border bg-background p-5">
                  <p className="mb-3 text-sm font-semibold text-foreground">
                    Payment History
                  </p>
                  {m.payments.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No payments recorded yet
                    </p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {m.payments.map((payment) => (
                        <div
                          key={payment.id}
                          className="flex items-center justify-between rounded-xl border border-border p-3"
                        >
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              ৳{payment.amount}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {payment.method ?? "Cash"} ·{" "}
                              {new Date(payment.paidAt).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </p>
                          </div>
                          <CheckCircle
                            size={16}
                            className="text-green-500"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* PAYMENT MODAL */}
      {paymentForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-6 text-lg font-black text-foreground">
              Record Payment
            </h2>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">
                  Amount (৳)
                </label>
                <input
                  type="number"
                  value={paymentForm.amount}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      amount: e.target.value,
                    })
                  }
                  className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">
                  Payment Method
                </label>
                <select
                  value={paymentForm.method}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      method: e.target.value,
                    })
                  }
                  className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-amber-500 focus:outline-none"
                >
                  <option value="bKash">bKash</option>
                  <option value="Nagad">Nagad</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank">Bank Transfer</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">
                  Reference (optional)
                </label>
                <input
                  type="text"
                  value={paymentForm.reference}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      reference: e.target.value,
                    })
                  }
                  placeholder="Transaction ID"
                  className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleRecordPayment}
                className="flex-1 rounded-full bg-amber-400 py-2.5 text-sm font-semibold text-black transition hover:bg-amber-300"
              >
                Record Payment
              </button>
              <button
                onClick={() => setPaymentForm(null)}
                className="flex-1 rounded-full border border-border py-2.5 text-sm font-semibold text-foreground transition hover:bg-accent"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}