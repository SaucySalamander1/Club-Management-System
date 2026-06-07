import  Navbar  from "@/components/layout/navbar";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold tracking-tight">
            SAVAR CF
          </h1>

          <p className="mt-4 text-lg text-muted-foreground">
            Football Club Management Platform
          </p>
        </div>
      </section>
    </main>
  );
}