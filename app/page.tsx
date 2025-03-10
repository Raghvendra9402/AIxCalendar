import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <Link href={"/calendar"}>
      <Button>Calendar new link</Button>
    </Link>
  );
}
