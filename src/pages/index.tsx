import CurrentTimeAndIftarCountdown from "@/components/time/currentTime";

export default function Home() {
  return (
    <main className="min-h-screen relative flex items-center justify-center py-10 bg-background text-gray-800">
      <div className="relative z-10 w-full max-w-7xl px-4">
        <CurrentTimeAndIftarCountdown />
      </div>
    </main>
  );
}
