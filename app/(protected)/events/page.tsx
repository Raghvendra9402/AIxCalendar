import { columns } from "@/components/shared/events/columns";
import { DataTable } from "@/components/shared/events/data-table";
import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function EventPage() {
  const user = await currentUser();
  if (!user) {
    return redirect("/");
  }
  const events = await prisma.event.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      dateRecord: true,
      reminders: true,
    },
  });
  return (
    <div className="flex flex-col w-full min-w-0">
      <div className="w-full min-w-0 overflow-auto">
        <DataTable columns={columns} data={events} />
      </div>
    </div>
  );
}
