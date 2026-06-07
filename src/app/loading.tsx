import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 size={32} className="animate-spin text-amber-400" />
      </div>
    </main>
  );
}