import Navbar from "@/components/shared/navbar";
import { Hero } from "@/components/shared/hero";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Features from "@/components/shared/features";
import { Footer } from "@/components/shared/footer";

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
