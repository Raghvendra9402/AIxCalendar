"use client";

import { useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { isSignedIn } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3 transition-all duration-300"
        >
          <Image
            src="/logo.png"
            alt="logo"
            width={145}
            height={145}
            className="transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </Link>

        {/* Desktop Nav */}
        {!isSignedIn && (
          <nav className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white/70 p-1 shadow-sm backdrop-blur md:flex">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="
                  rounded-full px-5 py-2 text-sm font-medium text-slate-600
                  transition-all duration-200
                  hover:bg-slate-100 hover:text-slate-900
                "
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  className="
                    hidden rounded-xl border border-slate-200 bg-white
                    px-4 text-sm font-medium text-slate-700 shadow-sm
                    transition-all duration-200
                    hover:border-slate-300 hover:bg-slate-50
                    hover:text-slate-900 md:flex
                  "
                >
                  Dashboard
                </Button>
              </Link>

              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10 ring-4 ring-blue-100/70 shadow-sm",
                  },
                }}
              />

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="
                  flex h-10 w-10 items-center justify-center rounded-xl
                  border border-slate-200 bg-white text-slate-700 shadow-sm
                  transition-all duration-200 hover:bg-slate-50 md:hidden
                "
              >
                {isOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* Desktop Buttons */}
              <div className="hidden items-center gap-2 md:flex">
                <Link href="/sign-in">
                  <Button
                    variant="ghost"
                    className="
                      rounded-xl px-4 text-sm font-medium text-slate-600
                      transition-all duration-200
                      hover:bg-slate-100 hover:text-slate-900
                    "
                  >
                    Sign in
                  </Button>
                </Link>

                <Link href="/sign-up">
                  <Button
                    className="
                      rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white
                      shadow-lg shadow-blue-100 transition-all duration-300
                      hover:-translate-y-0.5 hover:bg-blue-700
                      hover:shadow-blue-200 active:scale-[0.98]
                    "
                  >
                    Get Started
                  </Button>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="
                  flex h-10 w-10 items-center justify-center rounded-xl
                  border border-slate-200 bg-white text-slate-700 shadow-sm
                  transition-all duration-200 hover:bg-slate-50 md:hidden
                "
              >
                {isOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`
          overflow-hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl
          transition-all duration-300 md:hidden
          ${isOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="space-y-2 px-4 py-5">
          {!isSignedIn && (
            <>
              {/* Mobile Nav Links */}
              <div className="flex flex-col gap-1">
                {navLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="
                      rounded-xl px-4 py-3 text-sm font-medium text-slate-700
                      transition-all duration-200
                      hover:bg-slate-100 hover:text-slate-900
                    "
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Mobile Buttons */}
              <div className="mt-4 flex flex-col gap-3">
                <Link href="/sign-in">
                  <Button variant="outline" className="h-11 w-full rounded-xl">
                    Sign in
                  </Button>
                </Link>

                <Link href="/sign-up">
                  <Button
                    className="
                      h-11 w-full rounded-xl bg-blue-600 text-white
                      hover:bg-blue-700
                    "
                  >
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </>
          )}

          {isSignedIn && (
            <div className="flex flex-col gap-2">
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="
                  rounded-xl px-4 py-3 text-sm font-medium text-slate-700
                  transition-all duration-200
                  hover:bg-slate-100 hover:text-slate-900
                "
              >
                Dashboard
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
