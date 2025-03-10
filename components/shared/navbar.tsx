"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "../ui/button";
import { ChatButton } from "./chat-button";

export default function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <nav className="bg-white shadow-md sticky top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href={"/"}>
              <h2 className="text-2xl font-bold text-gray-800 cursor-pointer">
                Calendar
              </h2>
            </Link>
          </div>
          <div className="flex items-center">
            {isSignedIn ? (
              <div className="flex items-center space-x-4">
                <ChatButton />
                <UserButton />
              </div>
            ) : (
              <Link href="/sign-in">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
                  Sign In/Up
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
