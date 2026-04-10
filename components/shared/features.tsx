"use client";

import {
  Brain,
  BellRing,
  MessageSquareText,
  CalendarClock,
  Zap,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "RAG-Powered Context",
    description:
      "CalAI remembers your preferences, past events, and patterns — giving you smarter suggestions every single day.",
    accent: "bg-blue-50 text-blue-600",
    border: "group-hover:border-blue-200",
  },
  {
    icon: MessageSquareText,
    title: "Natural Language Input",
    description:
      'Just type "lunch with Sarah next Friday at 1pm" and CalAI handles the rest. No forms, no friction.',
    accent: "bg-violet-50 text-violet-600",
    border: "group-hover:border-violet-200",
  },
  {
    icon: BellRing,
    title: "Smart Reminders",
    description:
      "Reminders that adapt to your schedule — not just time-based pings, but context-aware nudges that actually help.",
    accent: "bg-amber-50 text-amber-600",
    border: "group-hover:border-amber-200",
  },
  {
    icon: Zap,
    title: "Function Calling Engine",
    description:
      "Integrates with your tools. CalAI can create events, reschedule meetings, and update tasks through natural conversation.",
    accent: "bg-emerald-50 text-emerald-600",
    border: "group-hover:border-emerald-200",
  },
  {
    icon: CalendarClock,
    title: "Conflict Detection",
    description:
      "Automatically spots scheduling conflicts and suggests better alternatives before you even notice the clash.",
    accent: "bg-rose-50 text-rose-600",
    border: "group-hover:border-rose-200",
  },
  {
    icon: ShieldCheck,
    title: "Private by Design",
    description:
      "Your calendar data stays yours. Enterprise-grade security with end-to-end encryption and zero data selling.",
    accent: "bg-slate-100 text-slate-600",
    border: "group-hover:border-slate-300",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-slate-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">
            Features
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
            Everything your schedule needs
          </h2>
          <p className="mt-4 text-lg text-slate-500 leading-relaxed">
            Built for people who want their calendar to work <em>with</em> them,
            not against them.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(
            ({ icon: Icon, title, description, accent, border }) => (
              <div
                key={title}
                className={`group bg-white rounded-2xl border border-slate-100 p-7 transition-all duration-300 hover:shadow-lg ${border} cursor-default`}
              >
                <div
                  className={`w-11 h-11 rounded-xl ${accent} flex items-center justify-center mb-5`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2 tracking-tight">
                  {title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {description}
                </p>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
