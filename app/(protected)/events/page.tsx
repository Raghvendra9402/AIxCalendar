import { columns } from "@/components/shared/events/columns";
import { DataTable } from "@/components/shared/events/data-table";
import { prisma } from "@/lib/db";

export default async function EventPage() {
  const events = await prisma.event.findMany({
    orderBy: {
      createdAt: "asc",
    },
    include: {
      dateRecord: true,
      reminders: true,
    },
  });
  return (
    <div className="p-2 flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl text-white font-semibold">All Car Listings</h1>
        {/* <ListingDialog /> */}
      </div>
      <div>
        <DataTable columns={columns} data={events} />
      </div>
    </div>
  );
}
