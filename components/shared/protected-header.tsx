import { UserButton } from "@clerk/nextjs";
import { SidebarTrigger } from "../ui/sidebar";

export function Header() {
  return (
    <header className="p-4 sticky top-0 z-10 bg-gray-100">
      <div className="flex items-center justify-between">
        <SidebarTrigger />
        <UserButton />
      </div>
    </header>
  );
}
