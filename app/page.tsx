import Features from "@/components/shared/features";
import { Footer } from "@/components/shared/footer";
import { Hero } from "@/components/shared/hero";
import Navbar from "@/components/shared/navbar";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </main>
  );
}
