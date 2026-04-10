import { AppSidebar } from "@/components/shared/app-sidebar";
import Navbar from "@/components/shared/navbar";
import { Header } from "@/components/shared/protected-header";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <main className="flex-1">
        <Header />
        {children}
      </main>
    </SidebarProvider>
  );
}
