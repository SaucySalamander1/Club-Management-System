"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, Flame } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        return;
      }

      // fetch session to get role
      const res = await fetch("/api/auth/session");
      const session = await res.json();
      const role = session?.user?.role;

      // redirect based on role
      if (role === "ADMIN") {
        router.push("/admin");
      } else if (role === "MEMBER" || role === "PLAYER" || role === "COACH") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }

      router.refresh();
    } catch (error) {
      console.log(error);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <div className="w-full max-w-md">

          {/* LOGO */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400">
              <Flame size={24} className="text-black" />
            </div>
            <h1 className="text-3xl font-black text-foreground">
              Welcome back
            </h1>
            <p className="mt-2 text-muted-foreground">
              Sign in to your Savar CF account
            </p>
          </div>

          {/* FORM */}
          <div className="rounded-2xl border border-border bg-card p-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-full bg-amber-400 py-3 font-semibold text-black transition hover:bg-amber-300 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-amber-500 hover:text-amber-400"
            >
              Join the Club
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}