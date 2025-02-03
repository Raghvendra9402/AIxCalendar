"use client";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "../ui/button";

export default function Navbar() {
  const { isSignedIn } = useUser();
  return (
    <div className="px-20 py-5">
      <div className="flex items-center justify-between">
        <h2>Calendar</h2>
        {isSignedIn ? (
          <UserButton />
        ) : (
          <Link href={"/sign-in"}>
            <Button>SignIn/Up</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
