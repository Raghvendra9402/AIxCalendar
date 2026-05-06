"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { ChatButton } from "./chat-button";

export default function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image src={"/logo.png"} alt="logo" width={160} height={160} />
          </Link>

          {/* Nav Links (visible when not signed in) */}
          {!isSignedIn && (
            <div className="hidden md:flex items-center gap-8">
              {["Features", "How it works", "Pricing"].map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-sm text-slate-500 hover:text-slate-900 font-medium transition-colors duration-200"
                >
                  {item}
                </Link>
              ))}
            </div>
          )}

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {isSignedIn ? (
              <div className="flex items-center gap-3">
                {/* <ChatButton /> */}
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8 ring-2 ring-blue-100",
                    },
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/sign-in">
                  <Button
                    className="text-sm font-medium text-slate-600
                    hover:text-slate-900 transition-colors duration-200"
                  >
                    {" "}
                    Sign in
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button
                    className="text-sm font-semibold bg-blue-600
                    hover:bg-blue-700 text-white py-2 px-4 rounded-lg
                    transition-all duration-200 shadow-sm hover:shadow-blue-200
                    hover:shadow-md active:scale-95"
                  >
                    {" "}
                    Get started free
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
