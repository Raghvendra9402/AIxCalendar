"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-20 pb-28">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#1e3a8a 1px, transparent 1px), linear-gradient(to right, #1e3a8a 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Gradient blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-100 rounded-full blur-[120px] opacity-40 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-100 rounded-full blur-[100px] opacity-40 translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          Powered by AI — RAG + Function Calling
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1] max-w-4xl mx-auto">
          Your calendar that{" "}
          <span className="relative inline-block">
            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
              thinks ahead
            </span>
            <span className="absolute -bottom-1 left-0 right-0 h-[6px] bg-gradient-to-r from-blue-200 to-violet-200 rounded-full -z-0" />
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-light">
          CalAI combines intelligent scheduling, smart reminders, and natural
          language understanding to manage your time — so you can focus on what
          matters.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/sign-up">
            <button className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base py-3.5 px-7 rounded-xl shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all duration-200 active:scale-95">
              Start for free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </Link>
          <Link href="#how-it-works">
            <button className="flex items-center gap-2 text-slate-700 hover:text-slate-900 font-semibold text-base py-3.5 px-7 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all duration-200">
              See how it works
            </button>
          </Link>
        </div>

        {/* Social proof */}
        <p className="mt-8 text-sm text-slate-400 font-medium">
          No credit card required · Free forever plan available
        </p>

        {/* Hero visual */}
        <div className="mt-16 relative max-w-4xl mx-auto">
          <div
            className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none"
            style={{ top: "60%" }}
          />
          <div className="rounded-2xl border border-slate-200 shadow-2xl shadow-slate-200/80 overflow-hidden bg-slate-50">
            {/* Mock calendar header */}
            <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="text-sm font-medium text-slate-500">
                April 2026
              </div>
              <div className="w-16" />
            </div>
            {/* Mock calendar body */}
            <div className="p-6 grid grid-cols-7 gap-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <div
                  key={d}
                  className="text-center text-xs font-semibold text-slate-400 pb-2"
                >
                  {d}
                </div>
              ))}
              {Array.from({ length: 35 }, (_, i) => {
                const day = i - 1;
                const isToday = day === 0;
                const hasEvent = [2, 5, 8, 14, 20, 22].includes(day);
                const isAI = [5, 14].includes(day);
                return (
                  <div
                    key={i}
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm relative ${
                      isToday
                        ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-200"
                        : "text-slate-700 hover:bg-white transition-colors"
                    }`}
                  >
                    {day > 0 && day <= 30 ? day : ""}
                    {hasEvent && day > 0 && (
                      <div
                        className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${
                          isAI ? "bg-violet-500" : "bg-blue-400"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            {/* AI chat hint */}
            <div className="border-t border-slate-100 bg-white p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 bg-slate-50 rounded-lg px-4 py-2.5 text-sm text-slate-400 text-left">
                "Create an event with name meeting on 10 April 2026"
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
