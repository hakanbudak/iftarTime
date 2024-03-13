import CurrentTimeAndIftarCountdown from "@/components/time/currentTime";

export default function Home() {
  return (
      <main className="bg-gray-100 min-h-screen flex items-center justify-center py-5">
       <CurrentTimeAndIftarCountdown/>
      </main>
  );
}
